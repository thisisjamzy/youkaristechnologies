# Prompt 4: Apply the new hero tagline, the social share image and the new photos

Paste everything below the line into Claude Code or Cursor if the website build has already started. If it has not, prompt 2 already includes these changes and this prompt is not needed.

---

The build kit in `Website/sfm-website-build-kit/` has been updated. Apply these changes to `Website/web/`, following `Website/web/CLAUDE.md`.

## 1. New Home hero headline

The Home page `h1` is now one sentence, two-tone:

- Ink: `Every friend of Mary is a stranger`
- Muted (`#8A94A6`): `we cannot wait to pray for, care for, and gather with.`

It replaces "If you love Mary, you are already one of us. Now take your place in the network." There is no separate line under it any more. The paragraph, buttons, photo and cards under it stay the same.

- Update `strings.home.opening.headline` in `src/content/strings.ts` to `{ main: "Every friend of Mary is a stranger", muted: "we cannot wait to pray for, care for, and gather with." }` and remove the old second line.
- Check the headline at 320px, 390px, 768px, 1280px and 1440px. It is a little longer than before: if it runs past five lines on a 390px phone, step the mobile font size down one step on the type scale in `tokens.ts` (never a one-off value), and say what you changed.
- Sources: `content/strings-master.md` (Home, Opening) and `design-reference/home.html`.

## 2. Social share image and text

- Copy `assets/social/sfm-og-1200x630.jpg` to `src/app/opengraph-image.jpg` and `src/app/twitter-image.jpg`. Add the matching `opengraph-image.alt.txt` and `twitter-image.alt.txt` with the "Share image alt text" from `content/strings-master.md` (section "Social sharing"). Use the file conventions this Next.js version documents in `node_modules/next/dist/docs/`.
- In the root layout metadata: `metadataBase` `https://www.strangersformary.org`; `openGraph` with type `website`, `siteName` "Strangers for Mary", locale `en`, and the share title and description; `twitter` with `card: "summary_large_image"` and the same title and description.
- Share title: `Strangers for Mary | A Rosary a day for a stranger`
- Share description: `Every day, a stranger prays a full Rosary for your intention, and you pray one for someone else. Join Catholics everywhere in the network, and be one of the first.`
- Put all three texts in `strings.meta.share` and read them from there. Use the same description as the Home page `<meta name="description">`.
- Do not generate the image in code. It is a designed asset. If the headline changes again, its source is `assets/social/og-source.html`.

## 3. Check

- `npm run lint`, `npm run test` and `npm run build` pass.
- In the built HTML of `/`, the `og:image` URL is absolute, `og:image:width` is 1200 and `og:image:height` is 630.
- Report what changed. After deploying, test the link in the Facebook Sharing Debugger, the LinkedIn Post Inspector and a WhatsApp chat.

## 4. Photos now come only from the Stock Images folder

Seven photos were replaced so that every image on the site comes from the owner's Stock Images folder. In `public/images/`, delete these files: `pray-hands-together.jpg`, `pray-open-hands.jpg`, `give-outreach.jpg`, `gather-crowd.jpg`, `gather-hall.jpg`, `story-campus.jpg`, `men-talking.jpg`. Copy in the new ones from `assets/photos/` and update every reference and alt text (alt text is in `content/strings-master.md`):

| Old file | New file | Where | New alt text |
| --- | --- | --- | --- |
| pray-hands-together.jpg | pray-hand-rosary.jpg | Home hero | A hand holding a rosary in prayer |
| pray-open-hands.jpg | pray-hands-raised.jpg | Pray hero, Pray link cards | Hands raised in prayer |
| give-outreach.jpg | give-embrace.jpg | Home "We give", Give hero, Give link cards | Two women embracing |
| gather-crowd.jpg | gather-worship-crowd.jpg | Home "We gather", Gather hero, Gather link cards | A crowd of people worshipping together |
| gather-hall.jpg | gather-talking.jpg | Gather "What happens" card | Strangers talking together at a gathering |
| story-campus.jpg | story-church-row.jpg | Our Story "What we saw" | A row of people praying with open hands in church |
| men-talking.jpg | story-praying-room.jpg | Our Story "When it broke" | Young people praying together in a crowded room |

Replace `public/images/CREDITS.json` with the kit's version. Then check with a search that no old file name is referenced anywhere.
