# Xianlin Lu 个人网站

基于 Next.js 16、React 19 和 Three.js 的桌面端作品集，支持中英文切换。

## 启动

需要 Node.js 24 或更新版本。

```sh
npm ci
npm run dev
```

生产构建：`npm run build`，运行：`npm start`。可部署到 Vercel 或支持 Node.js 的主机。

## 内容编辑

- `src/content/profile.ts`：双语经历、教育和联系方式。
- `src/content/sections-en.json`、`sections-zh.json`：页面内容。
- `src/content/scene-translations.json`：场景与弹窗翻译。
- `src/scene/`：独立的场景、作品、手机、声音与交互模块。
- `public/images/xianlin-lu.png`：个人照片。
- `public/sites/hello/assets/works/manifest.json`：作品卡片清单。

首页保留参考网站的 3D 房间、连接网线、滚动镜头、模拟系统更新、弹窗、分类切换和重播结构。个人信息、照片及中文排版已适配 Xianlin Lu。当前作品卡片依据个人经历绘制，实际作品通过 Behance 与个人作品集链接访问，可自行替换为项目图片。

联系表单只在浏览器中生成预览，不发送或保存信息。仅实现当前首页，不包含移动端专用布局。主验收宽度为 1440px。

详细说明见 [README](README.md)。
