import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductionStore = defineStore('production', () => {
    // State
    const fruitCount = ref(1)
    const fruits = ref([]) // Array of objects: { id: 1, settings: { pitting: false, peeling: false, cutting: true } }
    const selectedMode = ref(null) // 'juice', 'canned', 'cut'
    const processingSettings = ref({
        temperature: 'room', // cold, room, hot
        sweetness: 'custom', // custom, health
        sweetnessLevel: 50, // 0-100
        filter: 'medium' // no-residue, medium, high-fiber
    })

    // Actions
    function setFruitCount(count) {
        fruitCount.value = count
        // Initialize fruits array based on count
        fruits.value = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            settings: {
                pitting: false,
                peeling: false,
                cutting: true // Always true by default/requirement
            }
        }))
    }

    function updateFruitSetting(index, setting, value) {
        if (fruits.value[index]) {
            fruits.value[index].settings[setting] = value
        }
    }

    function setMode(mode) {
        selectedMode.value = mode
    }

    function resetProduction() {
        fruitCount.value = 1
        fruits.value = []
        selectedMode.value = null
        processingSettings.value = {
            temperature: 'room',
            sweetness: 'custom',
            sweetnessLevel: 50,
        }
    }

    return {
        fruitCount,
        fruits,
        selectedMode,
        processingSettings,
        setFruitCount,
        updateFruitSetting,
        setMode,
        resetProduction
    }
})
