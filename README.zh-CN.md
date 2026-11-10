# Xianlin Lu · 设计与科技

**[访问个人作品集 → https://xianlinlu.github.io/portfolio/](https://xianlinlu.github.io/portfolio/)**

[English](README.md)

展示 Xianlin Lu 原创个人内容、设计探索与专业经历的中英双语作品集，涵盖 AIGC、数字交互与视觉传达。

## 原创个人内容

个人叙事与基于履历的展示卡片为 Xianlin Lu 专门创作。个人介绍、工作经历、教育背景及肖像依据本人提供的资料整理。展示卡片用于呈现研究方向和专业经历，不冒充已完成客户项目的实物截图。原创声明适用于上述个人内容；第三方软件和媒体遵循各自适用的许可。

## 本地开发

使用 Node.js 24 或更新版本：

```sh
npm ci
npm run dev
```

- `npm run check`：运行 ESLint、TypeScript 检查及生产构建。
- `npm run build` / `npm start`：常规 Next.js 部署。
- `npm run build:pages`：生成 GitHub Pages 静态文件到 `out/`，使用 `/portfolio` 路径前缀。

推送到 `main` 后，由 `.github/workflows/pages.yml` 自动部署。中文与英文版本分别使用 `?lang=zh` 和 `?lang=en`。

## 内容维护

- `src/content/profile.ts`：双语个人资料、履历及联系方式。
- `src/content/sections-en.json`、`sections-zh.json`：页面内容。
- `src/content/scene-translations.json`：交互界面译文。
- `src/scene/`：房间、屏幕、桌面、作品、声音与动画模块。
- `public/assets/works/manifest.json`：作品卡片图片和尺寸。
- `public/assets/xianlin-mark.svg`：个人字母标识。
- `public/images/xianlin-lu.png`：个人肖像。

场景脚本在开发和构建前自动生成。开发服务器运行期间修改场景模块后，运行 `node scripts/build-scene.mjs` 并刷新浏览器。

## 当前功能范围

互动故事主要面向桌面浏览器，需要 WebGL。联系表单仅校验输入并提供本地预览，不发送或保存留言；可通过公开邮箱与社交链接直接联系。
