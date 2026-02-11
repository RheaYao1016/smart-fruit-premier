<script setup>
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { Check, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const store = useProductionStore()

const nextStep = () => {
  router.push({ name: 'production-scheme' })
}

const toggleSetting = (index, setting) => {
  const current = store.fruits[index].settings[setting]
  if (setting === 'cutting') return
  store.updateFruitSetting(index, setting, !current)
}
</script>

<template>
  <div class="h-full flex flex-col pt-4">
    <!-- Progress Indicator -->
    <div class="flex items-center gap-2 mb-8 justify-center">
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
        <div class="w-12 h-1 bg-fresh-green-500 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-fresh-green-500 text-white flex items-center justify-center font-bold text-sm">2</div>
        <div class="w-12 h-1 bg-gray-200 rounded-full"></div>
        <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
    </div>

    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-dark-text mb-2">步骤 2: 水果预处理</h2>
      <p class="text-gray-500 text-sm">请为每一个水果选择处理方式</p>
    </div>

    <div class="flex-1 overflow-y-auto pr-1 pb-24 space-y-4">
        <div 
          v-for="(fruit, index) in store.fruits" 
          :key="fruit.id"
          class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-fresh-green-100 text-fresh-green-700 flex items-center justify-center text-sm font-bold">
                {{ index + 1 }}
              </div>
              <span class="font-bold text-dark-text">水果 #{{ fruit.id }}</span>
            </div>
            <span class="text-xs text-gray-400">处理项</span>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <!-- Pitting -->
            <button 
              @click="toggleSetting(index, 'pitting')"
              class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2"
              :class="fruit.settings.pitting 
                ? 'bg-fresh-green-50 border-fresh-green-500 text-fresh-green-700' 
                : 'bg-gray-50 border-gray-200 text-gray-400'"
            >
              <span class="text-sm font-medium">去核</span>
              <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                :class="fruit.settings.pitting ? 'border-fresh-green-500 bg-fresh-green-500 text-white' : 'border-gray-300'"
              >
                <Check v-if="fruit.settings.pitting" class="w-3 h-3" />
              </div>
            </button>

            <!-- Peeling -->
            <button 
              @click="toggleSetting(index, 'peeling')"
              class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2"
              :class="fruit.settings.peeling 
                ? 'bg-fresh-green-50 border-fresh-green-500 text-fresh-green-700' 
                : 'bg-gray-50 border-gray-200 text-gray-400'"
            >
              <span class="text-sm font-medium">削皮</span>
              <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                :class="fruit.settings.peeling ? 'border-fresh-green-500 bg-fresh-green-500 text-white' : 'border-gray-300'"
              >
                <Check v-if="fruit.settings.peeling" class="w-3 h-3" />
              </div>
            </button>

            <!-- Cutting (Mandatory) -->
            <div class="flex flex-col items-center justify-center p-3 rounded-xl border bg-gray-50 border-gray-200 opacity-60">
              <span class="text-sm font-medium text-gray-500">切块</span>
              <div class="w-5 h-5 rounded-full border border-fresh-green-500 bg-fresh-green-500/20 text-fresh-green-600 flex items-center justify-center mt-2">
                <Check class="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Fixed Footer Action -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 md:rounded-b-3xl">
      <button
        @click="nextStep"
        class="w-full btn-primary text-lg flex items-center justify-center gap-2"
      >
        完成设置
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
