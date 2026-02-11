<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatTime } from '@/utils/datetime'

const authStore = useAuthStore()

const deviceStatus = ref({
  machine: 'SFM-X5',
  online: true,
  temperature: 38,
  bladeHealth: 93,
  runtimeHours: 286,
  updatedAt: new Date().toISOString()
})

const logs = ref([
  { id: 'log_1', level: 'info', message: '设备启动完成', time: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: 'log_2', level: 'warn', message: '刀头震动超过阈值，建议检查', time: new Date(Date.now() - 1000 * 60 * 16).toISOString() },
  { id: 'log_3', level: 'info', message: '完成自检，状态正常', time: new Date(Date.now() - 1000 * 60 * 40).toISOString() }
])

const roleText = computed(() => authStore.currentUser?.role || '-')
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <h2 class="text-lg font-semibold">维护面板</h2>
      <p class="mt-1 text-xs text-stone-500">当前角色：{{ roleText }}（模拟设备数据）</p>
    </section>

    <section class="grid grid-cols-2 gap-3">
      <div class="card p-4">
        <p class="text-xs text-stone-500">设备型号</p>
        <p class="mt-1 text-base font-semibold">{{ deviceStatus.machine }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-stone-500">在线状态</p>
        <p class="mt-1 text-base font-semibold" :class="deviceStatus.online ? 'text-green-600' : 'text-red-500'">
          {{ deviceStatus.online ? '在线' : '离线' }}
        </p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-stone-500">仓内温度</p>
        <p class="mt-1 text-base font-semibold">{{ deviceStatus.temperature }}°C</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-stone-500">刀头健康度</p>
        <p class="mt-1 text-base font-semibold">{{ deviceStatus.bladeHealth }}%</p>
      </div>
    </section>

    <section class="card p-4">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-medium">设备日志</h3>
        <span class="text-xs text-stone-400">更新时间：{{ formatTime(deviceStatus.updatedAt) }}</span>
      </div>
      <div class="space-y-2">
        <div v-for="item in logs" :key="item.id" class="rounded-xl border border-stone-200 p-3">
          <p class="text-sm font-medium" :class="item.level === 'warn' ? 'text-amber-600' : 'text-stone-700'">{{ item.message }}</p>
          <p class="mt-1 text-xs text-stone-400">{{ formatTime(item.time) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
