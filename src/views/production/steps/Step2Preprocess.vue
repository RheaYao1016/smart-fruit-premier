<script setup>
import { useProductionStore } from '@/stores/production'

const emit = defineEmits(['next', 'back'])
const store = useProductionStore()

function toggle(index, field) {
  const current = store.draft.fruits[index]
  if (!current || field === 'cutting') return
  store.updateFruit(index, { [field]: !current[field] })
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h2 class="text-lg font-semibold">步骤2：水果预处理</h2>
      <p class="mt-1 text-sm text-stone-500">去核/削皮可选；切块必选且不可取消。</p>
    </div>

    <div class="space-y-3">
      <div v-for="(fruit, index) in store.draft.fruits" :key="fruit.id" class="card p-4">
        <p class="mb-3 text-sm font-medium">水果 {{ fruit.id }}</p>

        <div class="grid grid-cols-3 gap-2 text-sm">
          <button
            class="rounded-xl border px-2 py-2"
            :class="fruit.pitting ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200'"
            @click="toggle(index, 'pitting')"
          >
            去核 {{ fruit.pitting ? '✓' : '' }}
          </button>
          <button
            class="rounded-xl border px-2 py-2"
            :class="fruit.peeling ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200'"
            @click="toggle(index, 'peeling')"
          >
            削皮 {{ fruit.peeling ? '✓' : '' }}
          </button>
          <div class="rounded-xl border border-emerald-300 bg-emerald-50 px-2 py-2 text-center text-emerald-700">
            切块 ✓
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button class="rounded-xl border border-stone-300 px-4 py-3" @click="emit('back')">上一步</button>
      <button class="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="emit('next')">继续：处理方案</button>
    </div>
  </div>
</template>
