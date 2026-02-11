<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import { useAuthStore } from '@/stores/auth'
import ImageField from '@/components/ImageField.vue'

const emit = defineEmits(['restart'])
const router = useRouter()
const productionStore = useProductionStore()
const authStore = useAuthStore()

const saved = ref(false)
const snapshot = ref('')

const modeText = computed(() => {
  if (productionStore.draft.mode === 'juice') return '果汁'
  if (productionStore.draft.mode === 'canned') return '罐头'
  if (productionStore.draft.mode === 'cut') return '果切'
  return '-'
})

const params = computed(() => {
  if (productionStore.draft.mode === 'juice') {
    return {
      texture: productionStore.draft.settings.texture,
      temperature: productionStore.draft.settings.temperature,
      sweetnessType: productionStore.draft.settings.sweetnessType,
      sweetnessValue: productionStore.draft.settings.sweetnessValue
    }
  }

  if (productionStore.draft.mode === 'canned') {
    return {
      temperature: productionStore.draft.settings.cannedTemperature,
      sweetnessValue: productionStore.draft.settings.cannedSweetness
    }
  }

  return {
    bladeChecked: true
  }
})

function saveRecord() {
  if (!authStore.currentUser?.id) return
  productionStore.addHistoryRecord({
    userId: authStore.currentUser.id,
    mode: productionStore.draft.mode,
    fruitCount: productionStore.draft.fruitCount,
    preprocess: productionStore.draft.fruits,
    params: params.value,
    image: snapshot.value || ''
  })
  saved.value = true
}

function restart() {
  productionStore.resetDraft()
  snapshot.value = ''
  saved.value = false
  emit('restart')
}

function finish() {
  productionStore.resetDraft()
  router.push('/my')
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h2 class="text-lg font-semibold text-emerald-700">步骤5：制作完成</h2>
      <p class="mt-1 text-sm text-stone-500">本次模式：{{ modeText }}，水果数量：{{ productionStore.draft.fruitCount }}。</p>
    </div>

    <div class="card p-4">
      <p class="mb-2 text-sm font-medium">参数回顾</p>
      <pre class="whitespace-pre-wrap rounded-xl bg-stone-50 p-3 text-xs text-stone-600">{{ JSON.stringify(params, null, 2) }}</pre>
    </div>

    <ImageField v-model="snapshot" label="制作截图（可选）" aspect-hint="自由比例" />

    <div class="grid grid-cols-1 gap-2">
      <button class="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="saveRecord">保存到历史制作记录</button>
      <p v-if="saved" class="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-600">已保存，可在“我的 -> 历史制作记录”查看。</p>
      <button class="rounded-xl border border-stone-300 px-4 py-3" @click="restart">再做一单</button>
      <button class="rounded-xl border border-stone-300 px-4 py-3" @click="finish">完成并去我的</button>
    </div>
  </div>
</template>
