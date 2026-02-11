<script setup>
import { ref, watch } from 'vue'
import { useProductionStore } from '@/stores/production'
import { ASSETS } from '@/constants/assets'

const emit = defineEmits(['next'])
const store = useProductionStore()

const count = ref(store.draft.fruitCount)

watch(count, (value) => {
  const safe = Math.max(1, Math.min(6, Number(value || 1)))
  if (safe !== value) count.value = safe
})

function minus() {
  count.value = Math.max(1, count.value - 1)
}

function plus() {
  count.value = Math.min(6, count.value + 1)
}

function nextStep() {
  store.setFruitCount(count.value)
  emit('next')
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h2 class="text-lg font-semibold">步骤1：水果安放</h2>
      <p class="mt-1 text-sm text-stone-500">请先放置水果，再确认数量（1-6个）。</p>

      <div class="mt-4 flex items-center justify-center gap-4">
        <button class="h-10 w-10 rounded-full bg-stone-100 text-xl" @click="minus">-</button>
        <div class="rounded-2xl bg-amber-50 px-5 py-2 text-2xl font-bold text-amber-600">{{ count }}</div>
        <button class="h-10 w-10 rounded-full bg-stone-100 text-xl" @click="plus">+</button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="index in 6"
        :key="index"
        class="overflow-hidden rounded-xl border"
        :class="index <= count ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-stone-100 opacity-50'"
      >
        <img :src="ASSETS.fruits[(index - 1) % ASSETS.fruits.length]" class="h-20 w-full object-cover" />
      </div>
    </div>

    <button class="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="nextStep">继续：水果预处理</button>
  </div>
</template>
