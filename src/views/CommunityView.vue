<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import { fromNow } from '@/utils/datetime'

const router = useRouter()
const communityStore = useCommunityStore()
const authStore = useAuthStore()

const search = ref('')
const sort = ref('latest')
const tag = ref('全部')
const visibleCount = ref(6)

const sortList = [
  { label: '最新', value: 'latest' },
  { label: '最热', value: 'hot' },
  { label: '精华', value: 'featured' }
]

const tagList = computed(() => {
  const set = new Set(['全部', '果汁', '罐头', '果切', '健康'])
  communityStore.posts.forEach((item) => (item.tags || []).forEach((t) => set.add(t)))
  return Array.from(set)
})

const allItems = computed(() => {
  return communityStore.queryPosts({
    userId: authStore.currentUser?.id,
    role: authStore.role,
    search: search.value,
    sort: sort.value,
    tag: tag.value,
    page: 1,
    pageSize: 999
  }).items
})

const visibleItems = computed(() => allItems.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleItems.value.length < allItems.value.length)

watch([search, sort, tag], () => {
  visibleCount.value = 6
})

function loadMore() {
  visibleCount.value += 6
}

function userById(userId) {
  return authStore.users.find((item) => item.id === userId)
}

function toggleLike(postId) {
  communityStore.toggleLike(postId, authStore.currentUser?.id)
}

function toggleFavorite(postId) {
  communityStore.toggleFavorite(postId, authStore.currentUser?.id)
}
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <div class="flex gap-2">
        <input v-model="search" type="text" placeholder="搜索标题/内容/标签" class="flex-1 rounded-xl border border-stone-200 px-3 py-2" />
        <button class="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white" @click="router.push('/community/new')">发帖</button>
      </div>
      <button
        v-if="authStore.role === 'admin'"
        class="mt-2 rounded-xl border border-amber-400 px-3 py-2 text-xs text-amber-600"
        @click="router.push('/community-manage')"
      >
        进入管理面板
      </button>

      <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in sortList"
          :key="item.value"
          class="rounded-full px-3 py-1.5 text-xs"
          :class="sort === item.value ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'"
          @click="sort = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in tagList"
          :key="item"
          class="rounded-full px-3 py-1.5 text-xs"
          :class="tag === item ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-600'"
          @click="tag = item"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <section v-if="visibleItems.length" class="grid grid-cols-1 gap-3">
      <article v-for="post in visibleItems" :key="post.id" class="card overflow-hidden">
        <img v-if="post.images[0]" :src="post.images[0]" class="h-48 w-full object-cover" />
        <div class="space-y-2 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-stone-500">
              <img :src="userById(post.authorId)?.avatar" class="h-7 w-7 rounded-full object-cover" />
              <span>{{ userById(post.authorId)?.nickname || '未知用户' }}</span>
              <span>· {{ fromNow(post.createdAt) }}</span>
            </div>
            <span v-if="post.isPinned" class="rounded-full bg-amber-100 px-2 py-1 text-[10px] text-amber-700">置顶</span>
          </div>

          <button class="w-full text-left" @click="router.push(`/community/${post.id}`)">
            <h3 class="line-clamp-1 text-base font-semibold">{{ post.title }}</h3>
            <p class="mt-1 line-clamp-2 text-sm text-stone-600">{{ post.content }}</p>
          </button>

          <div class="flex flex-wrap gap-1">
            <span v-for="t in post.tags" :key="t" class="rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">#{{ t }}</span>
          </div>

          <div class="flex items-center gap-3 text-xs text-stone-500">
            <button class="rounded-lg bg-stone-100 px-2 py-1" @click="toggleLike(post.id)">👍 {{ post.likeCount }}</button>
            <button class="rounded-lg bg-stone-100 px-2 py-1" @click="toggleFavorite(post.id)">⭐ {{ post.favoriteCount }}</button>
            <button class="rounded-lg bg-stone-100 px-2 py-1" @click="router.push(`/community/${post.id}`)">💬 {{ post.commentCount }}</button>
            <span v-if="!post.isApproved" class="ml-auto rounded-full bg-orange-100 px-2 py-1 text-[10px] text-orange-600">待审核</span>
          </div>
        </div>
      </article>
    </section>

    <section v-else class="card p-6 text-center text-sm text-stone-500">暂无帖子，去发布第一条吧。</section>

    <button v-if="hasMore" class="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" @click="loadMore">下拉加载更多</button>
  </div>
</template>
