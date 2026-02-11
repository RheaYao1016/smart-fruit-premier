import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { localDb } from '@/services/localDb'
import { ASSETS } from '@/constants/assets'

function defaultDraft() {
  return {
    fruitCount: 1,
    fruits: [{ id: 1, pitting: false, peeling: false, cutting: true }],
    mode: '',
    bladeVideo: '',
    settings: {
      texture: '微渣口感',
      temperature: '常温',
      sweetnessType: '自定义',
      sweetnessValue: 35,
      cannedTemperature: '常温',
      cannedSweetness: 20
    }
  }
}

export const useProductionStore = defineStore('production', () => {
  const draft = ref(defaultDraft())
  const history = ref(localDb.get(STORAGE_KEYS.productionHistory, []))

  const modeLabel = computed(() => {
    if (draft.value.mode === 'juice') return '果汁'
    if (draft.value.mode === 'canned') return '罐头'
    if (draft.value.mode === 'cut') return '果切'
    return '-'
  })

  function persistHistory() {
    localDb.set(STORAGE_KEYS.productionHistory, history.value)
  }

  function resetDraft() {
    draft.value = defaultDraft()
  }

  function setFruitCount(count) {
    const safeCount = Math.min(6, Math.max(1, Number(count || 1)))
    draft.value.fruitCount = safeCount
    draft.value.fruits = Array.from({ length: safeCount }, (_, index) => ({
      id: index + 1,
      pitting: false,
      peeling: false,
      cutting: true
    }))
  }

  function updateFruit(index, payload) {
    if (!draft.value.fruits[index]) return
    draft.value.fruits[index] = {
      ...draft.value.fruits[index],
      ...payload,
      cutting: true
    }
  }

  function setMode(mode) {
    draft.value.mode = mode
    draft.value.bladeVideo = ASSETS.bladeVideos[mode] || ''
  }

  function updateSettings(payload) {
    draft.value.settings = {
      ...draft.value.settings,
      ...payload
    }
  }

  function addHistoryRecord(record) {
    history.value.unshift({
      id: `h_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
      ...record,
      createdAt: new Date().toISOString()
    })
    persistHistory()
  }

  function getHistoryByUser(userId) {
    return history.value.filter((item) => item.userId === userId)
  }

  return {
    draft,
    history,
    modeLabel,
    resetDraft,
    setFruitCount,
    updateFruit,
    setMode,
    updateSettings,
    addHistoryRecord,
    getHistoryByUser
  }
})
