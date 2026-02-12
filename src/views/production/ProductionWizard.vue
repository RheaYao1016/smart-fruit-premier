<script setup>
import { computed, ref } from 'vue'
import Step1Placement from '@/views/production/steps/Step1Placement.vue'
import Step2Preprocess from '@/views/production/steps/Step2Preprocess.vue'
import Step3Scheme from '@/views/production/steps/Step3Scheme.vue'
import Step4Monitor from '@/views/production/steps/Step4Monitor.vue'
import Step5Complete from '@/views/production/steps/Step5Complete.vue'

const currentStep = ref(1)

const components = {
  1: Step1Placement,
  2: Step2Preprocess,
  3: Step3Scheme,
  4: Step4Monitor,
  5: Step5Complete
}

const stepLabels = ['水果安放', '预处理', '方案选择', '制作监控', '完成']
const stepTips = [
  '请确保水果摆放稳定，避免加工时偏移。',
  '切块为必选，去核和削皮可按水果类型选择。',
  '先确认刀片状态，再设置温度/甜度等参数。',
  '监控进度和预计时间，过程可实时查看。',
  '完成后建议保存历史记录，便于复用方案。'
]

const currentComponent = computed(() => components[currentStep.value])
const currentTip = computed(() => stepTips[currentStep.value - 1] || '')
const progressPercent = computed(() => Math.round((currentStep.value / stepLabels.length) * 100))

function next() {
  if (currentStep.value < 5) currentStep.value += 1
}

function back() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function restart() {
  currentStep.value = 1
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-3">
      <div class="grid grid-cols-5 gap-1 text-center text-[11px]">
        <div v-for="(item, idx) in stepLabels" :key="item" class="rounded-xl px-1 py-2" :class="idx + 1 <= currentStep ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'">
          {{ idx + 1 }}.{{ item }}
        </div>
      </div>
    </div>

    <component :is="currentComponent" @next="next" @back="back" @restart="restart" />

    <section class="card overflow-hidden">
      <div class="wizard-tail-bg p-4">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-stone-800">制作助手</h3>
          <span class="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-stone-600">阶段 {{ currentStep }}/5</span>
        </div>

        <div class="h-2 overflow-hidden rounded-full bg-white/70">
          <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500" :style="{ width: `${progressPercent}%` }"></div>
        </div>

        <p class="mt-3 rounded-xl bg-white/75 px-3 py-2 text-xs leading-5 text-stone-600">
          {{ currentTip }}
        </p>

        <div class="mt-3 grid grid-cols-3 gap-2">
          <div class="rounded-xl bg-white/75 px-2 py-2 text-center">
            <p class="text-[10px] text-stone-500">刀片状态</p>
            <p class="mt-1 text-xs font-semibold text-emerald-600 pulse-text">正常</p>
          </div>
          <div class="rounded-xl bg-white/75 px-2 py-2 text-center">
            <p class="text-[10px] text-stone-500">温控</p>
            <p class="mt-1 text-xs font-semibold text-amber-600 pulse-text">稳定</p>
          </div>
          <div class="rounded-xl bg-white/75 px-2 py-2 text-center">
            <p class="text-[10px] text-stone-500">建议</p>
            <p class="mt-1 text-xs font-semibold text-cyan-600 pulse-text">低糖优先</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wizard-tail-bg {
  background:
    radial-gradient(180px 120px at 90% 10%, rgba(251, 191, 36, 0.28) 0%, transparent 65%),
    radial-gradient(160px 110px at 10% 80%, rgba(52, 211, 153, 0.22) 0%, transparent 70%),
    linear-gradient(135deg, #fffaf2 0%, #f0fdf4 100%);
}

.pulse-text {
  animation: pulseText 1.8s ease-in-out infinite;
}

@keyframes pulseText {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
</style>
