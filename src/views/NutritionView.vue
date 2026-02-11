<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, X, Thermometer, Droplets } from 'lucide-vue-next'

const router = useRouter()

const juices = [
  { id: 1, name: '凝香甜梨汁', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80', color: 'bg-yellow-50 text-yellow-800', recipe: { fruit: 2, water: 200, sugar: 15, temp: 25 } },
  { id: 2, name: '原香苹果汁', image: 'https://images.unsplash.com/photo-1619898865709-ae4948037388?w=600&q=80', color: 'bg-red-50 text-red-800', recipe: { fruit: 3, water: 150, sugar: 10, temp: 20 } },
  { id: 3, name: '热带水果汁', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80', color: 'bg-orange-50 text-orange-800', recipe: { fruit: 4, water: 250, sugar: 20, temp: 10 } },
  { id: 4, name: '健胃山楂汁', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80', color: 'bg-red-100 text-red-900', recipe: { fruit: 10, water: 300, sugar: 30, temp: 40 } },
  { id: 5, name: '清爽黄瓜汁', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80', color: 'bg-green-50 text-green-800', recipe: { fruit: 2, water: 200, sugar: 5, temp: 15 } },
  { id: 6, name: '清润甘蔗汁', image: 'https://images.unsplash.com/photo-1600271801401-65396554869c?w=600&q=80', color: 'bg-emerald-50 text-emerald-800', recipe: { fruit: 1, water: 0, sugar: 0, temp: 25 } },
]

const selectedJuice = ref(null)
</script>

<template>
  <div class="min-h-screen bg-cream pb-24 md:pb-8">
     <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-gray-100 mb-6">
      <button @click="router.push('/')" class="p-2 rounded-full hover:bg-gray-100 text-dark-text transition-colors md:hidden">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-2xl font-bold font-heading text-fresh-green-800">营养科普</h1>
    </header>

    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="juice in juices" 
        :key="juice.id"
        @click="selectedJuice = juice"
        class="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-fresh-green-200 transition-all hover:-translate-y-1"
      >
        <div class="h-56 overflow-hidden bg-gray-100 relative">
          <img :src="juice.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
             <span class="text-white font-bold flex items-center gap-2">
               查看详情 <ArrowLeft class="w-4 h-4 rotate-180" />
             </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-dark-text mb-2">{{ juice.name }}</h3>
          <div class="flex gap-2">
            <span class="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-500">低卡路里</span>
            <span class="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-500">富含维C</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedJuice" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="selectedJuice = null">
      <div class="bg-white rounded-[2rem] max-w-sm w-full overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
        
        <!-- Modal Image Header -->
        <div class="h-64 relative">
           <img :src="selectedJuice.image" class="w-full h-full object-cover" />
           <button @click="selectedJuice = null" class="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
            <X class="w-6 h-6" />
          </button>
           <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
             <h2 class="text-3xl font-bold text-white">{{ selectedJuice.name }}</h2>
           </div>
        </div>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-fresh-green-50 rounded-2xl flex flex-col items-center justify-center text-center">
               <span class="text-sm text-fresh-green-600 mb-1 font-bold">水果用量</span>
               <span class="text-2xl font-heading font-bold text-dark-text">{{ selectedJuice.recipe.fruit }} <span class="text-xs text-gray-400">个</span></span>
            </div>
            <div class="p-4 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-center">
               <span class="text-sm text-blue-600 mb-1 font-bold">注水量</span>
               <span class="text-2xl font-heading font-bold text-dark-text">{{ selectedJuice.recipe.water }} <span class="text-xs text-gray-400">ml</span></span>
            </div>
          </div>

          <div class="space-y-4">
             <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
               <div class="flex items-center gap-3 text-gray-500">
                 <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                   <Droplets class="w-4 h-4" />
                 </div>
                 糖分含量
               </div>
               <span class="font-bold text-dark-text">{{ selectedJuice.recipe.sugar }}g</span>
             </div>

             <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
               <div class="flex items-center gap-3 text-gray-500">
                 <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                   <Thermometer class="w-4 h-4" />
                 </div>
                 最佳饮用温度
               </div>
               <span class="font-bold text-dark-text">{{ selectedJuice.recipe.temp }}°C</span>
             </div>
          </div>

          <button @click="selectedJuice = null" class="w-full py-4 btn-primary text-lg shadow-xl shadow-fresh-green-500/20">
            开始制作同款
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
