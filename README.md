# Xianlin Lu Portfolio

Next.js 16 + React 19 + Three.js desktop portfolio. Chinese and English versions are available at `/?lang=zh` and `/?lang=en`.

## Run

Node.js 24 or later:

```sh
npm ci
npm run dev
```

Production:

```sh
npm run build
npm start
```

Deploy as a Next.js project on Vercel, or use a Node.js host. No backend credentials are required. This is not a GitHub Pages static export.

## Edit

- `src/content/profile.ts`: bilingual experience, education, public contact links.
- `src/content/sections-en.json`, `sections-zh.json`: editable homepage section markup.
- `src/content/scene-translations.json`: Chinese scene/dialog strings.
- `src/scene/`: separate room, cable, CRT, OS, works, phone, cursor, audio and animation modules.
- `src/app/style.css`, `os.css`, `about.css`: desktop design rules.
- `public/sites/hello/assets/works/manifest.json`: work cards; replace with your own images and dimensions.
- `public/images/xianlin-lu.png`: user-supplied portrait.

The scene bundle is rebuilt automatically before `dev` and `build`. Editing scene source while dev is already running requires `node scripts/build-scene.mjs` and a browser reload.

The contact form validates input and shows a local preview. It does not submit, email, store, or transmit the message. Email/LinkedIn/Behance links are normal external links.

## Content and scope

Reference: https://helloworlddsgn.com/ . User confirmed permission to reuse reference code and media. The 3D/scroll/UI structure is adapted from the authorized reference. Personal copy and portrait are user-provided. Reference project images containing another person's identity or Ukrainian text are excluded. Work cards are designed from profile facts, not screenshots of completed client projects. Personalization, Chinese typography, the experience section, and profile cards intentionally differ from the reference.

Only `/` is implemented. No mobile navigation or mobile breakpoints. Main visual target: 1440px desktop. WebGL is required for the 3D story; readable content remains available if its model cannot load.
