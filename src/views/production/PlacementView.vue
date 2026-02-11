<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { Citrus, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const store = useProductionStore()

const inputCount = ref(1)
const isPlaced = ref(false)
const error = ref('')

const validateCount = () => {
  if (inputCount.value < 1) inputCount.value = 1
  if (inputCount.value > 6) {
      inputCount.value = 6
      error.value = '一次最多只能处理6个水果哦'
  } else {
      error.value = ''
  }
}

const handlePlacementComplete = () => {
  isPlaced.value = true
}

const handleNext = () => {
  if (!isPlaced.value) return
  if (inputCount.value >= 1 && inputCount.value <= 6) {
    store.setFruitCount(inputCount.value)
    router.push('/production/preprocess')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Progress Header -->
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">步骤 1/3: 水果安放</h2>
      <div class="flex gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <div class="w-3 h-3 rounded-full bg-gray-700"></div>
        <div class="w-3 h-3 rounded-full bg-gray-700"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Visualization Area -->
      <div class="bg-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 min-h-[400px]">
        <div class="relative">
          <Citrus class="w-48 h-48 text-green-500/20 animate-pulse" />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-gray-500 font-medium">请在此区域安放水果</span>
          </div>
        </div>
        
        <div v-if="isPlaced" class="mt-8 flex items-center gap-2 text-green-400 bg-green-900/20 px-4 py-2 rounded-full">
          <CheckCircle2 class="w-5 h-5" />
          <span>检测到水果已安放</span>
        </div>
      </div>

      <!-- Controls Area -->
      <div class="flex flex-col justify-center space-y-8">
        <div class="space-y-4">
          <p class="text-gray-300 text-lg">1. 请将洗净的水果放入左侧所示区域</p>
          <button 
            @click="handlePlacementComplete"
            class="w-full py-4 rounded-xl font-bold transition-all"
            :class="isPlaced ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
          >
            {{ isPlaced ? '完成水果安放' : '点击确认安放完成' }}
          </button>
        </div>

        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
          <div v-if="isPlaced" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-gray-300 text-lg">2. 请输入水果个数 (1-6个)</label>
              <div class="flex items-center gap-4">
                <button @click="inputCount--; validateCount()" class="w-12 h-12 rounded-lg bg-gray-700 text-white text-xl hover:bg-gray-600">-</button>
                <input 
                  type="number" 
                  v-model="inputCount"
                  @input="validateCount"
                  class="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-center text-2xl text-white focus:ring-2 focus:ring-green-500 outline-none"
                  min="1" max="6"
                />
                <button @click="inputCount++; validateCount()" class="w-12 h-12 rounded-lg bg-gray-700 text-white text-xl hover:bg-gray-600">+</button>
              </div>
              <p v-if="error" class="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle class="w-4 h-4" /> {{ error }}
              </p>
            </div>

            <button 
              @click="handleNext"
              class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-900/50 transform hover:scale-[1.02] transition-all"
            >
              下一步：预处理设置
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
