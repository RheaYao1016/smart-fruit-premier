<script setup>
import { useRouter } from 'vue-router'
import { Play, BookOpen, MessageCircle, ChevronRight, Star } from 'lucide-vue-next'

const router = useRouter()

const features = [
  { 
    id: 'production',
    name: '开始制作', 
    desc: '打造您的专属鲜果饮品',
    icon: Play, 
    color: 'bg-fresh-green-100 text-fresh-green-600',
    path: '/production'
  },
  { 
    id: 'nutrition',
    name: '营养科普', 
    desc: '探索每一口健康的奥秘',
    icon: BookOpen, 
    color: 'bg-warm-orange-100 text-warm-orange-600',
    path: '/nutrition'
  },
  { 
    id: 'community',
    name: '果汁社区', 
    desc: '分享您的独家配方',
    icon: MessageCircle, 
    color: 'bg-purple-100 text-purple-600',
    path: '/community'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Banner -->
    <div class="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-fresh-green-900/10 mx-4 md:mx-0 group">
      <img 
        src="https://placehold.co/1200x600?text=Fresh+Organic+Fruits" 
        alt="Banner" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
        <h2 class="text-3xl font-heading font-bold text-white mb-2">自然鲜果，健康生活</h2>
        <p class="text-gray-100/90 text-sm md:text-base max-w-md">
          精选当季鲜果，智能设备一键制作，还原自然本味。
        </p>
        <button class="mt-4 w-fit px-6 py-2 bg-white text-fresh-green-700 font-bold rounded-full text-sm hover:bg-fresh-green-50 transition-colors">
          立即体验
        </button>
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="px-4 md:px-0">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-dark-text">核心功能</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="feature in features"
          :key="feature.id"
          @click="navigateTo(feature.path)"
          class="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 text-left group"
        >
          <div :class="`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`">
            <component :is="feature.icon" class="w-6 h-6 fill-current" />
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-dark-text">{{ feature.name }}</h4>
            <p class="text-xs text-gray-500">{{ feature.desc }}</p>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>

    <!-- Recommendations (Mock) -->
    <div class="px-4 md:px-0 pb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-dark-text">今日推荐</h3>
        <span class="text-sm text-fresh-green-600 font-medium">查看全部</span>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div v-for="i in 3" :key="i" class="min-w-[200px] bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          <div class="h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
            <img :src="`https://placehold.co/400x300?text=Fruit+${i}`" class="w-full h-full object-cover" />
            <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-orange-500 flex items-center gap-1">
              <Star class="w-3 h-3 fill-current" /> 4.9
            </div>
          </div>
          <h4 class="font-bold text-sm">元气鲜橙汁组合</h4>
          <p class="text-xs text-gray-400 mt-1">含丰富维生素C，活力满满</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-fresh-green-600 font-bold text-sm">¥ 0.00</span>
            <button class="w-6 h-6 rounded-full bg-fresh-green-50 text-fresh-green-600 flex items-center justify-center">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
