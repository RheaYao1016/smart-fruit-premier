<script setup>
import { computed, ref } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import { formatTime } from '@/utils/datetime'

const communityStore = useCommunityStore()
const authStore = useAuthStore()

const postFilter = ref('all')
const reportFilter = ref('pending')
const reportResult = ref('')
const activeReportId = ref('')

const posts = computed(() => {
  if (postFilter.value === 'pending') return communityStore.posts.filter((item) => !item.isApproved)
  if (postFilter.value === 'hidden') return communityStore.posts.filter((item) => item.isHidden)
  return communityStore.posts
})

const reports = computed(() => {
  if (reportFilter.value === 'all') return communityStore.reports
  return communityStore.reports.filter((item) => item.status === reportFilter.value)
})

function postTitle(postId) {
  return communityStore.getPostById(postId)?.title || '已删除帖子'
}

function moderate(postId, action) {
  communityStore.moderatePost(postId, action, authStore.currentUser)
}

function removePost(postId) {
  communityStore.deletePost(postId, authStore.currentUser)
}

function openHandle(reportId) {
  activeReportId.value = reportId
  reportResult.value = ''
}

function submitHandle() {
  if (!activeReportId.value) return
  communityStore.handleReport({
    reportId: activeReportId.value,
    result: reportResult.value || '已处理',
    handlerId: authStore.currentUser?.id
  })
  activeReportId.value = ''
  reportResult.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <h2 class="text-lg font-semibold">帖子管理</h2>
      <div class="mt-2 flex gap-2 text-xs">
        <button class="rounded-full px-3 py-1.5" :class="postFilter==='all' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="postFilter='all'">全部</button>
        <button class="rounded-full px-3 py-1.5" :class="postFilter==='pending' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="postFilter='pending'">待审核</button>
        <button class="rounded-full px-3 py-1.5" :class="postFilter==='hidden' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="postFilter='hidden'">已隐藏</button>
      </div>

      <div class="mt-3 space-y-2">
        <article v-for="item in posts" :key="item.id" class="rounded-xl border border-stone-200 p-3">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="mt-1 text-xs text-stone-500">{{ formatTime(item.createdAt) }} · {{ item.isApproved ? '已审核' : '待审核' }} · {{ item.isHidden ? '隐藏' : '展示' }}</p>
          <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
            <button class="rounded-lg border border-stone-300 px-2 py-1" @click="moderate(item.id, 'approve')">通过</button>
            <button class="rounded-lg border border-stone-300 px-2 py-1" @click="moderate(item.id, item.isHidden ? 'show' : 'hide')">{{ item.isHidden ? '取消隐藏' : '隐藏' }}</button>
            <button class="rounded-lg border border-stone-300 px-2 py-1" @click="moderate(item.id, 'pin')">置顶</button>
            <button class="col-span-3 rounded-lg border border-red-300 px-2 py-1 text-red-500" @click="removePost(item.id)">删除</button>
          </div>
        </article>
        <p v-if="!posts.length" class="text-sm text-stone-400">暂无帖子</p>
      </div>
    </section>

    <section class="card p-4">
      <h2 class="text-lg font-semibold">举报处理</h2>
      <div class="mt-2 flex gap-2 text-xs">
        <button class="rounded-full px-3 py-1.5" :class="reportFilter==='pending' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="reportFilter='pending'">待处理</button>
        <button class="rounded-full px-3 py-1.5" :class="reportFilter==='resolved' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="reportFilter='resolved'">已处理</button>
        <button class="rounded-full px-3 py-1.5" :class="reportFilter==='all' ? 'bg-amber-500 text-white' : 'bg-stone-100'" @click="reportFilter='all'">全部</button>
      </div>

      <div class="mt-3 space-y-2">
        <article v-for="item in reports" :key="item.id" class="rounded-xl border border-stone-200 p-3">
          <p class="text-sm font-medium">{{ postTitle(item.postId) }}</p>
          <p class="mt-1 text-xs text-stone-500">原因：{{ item.reason }} · 状态：{{ item.status === 'pending' ? '待处理' : '已处理' }}</p>
          <p class="mt-1 text-xs text-stone-500">描述：{{ item.description || '无' }}</p>
          <p class="mt-1 text-xs text-stone-400">{{ formatTime(item.createdAt) }}</p>
          <button
            v-if="item.status === 'pending'"
            class="mt-2 rounded-lg border border-amber-400 px-3 py-1 text-xs text-amber-600"
            @click="openHandle(item.id)"
          >
            标记为已处理
          </button>
          <p v-else class="mt-2 text-xs text-green-600">处理结果：{{ item.result || '已处理' }}</p>
        </article>
        <p v-if="!reports.length" class="text-sm text-stone-400">暂无举报数据</p>
      </div>
    </section>

    <div v-if="activeReportId" class="fixed inset-0 z-[65] bg-black/50 p-3" @click.self="activeReportId = ''">
      <div class="mx-auto max-w-md rounded-3xl bg-white p-4">
        <h3 class="text-lg font-semibold">处理举报</h3>
        <textarea
          v-model="reportResult"
          rows="3"
          placeholder="请输入处理结果"
          class="mt-3 w-full rounded-xl border border-stone-200 px-3 py-2"
        ></textarea>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="activeReportId = ''">取消</button>
          <button class="rounded-xl bg-amber-500 px-3 py-2 font-semibold text-white" @click="submitHandle">确认处理</button>
        </div>
      </div>
    </div>
  </div>
</template>
