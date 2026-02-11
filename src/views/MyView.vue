<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCommunityStore } from '@/stores/community'
import { useProductionStore } from '@/stores/production'
import ImageField from '@/components/ImageField.vue'
import { formatTime } from '@/utils/datetime'

const router = useRouter()
const authStore = useAuthStore()
const communityStore = useCommunityStore()
const productionStore = useProductionStore()

const tab = ref('profile')
const allergyInput = ref('')
const tip = ref('')

const profileForm = ref({
  nickname: authStore.currentUser?.nickname || '',
  avatar: authStore.currentUser?.avatar || '',
  gender: authStore.currentUser?.gender || '',
  birthday: authStore.currentUser?.birthday || '',
  region: authStore.currentUser?.region || '',
  lowSugar: Boolean(authStore.currentUser?.preference?.lowSugar),
  highFiber: Boolean(authStore.currentUser?.preference?.highFiber),
  allergies: [...(authStore.currentUser?.preference?.allergies || [])]
})

const tabs = [
  { key: 'profile', label: '资料' },
  { key: 'recipes', label: '我的配方' },
  { key: 'posts', label: '我的帖子' },
  { key: 'favorites', label: '收藏' },
  { key: 'likes', label: '点赞' },
  { key: 'comments', label: '评论' },
  { key: 'history', label: '历史制作' }
]

const myData = computed(() => communityStore.getUserContent(authStore.currentUser?.id))
const myRecipes = computed(() => myData.value.myPosts.filter((item) => item.recipe))
const myHistory = computed(() => productionStore.getHistoryByUser(authStore.currentUser?.id))

function postTitle(postId) {
  return communityStore.getPostById(postId)?.title || '帖子已删除'
}

function addAllergy() {
  const value = allergyInput.value.trim()
  if (!value) return
  if (!profileForm.value.allergies.includes(value)) {
    profileForm.value.allergies.push(value)
  }
  allergyInput.value = ''
}

function removeAllergy(item) {
  profileForm.value.allergies = profileForm.value.allergies.filter((a) => a !== item)
}

function saveProfile() {
  if (!profileForm.value.nickname || !profileForm.value.avatar) {
    tip.value = '昵称和头像为必填'
    return
  }
  authStore.updateProfile({
    nickname: profileForm.value.nickname,
    avatar: profileForm.value.avatar,
    gender: profileForm.value.gender,
    birthday: profileForm.value.birthday,
    region: profileForm.value.region,
    preference: {
      lowSugar: profileForm.value.lowSugar,
      highFiber: profileForm.value.highFiber,
      allergies: profileForm.value.allergies
    }
  })
  tip.value = '资料已保存'
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <div class="flex items-center gap-3">
        <img :src="authStore.currentUser?.avatar" class="h-14 w-14 rounded-full object-cover" />
        <div>
          <p class="text-lg font-semibold">{{ authStore.currentUser?.nickname }}</p>
          <p class="text-xs text-stone-500">账号：{{ authStore.currentUser?.account }} · 角色：{{ authStore.currentUser?.role }}</p>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
        <button v-if="authStore.role==='admin'" class="rounded-xl border border-amber-400 px-3 py-2 text-amber-600" @click="router.push('/community-manage')">社区管理</button>
        <button v-if="['admin','maintainer'].includes(authStore.role)" class="rounded-xl border border-emerald-400 px-3 py-2 text-emerald-600" @click="router.push('/maintainer')">设备状态</button>
      </div>
    </section>

    <section class="card p-2">
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in tabs"
          :key="item.key"
          class="whitespace-nowrap rounded-full px-3 py-1.5 text-xs"
          :class="tab===item.key ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'"
          @click="tab = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </section>

    <section v-if="tab==='profile'" class="card space-y-3 p-4">
      <input v-model="profileForm.nickname" type="text" placeholder="昵称（必填）" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
      <ImageField v-model="profileForm.avatar" label="头像（必填）" aspect-hint="1:1" />
      <div class="grid grid-cols-2 gap-2">
        <select v-model="profileForm.gender" class="rounded-xl border border-stone-200 px-3 py-2">
          <option value="">性别</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="保密">保密</option>
        </select>
        <input v-model="profileForm.birthday" type="date" class="rounded-xl border border-stone-200 px-3 py-2" />
      </div>
      <input v-model="profileForm.region" type="text" placeholder="地区" class="w-full rounded-xl border border-stone-200 px-3 py-2" />

      <div class="rounded-xl bg-stone-50 p-3">
        <p class="text-sm font-medium">偏好设置</p>
        <div class="mt-2 flex gap-3 text-sm">
          <label><input v-model="profileForm.lowSugar" type="checkbox" class="mr-1" />低糖</label>
          <label><input v-model="profileForm.highFiber" type="checkbox" class="mr-1" />高纤维</label>
        </div>

        <div class="mt-2 flex gap-2">
          <input v-model="allergyInput" type="text" placeholder="过敏源自定义" class="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-xs" />
          <button class="rounded-xl border border-amber-500 px-3 py-2 text-xs text-amber-600" @click="addAllergy">添加</button>
        </div>

        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="item in profileForm.allergies"
            :key="item"
            class="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700"
            @click="removeAllergy(item)"
          >
            {{ item }} ×
          </button>
        </div>
      </div>

      <p v-if="tip" class="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-600">{{ tip }}</p>

      <button class="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="saveProfile">保存资料</button>
      <button class="w-full rounded-xl border border-red-300 px-4 py-3 text-red-500" @click="logout">退出登录</button>
    </section>

    <section v-else-if="tab==='recipes'" class="space-y-3">
      <article v-for="item in myRecipes" :key="item.id" class="card p-4">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p class="mt-1 text-xs text-stone-500">模式：{{ item.recipe?.mode }} · {{ formatTime(item.createdAt) }}</p>
      </article>
      <p v-if="!myRecipes.length" class="card p-4 text-sm text-stone-500">暂无配方帖子</p>
    </section>

    <section v-else-if="tab==='posts'" class="space-y-3">
      <article v-for="item in myData.myPosts" :key="item.id" class="card p-4">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p class="mt-1 text-xs text-stone-500">{{ item.isApproved ? '已审核' : '待审核' }} · {{ formatTime(item.createdAt) }}</p>
      </article>
      <p v-if="!myData.myPosts.length" class="card p-4 text-sm text-stone-500">暂无帖子</p>
    </section>

    <section v-else-if="tab==='favorites'" class="space-y-3">
      <article v-for="item in myData.favoritePosts" :key="item.id" class="card p-4">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p class="mt-1 text-xs text-stone-500">收藏</p>
      </article>
      <p v-if="!myData.favoritePosts.length" class="card p-4 text-sm text-stone-500">暂无收藏</p>
    </section>

    <section v-else-if="tab==='likes'" class="space-y-3">
      <article v-for="item in myData.likedPosts" :key="item.id" class="card p-4">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p class="mt-1 text-xs text-stone-500">已点赞</p>
      </article>
      <p v-if="!myData.likedPosts.length" class="card p-4 text-sm text-stone-500">暂无点赞</p>
    </section>

    <section v-else-if="tab==='comments'" class="space-y-3">
      <article v-for="item in myData.myComments" :key="item.id" class="card p-4">
        <p class="text-sm">{{ item.content }}</p>
        <p class="mt-1 text-xs text-stone-500">帖子：{{ postTitle(item.postId) }} · {{ formatTime(item.createdAt) }}</p>
      </article>
      <p v-if="!myData.myComments.length" class="card p-4 text-sm text-stone-500">暂无评论</p>
    </section>

    <section v-else class="space-y-3">
      <article v-for="item in myHistory" :key="item.id" class="card p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ item.mode === 'juice' ? '果汁' : item.mode === 'canned' ? '罐头' : '果切' }} · {{ item.fruitCount }} 个水果</p>
          <span class="text-xs text-stone-400">{{ formatTime(item.createdAt) }}</span>
        </div>
        <img v-if="item.image" :src="item.image" class="mt-2 h-28 w-full rounded-xl object-cover" />
      </article>
      <p v-if="!myHistory.length" class="card p-4 text-sm text-stone-500">暂无制作历史</p>
    </section>
  </div>
</template>
