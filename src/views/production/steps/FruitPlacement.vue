<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { Plus, Minus, ArrowRight, Check } from 'lucide-vue-next'

const router = useRouter()
const store = useProductionStore()

const fruitCount = ref(store.fruitCount)
const isPlaced = ref(false)

const handlePlacementComplete = () => {
  isPlaced.value = true
}

const increment = () => {
  if (fruitCount.value < 6) fruitCount.value++
}

const decrement = () => {
  if (fruitCount.value > 1) fruitCount.value--
}

const nextStep = () => {
  store.setFruitCount(fruitCount.value)
  router.push({ name: 'production-preprocessing' })
}
</script>

<template>
  <div class="flex flex-col items-center h-full max-w-2xl mx-auto text-center pt-4">
    <!-- Progress Indicator -->
    <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">1</div>
        <div class="w-12 h-1 bg-gray-200 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
        <div class="w-12 h-1 bg-gray-200 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
    </div>

    <h2 class="text-2xl font-bold text-dark-text mb-2">步骤 1: 安放水果</h2>
    <p class="text-gray-500 mb-8 max-w-xs mx-auto">请按照示意图将水果放置在工作区，最大支持6个。</p>

    <!-- Placement Area Visualization -->
    <div class="relative w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-8 overflow-hidden group hover:border-fresh-green-400 transition-colors">
      <div v-if="!isPlaced" class="text-center p-8">
        <div class="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-fresh-green-500 transition-colors">
          <Plus class="w-8 h-8" />
        </div>
        <p class="text-gray-400 text-sm">点击下方按钮确认安放</p>
      </div>
      <div v-else class="text-fresh-green-600 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div class="w-16 h-16 bg-fresh-green-100 rounded-full flex items-center justify-center mb-3">
          <Check class="w-8 h-8" />
        </div>
        <p class="text-lg font-bold">水果已安放</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="w-full space-y-6 mt-auto md:mt-0 pb-8">
      <button
        v-if="!isPlaced"
        @click="handlePlacementComplete"
        class="w-full btn-primary text-lg"
      >
        我已完成安放
      </button>

      <div v-else class="space-y-8 animate-in slide-in-from-bottom duration-500">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label class="block text-sm font-bold text-gray-700 mb-4">确认水果数量</label>
          <div class="flex items-center justify-center gap-6">
            <button 
              @click="decrement"
              :disabled="fruitCount <= 1"
              class="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-dark-text"
            >
              <Minus class="w-5 h-5" />
            </button>
            
            <span class="text-3xl font-heading font-bold text-dark-text w-12">{{ fruitCount }}</span>

            <button 
              @click="increment"
              :disabled="fruitCount >= 6"
              class="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-dark-text"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          @click="nextStep"
          class="w-full btn-primary text-lg flex items-center justify-center gap-2"
        >
          下一步
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
