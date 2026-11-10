<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

---
description: Project conventions for Xianlin Lu Portfolio
alwaysApply: true
---
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Xianlin Lu Portfolio

This repository presents Xianlin Lu’s personal design work, biography, and professional experience in English and Chinese.

## Development
- Use Node.js 24 and install dependencies with `npm ci`.
- Run `npm run dev` locally and `npm run check` before submitting changes.
- Keep personal content in `src/content/` and interactive modules in `src/scene/`.
- Keep English and Chinese content consistent and preserve verified profile facts.
- Describe original personal content precisely; do not imply authorship of third-party dependencies.
- Preserve third-party license notices where applicable.
- Support the `/portfolio` base path for GitHub Pages and the root path for local development.
- After editing this file, run `bash scripts/sync-agent-rules.sh`.
