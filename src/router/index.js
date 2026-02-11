import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/production',
            component: () => import('../views/production/ProductionWizard.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'production-start',
                    component: () => import('../views/production/steps/FruitPlacement.vue')
                },
                {
                    path: 'preprocessing',
                    name: 'production-preprocessing',
                    component: () => import('../views/production/steps/Preprocessing.vue')
                },
                {
                    path: 'scheme',
                    name: 'production-scheme',
                    component: () => import('../views/production/steps/ProcessingScheme.vue')
                },
                {
                    path: 'process',
                    name: 'production-process',
                    component: () => import('../views/production/steps/ProductionStatus.vue')
                }
            ]
        },
        {
            path: '/nutrition',
            name: 'nutrition',
            component: () => import('../views/NutritionView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/community',
            name: 'community',
            component: () => import('../views/CommunityView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router
