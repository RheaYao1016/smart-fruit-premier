<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { CheckCircle, Loader2, Home } from 'lucide-vue-next'

const router = useRouter()
const store = useProductionStore()

const progress = ref(0)
const currentFruitIndex = ref(0)
const isComplete = ref(false)

const productType = computed(() => {
  const map = { juice: '果汁', canned: '水果罐头', cut: '果切' }
  return map[store.selectedMode] || '制作'
})

onMounted(() => {
  simulateProduction()
})

const simulateProduction = async () => {
  const totalFruits = store.fruitCount
  const timePerFruit = 2000 
  
  for (let i = 0; i < totalFruits; i++) {
    currentFruitIndex.value = i + 1
    for (let p = 0; p <= 100; p += 10) {
      await new Promise(r => setTimeout(r, timePerFruit / 10))
      progress.value = ((i * 100) + p) / totalFruits
    }
  }
  isComplete.value = true
}

const finish = () => {
  store.resetProduction()
  router.push('/')
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto min-h-[500px]">
    
    <div v-if="!isComplete" class="w-full space-y-12">
      <div class="relative w-64 h-64 mx-auto">
         <!-- Circular Progress SVG -->
         <svg class="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
            <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="8" fill="transparent" class="text-fresh-green-500 transition-all duration-300 ease-linear"
                :stroke-dasharray="2 * Math.PI * 120"
                :stroke-dashoffset="2 * Math.PI * 120 * (1 - progress / 100)"
                stroke-linecap="round"
             />
         </svg>
         
         <div class="absolute inset-0 flex flex-col items-center justify-center">
             <span class="text-5xl font-heading font-bold text-dark-text mb-2">{{ Math.round(progress) }}%</span>
             <span class="text-gray-500 text-sm">正在处理第 {{ currentFruitIndex }}/{{ store.fruitCount }} 个</span>
         </div>
      </div>

      <div class="grid grid-cols-3 gap-2 w-full">
        <div class="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
             <div class="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse"></div>
             <span class="text-xs text-gray-500">温控正常</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
             <div class="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse"></div>
             <span class="text-xs text-gray-500">刀头运转</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
             <div class="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse"></div>
             <span class="text-xs text-gray-500">自动调节</span>
        </div>
      </div>
    </div>

    <div v-else class="w-full space-y-8 animate-in zoom-in duration-500">
      <div class="w-32 h-32 bg-fresh-green-100 text-fresh-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle class="w-16 h-16" />
      </div>
      
      <div>
        <h2 class="text-3xl font-heading font-bold text-dark-text mb-2">制作完成！</h2>
        <p class="text-gray-500">您的{{ productType }}已准备好，请享用。</p>
      </div>

      <button 
        @click="finish"
        class="w-full btn-secondary text-lg flex items-center justify-center gap-2"
      >
        <Home class="w-5 h-5" />
        返回主页
      </button>
    </div>
  </div>
</template>
