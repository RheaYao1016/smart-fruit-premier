<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-vue-next'

const router = useRouter()

const posts = ref([
  {
    id: 1,
    user: '果汁达人',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80',
    content: '今天的配方是：2个苹果 + 1个梨，无需加糖，口感超级棒！#健康生活',
    likes: 128,
    isLiked: false,
    comments: 32,
    time: '2小时前'
  },
  {
    id: 2,
    user: '养生小能手',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1543362906-ac1b4f87eec6?w=800&q=80',
    content: '强烈推荐热带水果汁，加一点点蜂蜜，味道绝了。记得温度控制在15度左右口感最佳。',
    likes: 89,
    isLiked: true,
    comments: 15,
    time: '5小时前'
  },
  {
    id: 3,
    user: '新手小白',
    avatar: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1615478503562-ec2d8dd0e676?w=800&q=80',
    content: '第一次做水果罐头，没想到这么简单！机器很智能，自动去核太方便了。',
    likes: 45,
    isLiked: false,
    comments: 8,
    time: '1天前'
  }
])

const activeCommentPostId = ref(null)
const commentText = ref('')

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const toggleComments = (postId) => {
  activeCommentPostId.value = activeCommentPostId.value === postId ? null : postId
}

const sendComment = (post) => {
  if (!commentText.value.trim()) return
  post.comments++
  commentText.value = ''
  // In a real app, we would push to a comments array
  alert('评论已发送！')
  activeCommentPostId.value = null
}

const share = () => {
  if (navigator.share) {
    navigator.share({
      title: '智果大师',
      text: '快来看看这个美味的果汁配方！',
      url: window.location.href,
    })
  } else {
    alert('已复制链接到剪贴板！')
  }
}

</script>

<template>
  <div class="min-h-screen bg-cream pb-24 md:pb-8">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100 mb-6">
      <div class="flex items-center gap-4">
        <button @click="router.push('/')" class="p-2 rounded-full hover:bg-gray-100 text-dark-text transition-colors md:hidden">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h1 class="text-2xl font-bold font-heading text-fresh-green-800">果汁社区</h1>
      </div>
      <button class="bg-fresh-green-500 px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg shadow-fresh-green-500/30 hover:bg-fresh-green-600 transition-all active:scale-95">
        + 发布
      </button>
    </header>

    <div class="max-w-2xl mx-auto px-4 space-y-8">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <!-- Post Header -->
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover border-2 border-fresh-green-100" />
            <div>
              <h3 class="font-bold text-dark-text text-sm">{{ post.user }}</h3>
              <p class="text-gray-400 text-xs">{{ post.time }}</p>
            </div>
          </div>
          <button class="text-gray-400 hover:text-dark-text">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Post Image -->
        <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer" @dblclick="toggleLike(post)">
           <img :src="post.image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
        </div>

        <!-- Post Actions -->
        <div class="p-4 pb-2 flex items-center gap-6">
          <button @click="toggleLike(post)" class="group flex items-center gap-1 transition-colors" :class="post.isLiked ? 'text-red-500' : 'text-dark-text'">
            <Heart class="w-7 h-7" :class="{ 'fill-current transition-transform active:scale-125': post.isLiked }" />
          </button>
          
          <button @click="toggleComments(post.id)" class="text-dark-text hover:text-fresh-green-600 transition-colors">
            <MessageCircle class="w-7 h-7" />
          </button>
          
          <button @click="share" class="text-dark-text hover:text-fresh-green-600 transition-colors ml-auto">
            <Share2 class="w-6 h-6" />
          </button>
        </div>

        <!-- Post Content -->
        <div class="px-4 pb-4">
           <div class="font-bold text-sm mb-2 text-dark-text">{{ post.likes }} 次赞</div>
           <p class="text-gray-700 text-sm leading-relaxed mb-2">
             <span class="font-bold mr-2">{{ post.user }}</span>
             {{ post.content }}
           </p>
           <button class="text-gray-400 text-sm hover:text-dark-text" @click="toggleComments(post.id)">
             查看全部 {{ post.comments }} 条评论
           </button>
        </div>

        <!-- Comment Input Area (Expandable) -->
        <div v-if="activeCommentPostId === post.id" class="px-4 pb-4 pt-2 border-t border-gray-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
           <input 
             v-model="commentText" 
             type="text" 
             placeholder="添加评论..." 
             class="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fresh-green-300 transition-all"
             @keyup.enter="sendComment(post)"
           />
           <button 
             @click="sendComment(post)" 
             :disabled="!commentText.trim()"
             class="text-fresh-green-600 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:text-fresh-green-700"
           >
             发布
           </button>
        </div>

      </div>
       <div class="text-center text-gray-400 text-sm pb-8">
        已经到底啦 🍋
      </div>
    </div>
  </div>
</template>
