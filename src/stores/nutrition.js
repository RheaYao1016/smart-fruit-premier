import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { localDb } from '@/services/localDb'

function uid() {
  return `n_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`
}

export const useNutritionStore = defineStore('nutrition', () => {
  const items = ref(localDb.get(STORAGE_KEYS.nutritionContent, []))

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  function persist() {
    localDb.set(STORAGE_KEYS.nutritionContent, items.value)
  }

  function getById(id) {
    return items.value.find((item) => item.id === id) || null
  }

  function createItem(payload) {
    const next = {
      id: uid(),
      title: payload.title,
      summary: payload.summary,
      cover: payload.cover,
      recipe: payload.recipe,
      detail: payload.detail,
      createdAt: new Date().toISOString()
    }
    items.value.unshift(next)
    persist()
    return next
  }

  function updateItem(id, payload) {
    const idx = items.value.findIndex((item) => item.id === id)
    if (idx < 0) return null
    items.value[idx] = {
      ...items.value[idx],
      ...payload
    }
    persist()
    return items.value[idx]
  }

  function deleteItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
    persist()
  }

  return {
    items,
    sortedItems,
    getById,
    createItem,
    updateItem,
    deleteItem
  }
})
