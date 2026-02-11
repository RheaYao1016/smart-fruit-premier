<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useProductionStore } from '@/stores/production'

const emit = defineEmits(['next', 'back'])
const store = useProductionStore()

const progress = ref(0)
const completed = ref(false)
const doneFruits = ref([])
let timer = null

const totalMs = computed(() => Math.max(8000, store.draft.fruitCount * 3500))
const remainingSec = computed(() => Math.max(0, Math.round((totalMs.value * (1 - progress.value / 100)) / 1000)))

function start() {
  const tick = 200
  const step = 100 / (totalMs.value / tick)

  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + step)

    const currentDone = Math.floor((progress.value / 100) * store.draft.fruitCount)
    doneFruits.value = Array.from({ length: currentDone }, (_, i) => i + 1)

    if (progress.value >= 100) {
      completed.value = true
      window.clearInterval(timer)
      timer = null
    }
  }, tick)
}

onMounted(() => {
  start()
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h2 class="text-lg font-semibold">步骤4：制作与监控</h2>
      <p class="mt-1 text-sm text-stone-500">正在按设定参数处理水果。</p>
    </div>

    <div class="card p-4">
      <div class="mb-2 flex items-center justify-between text-sm">
        <span>当前进度</span>
        <span class="font-semibold text-amber-600">{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-3 overflow-hidden rounded-full bg-stone-100">
        <div class="h-full bg-amber-500 transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="mt-2 text-xs text-stone-500">预计剩余 {{ remainingSec }} 秒</p>
    </div>

    <div class="card p-4">
      <p class="mb-2 text-sm font-medium">水果完成状态</p>
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div
          v-for="fruit in store.draft.fruitCount"
          :key="fruit"
          class="rounded-xl border px-2 py-2 text-center"
          :class="doneFruits.includes(fruit) ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500'"
        >
          {{ doneFruits.includes(fruit) ? '已完成' : '处理中' }} #{{ fruit }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button class="rounded-xl border border-stone-300 px-4 py-3" @click="emit('back')">上一步</button>
      <button
        class="rounded-xl px-4 py-3 font-semibold text-white"
        :class="completed ? 'bg-amber-500' : 'bg-stone-300'"
        :disabled="!completed"
        @click="emit('next')"
      >
        {{ completed ? '继续：完成提示' : '制作中...' }}
      </button>
    </div>
  </div>
</template>
