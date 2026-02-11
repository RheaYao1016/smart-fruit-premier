<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Home, BookOpen, MessageCircle, LogOut } from 'lucide-vue-next'
import { computed } from 'vue'

const route = useRoute()

const navigation = [
  { name: '主界面', path: '/', icon: Home },
  { name: '营养科普', path: '/nutrition', icon: BookOpen },
  { name: '果汁社区', path: '/community', icon: MessageCircle },
]

const isActive = (path) => route.path === path
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
      <div class="p-6 flex items-center justify-center border-b border-gray-700">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          智果优享
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
          :class="[
            isActive(item.path) 
              ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
          <LogOut class="w-5 h-5" />
          <span class="font-medium">退出登录</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-gray-900 relative">
      <div class="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 pointer-events-none"></div>
      <RouterView v-slot="{ Component }">
        <transition
          enter-active-class="transition ease-out duration-300 transform"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-200 transform"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>
