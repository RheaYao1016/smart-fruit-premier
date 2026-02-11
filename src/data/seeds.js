import { ASSETS } from '@/constants/assets'
import { demoHash } from '@/utils/security'

const now = Date.now()

export const seedUsers = [
  {
    id: 'u_admin',
    account: 'admin',
    passwordHash: demoHash('admin123'),
    role: 'admin',
    nickname: '运营管理员',
    avatar: ASSETS.avatars[0],
    gender: '男',
    birthday: '1990-06-12',
    region: '上海',
    preference: {
      lowSugar: true,
      highFiber: false,
      allergies: ['芒果']
    },
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 40).toISOString()
  },
  {
    id: 'u_maintainer',
    account: 'maintainer',
    passwordHash: demoHash('maintain123'),
    role: 'maintainer',
    nickname: '设备维护员',
    avatar: ASSETS.avatars[2],
    gender: '女',
    birthday: '1994-02-19',
    region: '苏州',
    preference: {
      lowSugar: false,
      highFiber: true,
      allergies: []
    },
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 25).toISOString()
  },
  {
    id: 'u_user',
    account: 'user',
    passwordHash: demoHash('user123'),
    role: 'user',
    nickname: '果汁达人小李',
    avatar: ASSETS.avatars[1],
    gender: '女',
    birthday: '1998-11-08',
    region: '杭州',
    preference: {
      lowSugar: true,
      highFiber: true,
      allergies: ['菠萝']
    },
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString()
  }
]

export const seedPosts = [
  {
    id: 'p_1',
    authorId: 'u_user',
    title: '夏日特饮：西瓜薄荷冰沙',
    content: '西瓜+薄荷+冰块，30秒打出清凉感。低糖模式也很好喝。',
    tags: ['果汁', '健康'],
    images: [ASSETS.communityCovers[0]],
    recipe: {
      mode: 'juice',
      fruits: ['西瓜', '薄荷叶'],
      waterMl: 80,
      sugarG: 6,
      temp: '冷饮'
    },
    isPinned: false,
    isHidden: false,
    isApproved: true,
    createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'p_2',
    authorId: 'u_admin',
    title: '自制黄桃罐头，童年的味道',
    content: '黄桃去皮切块，低温慢煮，甜度控制在 20% 更适合家庭饮用。',
    tags: ['罐头', '家庭'],
    images: [ASSETS.communityCovers[1]],
    recipe: {
      mode: 'canned',
      fruits: ['黄桃'],
      waterMl: 200,
      sugarG: 25,
      temp: '常温'
    },
    isPinned: true,
    isHidden: false,
    isApproved: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'p_3',
    authorId: 'u_user',
    title: '彩虹果盘，颜值与美味并存',
    content: '草莓、奇异果、蓝莓做颜色分层，适合亲子场景。',
    tags: ['果切', '果盘'],
    images: [ASSETS.communityCovers[2]],
    recipe: {
      mode: 'cut',
      fruits: ['草莓', '奇异果', '蓝莓'],
      waterMl: 0,
      sugarG: 0,
      temp: '常温'
    },
    isPinned: false,
    isHidden: false,
    isApproved: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString()
  }
]

export const seedComments = [
  {
    id: 'c_1',
    postId: 'p_1',
    userId: 'u_admin',
    content: '薄荷的量控制得不错，适合大众口感。',
    parentId: null,
    createdAt: new Date(now - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'c_2',
    postId: 'p_2',
    userId: 'u_user',
    content: '这个配方我今晚就试试。',
    parentId: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString()
  }
]

export const seedLikes = [
  { id: 'l_1', postId: 'p_1', userId: 'u_admin', createdAt: new Date(now - 1000 * 60 * 20).toISOString() },
  { id: 'l_2', postId: 'p_2', userId: 'u_user', createdAt: new Date(now - 1000 * 60 * 60).toISOString() },
  { id: 'l_3', postId: 'p_2', userId: 'u_maintainer', createdAt: new Date(now - 1000 * 60 * 90).toISOString() }
]

export const seedFavorites = [
  { id: 'f_1', postId: 'p_1', userId: 'u_user', createdAt: new Date(now - 1000 * 60 * 15).toISOString() },
  { id: 'f_2', postId: 'p_2', userId: 'u_user', createdAt: new Date(now - 1000 * 60 * 16).toISOString() }
]

export const seedReports = [
  {
    id: 'r_1',
    postId: 'p_3',
    reporterId: 'u_admin',
    reason: '疑似广告',
    description: '文本里疑似引流。',
    status: 'resolved',
    createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
    handledBy: 'u_admin',
    handledAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    result: '未发现违规，已驳回'
  }
]

export const seedProductionHistory = [
  {
    id: 'h_1',
    userId: 'u_user',
    mode: 'juice',
    fruitCount: 3,
    preprocess: [
      { id: 1, pitting: false, peeling: true, cutting: true },
      { id: 2, pitting: false, peeling: false, cutting: true },
      { id: 3, pitting: true, peeling: false, cutting: true }
    ],
    params: {
      texture: '高纤维',
      temperature: '冷饮',
      sweetnessType: '自定义',
      sweetnessValue: 35
    },
    image: ASSETS.communityCovers[4],
    createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString()
  }
]

export const seedNutritionContent = [
  {
    id: 'n_1',
    title: '凝香甜梨汁',
    summary: '润肺清甜，适合晨间补水。',
    cover: ASSETS.fruits[0],
    recipe: { fruits: '雪梨 2 个', waterMl: 180, sugarG: 8, temperature: '常温 20°C' },
    detail: '雪梨去皮切块，先低速后高速，口感更加顺滑。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'n_2',
    title: '原香苹果汁',
    summary: '经典苹果风味，清爽低负担。',
    cover: ASSETS.fruits[1],
    recipe: { fruits: '苹果 3 个', waterMl: 150, sugarG: 10, temperature: '冷饮 10°C' },
    detail: '建议使用脆甜苹果，减少额外加糖。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    id: 'n_3',
    title: '热带水果汁',
    summary: '芒果+菠萝，果香浓郁。',
    cover: ASSETS.fruits[2],
    recipe: { fruits: '芒果 2 个 + 菠萝 1/2 个', waterMl: 220, sugarG: 12, temperature: '冷饮 8°C' },
    detail: '可加入少量椰汁，提升热带风味。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'n_4',
    title: '健胃山楂汁',
    summary: '酸甜平衡，餐后友好。',
    cover: ASSETS.fruits[3],
    recipe: { fruits: '山楂 10 颗', waterMl: 300, sugarG: 20, temperature: '温饮 35°C' },
    detail: '山楂需去核，避免苦涩。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'n_5',
    title: '清爽黄瓜汁',
    summary: '清新低糖，适合运动后。',
    cover: ASSETS.fruits[4],
    recipe: { fruits: '黄瓜 2 根', waterMl: 200, sugarG: 4, temperature: '冷饮 12°C' },
    detail: '可搭配薄荷提升层次。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'n_6',
    title: '清润甘蔗汁',
    summary: '自然甜感，补水充能。',
    cover: ASSETS.fruits[5],
    recipe: { fruits: '甘蔗 1 节', waterMl: 0, sugarG: 0, temperature: '常温 25°C' },
    detail: '建议过滤纤维后饮用，口感更佳。',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
]
