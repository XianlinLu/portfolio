/** User-supplied Profile.pdf; dates preserved rather than inferred durations.
 * Chinese copy is a translation. No unverified Chinese legal name is assumed.
 */
export type Locale = "en" | "zh";

export const identity = {
  name: "Xianlin Lu",
  portrait: "/images/xianlin-lu.png",
  email: "luxianlin68@gmail.com",
  linkedin: "https://www.linkedin.com/in/xianlin-lu/",
  behance: "https://www.behance.net/xianlinlu",
  portfolio: "https://xianlinlu.webflow.io/",
  skills: ["ComfyUI", "Figma", "AI agent"],
} as const;

export const profile = {
  en: {
    role: "AIGC Designer · Digital Interaction Designer",
    location: "Beijing, China",
    introduction: "I’m Xianlin Lu, a designer and engineer exploring human–computer interaction, AR and VR, 2D and 3D interfaces, automated graphics and multimedia design, mobile and wearable computing, and data visualization.",
    invitation: "I’m looking forward to collaborating with people who share my love for design.",
    experience: [
      { company: "ByteDance", role: "AIGC Designer", start: "2025-11", end: null, location: "Beijing, China", highlights: [] },
      { company: "Sine Wave Entertainment", role: "UI & UX Designer", start: "2022-12", end: "2025-10", location: "London, United Kingdom", highlights: ["Owned end-to-end design from requirements and prototyping to visual design and development follow-up.", "Redesigned dashboards and login flows, reducing task completion time by 20%.", "User research and usability testing informed iterations that increased user satisfaction by 25%.", "Landing pages and promotional campaigns achieved a 30% higher click-through rate.", "Established interaction specifications and visual guidelines."] },
      { company: "Luxottica", role: "Graphic Designer", start: "2021-07", end: "2022-09", location: "Milan, Italy", highlights: ["Website redesign improved navigation and visual hierarchy, resulting in 35K+ pageviews and an Awwwards Honorable Mention.", "Contributed to brand digitisation, localization, logo redesign, and UI improvements.", "Collaborated with analysts on data visualization and delivered creative design and HTML development for key pages."] },
    ],
    education: [
      { school: "Politecnico di Milano", degree: "Master’s degree · Digital Interaction Design", dates: "2020-09 – 2022-12" },
      { school: "Domus Academy", degree: "Master’s degree · Interaction Design", dates: "2020-10 – 2021-12" },
      { school: "NABA Nuova Accademia di Belle Arti", degree: "Bachelor’s degree · Graphic Design & Art Direction", dates: "2017-09 – 2020-07" },
      { school: "Shanghai Business School", degree: "Bachelor’s degree · Visual Communication Design", dates: "2016-06 – 2017-07" },
    ],
    honors: ["NABA Communication Award", "2021 Milan Design Marathon", "2021 Tortona Design Week", "2020 Asian Design Invitation Exhibition · Exhibitor"],
    languages: ["Chinese · Native or bilingual", "English · Full professional", "Italian · Limited working", "Spanish · Elementary"],
    navigation: { about: "About", work: "Work", contact: "Contact", skip: "Skip the story", replay: "Replay the story", sound: "Sound" },
    form: { title: "Tell me about your project", name: "Name", contact: "Email / Contact", task: "Project details", submit: "Preview message", notice: "This is a frontend demo. No message has been sent." },
  },
  zh: {
    role: "AIGC 设计师 · 数字交互设计师",
    location: "中国 · 北京",
    introduction: "我是 Xianlin Lu，一名设计师与工程师，探索人机交互、增强现实与虚拟现实、二维与三维界面、图形与多媒体自动化设计、移动与可穿戴计算，以及数据可视化。",
    invitation: "期待与同样热爱设计的人合作，让创意推动团队向前。",
    experience: [
      { company: "字节跳动", role: "AIGC 设计师", start: "2025-11", end: null, location: "中国 · 北京", highlights: [] },
      { company: "Sine Wave Entertainment", role: "UI / UX 设计师", start: "2022-12", end: "2025-10", location: "英国 · 伦敦", highlights: ["负责从需求分析、原型与视觉设计到开发跟进的完整设计流程。", "重设计仪表盘与登录流程，使任务完成时间缩短 20%。", "通过用户研究与可用性测试推动迭代，用户满意度提升 25%。", "设计落地页及推广活动，点击率提升 30%。", "建立交互规范与视觉指南。"] },
      { company: "Luxottica", role: "平面设计师", start: "2021-07", end: "2022-09", location: "意大利 · 米兰", highlights: ["通过网站改版优化导航与视觉层级，获得超过 3.5 万次页面浏览和 Awwwards 荣誉提名。", "参与品牌数字化、本地化、标志重设计及界面改进。", "与分析师合作完成数据可视化，并负责关键页面的创意设计与 HTML 开发。"] },
    ],
    education: [
      { school: "米兰理工大学", degree: "硕士 · 数字交互设计", dates: "2020-09 – 2022-12" },
      { school: "Domus Academy", degree: "硕士 · 交互设计", dates: "2020-10 – 2021-12" },
      { school: "NABA 米兰新美术学院", degree: "学士 · 平面设计与艺术指导", dates: "2017-09 – 2020-07" },
      { school: "上海商学院", degree: "学士 · 视觉传达设计", dates: "2016-06 – 2017-07" },
    ],
    honors: ["NABA Communication Award", "2021 米兰设计马拉松", "2021 Tortona 设计周", "2020 亚洲设计邀请展 · 参展者"],
    languages: ["中文 · 母语或双语", "英语 · 专业工作能力", "意大利语 · 有限工作能力", "西班牙语 · 基础"],
    navigation: { about: "关于", work: "作品", contact: "联系", skip: "跳过故事", replay: "重播故事", sound: "声音" },
    form: { title: "聊聊你的项目", name: "姓名", contact: "邮箱 / 联系方式", task: "项目详情", submit: "预览留言", notice: "这是纯前端演示，留言尚未发送。" },
  },
} as const;
