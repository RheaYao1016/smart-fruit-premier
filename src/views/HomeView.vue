<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCommunityStore } from '@/stores/community'
import { useProductionStore } from '@/stores/production'
import { ASSETS } from '@/constants/assets'
import { fromNow } from '@/utils/datetime'

const router = useRouter()
const authStore = useAuthStore()
const communityStore = useCommunityStore()
const productionStore = useProductionStore()

const quickCards = [
  { title: '开始制作', desc: '进入 5 步制作向导', path: '/production' },
  { title: '营养科普', desc: '查看水果配比与温度建议', path: '/nutrition' },
  { title: '果汁社区', desc: '发布图文并互动', path: '/community' }
]

const feed = computed(() => communityStore.queryPosts({
  userId: authStore.currentUser?.id,
  role: authStore.role,
  page: 1,
  pageSize: 3,
  sort: 'hot'
}).items)

const myHistory = computed(() => productionStore.getHistoryByUser(authStore.currentUser?.id).slice(0, 2))

const chartBars = ref([58, 76, 64, 82, 69, 91, 73])
const usage = ref({
  juice: 62,
  canned: 23,
  cut: 15
})
const deviceRate = ref(88)
const avgSeconds = ref(39)
let chartTimer = null

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function refreshDashboard() {
  chartBars.value = chartBars.value.map((item) => clamp(item + Math.round((Math.random() - 0.5) * 14), 35, 96))
  const nextJuice = clamp(usage.value.juice + Math.round((Math.random() - 0.5) * 10), 40, 75)
  const nextCanned = clamp(usage.value.canned + Math.round((Math.random() - 0.5) * 8), 10, 40)
  const nextCut = Math.max(5, 100 - nextJuice - nextCanned)

  usage.value = {
    juice: nextJuice,
    canned: nextCanned,
    cut: nextCut
  }
  deviceRate.value = clamp(deviceRate.value + Math.round((Math.random() - 0.5) * 4), 82, 98)
  avgSeconds.value = clamp(avgSeconds.value + Math.round((Math.random() - 0.5) * 3), 28, 48)
}

function startQuick(mode) {
  productionStore.resetDraft()
  productionStore.setMode(mode)
  router.push('/production')
}

onMounted(() => {
  chartTimer = window.setInterval(refreshDashboard, 2200)
})

onBeforeUnmount(() => {
  if (chartTimer) window.clearInterval(chartTimer)
})
</script>

<template>
  <div class="space-y-4">
    <section class="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow">
      <img :src="ASSETS.homeBanner" class="h-44 w-full object-cover" alt="banner" />
      <div class="space-y-2 px-4 py-4">
        <h2 class="text-xl font-bold text-stone-800">智能水果处理专家</h2>
        <p class="text-sm text-stone-600">一键制作鲜果汁、水果罐头和果切，手机/PWA 直接可用。</p>
        <div class="grid grid-cols-3 gap-2">
          <button class="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white" @click="startQuick('juice')">果汁</button>
          <button class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white" @click="startQuick('canned')">罐头</button>
          <button class="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white" @click="startQuick('cut')">果切</button>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-3">
      <button
        v-for="item in quickCards"
        :key="item.path"
        class="card p-4 text-left active:scale-[0.99]"
        @click="router.push(item.path)"
      >
        <p class="text-lg font-semibold text-stone-800">{{ item.title }}</p>
        <p class="mt-1 text-sm text-stone-500">{{ item.desc }}</p>
      </button>
    </section>

    <section class="card overflow-hidden">
      <div class="dashboard-bg relative p-4">
        <div class="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-full bg-white/40 pulse-dot"></div>
        <div class="pointer-events-none absolute left-6 top-6 h-3 w-3 rounded-full bg-amber-300/80 float-dot"></div>
        <div class="pointer-events-none absolute bottom-5 right-10 h-2 w-2 rounded-full bg-emerald-300/80 float-dot delay-1"></div>

        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold text-stone-800">实时运行看板</h3>
          <span class="rounded-full bg-white/60 px-2 py-1 text-[10px] text-stone-600">自动更新</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="rounded-xl bg-white/80 p-3 shadow-sm">
            <p class="text-[11px] text-stone-500">设备稳定率</p>
            <p class="text-xl font-bold text-emerald-600">{{ deviceRate }}%</p>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div class="h-full bg-emerald-500 transition-all duration-700" :style="{ width: `${deviceRate}%` }"></div>
            </div>
          </div>
          <div class="rounded-xl bg-white/80 p-3 shadow-sm">
            <p class="text-[11px] text-stone-500">单杯均耗时</p>
            <p class="text-xl font-bold text-cyan-600">{{ avgSeconds }}s</p>
            <p class="mt-1 text-[10px] text-stone-400">目标区间 30-45s</p>
          </div>
        </div>

        <div class="mt-3 rounded-xl bg-white/80 p-3 shadow-sm">
          <p class="mb-2 text-xs text-stone-600">今日模式占比</p>
          <div class="h-2 overflow-hidden rounded-full bg-stone-200">
            <div class="h-full bg-amber-400 transition-all duration-700" :style="{ width: `${usage.juice}%` }"></div>
          </div>
          <div class="mt-2 flex items-center justify-between text-[10px] text-stone-600">
            <span>果汁 {{ usage.juice }}%</span>
            <span>罐头 {{ usage.canned }}%</span>
            <span>果切 {{ usage.cut }}%</span>
          </div>
        </div>

        <div class="mt-3 rounded-xl bg-white/80 p-3 shadow-sm">
          <p class="mb-2 text-xs text-stone-600">7段产能波动</p>
          <div class="flex h-16 items-end gap-1">
            <div
              v-for="(item, index) in chartBars"
              :key="index"
              class="flex-1 rounded-t bg-gradient-to-t from-amber-500 to-emerald-400 transition-all duration-700"
              :style="{ height: `${item}%` }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <section class="card p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-base font-semibold">社区热帖</h3>
        <button class="text-xs text-amber-600" @click="router.push('/community')">查看全部</button>
      </div>
      <div v-if="feed.length" class="space-y-3">
        <button
          v-for="post in feed"
          :key="post.id"
          class="w-full rounded-xl border border-stone-200 p-3 text-left"
          @click="router.push(`/community/${post.id}`)"
        >
          <p class="line-clamp-1 text-sm font-medium text-stone-800">{{ post.title }}</p>
          <p class="mt-1 line-clamp-1 text-xs text-stone-500">{{ post.content }}</p>
          <p class="mt-1 text-xs text-stone-400">👍 {{ post.likeCount }} · 💬 {{ post.commentCount }}</p>
        </button>
      </div>
      <p v-else class="text-sm text-stone-400">暂无内容</p>
    </section>

    <section class="card p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-base font-semibold">我的最近制作</h3>
        <button class="text-xs text-amber-600" @click="router.push('/my')">去我的</button>
      </div>
      <div v-if="myHistory.length" class="space-y-2">
        <div v-for="item in myHistory" :key="item.id" class="rounded-xl border border-stone-200 p-3">
          <p class="text-sm font-medium">{{ item.mode === 'juice' ? '果汁' : item.mode === 'canned' ? '罐头' : '果切' }} · {{ item.fruitCount }} 个水果</p>
          <p class="text-xs text-stone-500">{{ fromNow(item.createdAt) }}</p>
        </div>
      </div>
      <p v-else class="text-sm text-stone-400">还没有制作记录，去开始制作吧。</p>
    </section>
  </div>
</template>

<style scoped>
.dashboard-bg {
  background:
    radial-gradient(220px 120px at 80% 20%, rgba(253, 224, 71, 0.25) 0%, transparent 65%),
    radial-gradient(180px 100px at 15% 75%, rgba(52, 211, 153, 0.2) 0%, transparent 70%),
    linear-gradient(140deg, #fff9ee 0%, #f0fdf4 100%);
}

.pulse-dot {
  animation: pulseRing 1.8s ease-in-out infinite;
}

.float-dot {
  animation: floatUp 2.5s ease-in-out infinite;
}

.float-dot.delay-1 {
  animation-delay: 0.7s;
}

@keyframes pulseRing {
  0%, 100% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(1.25); opacity: 0.85; }
}

@keyframes floatUp {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(-6px); opacity: 1; }
}
</style>
