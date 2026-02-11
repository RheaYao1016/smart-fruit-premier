import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', hideShell: true, publicOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '注册', hideShell: true, publicOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { title: '找回密码', hideShell: true, publicOnly: true }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '主页', requiresAuth: true, tab: 'home' }
  },
  {
    path: '/production',
    name: 'production',
    component: () => import('@/views/production/ProductionWizard.vue'),
    meta: { title: '制作向导', requiresAuth: true, tab: 'production' }
  },
  {
    path: '/nutrition',
    name: 'nutrition',
    component: () => import('@/views/NutritionView.vue'),
    meta: { title: '营养科普', requiresAuth: true, tab: 'nutrition' }
  },
  {
    path: '/nutrition/:id',
    name: 'nutrition-detail',
    component: () => import('@/views/NutritionDetailView.vue'),
    meta: { title: '科普详情', requiresAuth: true, tab: 'nutrition' }
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/CommunityView.vue'),
    meta: { title: '果汁社区', requiresAuth: true, tab: 'community' }
  },
  {
    path: '/community/new',
    name: 'community-new',
    component: () => import('@/views/CommunityCreateView.vue'),
    meta: { title: '发布帖子', requiresAuth: true, tab: 'community' }
  },
  {
    path: '/community/:id',
    name: 'community-detail',
    component: () => import('@/views/CommunityDetailView.vue'),
    meta: { title: '帖子详情', requiresAuth: true, tab: 'community' }
  },
  {
    path: '/community-manage',
    name: 'community-manage',
    component: () => import('@/views/CommunityManageView.vue'),
    meta: { title: '社区管理', requiresAuth: true, roles: ['admin'], tab: 'community' }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/MyView.vue'),
    meta: { title: '我的', requiresAuth: true, tab: 'my' }
  },
  {
    path: '/maintainer',
    name: 'maintainer',
    component: () => import('@/views/MaintainerView.vue'),
    meta: { title: '设备维护', requiresAuth: true, roles: ['maintainer', 'admin'], tab: 'my' }
  },
  {
    path: '/profile',
    redirect: '/my'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.hydrateSession()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.publicOnly && authStore.isAuthenticated) {
    return '/'
  }

  if (to.meta.roles && !authStore.canAccess(to.meta.roles)) {
    return '/'
  }

  return true
})

export default router
