<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, Play, BookOpen, MessageCircle, User } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Bottom Navigation items
const navItems = [
  { name: '主页', path: '/', icon: Home },
  { name: '制作', path: '/production', icon: Play },
  { name: '科普', path: '/nutrition', icon: BookOpen },
  { name: '社区', path: '/community', icon: MessageCircle },
]

const showBottomNav = computed(() => {
  return route.name !== 'login' && !route.path.includes('/production/')
})

</script>

<template>
  <div class="min-h-screen bg-cream text-dark-text font-body pb-20 md:pb-0">
    <!-- Desktop Header (Hidden on Mobile) -->
    <header v-if="route.name !== 'login'" class="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 flex items-center justify-center text-white font-bold">
          智
        </div>
        <span class="text-xl font-heading font-bold text-fresh-green-800">智果大师</span>
      </div>
      <nav class="flex items-center gap-6">
        <router-link to="/" class="hover:text-fresh-green-600 transition-colors">主页</router-link>
        <router-link to="/production" class="hover:text-fresh-green-600 transition-colors">开始制作</router-link>
        <router-link to="/nutrition" class="hover:text-fresh-green-600 transition-colors">营养科普</router-link>
        <router-link to="/community" class="hover:text-fresh-green-600 transition-colors">果汁社区</router-link>
      </nav>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">欢迎, 用户</span>
        <div class="w-8 h-8 rounded-full bg-gray-200"></div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav v-if="showBottomNav" class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-end z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex flex-col items-center gap-1 text-gray-400 transition-colors"
        active-class="text-fresh-green-600"
      >
        <component :is="item.icon" class="w-6 h-6" :class="{ 'fill-current': route.path === item.path }" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
