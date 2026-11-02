/**
 * Strangers for Mary: sign-up and volunteer application backend
 * (Google Apps Script web app, version 2)
 *
 * Bound to one Google Sheet. Receives requests from the Next.js server only,
 * stores them, saves volunteer CVs to a private Google Drive folder and
 * emails the team when an application arrives.
 *
 * Paste this whole file into Extensions > Apps Script > Code.gs.
 * Setup and deploy steps are in README.md beside this file.
 *
 * Contract (used by the website):
 *
 *   POST { secret, action: "signup", sourcePage: "home",
 *          baptismName, phone, parish, city, email?, joinAsStranger: true, submittedAt? }
 *     -> { ok, strangerId, updated }
 *
 *   POST { secret, action: "apply", sourcePage: "roles",
 *          roleId, fullName, baptismName, phone, email, parish, city,
 *          answers: { q1, q2, q3 }, links?, hours,
 *          confirmUnpaid: true, confirmSunday: true, confirmRosary: true,
 *          joinAsStranger, cv: { fileName, mimeType, base64 }, submittedAt? }
 *     -> { ok, applicationId, updated }
 *
 *   GET ?action=health&secret=...   -> { ok, time }
 *   GET ?action=roles&secret=...    -> { ok, roles: [{ id, title, team }] }
 *
 * Version 1 fields still accepted so nothing breaks during the switch:
 *   signup with fullName, whatsapp, applyCoreTeam, teams, about, and GET ?action=places.
 *   The new website does not use them.
 */

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

var SHEETS = {
  STRANGERS: 'Strangers',
  VOLUNTEERS: 'Volunteer Applications',
  LEGACY_APPLICATIONS: 'Core Team Applications',
  CONFIG: 'Config',
  LOG: 'Log'
};

var HEADERS = {
  Strangers: ['id', 'created_at', 'updated_at', 'full_name', 'baptism_name', 'email', 'parish', 'city', 'whatsapp', 'join_as_stranger', 'source_page', 'status', 'phone'],
  'Volunteer Applications': [
    'id', 'created_at', 'updated_at', 'status', 'role_id', 'role_title', 'team',
    'full_name', 'baptism_name', 'phone', 'email', 'parish', 'city', 'hours',
    'question_1', 'answer_1', 'question_2', 'answer_2', 'question_3', 'answer_3',
    'links', 'cv_file', 'cv_link', 'confirm_unpaid', 'confirm_sunday', 'confirm_rosary',
    'join_as_stranger', 'notes'
  ],
  'Core Team Applications': ['id', 'created_at', 'updated_at', 'full_name', 'baptism_name', 'email', 'parish', 'city', 'whatsapp', 'teams', 'about', 'status', 'notes'],
  Config: ['key', 'value', 'meaning'],
  Log: ['timestamp', 'level', 'action', 'message', 'email']
};

var CONFIG_DEFAULTS = [
  ['notify_email', 'admin@strangersformary.org', 'Who is emailed when a volunteer application arrives. Blank turns emails off'],
  ['accepting_applications', true, 'FALSE closes volunteer applications on every role'],
  ['closed_roles', '', 'Role ids that are not taking applications, separated by commas (for example: technology-lead, logistics-officer). Usually blank: applications for filled roles are kept for later'],
  ['cv_folder_id', '', 'Google Drive folder for CVs. setup() creates a private folder and fills this in'],
  ['max_cv_mb', 4, 'Largest CV accepted, in MB. Keep at 4 or less if the website is hosted on Vercel'],
  // Version 1 keys, kept so older rows and the places endpoint keep working.
  ['core_team_total', 20, 'Version 1 only. Total core team places'],
  ['core_team_filled_override', 3, 'Version 1 only. Places filled for the old places counter']
];

/** The roles open to application. The Core and Content Lead is appointed and is deliberately absent. */
var ROLES = [
  { id: 'devotional-content-editor', title: 'Devotional Content Editor', team: 'Core and Content' },
  { id: 'content-writer-and-editor', title: 'Content Writer and Editor', team: 'Core and Content' },
  { id: 'content-moderator', title: 'Content Moderator', team: 'Core and Content' },
  { id: 'safeguarding-and-training-officer', title: 'Safeguarding and Training Officer', team: 'Core and Content' },
  { id: 'technology-lead', title: 'Technology Lead', team: 'Technology' },
  { id: 'backend-engineer', title: 'Backend Engineer', team: 'Technology' },
  { id: 'mobile-engineer-android-and-ios', title: 'Mobile Engineer (Android and iOS)', team: 'Technology' },
  { id: 'frontend-engineer-react-and-next-js', title: 'Frontend Engineer (React and Next.js)', team: 'Technology' },
  { id: 'product-designer-ux-and-ui', title: 'Product Designer (UX and UI)', team: 'Technology' },
  { id: 'customer-experience-lead', title: 'Customer Experience Lead', team: 'Stranger Relations' },
  { id: 'onboarding-officer', title: 'Onboarding Officer', team: 'Stranger Relations' },
  { id: 'customer-support-officer', title: 'Customer Support Officer', team: 'Stranger Relations' },
  { id: 'member-retention-coordinator', title: 'Member Retention Coordinator', team: 'Stranger Relations' },
  { id: 'events-coordinator', title: 'Events Coordinator', team: 'Stranger Relations' },
  { id: 'marketing-and-partnerships-lead', title: 'Marketing and Partnerships Lead', team: 'Outreach' },
  { id: 'brand-and-graphic-designer', title: 'Brand and Graphic Designer', team: 'Outreach', linkRequired: true },
  { id: 'social-media-manager', title: 'Social Media Manager', team: 'Outreach' },
  { id: 'logistics-officer', title: 'Logistics Officer', team: 'Outreach' },
  { id: 'finance-officer-treasurer', title: 'Finance Officer (Treasurer)', team: 'Outreach' }
];

var HOURS_OPTIONS = ['Up to 3 hours', '4 to 6 hours', '7 hours or more'];
var STRANGER_STATUSES = ['Waitlist', 'Invited', 'Active', 'Left'];
var APPLICATION_STATUSES = ['New', 'Reviewing', 'Interview invited', 'Accepted', 'On file', 'Declined'];
var ALLOWED_SOURCES = ['home', 'roles', 'volunteer', 'build-with-us'];
var CV_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

var LIMITS = { name: 120, place: 160, phone: 40, answer: 3000, links: 600, about: 2000, fileName: 200 };

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
    if (body.action === 'apply') return json_(handleApply_(body));
    logEvent_('warn', 'post', 'Unknown action: ' + String(body.action).slice(0, 40), '');
    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    logEvent_('error', String(body.action || 'post').slice(0, 20), String(err && err.message ? err.message : err), safeEmail_(body.email));
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
    if (p.action === 'health') return json_({ ok: true, time: new Date().toISOString() });
    if (p.action === 'roles') {
      var closed = closedRoles_();
      return json_({ ok: true, accepting: isAccepting_(), roles: ROLES.map(function (r) {
        return { id: r.id, title: r.title, team: r.team, open: closed.indexOf(r.id) === -1 };
      }) });
    }
    if (p.action === 'places') { // Version 1 only.
      var places = getPlaces_();
      return json_({ ok: true, total: places.total, filled: places.filled, left: places.left, accepting: places.accepting });
    }
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

  // Private CV folder, created once.
  ensureCvFolder_();

  // Status dropdowns.
  setStatusValidation_(ss.getSheetByName(SHEETS.STRANGERS), STRANGER_STATUSES);
  setStatusValidation_(ss.getSheetByName(SHEETS.VOLUNTEERS), APPLICATION_STATUSES);
  setStatusValidation_(ss.getSheetByName(SHEETS.LEGACY_APPLICATIONS), APPLICATION_STATUSES);

  // Column widths for readability.
  ss.getSheetByName(SHEETS.STRANGERS).setColumnWidths(1, HEADERS.Strangers.length, 160);
  var vol = ss.getSheetByName(SHEETS.VOLUNTEERS);
  vol.setColumnWidths(1, HEADERS['Volunteer Applications'].length, 160);
  var vmap = headerMap_(vol);
  ['answer_1', 'answer_2', 'answer_3'].forEach(function (h) { if (vmap[h]) vol.setColumnWidth(vmap[h], 360); });
  ss.getSheetByName(SHEETS.LOG).setColumnWidth(4, 420);

  // Remove the default empty "Sheet1" only if it is empty and other sheets exist.
  var s1 = ss.getSheetByName('Sheet1');
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);

  clearPlacesCache_();
  logEvent_('info', 'setup', 'Setup completed', '');
  return 'Setup complete';
}

function setStatusValidation_(sh, values) {
  if (!sh) return;
  var col = headerMap_(sh).status;
  if (!col) return;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  sh.getRange(2, col, sh.getMaxRows() - 1, 1).setDataValidation(rule);
}

function ensureCvFolder_() {
  var cfg = readConfigRaw_();
  var id = String(cfg.cv_folder_id || '').trim();
  if (id) {
    try { DriveApp.getFolderById(id); return id; } catch (err) { /* recreate below */ }
  }
  var folder = DriveApp.createFolder('Strangers for Mary · Volunteer CVs');
  setConfig_('cv_folder_id', folder.getId());
  return folder.getId();
}

/* ------------------------------------------------------------------ */
/* Sign-up (Home page)                                                 */
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
    if (d.applyCoreTeam) { // Version 1 only.
      var app = upsertLegacyApplication_(d);
      applicationId = app.id;
    }
    logEvent_('info', 'signup', (stranger.updated ? 'Updated' : 'New') + ' stranger', d.email || d.phone);
    return { ok: true, strangerId: stranger.id, applicationId: applicationId, updated: stranger.updated };
  } finally {
    lock.releaseLock();
  }
}

/** One row per person, matched on phone number first, then email. */
function upsertStranger_(d) {
  var sh = sheet_(SHEETS.STRANGERS);
  var now = new Date().toISOString();
  var found = (d.phone && findRow_(sh, 'phone', d.phone, phoneKey_)) || (d.email && findRow_(sh, 'email', d.email, emailKey_));

  if (found) {
    var cur = found.values;
    var keepJoin = cur.join_as_stranger === true || String(cur.join_as_stranger).toUpperCase() === 'TRUE';
    updateRow_(sh, found.row, {
      updated_at: now,
      full_name: d.fullName || cur.full_name || '',
      baptism_name: d.baptismName,
      email: d.email || cur.email || '',
      phone: d.phone || cur.phone || '',
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
    full_name: d.fullName || '', baptism_name: d.baptismName, email: d.email || '', phone: d.phone || '',
    parish: d.parish, city: d.city, whatsapp: d.whatsapp || '',
    join_as_stranger: d.joinAsStranger, source_page: d.sourcePage, status: 'Waitlist'
  });
  return { id: id, updated: false };
}

/* ------------------------------------------------------------------ */
/* Volunteer application (Roles page)                                  */
/* ------------------------------------------------------------------ */

function handleApply_(body) {
  if (!isAccepting_()) return { ok: false, error: 'applications_closed' };

  var v = validateApply_(body);
  if (!v.ok) {
    logEvent_('warn', 'apply', 'Validation failed: ' + JSON.stringify(v.fields), safeEmail_(body.email));
    return { ok: false, error: 'validation', fields: v.fields };
  }
  var d = v.data;
  if (closedRoles_().indexOf(d.role.id) !== -1) return { ok: false, error: 'role_closed' };

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    logEvent_('error', 'apply', 'Could not get lock within 15 seconds', d.email);
    return { ok: false, error: 'server' };
  }
  try {
    var app = upsertVolunteerApplication_(d);
    if (d.joinAsStranger) upsertStranger_({
      fullName: d.fullName, baptismName: d.baptismName, email: d.email, phone: d.phone,
      parish: d.parish, city: d.city, whatsapp: '', joinAsStranger: true, sourcePage: 'roles'
    });
    SpreadsheetApp.flush();
    notifyVolunteer_(d, app);
    logEvent_('info', 'apply', (app.updated ? 'Updated' : 'New') + ' application for ' + d.role.id, d.email);
    return { ok: true, applicationId: app.id, updated: app.updated };
  } finally {
    lock.releaseLock();
  }
}

/** A second application from the same email for the same role, while still New, updates the row. */
function upsertVolunteerApplication_(d) {
  var sh = sheet_(SHEETS.VOLUNTEERS);
  var now = new Date().toISOString();
  var found = findRow_(sh, 'email', d.email, emailKey_, function (vals) {
    return vals.role_id === d.role.id && vals.status === 'New';
  });
  var id = found ? found.values.id : 'VOL-' + shortId_();
  var cv = saveCv_(d, id);

  var fields = {
    updated_at: now,
    role_id: d.role.id, role_title: d.role.title, team: d.role.team,
    full_name: d.fullName, baptism_name: d.baptismName, phone: d.phone, email: d.email,
    parish: d.parish, city: d.city, hours: d.hours,
    question_1: d.questions[0] || '', answer_1: d.answers.q1,
    question_2: d.questions[1] || '', answer_2: d.answers.q2,
    question_3: d.questions[2] || '', answer_3: d.answers.q3,
    links: d.links, cv_file: cv.name, cv_link: cv.url,
    confirm_unpaid: true, confirm_sunday: true, confirm_rosary: true,
    join_as_stranger: d.joinAsStranger
  };

  if (found) {
    updateRow_(sh, found.row, fields);
    return { id: id, row: found.row, updated: true, cvUrl: cv.url };
  }
  fields.id = id;
  fields.created_at = now;
  fields.status = 'New';
  fields.notes = '';
  var row = appendRow_(sh, fields);
  return { id: id, row: row, updated: false, cvUrl: cv.url };
}

function saveCv_(d, applicationId) {
  var folder = DriveApp.getFolderById(ensureCvFolder_());
  var ext = CV_TYPES[d.cv.mimeType];
  var name = [applicationId, d.role.title, d.baptismName].join(' · ').replace(/[\\/:*?"<>|]/g, '-') + '.' + ext;
  var blob = Utilities.newBlob(d.cv.bytes, d.cv.mimeType, name);
  var file = folder.createFile(blob);
  file.setDescription('Original file name: ' + d.cv.fileName);
  // The folder is private to the owner; never share files publicly.
  return { name: name, url: file.getUrl() };
}

/* ------------------------------------------------------------------ */
/* Version 1 core team application (kept for older clients only)       */
/* ------------------------------------------------------------------ */

function upsertLegacyApplication_(d) {
  var sh = sheet_(SHEETS.LEGACY_APPLICATIONS);
  var now = new Date().toISOString();
  var found = d.email ? findRow_(sh, 'email', d.email, emailKey_, function (vals) { return vals.status === 'New'; }) : null;
  var fields = {
    updated_at: now, full_name: d.fullName, baptism_name: d.baptismName,
    parish: d.parish, city: d.city, whatsapp: d.whatsapp,
    teams: d.teams.join(', '), about: d.about
  };
  if (found) {
    updateRow_(sh, found.row, fields);
    return { id: found.values.id, row: found.row, updated: true };
  }
  var id = 'APP-' + shortId_();
  fields.id = id; fields.created_at = now; fields.email = d.email; fields.status = 'New'; fields.notes = '';
  var row = appendRow_(sh, fields);
  return { id: id, row: row, updated: false };
}

function getPlaces_(skipCache) {
  var cache = CacheService.getScriptCache();
  if (!skipCache) {
    var hit = cache.get(CACHE_KEY_PLACES);
    if (hit) return JSON.parse(hit);
  }
  var cfg = readConfigRaw_();
  var total = toInt_(cfg.core_team_total, 20);
  var filled = toInt_(cfg.core_team_filled_override, 0);
  var result = { total: total, filled: filled, left: Math.max(0, total - filled), accepting: isAccepting_() };
  cache.put(CACHE_KEY_PLACES, JSON.stringify(result), CACHE_SECONDS);
  return result;
}

function clearPlacesCache_() {
  CacheService.getScriptCache().remove(CACHE_KEY_PLACES);
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function str_(v) { return (v === null || v === undefined) ? '' : String(v).trim(); }

function validateSignup_(b) {
  var fields = {};
  var data = {
    sourcePage: str_(b.sourcePage) || 'home',
    fullName: str_(b.fullName),
    baptismName: str_(b.baptismName),
    email: str_(b.email).toLowerCase(),
    phone: str_(b.phone),
    parish: str_(b.parish),
    city: str_(b.city),
    whatsapp: str_(b.whatsapp),
    joinAsStranger: b.joinAsStranger !== false,
    applyCoreTeam: b.applyCoreTeam === true,
    teams: Array.isArray(b.teams) ? b.teams.map(str_).filter(Boolean) : [],
    about: str_(b.about)
  };
  // Version 1 clients sent the number as whatsapp.
  if (!data.phone && data.whatsapp) data.phone = data.whatsapp;

  [['baptismName', LIMITS.name], ['parish', LIMITS.place], ['city', LIMITS.place]].forEach(function (pair) {
    if (!data[pair[0]]) fields[pair[0]] = 'required';
    else if (data[pair[0]].length > pair[1]) fields[pair[0]] = 'too_long';
  });
  if (data.fullName.length > LIMITS.name) fields.fullName = 'too_long';
  checkPhone_(data.phone, fields, true);
  checkEmail_(data.email, fields, false);
  if (data.about.length > LIMITS.about) fields.about = 'too_long';
  if (ALLOWED_SOURCES.indexOf(data.sourcePage) === -1) fields.sourcePage = 'invalid';

  if (Object.keys(fields).length) return { ok: false, fields: fields };
  ['fullName', 'baptismName', 'email', 'phone', 'parish', 'city', 'whatsapp', 'about'].forEach(function (k) { data[k] = safeCell_(data[k]); });
  return { ok: true, data: data };
}

function validateApply_(b) {
  var fields = {};
  var role = roleById_(str_(b.roleId));
  var answers = b.answers || {};
  var data = {
    role: role,
    questions: [],
    fullName: str_(b.fullName),
    baptismName: str_(b.baptismName),
    phone: str_(b.phone),
    email: str_(b.email).toLowerCase(),
    parish: str_(b.parish),
    city: str_(b.city),
    hours: str_(b.hours),
    links: str_(b.links),
    answers: { q1: str_(answers.q1), q2: str_(answers.q2), q3: str_(answers.q3) },
    joinAsStranger: b.joinAsStranger === true
  };

  if (!role) fields.roleId = 'invalid';
  [['fullName', LIMITS.name], ['baptismName', LIMITS.name], ['parish', LIMITS.place], ['city', LIMITS.place]].forEach(function (pair) {
    if (!data[pair[0]]) fields[pair[0]] = 'required';
    else if (data[pair[0]].length > pair[1]) fields[pair[0]] = 'too_long';
  });
  checkPhone_(data.phone, fields, true);
  checkEmail_(data.email, fields, true);
  if (HOURS_OPTIONS.indexOf(data.hours) === -1) fields.hours = data.hours ? 'invalid' : 'required';

  ['q1', 'q2', 'q3'].forEach(function (k) {
    if (!data.answers[k]) fields[k] = 'required';
    else if (data.answers[k].length > LIMITS.answer) fields[k] = 'too_long';
  });

  if (data.links.length > LIMITS.links) fields.links = 'too_long';
  else if (data.links && !/^https?:\/\/\S+/i.test(data.links)) fields.links = 'invalid';
  else if (role && role.linkRequired && !data.links) fields.links = 'required';

  if (b.confirmUnpaid !== true) fields.confirmUnpaid = 'required';
  if (b.confirmSunday !== true) fields.confirmSunday = 'required';
  if (b.confirmRosary !== true) fields.confirmRosary = 'required';

  var cv = b.cv || {};
  var mime = str_(cv.mimeType);
  var fileName = str_(cv.fileName).slice(0, LIMITS.fileName);
  if (!cv.base64) fields.cv = 'required';
  else if (!CV_TYPES[mime]) fields.cv = 'invalid_type';
  else {
    var bytes;
    try { bytes = Utilities.base64Decode(String(cv.base64)); } catch (err) { fields.cv = 'invalid'; }
    var maxBytes = toNumber_(readConfigRaw_().max_cv_mb, 4) * 1024 * 1024;
    if (bytes && bytes.length > maxBytes) fields.cv = 'too_large';
    else if (bytes && !looksLike_(bytes, CV_TYPES[mime])) fields.cv = 'invalid_type';
    data.cv = { bytes: bytes, mimeType: mime, fileName: fileName || 'cv.' + CV_TYPES[mime] };
  }

  if (Object.keys(fields).length) return { ok: false, fields: fields };

  data.questions = (Array.isArray(b.questions) ? b.questions : []).slice(0, 3).map(function (q) { return safeCell_(str_(q).slice(0, 400)); });
  ['fullName', 'baptismName', 'email', 'phone', 'parish', 'city', 'links'].forEach(function (k) { data[k] = safeCell_(data[k]); });
  ['q1', 'q2', 'q3'].forEach(function (k) { data.answers[k] = safeCell_(data.answers[k]); });
  return { ok: true, data: data };
}

function checkPhone_(v, fields, required) {
  if (!v) { if (required) fields.phone = 'required'; return; }
  if (v.length > LIMITS.phone) fields.phone = 'too_long';
  else if (!/^\+?[0-9 ()-]{6,}$/.test(v) || v.replace(/\D/g, '').length < 7) fields.phone = 'invalid';
}

function checkEmail_(v, fields, required) {
  if (!v) { if (required) fields.email = 'required'; return; }
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) fields.email = 'invalid';
}

/** Checks the file really is what its type says (magic bytes). */
function looksLike_(bytes, ext) {
  var b = function (i) { return (bytes[i] + 256) % 256; };
  if (bytes.length < 8) return false;
  if (ext === 'pdf') return b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46; // %PDF
  if (ext === 'docx') return b(0) === 0x50 && b(1) === 0x4B; // PK (zip)
  if (ext === 'doc') return b(0) === 0xD0 && b(1) === 0xCF && b(2) === 0x11 && b(3) === 0xE0; // OLE
  return false;
}

function roleById_(id) {
  for (var i = 0; i < ROLES.length; i++) if (ROLES[i].id === id) return ROLES[i];
  return null;
}

function closedRoles_() {
  return String(readConfigRaw_().closed_roles || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

function isAccepting_() {
  var raw = readConfigRaw_().accepting_applications;
  return !(raw === false || String(raw).toUpperCase() === 'FALSE');
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

function emailKey_(v) { return String(v || '').replace(/^'/, '').trim().toLowerCase(); }
function phoneKey_(v) { return String(v || '').replace(/\D/g, ''); }

/** Finds the last row whose column matches (after normalising) and passes the optional filter. */
function findRow_(sh, column, value, normalise, filter) {
  var last = sh.getLastRow();
  if (last < 2) return null;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var idx = headers.indexOf(column);
  if (idx === -1) return null;
  var target = normalise(value);
  if (!target) return null;
  var rows = sh.getRange(2, 1, last - 1, headers.length).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {
    if (normalise(rows[i][idx]) === target) {
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

function setConfig_(key, value) {
  var sh = sheet_(SHEETS.CONFIG);
  var last = sh.getLastRow();
  if (last >= 2) {
    var keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < keys.length; i++) {
      if (String(keys[i][0]).trim() === key) { sh.getRange(i + 2, 2).setValue(value); return; }
    }
  }
  sh.appendRow([key, value, '']);
}

/* ------------------------------------------------------------------ */
/* Auth, notify, log, respond, utils                                   */
/* ------------------------------------------------------------------ */

function isAuthorised_(given) {
  var secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  if (!secret || !given) return false;
  var a = String(given), b = String(secret);
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function notifyVolunteer_(d, app) {
  try {
    var to = String(readConfigRaw_().notify_email || '').trim();
    if (!to) return;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEETS.VOLUNTEERS);
    var link = ss.getUrl() + '#gid=' + sh.getSheetId() + '&range=A' + app.row;
    var qa = [1, 2, 3].map(function (n) {
      return (d.questions[n - 1] || 'Question ' + n) + '\n' + d.answers['q' + n];
    }).join('\n\n');
    var body = [
      (app.updated ? 'An application was updated' : 'A new volunteer application arrived') + '.',
      '',
      'Role: ' + d.role.title + ' (' + d.role.team + ')',
      'Baptism name: ' + d.baptismName,
      'Full name: ' + d.fullName,
      'Phone: ' + d.phone,
      'Email: ' + d.email,
      'Parish: ' + d.parish,
      'City: ' + d.city,
      'Time each week besides Sunday: ' + d.hours,
      'Links: ' + (d.links || 'none'),
      'CV: ' + app.cvUrl,
      '',
      qa,
      '',
      'Open the row: ' + link
    ].join('\n');
    MailApp.sendEmail({ to: to, subject: 'Volunteer application: ' + d.role.title + ' · ' + d.baptismName + ' (' + app.id + ')', body: body });
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

function toNumber_(v, fallback) {
  var n = parseFloat(v);
  return isNaN(n) || n <= 0 ? fallback : n;
}

function safeEmail_(v) {
  return String(v || '').trim().toLowerCase().slice(0, 254);
}

/* ------------------------------------------------------------------ */
/* Manual tests: run from the editor (Run > runAllTests).              */
/* They write rows with emails ending @example.test and one test CV.   */
/* Delete those rows and the test file afterwards.                     */
/* ------------------------------------------------------------------ */

function runAllTests() {
  var secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  if (!secret) throw new Error('Set the ' + SECRET_PROPERTY + ' script property first.');
  var post = function (payload) {
    return JSON.parse(doPost({ postData: { contents: JSON.stringify(payload) } }).getContent());
  };
  var get = function (params) {
    return JSON.parse(doGet({ parameter: params }).getContent());
  };
  var results = [];
  var check = function (name, cond, got) { results.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : ' -> ' + JSON.stringify(got))); };

  // Sign-up
  var signup = {
    secret: secret, action: 'signup', sourcePage: 'home',
    baptismName: 'Paul', phone: '+237 600 000 001', parish: 'St Test', city: 'Buea, Cameroon',
    email: '', joinAsStranger: true
  };
  check('rejects wrong secret', post(Object.assign({}, signup, { secret: 'wrong' })).error === 'unauthorised');
  var s1 = post(Object.assign({}, signup, { phone: '' }));
  check('signup needs a phone', s1.error === 'validation' && s1.fields.phone === 'required', s1);
  var s2 = post(signup);
  check('creates stranger', s2.ok === true && /^STR-/.test(s2.strangerId), s2);
  var s3 = post(Object.assign({}, signup, { phone: '+237600000001', email: 'paul@example.test', parish: 'St Updated' }));
  check('same phone updates the stranger', s3.ok === true && s3.updated === true && s3.strangerId === s2.strangerId, s3);

  // Application
  var pdf = Utilities.base64Encode(Utilities.newBlob('%PDF-1.4\n% test cv\n%%EOF').getBytes());
  var apply = {
    secret: secret, action: 'apply', sourcePage: 'roles', roleId: 'logistics-officer',
    fullName: 'Test Volunteer', baptismName: 'Anne', phone: '+237 600 000 002', email: 'anne@example.test',
    parish: 'St Test', city: 'Limbe, Cameroon', hours: '4 to 6 hours', links: '',
    questions: ['Why are you ideal for this role?', 'Tell us about a time one', 'Tell us about a time two'],
    answers: { q1: 'Because I organise things.', q2: 'Answer two.', q3: 'Answer three.' },
    confirmUnpaid: true, confirmSunday: true, confirmRosary: true, joinAsStranger: true,
    cv: { fileName: 'anne-cv.pdf', mimeType: 'application/pdf', base64: pdf }
  };
  var a1 = post(Object.assign({}, apply, { roleId: 'core-and-content-lead-and-network-chaplain' }));
  check('rejects the appointed role', a1.error === 'validation' && a1.fields.roleId === 'invalid', a1);
  var a2 = post(Object.assign({}, apply, { confirmUnpaid: false }));
  check('needs the unpaid confirmation', a2.error === 'validation' && a2.fields.confirmUnpaid === 'required', a2);
  var a3 = post(Object.assign({}, apply, { cv: { fileName: 'x.pdf', mimeType: 'application/pdf', base64: Utilities.base64Encode('not a pdf at all') } }));
  check('rejects a fake PDF', a3.error === 'validation' && a3.fields.cv === 'invalid_type', a3);
  var a4 = post(Object.assign({}, apply, { roleId: 'brand-and-graphic-designer' }));
  check('designer needs a portfolio link', a4.error === 'validation' && a4.fields.links === 'required', a4);
  var a5 = post(apply);
  check('creates application with CV', a5.ok === true && /^VOL-/.test(a5.applicationId), a5);
  var a6 = post(Object.assign({}, apply, { answers: { q1: 'Updated answer.', q2: 'Two.', q3: 'Three.' } }));
  check('same email and role updates the row', a6.ok === true && a6.updated === true && a6.applicationId === a5.applicationId, a6);
  var a7 = post(Object.assign({}, apply, { fullName: '=HYPERLINK("x")', email: 'formula@example.test' }));
  check('neutralises formulas', a7.ok === true, a7);

  // GET
  check('health', get({ action: 'health', secret: secret }).ok === true);
  var roles = get({ action: 'roles', secret: secret });
  check('roles lists 19', roles.ok === true && roles.roles.length === 19, roles);

  Logger.log(results.join('\n'));
  return results;
}
