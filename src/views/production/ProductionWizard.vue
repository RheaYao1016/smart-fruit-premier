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

const currentComponent = computed(() => components[currentStep.value])

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
  </div>
</template>
