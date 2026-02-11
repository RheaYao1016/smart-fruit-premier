<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import { formatTime } from '@/utils/datetime'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()
const authStore = useAuthStore()

const postId = computed(() => String(route.params.id))
const rawPost = computed(() => communityStore.getPostById(postId.value))
const post = computed(() => {
  if (!rawPost.value) return null
  return communityStore.buildPostView(rawPost.value, authStore.currentUser?.id)
})

const comments = computed(() => communityStore.getCommentsByPost(postId.value))

const commentText = ref('')
const showReport = ref(false)
const reportReason = ref('')
const reportDescription = ref('')

const reportReasons = ['低质内容', '疑似广告', '不实信息', '其他']

const author = computed(() => authStore.users.find((item) => item.id === post.value?.authorId))
const canManage = computed(() => authStore.role === 'admin')
const canEdit = computed(() => authStore.currentUser?.id === post.value?.authorId || canManage.value)
const canView = computed(() => {
  if (!post.value) return false
  if (canManage.value) return true
  return !post.value.isHidden || post.value.authorId === authStore.currentUser?.id
})

function userById(id) {
  return authStore.users.find((item) => item.id === id)
}

function sendComment() {
  if (!commentText.value.trim()) return
  communityStore.addComment({
    postId: postId.value,
    userId: authStore.currentUser?.id,
    content: commentText.value
  })
  commentText.value = ''
}

function submitReport() {
  const result = communityStore.addReport({
    postId: postId.value,
    reporterId: authStore.currentUser?.id,
    reason: reportReason.value,
    description: reportDescription.value
  })
  if (result.success) {
    showReport.value = false
    reportReason.value = ''
    reportDescription.value = ''
  }
}

function moderate(action) {
  communityStore.moderatePost(postId.value, action, authStore.currentUser)
}

function removePost() {
  communityStore.deletePost(postId.value, authStore.currentUser)
  router.push('/community')
}
</script>

<template>
  <div v-if="post" class="space-y-4">
    <section v-if="!canView" class="card p-4 text-sm text-stone-500">该帖子已隐藏，暂无权限查看。</section>

    <template v-else>
      <section class="card overflow-hidden">
        <img v-if="post.images.length" :src="post.images[0]" class="h-56 w-full object-cover" />
        <div class="space-y-3 p-4">
          <div class="flex items-center gap-2">
            <img :src="author?.avatar" class="h-9 w-9 rounded-full object-cover" />
            <div>
              <p class="text-sm font-medium">{{ author?.nickname || '未知用户' }}</p>
              <p class="text-xs text-stone-500">{{ formatTime(post.createdAt) }}</p>
            </div>
            <span v-if="post.isPinned" class="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] text-amber-700">置顶</span>
            <span v-if="!post.isApproved" class="rounded-full bg-orange-100 px-2 py-1 text-[10px] text-orange-600">待审核</span>
          </div>

          <h1 class="text-xl font-semibold">{{ post.title }}</h1>
          <p class="text-sm leading-6 text-stone-700">{{ post.content }}</p>

          <div class="flex flex-wrap gap-1">
            <span v-for="t in post.tags" :key="t" class="rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">#{{ t }}</span>
          </div>

          <div v-if="post.recipe" class="rounded-xl bg-stone-50 p-3 text-xs text-stone-600">
            <p>配方模式：{{ post.recipe.mode || '-' }}</p>
            <p>水果：{{ (post.recipe.fruits || []).join ? post.recipe.fruits.join('、') : post.recipe.fruits }}</p>
            <p>注水：{{ post.recipe.waterMl || 0 }} ml，糖量：{{ post.recipe.sugarG || 0 }} g，温度：{{ post.recipe.temp || '-' }}</p>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <button class="rounded-xl bg-stone-100 px-3 py-2" @click="communityStore.toggleLike(post.id, authStore.currentUser?.id)">
              👍 {{ post.likeCount }}
            </button>
            <button class="rounded-xl bg-stone-100 px-3 py-2" @click="communityStore.toggleFavorite(post.id, authStore.currentUser?.id)">
              ⭐ {{ post.favoriteCount }}
            </button>
            <button class="rounded-xl bg-stone-100 px-3 py-2" @click="showReport = true">举报</button>
          </div>
        </div>
      </section>

      <section class="card p-4">
        <h2 class="mb-2 text-base font-semibold">评论（{{ comments.length }}）</h2>
        <div class="space-y-3">
          <article v-for="c in comments" :key="c.id" class="rounded-xl border border-stone-200 p-3">
            <div class="flex items-center gap-2 text-xs text-stone-500">
              <img :src="userById(c.userId)?.avatar" class="h-6 w-6 rounded-full object-cover" />
              <span>{{ userById(c.userId)?.nickname || '匿名用户' }}</span>
              <span>{{ formatTime(c.createdAt) }}</span>
            </div>
            <p class="mt-1 text-sm text-stone-700">{{ c.content }}</p>
          </article>
          <p v-if="!comments.length" class="text-sm text-stone-400">暂无评论</p>
        </div>

        <div class="mt-3 flex gap-2">
          <input v-model="commentText" type="text" placeholder="说点什么..." class="flex-1 rounded-xl border border-stone-200 px-3 py-2" />
          <button class="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white" @click="sendComment">发送</button>
        </div>
      </section>

      <section v-if="canManage" class="card p-4">
        <h2 class="mb-2 text-base font-semibold">管理员操作</h2>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="moderate('approve')">审核通过</button>
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="moderate('pin')">置顶/取消置顶</button>
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="moderate('hide')">隐藏</button>
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="moderate('show')">取消隐藏</button>
        </div>
      </section>

      <section v-if="canEdit" class="card p-4">
        <button class="w-full rounded-xl border border-red-300 px-3 py-2 text-sm text-red-500" @click="removePost">删除帖子</button>
      </section>
    </template>

    <div v-if="showReport" class="fixed inset-0 z-[65] bg-black/50 p-3" @click.self="showReport = false">
      <div class="mx-auto max-w-md space-y-3 rounded-3xl bg-white p-4">
        <h3 class="text-lg font-semibold">举报帖子</h3>
        <select v-model="reportReason" class="w-full rounded-xl border border-stone-200 px-3 py-2">
          <option value="">选择原因</option>
          <option v-for="item in reportReasons" :key="item" :value="item">{{ item }}</option>
        </select>
        <textarea v-model="reportDescription" rows="3" placeholder="补充说明（可选）" class="w-full rounded-xl border border-stone-200 px-3 py-2"></textarea>
        <div class="grid grid-cols-2 gap-2">
          <button class="rounded-xl border border-stone-300 px-3 py-2" @click="showReport = false">取消</button>
          <button class="rounded-xl bg-amber-500 px-3 py-2 font-semibold text-white" @click="submitReport">提交举报</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card p-4 text-sm text-stone-500">帖子不存在</div>
</template>
