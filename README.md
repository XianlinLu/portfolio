# Xianlin Lu · Design & Technology

**[Visit the portfolio → https://xianlinlu.github.io/portfolio/](https://xianlinlu.github.io/portfolio/)**

[中文说明](README.zh-CN.md)

A bilingual personal portfolio presenting Xianlin Lu’s original personal content, design explorations, and professional experience in AIGC, digital interaction, and visual communication.

## Personal content

Personal biography and portrait are based on owner-provided materials. The homepage uses a compact introduction rather than a full experience and education list. The gallery images, videos, and eight figures are visual references supplied for the requested presentation; they are not claims about Xianlin Lu’s authorship or client results. Original-content statements apply only to personal biography. Third-party software and media remain subject to their applicable licenses.

The My Portfolio button opens https://xianlinlu.webflow.io/ in a new tab.

## Development

Use Node.js 24 or later:

```sh
npm ci
npm run dev
```

- `npm run check`: lint, TypeScript, and production build.
- `npm run build` / `npm start`: standard Next.js production hosting.
- `npm run build:pages`: static GitHub Pages build in `out/`, with `/portfolio` as the base path.

Pushes to `main` deploy through `.github/workflows/pages.yml`. English and Chinese versions are available at `?lang=en` and `?lang=zh`.

## Editing

- `src/content/profile.ts`: bilingual biography, experience, education, and contact details.
- `src/content/sections-en.json` and `sections-zh.json`: page content.
- `src/content/scene-translations.json`: translated interactive labels.
- `src/scene/`: room, CRT, desktop, work cards, audio, and animation modules.
- `public/assets/works/manifest.json`: portfolio card images and dimensions.
- `public/assets/xianlin-mark.svg`: personal monogram.
- `public/images/xianlin-lu.png`: portrait.

The scene bundle is generated before development and production builds. After editing scene modules during an active development session, run `node scripts/build-scene.mjs` and reload the browser.

## Current scope

The interactive story is designed primarily for desktop and requires WebGL. The contact form validates input and displays a local preview; it does not send or store messages. Public email and social links provide direct contact options.
