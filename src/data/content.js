// 中央数据层：所有可编辑内容集中在这里
// 后续替换真实项目图、文案只需改本文件即可

export const site = {
  brand: 'WEIJIAJIE',
  name: '韦嘉杰',
  nameEn: 'WEI JIAJIE',
  role: '短视频 / 新媒体运营',
  roleEn: 'Short-Video & New Media',
  location: '广东 · 广州',
  tagline: '用镜头和内容把数据做出来',
  email: '1915084970@qq.com',
  phone: '19127921737',
  // 抖音等外链占位，后续可改成真实链接
  social: [
    { label: 'Douyin', handle: '@weijiajie' },
    { label: 'Xiaohongshu', handle: '@weijiajie' },
    { label: 'WeChat', handle: 'wj_19127921737' },
  ],
  // 作品集完整版 · 百度网盘下载入口
  portfolio: {
    name: '作品集 · 百度网盘',
    link: 'https://pan.baidu.com/s/1wL9Ki7wsDUkmMPXdYa_AOA?pwd=8cn3',
    pwd: '8cn3',
  },
};

export const navItems = [
  { id: 'home', label: '首页', en: 'Home' },
  { id: 'about', label: '关于', en: 'About' },
  { id: 'projects', label: '项目', en: 'Works' },
  { id: 'strengths', label: '能力', en: 'Skills' },
  { id: 'contact', label: '联系', en: 'Contact' },
];

export const about = {
  title: '用内容把数据做出来',
  titleEn: 'ABOUT',
  intro:
    '我是韦嘉杰，网络与新媒体 2026 届本科毕业生，专注短视频内容创作与新媒体账号运营。从 0 起号冷启动抖音 IP——1 个月涨粉 8,000+、累计获赞 40,000+。',
  lead: '从零起号｜企业号运营｜宣传片拍摄｜口播全流程',
  edu: [
    {
      school: '桂林旅游学院',
      major: '网络与新媒体 · 本科',
      time: '2022 — 2026',
    },
    {
      school: '深圳好创意文化传媒',
      major: '新媒体运营实习生',
      time: '2025.12 — 2026.03',
    },
    {
      school: '广州靠近香氛',
      major: '新媒体运营',
      time: '2026.06 — 2026.08',
    },
  ],
  skills: [
    '剪映', 'Premiere Pro', 'Photoshop',
    '摄影摄像', '构图布光',
    'AI 视频生成', 'AI 绘图', 'AI 脚本',
    '选题策划', '脚本撰写', '账号运营', '数据复盘',
  ],
  stats: [
    { num: '40,000+', label: '累计获赞' },
    { num: '8,000+', label: '1 个月涨粉' },
    { num: '2', label: '点赞破万作品' },
    { num: '6', label: '独立运营作品数' },
  ],
  contact: [
    { label: '邮箱', value: '1915084970@qq.com' },
    { label: '电话', value: '191 2792 1737' },
    { label: '城市', value: '广东 · 广州' },
  ],
};

export const projects = [
  {
    id: 'p01',
    index: '01',
    year: '2025.12 — 2026.03',
    title: '抖音个人 IP',
    subtitle: '独立运营 / 内容增长',
    tone: 'coral',
    desc: '从 0 起号独立运营短视频账号，1 个月内涨粉 8,000+，累计获赞 40,000+，2 条作品单条点赞破万。基于数据、热点与用户反馈迭代选题和封面，持续优化内容产出。',
    tags: ['账号定位', '选题策划', '拍摄剪辑', '数据复盘'],
    metric: { value: '+8,000', label: '1 个月涨粉' },
  },
  {
    id: 'p02',
    index: '02',
    year: '2025.12 — 2026.03',
    title: '深圳好创意文化传媒 · 短视频运营实习',
    subtitle: '企业号日常运营',
    tone: 'sky',
    desc: '负责短视频账号日常运营：选题分析、内容策划、脚本撰写，参与短视频拍摄与后期制作，协同运营团队做素材整理、热点跟踪与数据复盘，根据播放量、点赞量等指标调整内容方向。',
    tags: ['选题脚本', '字幕包装', '热点分析', '内容优化'],
    metric: { value: '3+', label: '协同负责账号' },
  },
  {
    id: 'p03',
    index: '03',
    year: '2024.10 / 2025.05',
    title: '桂林红色旅游创意大赛',
    subtitle: '摄影 / 剪辑 / 参赛',
    tone: 'amber',
    desc: '围绕桂林红色文旅主题，独立完成活动拍摄与后期剪辑，提交短视频参赛作品。锻炼了在真实场景下"快速出脚本、稳定出片"的能力。',
    tags: ['活动拍摄', '后期剪辑', '文旅主题'],
    metric: { value: 'Ⅱ', label: '二等奖' },
  },
  {
    id: 'p04',
    index: '04',
    year: '2024.12 — 2025.10',
    title: '互联网+ / 三创赛 / 建行杯',
    subtitle: '赛事 / 校级二等奖',
    tone: 'accent',
    desc: '作为团队主创之一参与第十五届全国大学生电子商务"三创赛"校级赛，获二等奖；同期"互联网+""建行杯"广西赛区赛事获奖，积累了把内容创意落到完整方案与汇报材料上的经验。',
    tags: ['团队协作', '方案撰写', '路演汇报'],
    metric: { value: 'Ⅱ', label: '二等奖' },
  },
  {
    id: 'p05',
    index: '05',
    year: '2024.09 — 2024.11',
    title: '主题党日 / 公益展演拍摄',
    subtitle: '政府/校园活动摄影',
    tone: 'mint',
    desc: '参与桂林全州主题党日活动、桂林市红心向党儿童青少年公益展演等多次官方活动拍摄，输出活动照片与视频素材。',
    tags: ['活动跟拍', '人物纪实', '光线调度'],
    metric: { value: '7+', label: '场次官方拍摄' },
  },
  {
    id: 'p06',
    index: '06',
    year: '2024.11',
    title: '熟悉各类型剪辑',
    subtitle: '口播 / 信息流 / 混剪',
    tone: 'coral',
    desc: '独立完成各类视频从选题策划到成片输出全流程，具备多种类型视频项目的完整独立执行能力。',
    tags: ['微电影', '情绪表达', '完整短片'],
    metric: { value: '三年', label: '剪辑经验' },
  },
];

export const strengths = [
  {
    id: 's1',
    no: '01',
    title: '完整短视频制作流程',
    en: 'End-to-End Production',
    desc: '从选题策划、脚本撰写、拍摄执行到后期剪辑、包装发布，独自把一条视频从 0 做到 1 跑通过。',
  },
  {
    id: 's2',
    no: '02',
    title: '摄影摄像与画面构图',
    en: 'Photography & Framing',
    desc: '熟悉不同场景下的画面构图、镜头运用与光线布置，能根据内容需求完成活动拍摄、人物采访与宣传片。',
  },
  {
    id: 's3',
    no: '03',
    title: '后期工具栈',
    en: 'Post-Production Stack',
    desc: '熟练使用剪映、Premiere Pro、Photoshop 等软件，掌握视频剪辑、字幕包装、画面优化等后期制作技能。',
  },
  {
    id: 's4',
    no: '04',
    title: '新媒体平台运营逻辑',
    en: 'Platform Operation',
    desc: '熟悉新媒体平台内容运营逻辑，能结合热点趋势进行内容策划、素材整理与账号运营优化。',
  },
  {
    id: 's5',
    no: '05',
    title: 'AI 辅助创作工作流',
    en: 'AI-Augmented Workflow',
    desc: '掌握 AI 视频生成、AI 绘图、AI 脚本等工具，能用 AI 提效选题、出分镜与封面迭代。',
  },
  {
    id: 's6',
    no: '06',
    title: '团队协作与赛事经历',
    en: 'Team & Competition',
    desc: '新媒体社团骨干经历 + "三下乡""互联网+""三创赛"等多项校级/省级赛事经验。',
  },
];
