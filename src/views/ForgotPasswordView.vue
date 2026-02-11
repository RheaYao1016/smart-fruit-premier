<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const account = ref('')
const password = ref('')
const confirm = ref('')
const message = ref('')
const error = ref('')

function submit() {
  message.value = ''
  error.value = ''

  if (!account.value || !password.value || !confirm.value) {
    error.value = '请填写完整信息'
    return
  }

  if (password.value !== confirm.value) {
    error.value = '两次密码不一致'
    return
  }

  const result = authStore.resetPassword(account.value, password.value)
  if (!result.success) {
    error.value = result.message
    return
  }

  message.value = '密码已重置，请使用新密码登录。'
}
</script>

<template>
  <div class="min-h-screen bg-app-bg px-4 py-8">
    <div class="mx-auto max-w-md rounded-3xl border border-amber-100 bg-white p-6 shadow-xl">
      <h1 class="text-xl font-bold text-stone-800">找回密码（模拟）</h1>
      <p class="mt-1 text-xs text-stone-500">纯前端演示：直接重置账号密码。</p>

      <div class="mt-5 space-y-3">
        <input v-model="account" type="text" placeholder="账号" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
        <input v-model="password" type="password" placeholder="新密码" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
        <input v-model="confirm" type="password" placeholder="确认新密码" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />

        <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500">{{ error }}</p>
        <p v-if="message" class="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-600">{{ message }}</p>

        <button class="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="submit">重置密码</button>
      </div>

      <button class="mt-4 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm" @click="router.push('/login')">
        返回登录
      </button>
    </div>
  </div>
</template>
