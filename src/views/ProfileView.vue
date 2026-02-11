<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Settings, LogOut, Heart, Clock, ChevronRight, User } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const userStats = ref([
  { label: '制作次数', value: 24, icon: Clock },
  { label: '获赞', value: 128, icon: Heart },
  { label: '收藏', value: 15, icon: User },
])

const menuItems = [
  { label: '我的发布', icon: User, path: '/profile/posts' },
  { label: '收藏配方', icon: Heart, path: '/profile/favorites' },
  { label: '制作记录', icon: Clock, path: '/profile/history' },
  { label: '系统设置', icon: Settings, path: '/settings' },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-cream pb-24 md:pb-8">
    <!-- Header Decor -->
    <div class="bg-fresh-green-500 h-48 rounded-b-[3rem] relative overflow-hidden">
       <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
       <div class="absolute -bottom-12 left-1/2 -translate-x-1/2">
         <div class="w-24 h-24 rounded-full border-4 border-cream bg-white p-1 shadow-xl">
           <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" class="w-full h-full rounded-full object-cover" />
         </div>
       </div>
    </div>

    <!-- User Info -->
    <div class="text-center mt-14 mb-8">
      <h1 class="text-2xl font-heading font-bold text-dark-text">用户名称</h1>
      <p class="text-gray-400 text-sm">鲜果生活家 | ID: 882910</p>
    </div>

    <!-- Stats -->
    <div class="flex justify-center gap-4 mb-8 px-6">
      <div v-for="(stat, index) in userStats" :key="index" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 text-center min-w-[100px]">
        <h3 class="font-bold text-xl text-dark-text">{{ stat.value }}</h3>
        <p class="text-xs text-gray-400 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Menu -->
    <div class="px-6 space-y-4">
      <div class="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        <button 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-fresh-green-50 text-fresh-green-600 flex items-center justify-center group-hover:bg-fresh-green-500 group-hover:text-white transition-colors">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <span class="font-medium text-dark-text">{{ item.label }}</span>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <button 
        @click="handleLogout"
        class="w-full py-4 bg-white text-red-500 font-bold rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut class="w-5 h-5" />
        退出登录
      </button>
    </div>

  </div>
</template>
