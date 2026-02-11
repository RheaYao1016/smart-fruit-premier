<script setup>
import { computed, ref } from 'vue'
import { useProductionStore } from '@/stores/production'
import { ASSETS } from '@/constants/assets'

const emit = defineEmits(['next', 'back'])
const store = useProductionStore()

const stage = ref(store.draft.mode ? 'blade' : 'mode')
const tempMode = ref(store.draft.mode || 'juice')

const modeText = computed(() => {
  if (tempMode.value === 'juice') return '果汁'
  if (tempMode.value === 'canned') return '罐头'
  return '果切'
})

const temperatures = ['冷饮', '常温', '热饮']
const textures = ['细腻无渣', '微渣口感', '高纤维']

function pickMode(mode) {
  tempMode.value = mode
  stage.value = 'blade'
}

function confirmBlade() {
  store.setMode(tempMode.value)
  if (tempMode.value === 'cut') {
    emit('next')
    return
  }
  stage.value = 'settings'
}

function finishSettings() {
  emit('next')
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h2 class="text-lg font-semibold">步骤3：处理方案选择</h2>
      <p class="mt-1 text-sm text-stone-500">果汁 / 罐头 / 果切</p>
    </div>

    <section v-if="stage === 'mode'" class="grid grid-cols-1 gap-3">
      <button class="card p-4 text-left" @click="pickMode('juice')">
        <p class="text-base font-semibold">果汁</p>
        <p class="text-xs text-stone-500">支持滤网口感、温度、甜度配置</p>
      </button>
      <button class="card p-4 text-left" @click="pickMode('canned')">
        <p class="text-base font-semibold">罐头</p>
        <p class="text-xs text-stone-500">支持温度和甜度配置</p>
      </button>
      <button class="card p-4 text-left" @click="pickMode('cut')">
        <p class="text-base font-semibold">果切</p>
        <p class="text-xs text-stone-500">完成刀头检查后可直接制作</p>
      </button>
    </section>

    <section v-else-if="stage === 'blade'" class="card space-y-3 p-4">
      <p class="font-medium">刀头检查（{{ modeText }}）</p>
      <img :src="ASSETS.bladeImages[tempMode]" class="h-44 w-full rounded-xl object-cover" />
      <a :href="ASSETS.bladeVideos[tempMode]" target="_blank" class="text-sm text-amber-600 underline">查看刀头更换视频（占位链接）</a>
      <div class="grid grid-cols-2 gap-2">
        <button class="rounded-xl border border-stone-300 px-4 py-2" @click="stage='mode'">重新选方案</button>
        <button class="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white" @click="confirmBlade">已检查完成</button>
      </div>
    </section>

    <section v-else class="space-y-3">
      <div v-if="tempMode === 'juice'" class="card space-y-3 p-4">
        <p class="font-medium">果汁参数</p>

        <div>
          <p class="mb-2 text-xs text-stone-500">滤网口感</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="item in textures"
              :key="item"
              class="rounded-xl border px-2 py-2 text-xs"
              :class="store.draft.settings.texture === item ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200'"
              @click="store.updateSettings({ texture: item })"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs text-stone-500">温度</p>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            :value="temperatures.indexOf(store.draft.settings.temperature)"
            class="w-full accent-amber-500"
            @input="store.updateSettings({ temperature: temperatures[Number($event.target.value)] })"
          />
          <p class="mt-1 text-xs text-stone-600">当前：{{ store.draft.settings.temperature }}</p>
        </div>

        <div>
          <p class="mb-2 text-xs text-stone-500">甜度</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              class="rounded-xl border px-2 py-2 text-xs"
              :class="store.draft.settings.sweetnessType === '自定义' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200'"
              @click="store.updateSettings({ sweetnessType: '自定义' })"
            >自定义</button>
            <button
              class="rounded-xl border px-2 py-2 text-xs"
              :class="store.draft.settings.sweetnessType === '健康推荐' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200'"
              @click="store.updateSettings({ sweetnessType: '健康推荐', sweetnessValue: 20 })"
            >健康推荐</button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            class="mt-2 w-full accent-amber-500"
            :value="store.draft.settings.sweetnessValue"
            @input="store.updateSettings({ sweetnessValue: Number($event.target.value) })"
          />
          <p class="mt-1 text-xs text-stone-600">甜度：{{ store.draft.settings.sweetnessValue }}%</p>
          <p class="text-xs text-emerald-600">建议：低糖用户可控制在 0~30%。</p>
        </div>
      </div>

      <div v-else class="card space-y-3 p-4">
        <p class="font-medium">罐头参数</p>

        <div>
          <p class="mb-2 text-xs text-stone-500">温度</p>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            :value="temperatures.indexOf(store.draft.settings.cannedTemperature)"
            class="w-full accent-amber-500"
            @input="store.updateSettings({ cannedTemperature: temperatures[Number($event.target.value)] })"
          />
          <p class="mt-1 text-xs text-stone-600">当前：{{ store.draft.settings.cannedTemperature }}</p>
        </div>

        <div>
          <p class="mb-2 text-xs text-stone-500">甜度</p>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            :value="store.draft.settings.cannedSweetness"
            class="w-full accent-amber-500"
            @input="store.updateSettings({ cannedSweetness: Number($event.target.value) })"
          />
          <p class="mt-1 text-xs text-stone-600">当前：{{ store.draft.settings.cannedSweetness }}%</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button class="rounded-xl border border-stone-300 px-4 py-3" @click="stage='blade'">返回刀头检查</button>
        <button class="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="finishSettings">继续：制作监控</button>
      </div>
    </section>

    <button class="w-full rounded-xl border border-stone-300 px-4 py-2" @click="emit('back')">返回上一步</button>
  </div>
</template>
