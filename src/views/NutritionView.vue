<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, X } from 'lucide-vue-next'

const router = useRouter()

const juices = [
  { id: 1, name: '凝香甜梨汁', image: '/images/pear.jpg', color: 'bg-yellow-100 text-yellow-800', recipe: { fruit: 2, water: 200, sugar: 15, temp: 25 } },
  { id: 2, name: '原香苹果汁', image: '/images/apple.jpg', color: 'bg-red-100 text-red-800', recipe: { fruit: 3, water: 150, sugar: 10, temp: 20 } },
  { id: 3, name: '热带水果汁', image: '/images/tropical.jpg', color: 'bg-orange-100 text-orange-800', recipe: { fruit: 4, water: 250, sugar: 20, temp: 10 } },
  { id: 4, name: '健胃山楂汁', image: '/images/hawthorn.jpg', color: 'bg-red-200 text-red-900', recipe: { fruit: 10, water: 300, sugar: 30, temp: 40 } },
  { id: 5, name: '清爽黄瓜汁', image: '/images/cucumber.jpg', color: 'bg-green-100 text-green-800', recipe: { fruit: 2, water: 200, sugar: 5, temp: 15 } },
  { id: 6, name: '清润甘蔗汁', image: '/images/sugarcane.jpg', color: 'bg-emerald-100 text-emerald-800', recipe: { fruit: 1, water: 0, sugar: 0, temp: 25 } },
]

const selectedJuice = ref(null)

const openUnsplash = (term) => `https://source.unsplash.com/400x300/?${term},juice`

</script>

<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <header class="flex items-center gap-4 mb-8">
      <button @click="router.push('/')" class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-3xl font-bold text-white">营养科普 & 健康配比</h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="juice in juices" 
        :key="juice.id"
        @click="selectedJuice = juice"
        class="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
      >
        <div class="h-48 overflow-hidden bg-gray-200 relative">
          <!-- Placeholder images since we don't have real files -->
          <div class="absolute inset-0 flex items-center justify-center text-4xl">
             🍹
          </div>
          <div :class="`absolute inset-0 opacity-20 ${juice.color.split(' ')[0]}`"></div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ juice.name }}</h3>
          <p class="text-gray-500 text-sm">点击查看健康配比详情</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedJuice" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="selectedJuice = null">
      <div class="bg-white text-gray-900 rounded-3xl max-w-md w-full p-8 relative animate-in zoom-in duration-300">
        <button @click="selectedJuice = null" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
          <X class="w-6 h-6" />
        </button>

        <h2 class="text-3xl font-bold mb-6 text-center">{{ selectedJuice.name }}</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span class="text-gray-500">水果数量</span>
            <span class="font-bold text-xl">{{ selectedJuice.recipe.fruit }} <span class="text-sm font-normal">个</span></span>
          </div>
           <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span class="text-gray-500">注水量</span>
            <span class="font-bold text-xl">{{ selectedJuice.recipe.water }} <span class="text-sm font-normal">ml</span></span>
          </div>
           <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span class="text-gray-500">糖分</span>
            <span class="font-bold text-xl">{{ selectedJuice.recipe.sugar }} <span class="text-sm font-normal">g</span></span>
          </div>
           <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span class="text-gray-500">饮用温度</span>
            <span class="font-bold text-xl">{{ selectedJuice.recipe.temp }} <span class="text-sm font-normal">°C</span></span>
          </div>
        </div>

        <button @click="selectedJuice = null" class="w-full mt-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold">
          了解了
        </button>
      </div>
    </div>
  </div>
</template>
