import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const router = useRouter()

    const userProfile = ref({
        name: '用户名称',
        bio: '鲜果生活家 | ID: 882910',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        header: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
        gender: '女',
        age: 25,
        location: '上海'
    })

    function updateProfile(payload) {
        userProfile.value = { ...userProfile.value, ...payload }
    }

    function login(username, password) {
        // Mock login logic
        if (username && password) {
            user.value = { name: username }
            // Update profile name on login if generic
            if (userProfile.value.name === '用户名称') {
                userProfile.value.name = username
            }
            isAuthenticated.value = true
            return true
        }
        return false
    }

    function logout() {
        user.value = null
        isAuthenticated.value = false
        // router.push('/login')
    }

    return { user, isAuthenticated, userProfile, login, logout, updateProfile }
})
