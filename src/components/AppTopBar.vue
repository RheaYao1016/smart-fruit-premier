<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, MoreVertical, Shield, Wrench, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const open = ref(false)

const rootTabs = ['home', 'production', 'nutrition', 'community', 'my']

const title = computed(() => route.meta.title || '智果大师')
const canBack = computed(() => !rootTabs.includes(String(route.name || '')))

watch(() => route.fullPath, () => {
  open.value = false
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}

function go(path) {
  open.value = false
  router.push(path)
}

function logout() {
  open.value = false
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/50 bg-white/90 backdrop-blur px-4 py-3">
    <div class="mx-auto flex w-full max-w-[430px] items-center justify-between">
      <button
        v-if="canBack"
        @click="goBack"
        class="h-10 w-10 rounded-full bg-stone-100 text-stone-700 active:scale-95"
      >
        <ArrowLeft class="mx-auto h-5 w-5" />
      </button>
      <div v-else class="h-10 w-10"></div>

      <div class="text-base font-semibold text-stone-800">{{ title }}</div>

      <div class="relative">
        <button
          class="h-10 w-10 rounded-full bg-stone-100 text-stone-700 active:scale-95"
          @click="open = !open"
        >
          <MoreVertical class="mx-auto h-5 w-5" />
        </button>

        <div
          v-if="open"
          class="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl"
        >
          <button
            v-if="authStore.role === 'admin'"
            class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-stone-700 hover:bg-stone-50"
            @click="go('/community-manage')"
          >
            <Shield class="h-4 w-4" /> 社区管理
          </button>
          <button
            v-if="['admin', 'maintainer'].includes(authStore.role)"
            class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-stone-700 hover:bg-stone-50"
            @click="go('/maintainer')"
          >
            <Wrench class="h-4 w-4" /> 设备状态
          </button>
          <button
            class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
            @click="logout"
          >
            <LogOut class="h-4 w-4" /> 退出登录
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
