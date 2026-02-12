<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Play, BookOpen, MessageCircle, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'home', label: '主页', path: '/', icon: Home },
  { name: 'production', label: '制作', path: '/production', icon: Play },
  { name: 'nutrition', label: '科普', path: '/nutrition', icon: BookOpen },
  { name: 'community', label: '社区', path: '/community', icon: MessageCircle },
  { name: 'my', label: '我的', path: '/my', icon: User }
]

const activeTab = computed(() => String(route.meta.tab || 'home'))

function go(path) {
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur">
    <div class="mx-auto grid w-full max-w-[430px] grid-cols-5 gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium"
        :class="activeTab === tab.name ? 'bg-amber-100 text-amber-600' : 'text-stone-500'"
        @click="go(tab.path)"
      >
        <component :is="tab.icon" class="h-5 w-5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>
