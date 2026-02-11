<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-vue-next'

const router = useRouter()

const posts = ref([
  {
    id: 1,
    user: '果汁达人',
    avatar: '👩‍🍳',
    content: '今天的配方是：2个苹果 + 1个梨，无需加糖，口感超级棒！#健康生活',
    likes: 128,
    comments: 32,
    time: '2小时前'
  },
  {
    id: 2,
    user: '养生小能手',
    avatar: '🧘‍♂️',
    content: '强烈推荐热带水果汁，加一点点蜂蜜，味道绝了。记得温度控制在15度左右口感最佳。',
    likes: 89,
    comments: 15,
    time: '5小时前'
  },
  {
    id: 3,
    user: '新手小白',
    avatar: '👶',
    content: '第一次做水果罐头，没想到这么简单！机器很智能，自动去核太方便了。',
    likes: 45,
    comments: 8,
    time: '1天前'
  }
])

</script>

<template>
  <div class="min-h-screen bg-gray-900 p-4 md:p-8">
    <header class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button @click="router.push('/')" class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h1 class="text-3xl font-bold text-white">果汁社区</h1>
      </div>
      <button class="bg-green-600 px-6 py-2 rounded-full text-white font-bold hover:bg-green-500">
        发帖分享
      </button>
    </header>

    <div class="max-w-2xl mx-auto space-y-6">
      <div v-for="post in posts" :key="post.id" class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
            {{ post.avatar }}
          </div>
          <div>
            <h3 class="text-white font-bold">{{ post.user }}</h3>
            <p class="text-gray-400 text-xs">{{ post.time }}</p>
          </div>
        </div>
        
        <p class="text-gray-200 mb-6 leading-relaxed">
          {{ post.content }}
        </p>

        <div class="flex items-center gap-6 text-gray-400 border-t border-gray-700 pt-4">
          <button class="flex items-center gap-2 hover:text-red-500 transition-colors">
            <Heart class="w-5 h-5" />
            <span>{{ post.likes }}</span>
          </button>
          <button class="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <MessageCircle class="w-5 h-5" />
            <span>{{ post.comments }}</span>
          </button>
          <button class="flex items-center gap-2 hover:text-green-500 transition-colors">
            <Share2 class="w-5 h-5" />
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
