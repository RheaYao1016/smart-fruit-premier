<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { ArrowLeft, Play, Thermometer, Droplets, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const store = useProductionStore()

const currentStage = ref('selection') // selection, blade-check, settings
const tempMode = ref('') 

const modes = [
  { id: 'juice', name: '果汁', desc: '鲜榨纯果汁', icon: '🥤', color: 'bg-orange-100 text-orange-600' },
  { id: 'canned', name: '罐头', desc: '甜蜜水果罐头', icon: '🥫', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'cut', name: '果切', desc: '现切鲜果拼盘', icon: '🍎', color: 'bg-fresh-green-100 text-fresh-green-600' }
]

const selectMode = (modeId) => {
  tempMode.value = modeId
  currentStage.value = 'blade-check'
}

const confirmBlade = () => {
  store.setMode(tempMode.value)
  if (tempMode.value === 'cut') {
    router.push({ name: 'production-process' })
  } else {
    currentStage.value = 'settings'
  }
}

const startProduction = () => {
  router.push({ name: 'production-process' })
}

const temperatures = [
  { id: 'cold', label: '冷饮', value: 10 },
  { id: 'room', label: '常温', value: 25 },
  { id: 'hot', label: '热饮', value: 45 }
]

const filters = [
  { id: 'no-residue', label: '细腻无渣' },
  { id: 'medium', label: '微渣口感' },
  { id: 'high-fiber', label: '高纤维' }
]
</script>

<template>
  <div class="h-full flex flex-col pt-4">
     <!-- Progress Indicator -->
    <div class="flex items-center gap-2 mb-8 justify-center">
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
        <div class="w-12 h-1 bg-fresh-green-500 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
        <div class="w-12 h-1 bg-fresh-green-500 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">3</div>
    </div>

    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-dark-text">步骤 3: 选择方案</h2>
      <button v-if="currentStage !== 'selection'" @click="currentStage = 'selection'" class="text-sm text-fresh-green-600 font-bold flex items-center gap-1">
        <ArrowLeft class="w-4 h-4" />重新选择
      </button>
    </div>

    <!-- Stage 1: Mode Selection -->
    <div v-if="currentStage === 'selection'" class="flex-1 space-y-4">
      <button
        v-for="mode in modes"
        :key="mode.id"
        @click="selectMode(mode.id)"
        class="w-full group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-fresh-green-500 hover:shadow-md transition-all flex items-center gap-6 text-left"
      >
        <div :class="`w-16 h-16 rounded-2xl ${mode.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`">
          {{ mode.icon }}
        </div>
        <div>
          <span class="text-lg font-bold text-dark-text block">{{ mode.name }}</span>
          <span class="text-sm text-gray-500">{{ mode.desc }}</span>
        </div>
        <div class="ml-auto text-gray-300 group-hover:text-fresh-green-500">
           <ArrowRight class="w-6 h-6" />
        </div>
      </button>
    </div>

    <!-- Stage 2: Blade Check -->
    <div v-else-if="currentStage === 'blade-check'" class="flex-1 flex flex-col items-center">
      <div class="w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
        <h3 class="text-xl font-bold text-red-500 mb-4 flex items-center justify-center gap-2">
          ⚠️ 请检查刀头
        </h3>
        
        <div class="aspect-video bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-200 relative overflow-hidden group">
          <img src="https://placehold.co/600x400?text=Blade+Image" class="opacity-80" alt="Blade Image" />
          <div class="absolute inset-0 flex items-center justify-center">
             <span class="text-gray-600 font-bold bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
               {{ tempMode === 'juice' ? '榨汁刀' : (tempMode === 'canned' ? '搅拌刀' : '切块刀') }}
             </span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 text-fresh-green-600 mb-6 cursor-pointer font-bold">
          <Play class="w-4 h-4 fill-current" />
          <span class="text-sm">查看更换视频教程</span>
        </div>

        <button @click="confirmBlade" class="w-full btn-primary text-lg">
          我已确认
        </button>
      </div>
    </div>

    <!-- Stage 3: Detailed Settings -->
    <div v-else-if="currentStage === 'settings'" class="flex-1 pb-24 space-y-6 overflow-y-auto">
        <!-- Filter Settings (Juice Only) -->
        <div v-if="tempMode === 'juice'" class="space-y-3">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">口感</h3>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="f in filters" 
              :key="f.id"
              @click="store.processingSettings.filter = f.id"
              class="p-3 rounded-xl border transition-all text-center text-sm font-medium"
              :class="store.processingSettings.filter === f.id ? 'bg-fresh-green-500 text-white border-fresh-green-500 shadow-lg shadow-fresh-green-500/30' : 'bg-white text-gray-600 border-gray-200'"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Temperature Settings -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">温度</h3>
          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="1"
              :value="temperatures.findIndex(t => t.id === store.processingSettings.temperature)"
              @input="e => store.processingSettings.temperature = temperatures[e.target.value].id"
              class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-fresh-green-500 mb-4"
            />
            <div class="flex justify-between text-xs font-bold text-gray-400">
              <span v-for="t in temperatures" :key="t.id" 
                class="transition-colors"
                :class="store.processingSettings.temperature === t.id ? 'text-fresh-green-600' : ''"
              >
                {{ t.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sweetness Settings -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">甜度</h3>
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button 
              @click="store.processingSettings.sweetness = 'custom'" 
              class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
              :class="store.processingSettings.sweetness === 'custom' ? 'bg-white text-fresh-green-600 shadow-sm' : 'text-gray-500'"
            >
              自定义
            </button>
             <button 
              @click="store.processingSettings.sweetness = 'health'" 
              class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
              :class="store.processingSettings.sweetness === 'health' ? 'bg-white text-fresh-green-600 shadow-sm' : 'text-gray-500'"
            >
              健康推荐
            </button>
          </div>
          <div v-if="store.processingSettings.sweetness === 'custom'" class="bg-white p-4 rounded-xl border border-gray-200 mt-2">
             <input type="range" v-model="store.processingSettings.sweetnessLevel" class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-fresh-green-500" />
             <div class="text-right text-fresh-green-600 text-sm font-bold mt-2">{{ store.processingSettings.sweetnessLevel }}%</div>
          </div>
        </div>

        <!-- Fixed Footer Action -->
        <div class="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 md:absolute md:rounded-b-3xl z-10">
            <button @click="startProduction" class="w-full btn-primary text-lg shadow-fresh-green-500/40">
                开始制作
            </button>
        </div>
    </div>
  </div>
</template>
