<script setup>
import { computed } from 'vue'
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

function startQuick(mode) {
  productionStore.resetDraft()
  productionStore.setMode(mode)
  router.push('/production')
}
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
