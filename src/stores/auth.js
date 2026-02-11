import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const router = useRouter()

    function login(username, password) {
        // Mock login logic
        if (username && password) {
            user.value = { name: username }
            isAuthenticated.value = true
            return true
        }
        return false
    }

    function logout() {
        user.value = null
        isAuthenticated.value = false
        // router.push('/login') // Router instance might not be available here directly in some setups, better to handle in component or use router instance if injected
    }

    return { user, isAuthenticated, login, logout }
})
