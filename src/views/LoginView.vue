<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (authStore.login(username.value, password.value)) {
    router.push('/')
  } else {
    error.value = '请输入用户名和密码'
  }
}
</script>

<template>
  <div class="min-h-screen bg-cream flex flex-col relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-fresh-green-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-warm-orange-200 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>

    <div class="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
      <div class="text-center mb-10 animate-float">
        <div class="w-24 h-24 bg-gradient-to-br from-fresh-green-400 to-fresh-green-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-fresh-green-200 mb-6">
          <span class="text-5xl">🍋</span>
        </div>
        <h1 class="text-4xl font-heading font-bold text-dark-text mb-2">
          智果大师
        </h1>
        <p class="text-gray-500">您的私人鲜果管家</p>
      </div>

      <div class="w-full glass-panel rounded-3xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2 pl-1">账号</label>
            <input
              v-model="username"
              type="text"
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-dark-text focus:ring-2 focus:ring-fresh-green-400 focus:border-transparent outline-none transition-all"
              placeholder="请输入用户名"
            />
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-600 mb-2 pl-1">密码</label>
            <input
              v-model="password"
              type="password"
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-dark-text focus:ring-2 focus:ring-fresh-green-400 focus:border-transparent outline-none transition-all"
              placeholder="请输入密码"
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{{ error }}</div>

          <button
            type="submit"
            class="w-full btn-primary text-lg shadow-fresh-green-500/40"
          >
            立即开启
          </button>
        </form>
      </div>

      <p class="mt-8 text-sm text-gray-400">
        登录即代表同意 <a href="#" class="text-fresh-green-600 font-medium">服务协议</a>
      </p>
    </div>
  </div>
</template>
