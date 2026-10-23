/**
 * Strangers for Mary: sign-up backend (Google Apps Script web app)
 *
 * Bound to one Google Sheet. Receives sign-ups from the Next.js server,
 * stores them, and reports how many core team places are left.
 *
 * Paste this whole file into Extensions > Apps Script > Code.gs.
 * Setup and deploy steps are in README.md beside this file.
 *
 * Contract (used by the website):
 *   POST  JSON body { secret, action: "signup", sourcePage, fullName, baptismName,
 *         email, parish, city, whatsapp, joinAsStranger, applyCoreTeam, teams, about, submittedAt }
 *   GET   ?action=places&secret=...   -> { ok, total, filled, left, accepting }
 *   GET   ?action=health&secret=...   -> { ok, time }
 */

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

var SHEETS = {
  STRANGERS: 'Strangers',
  APPLICATIONS: 'Core Team Applications',
  CONFIG: 'Config',
  LOG: 'Log'
};

var HEADERS = {
  Strangers: ['id', 'created_at', 'updated_at', 'full_name', 'baptism_name', 'email', 'parish', 'city', 'whatsapp', 'join_as_stranger', 'source_page', 'status'],
  'Core Team Applications': ['id', 'created_at', 'updated_at', 'full_name', 'baptism_name', 'email', 'parish', 'city', 'whatsapp', 'teams', 'about', 'status', 'notes'],
  Config: ['key', 'value', 'meaning'],
  Log: ['timestamp', 'level', 'action', 'message', 'email']
};

var CONFIG_DEFAULTS = [
  ['core_team_total', 20, 'Total core team places'],
  ['core_team_filled_override', 3, 'If not blank, used as places filled. Clear it to count Accepted applications instead'],
  ['notify_email', 'admin@strangersformary.org', 'Who is emailed when a core team application arrives. Blank turns emails off'],
  ['accepting_applications', true, 'FALSE closes core team applications']
];

var STRANGER_STATUSES = ['Waitlist', 'Invited', 'Active', 'Left'];
var APPLICATION_STATUSES = ['New', 'Interview invited', 'Accepted', 'Declined'];
var ALLOWED_TEAMS = ['Stranger Relations', 'Outreach', 'Core and Content', 'Technology'];
var ALLOWED_SOURCES = ['home', 'build-with-us'];

var LIMITS = { name: 120, place: 160, whatsapp: 40, about: 2000 };

var CACHE_KEY_PLACES = 'sfm_places_v1';
var CACHE_SECONDS = 60;
var SECRET_PROPERTY = 'SFM_SHARED_SECRET';

/* ------------------------------------------------------------------ */
/* Entry points                                                        */
/* ------------------------------------------------------------------ */

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    logEvent_('warn', 'post', 'Body was not valid JSON', '');
    return json_({ ok: false, error: 'validation', fields: { body: 'invalid_json' } });
  }

  if (!isAuthorised_(body.secret)) {
    logEvent_('warn', 'post', 'Rejected: wrong or missing secret', '');
    return json_({ ok: false, error: 'unauthorised' });
  }

  try {
    if (body.action === 'signup') return json_(handleSignup_(body));
    logEvent_('warn', 'post', 'Unknown action: ' + String(body.action).slice(0, 40), '');
    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    logEvent_('error', 'signup', String(err && err.message ? err.message : err), safeEmail_(body.email));
    return json_({ ok: false, error: 'server' });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!isAuthorised_(p.secret)) {
    logEvent_('warn', 'get', 'Rejected: wrong or missing secret', '');
    return json_({ ok: false, error: 'unauthorised' });
  }
  try {
    if (p.action === 'places') {
      var places = getPlaces_();
      return json_({ ok: true, total: places.total, filled: places.filled, left: places.left, accepting: places.accepting });
    }
    if (p.action === 'health') return json_({ ok: true, time: new Date().toISOString() });
    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    logEvent_('error', 'get', String(err && err.message ? err.message : err), '');
    return json_({ ok: false, error: 'server' });
  }
}

/** Simple trigger: editing the Config sheet clears the places cache. */
function onEdit(e) {
  try {
    if (e && e.range && e.range.getSheet().getName() === SHEETS.CONFIG) clearPlacesCache_();
  } catch (err) { /* never block an edit */ }
}

/* ------------------------------------------------------------------ */
/* Setup (safe to run more than once, never deletes data)              */
/* ------------------------------------------------------------------ */

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(HEADERS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var headers = HEADERS[name];
    var existing = sh.getLastColumn() > 0 ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    if (existing.join('') === '') {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      // Add any missing headers at the end; never reorder or remove.
      var missing = headers.filter(function (h) { return existing.indexOf(h) === -1; });
      if (missing.length) sh.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
    }
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#EEF1F4');
  });

  // Config defaults: add keys that are missing, keep values that exist.
  var cfg = ss.getSheetByName(SHEETS.CONFIG);
  var have = readConfigRaw_();
  CONFIG_DEFAULTS.forEach(function (row) {
    if (!(row[0] in have)) cfg.appendRow(row);
  });

  // Status dropdowns.
  setStatusValidation_(ss.getSheetByName(SHEETS.STRANGERS), STRANGER_STATUSES);
  setStatusValidation_(ss.getSheetByName(SHEETS.APPLICATIONS), APPLICATION_STATUSES);

  // Column widths for readability.
  ss.getSheetByName(SHEETS.STRANGERS).setColumnWidths(1, HEADERS.Strangers.length, 160);
  var apps = ss.getSheetByName(SHEETS.APPLICATIONS);
  apps.setColumnWidths(1, HEADERS['Core Team Applications'].length, 160);
  var aboutCol = headerMap_(apps).about;
  if (aboutCol) apps.setColumnWidth(aboutCol, 360);
  ss.getSheetByName(SHEETS.LOG).setColumnWidth(4, 420);

  // Remove the default empty "Sheet1" only if it is empty and other sheets exist.
  var s1 = ss.getSheetByName('Sheet1');
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);

  clearPlacesCache_();
  logEvent_('info', 'setup', 'Setup completed', '');
  return 'Setup complete';
}

function setStatusValidation_(sh, values) {
  var col = headerMap_(sh).status;
  if (!col) return;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  sh.getRange(2, col, sh.getMaxRows() - 1, 1).setDataValidation(rule);
}

/* ------------------------------------------------------------------ */
/* Sign-up                                                             */
/* ------------------------------------------------------------------ */

function handleSignup_(body) {
  var v = validateSignup_(body);
  if (!v.ok) {
    logEvent_('warn', 'signup', 'Validation failed: ' + JSON.stringify(v.fields), safeEmail_(body.email));
    return { ok: false, error: 'validation', fields: v.fields };
  }
  var d = v.data;

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    logEvent_('error', 'signup', 'Could not get lock within 10 seconds', d.email);
    return { ok: false, error: 'server' };
  }

  try {
    var stranger = upsertStranger_(d);
    var applicationId = null;

    if (d.applyCoreTeam) {
      var places = getPlaces_(true);
      if (!places.accepting || places.left <= 0) {
        logEvent_('info', 'signup', 'Core team full or closed; stranger saved', d.email);
        return { ok: false, error: 'core_team_full', strangerId: stranger.id, placesLeft: places.left };
      }
      var app = upsertApplication_(d);
      applicationId = app.id;
      clearPlacesCache_();
      SpreadsheetApp.flush();
      notifyApplication_(d, app);
    }

    var after = getPlaces_(true);
    logEvent_('info', 'signup', (stranger.updated ? 'Updated' : 'New') + ' stranger' + (applicationId ? ' with core team application' : ''), d.email);
    return { ok: true, strangerId: stranger.id, applicationId: applicationId, updated: stranger.updated, placesLeft: after.left };
  } finally {
    lock.releaseLock();
  }
}

function upsertStranger_(d) {
  var sh = sheet_(SHEETS.STRANGERS);
  var now = new Date().toISOString();
  var found = findRowByEmail_(sh, d.email);

  if (found) {
    var cur = found.values;
    var keepJoin = cur.join_as_stranger === true || String(cur.join_as_stranger).toUpperCase() === 'TRUE';
    updateRow_(sh, found.row, {
      updated_at: now,
      full_name: d.fullName,
      baptism_name: d.baptismName,
      parish: d.parish,
      city: d.city,
      whatsapp: d.whatsapp || cur.whatsapp || '',
      join_as_stranger: keepJoin || d.joinAsStranger
    });
    return { id: cur.id, updated: true };
  }

  var id = 'STR-' + shortId_();
  appendRow_(sh, {
    id: id, created_at: now, updated_at: now,
    full_name: d.fullName, baptism_name: d.baptismName, email: d.email,
    parish: d.parish, city: d.city, whatsapp: d.whatsapp,
    join_as_stranger: d.joinAsStranger, source_page: d.sourcePage, status: 'Waitlist'
  });
  return { id: id, updated: false };
}

function upsertApplication_(d) {
  var sh = sheet_(SHEETS.APPLICATIONS);
  var now = new Date().toISOString();
  var found = findRowByEmail_(sh, d.email, function (vals) { return vals.status === 'New'; });
  var fields = {
    updated_at: now,
    full_name: d.fullName, baptism_name: d.baptismName,
    parish: d.parish, city: d.city, whatsapp: d.whatsapp,
    teams: d.teams.join(', '), about: d.about
  };

  if (found) {
    updateRow_(sh, found.row, fields);
    return { id: found.values.id, row: found.row, updated: true };
  }

  var id = 'APP-' + shortId_();
  fields.id = id;
  fields.created_at = now;
  fields.email = d.email;
  fields.status = 'New';
  fields.notes = '';
  var row = appendRow_(sh, fields);
  return { id: id, row: row, updated: false };
}

/* ------------------------------------------------------------------ */
/* Places                                                              */
/* ------------------------------------------------------------------ */

function getPlaces_(skipCache) {
  var cache = CacheService.getScriptCache();
  if (!skipCache) {
    var hit = cache.get(CACHE_KEY_PLACES);
    if (hit) return JSON.parse(hit);
  }
  var cfg = readConfigRaw_();
  var total = toInt_(cfg.core_team_total, 20);
  var override = cfg.core_team_filled_override;
  var filled = (override === '' || override === null || override === undefined) ? countAccepted_() : toInt_(override, 0);
  var acceptingRaw = cfg.accepting_applications;
  var accepting = !(acceptingRaw === false || String(acceptingRaw).toUpperCase() === 'FALSE');
  var result = { total: total, filled: filled, left: Math.max(0, total - filled), accepting: accepting };
  cache.put(CACHE_KEY_PLACES, JSON.stringify(result), CACHE_SECONDS);
  return result;
}

function countAccepted_() {
  var sh = sheet_(SHEETS.APPLICATIONS);
  var map = headerMap_(sh);
  if (!map.status || sh.getLastRow() < 2) return 0;
  return sh.getRange(2, map.status, sh.getLastRow() - 1, 1).getValues()
    .filter(function (r) { return r[0] === 'Accepted'; }).length;
}

function clearPlacesCache_() {
  CacheService.getScriptCache().remove(CACHE_KEY_PLACES);
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validateSignup_(b) {
  var fields = {};
  var str = function (v) { return (v === null || v === undefined) ? '' : String(v).trim(); };

  var data = {
    sourcePage: str(b.sourcePage) || 'home',
    fullName: str(b.fullName),
    baptismName: str(b.baptismName),
    email: str(b.email).toLowerCase(),
    parish: str(b.parish),
    city: str(b.city),
    whatsapp: str(b.whatsapp),
    joinAsStranger: b.joinAsStranger === true,
    applyCoreTeam: b.applyCoreTeam === true,
    teams: Array.isArray(b.teams) ? b.teams.map(str).filter(Boolean) : [],
    about: str(b.about)
  };

  [['fullName', LIMITS.name], ['baptismName', LIMITS.name], ['parish', LIMITS.place], ['city', LIMITS.place]].forEach(function (pair) {
    var k = pair[0];
    if (!data[k]) fields[k] = 'required';
    else if (data[k].length > pair[1]) fields[k] = 'too_long';
  });

  if (!data.email) fields.email = 'required';
  else if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) fields.email = 'invalid';

  if (data.whatsapp.length > LIMITS.whatsapp) fields.whatsapp = 'too_long';
  else if (data.whatsapp && !/^[+0-9 ()-]{6,}$/.test(data.whatsapp)) fields.whatsapp = 'invalid';

  if (data.about.length > LIMITS.about) fields.about = 'too_long';

  if (data.teams.some(function (t) { return ALLOWED_TEAMS.indexOf(t) === -1; })) fields.teams = 'invalid';
  if (ALLOWED_SOURCES.indexOf(data.sourcePage) === -1) fields.sourcePage = 'invalid';
  if (!data.joinAsStranger && !data.applyCoreTeam) fields.choice = 'required';

  if (Object.keys(fields).length) return { ok: false, fields: fields };

  // Neutralise formula injection on every text value written to the Sheet.
  ['fullName', 'baptismName', 'email', 'parish', 'city', 'whatsapp', 'about'].forEach(function (k) {
    data[k] = safeCell_(data[k]);
  });
  return { ok: true, data: data };
}

function safeCell_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

/* ------------------------------------------------------------------ */
/* Sheet helpers (columns by header name, never by letter)             */
/* ------------------------------------------------------------------ */

function sheet_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Missing sheet "' + name + '". Run setup().');
  return sh;
}

function headerMap_(sh) {
  var map = {};
  if (sh.getLastColumn() === 0) return map;
  sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].forEach(function (h, i) {
    if (h !== '') map[String(h).trim()] = i + 1;
  });
  return map;
}

function rowToObject_(headers, row) {
  var o = {};
  headers.forEach(function (h, i) { o[h] = row[i]; });
  return o;
}

/** Finds the last row whose email matches (and passes the optional filter). */
function findRowByEmail_(sh, email, filter) {
  var last = sh.getLastRow();
  if (last < 2) return null;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var emailIdx = headers.indexOf('email');
  if (emailIdx === -1) throw new Error('Sheet "' + sh.getName() + '" has no email column');
  var rows = sh.getRange(2, 1, last - 1, headers.length).getValues();
  var target = String(email).replace(/^'/, '').toLowerCase();
  for (var i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][emailIdx]).replace(/^'/, '').toLowerCase() === target) {
      var values = rowToObject_(headers, rows[i]);
      if (!filter || filter(values)) return { row: i + 2, values: values };
    }
  }
  return null;
}

function appendRow_(sh, obj) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var row = headers.map(function (h) { return (h in obj) ? obj[h] : ''; });
  sh.appendRow(row);
  return sh.getLastRow();
}

function updateRow_(sh, rowNumber, obj) {
  var map = headerMap_(sh);
  Object.keys(obj).forEach(function (k) {
    if (map[k]) sh.getRange(rowNumber, map[k]).setValue(obj[k]);
  });
}

function readConfigRaw_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.CONFIG);
  var out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(function (r) {
    if (r[0] !== '') out[String(r[0]).trim()] = r[1];
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Auth, notify, log, respond, utils                                   */
/* ------------------------------------------------------------------ */

function isAuthorised_(given) {
  var secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  if (!secret || !given) return false;
  // Constant-time comparison.
  var a = String(given), b = String(secret);
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function notifyApplication_(d, app) {
  try {
    var to = String(readConfigRaw_().notify_email || '').trim();
    if (!to) return;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEETS.APPLICATIONS);
    var link = ss.getUrl() + '#gid=' + sh.getSheetId() + '&range=A' + app.row;
    var places = getPlaces_(true);
    var body = [
      (app.updated ? 'An application was updated' : 'A new core team application arrived') + '.',
      '',
      'Baptism name: ' + d.baptismName,
      'Full name: ' + d.fullName,
      'Email: ' + d.email,
      'Parish: ' + d.parish,
      'City: ' + d.city,
      'WhatsApp: ' + (d.whatsapp || 'not given'),
      'Teams: ' + (d.teams.length ? d.teams.join(', ') : 'not chosen'),
      '',
      'About:',
      d.about || '(nothing written)',
      '',
      'Places left: ' + places.left + ' of ' + places.total,
      'Open the row: ' + link
    ].join('\n');
    MailApp.sendEmail({ to: to, subject: 'Core team application: ' + d.baptismName + ' (' + app.id + ')', body: body });
  } catch (err) {
    logEvent_('error', 'notify', String(err && err.message ? err.message : err), d.email);
  }
}

function logEvent_(level, action, message, email) {
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.LOG);
    if (!sh) return;
    sh.appendRow([new Date().toISOString(), level, action, String(message).slice(0, 1000), email || '']);
  } catch (err) { /* logging must never break a request */ }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function shortId_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
}

function toInt_(v, fallback) {
  var n = parseInt(v, 10);
  return isNaN(n) ? fallback : n;
}

function safeEmail_(v) {
  return String(v || '').trim().toLowerCase().slice(0, 254);
}

/* ------------------------------------------------------------------ */
/* Manual tests: run from the editor (Run > runAllTests).              */
/* They write rows marked with emails ending @example.test.            */
/* Delete those rows afterwards.                                       */
/* ------------------------------------------------------------------ */

function runAllTests() {
  var secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  if (!secret) throw new Error('Set the ' + SECRET_PROPERTY + ' script property first.');
  var post = function (payload) {
    var res = doPost({ postData: { contents: JSON.stringify(payload) } });
    return JSON.parse(res.getContent());
  };
  var base = {
    secret: secret, action: 'signup', sourcePage: 'home',
    fullName: 'Test Stranger', baptismName: 'Paul', email: 'paul@example.test',
    parish: 'St Test', city: 'Buea, Cameroon', whatsapp: '',
    joinAsStranger: true, applyCoreTeam: false, teams: [], about: ''
  };
  var results = [];
  var check = function (name, cond, got) { results.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : ' -> ' + JSON.stringify(got))); };

  var r1 = post(Object.assign({}, base, { secret: 'wrong' }));
  check('rejects wrong secret', r1.error === 'unauthorised', r1);

  var r2 = post(Object.assign({}, base, { email: 'not-an-email' }));
  check('rejects bad email', r2.error === 'validation' && r2.fields.email === 'invalid', r2);

  var r3 = post(base);
  check('creates stranger', r3.ok === true && /^STR-/.test(r3.strangerId), r3);

  var r4 = post(Object.assign({}, base, { parish: 'St Updated', joinAsStranger: false, applyCoreTeam: true, teams: ['Technology'], about: 'I build apps.' }));
  check('updates stranger and applies', r4.updated === true && (r4.ok ? /^APP-/.test(r4.applicationId) : r4.error === 'core_team_full'), r4);

  var r5 = post(Object.assign({}, base, { fullName: '=HYPERLINK("x")', email: 'formula@example.test' }));
  check('accepts and neutralises formula', r5.ok === true, r5);

  var r6 = doGet({ parameter: { action: 'places', secret: secret } });
  var p = JSON.parse(r6.getContent());
  check('places', p.ok === true && typeof p.left === 'number', p);

  var r7 = JSON.parse(doGet({ parameter: { action: 'health', secret: secret } }).getContent());
  check('health', r7.ok === true, r7);

  Logger.log(results.join('\n'));
  return results;
}
