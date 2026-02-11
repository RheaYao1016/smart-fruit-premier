<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const account = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const redirect = computed(() => String(route.query.redirect || '/'))

const demos = [
  { role: 'admin', account: 'admin', password: 'admin123' },
  { role: 'maintainer', account: 'maintainer', password: 'maintain123' },
  { role: 'user', account: 'user', password: 'user123' }
]

async function submit() {
  error.value = ''
  loading.value = true
  const result = authStore.login(account.value, password.value)
  loading.value = false

  if (!result.success) {
    error.value = result.message
    return
  }

  router.replace(redirect.value)
}

function fillDemo(item) {
  account.value = item.account
  password.value = item.password
}
</script>

<template>
  <div class="min-h-screen bg-app-bg px-4 py-8">
    <div class="mx-auto max-w-md rounded-3xl border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100/40">
      <h1 class="text-center text-2xl font-bold text-stone-800">智果大师</h1>
      <p class="mt-1 text-center text-sm text-stone-500">登录后可使用制作向导、社区和个人中心</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <input
          v-model="account"
          type="text"
          placeholder="账号"
          class="w-full rounded-xl border border-stone-200 px-4 py-3"
        />
        <input
          v-model="password"
          type="password"
          placeholder="密码"
          class="w-full rounded-xl border border-stone-200 px-4 py-3"
        />

        <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500">{{ error }}</p>

        <button
          type="submit"
          class="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-4 flex items-center justify-between text-sm">
        <button class="text-stone-500" @click="router.push('/forgot-password')">找回密码</button>
        <button class="font-medium text-amber-600" @click="router.push('/register')">去注册</button>
      </div>

      <div class="mt-6 rounded-2xl bg-stone-50 p-3">
        <p class="text-xs text-stone-500">演示账号</p>
        <div class="mt-2 grid grid-cols-1 gap-2">
          <button
            v-for="item in demos"
            :key="item.role"
            class="rounded-xl border border-stone-200 bg-white px-3 py-2 text-left text-xs"
            @click="fillDemo(item)"
          >
            {{ item.role }}: {{ item.account }} / {{ item.password }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
