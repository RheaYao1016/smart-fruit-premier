<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Send, Image as ImageIcon, X, Download, Edit, Scissors, Type, Languages, Play } from 'lucide-vue-next'
import ImageCropper from '@/components/ImageCropper.vue'

const router = useRouter()

const filters = ['全部', '果汁', '罐头', '果切']
const activeFilter = ref('全部')

const posts = ref([
  {
    id: 1,
    user: '水果达人小李',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1622597467536-01a69f78eedb?w=800&q=80',
    content: '炎炎夏日，这款西瓜薄荷沙冰真是救星！清凉解暑，口感绝佳。',
    title: '夏日特饮：西瓜薄荷冰沙',
    tag: '果汁',
    tagColor: 'bg-orange-500',
    likes: 128,
    isLiked: false,
    comments: 23,
    time: '2小时前'
  },
  {
    id: 2,
    user: '健康生活家',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80',
    content: '早餐必备！牛油果和香蕉的完美搭配，营养丰富又饱腹。',
    title: '营养早餐：牛油果香蕉奶昔',
    tag: '果汁',
    tagColor: 'bg-orange-500', 
    likes: 95,
    isLiked: true,
    comments: 18,
    time: '5小时前'
  },
  {
    id: 3,
    user: '美食探索者',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1502741126161-b048400f085d?w=800&q=80',
    content: '自己做的黄桃罐头，无添加更健康，甜度刚刚好！',
    title: '自制黄桃罐头，童年的味道',
    tag: '罐头',
    tagColor: 'bg-yellow-500',
    likes: 156,
    isLiked: false,
    comments: 34,
    time: '1天前'
  },
  {
    id: 4,
    user: '果切艺术家',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1519996529931-e8ecd95213d2?w=800&q=80',
    content: '用不同颜色的水果摆出彩虹造型，孩子们超喜欢！',
    title: '彩虹果盘，颜值与美味并存',
    tag: '果切',
    tagColor: 'bg-orange-400',
    likes: 203,
    isLiked: false,
    comments: 45,
    time: '1天前'
  },
   {
    id: 5,
    user: '养生小达人',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&q=80',
    content: '这款果汁特别适合女生，补气血效果很好。',
    title: '红枣枸杞苹果汁，养颜又补气',
    tag: '果汁',
    tagColor: 'bg-orange-500',
    likes: 87,
    isLiked: false,
    comments: 16,
    time: '2天前'
  },
  {
    id: 6,
    user: '创意料理师',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=800&q=80',
    content: '浓郁的芒果配上椰奶和西米，仿佛置身热带海岛。',
    title: '芒果椰奶西米露，热带风情',
    tag: '罐头',
    tagColor: 'bg-yellow-500',
    likes: 142,
    isLiked: false,
    comments: 28,
    time: '3天前'
  }
])

const filteredPosts = computed(() => {
  if (activeFilter.value === '全部') return posts.value
  return posts.value.filter(post => post.tag === activeFilter.value)
})

const activeCommentPostId = ref(null)
const commentText = ref('')
const activePostDetail = ref(null) // For Detail Overlay

// Create Post State
const showCreateModal = ref(false)
const newPostContent = ref('')
const newPostImage = ref(null)
const fileInput = ref(null)

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

// Create Post Logic
const triggerImageUpload = () => fileInput.value.click()

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    newPostImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const publishPost = () => {
  if (!newPostContent.value.trim() && !newPostImage.value) return

  const newPost = {
    id: Date.now(),
    user: '我',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', // Mock user avatar
    image: newPostImage.value || 'https://placehold.co/800x800?text=No+Image',
    content: newPostContent.value,
    likes: 0,
    isLiked: false,
    comments: 0,
    time: '刚刚'
  }

  posts.value.unshift(newPost)
  
  // Reset
  newPostContent.value = ''
  newPostImage.value = null
  showCreateModal.value = false
}

// Context Menu State
const showContextMenu = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const activeContextImage = ref(null)

// Image Cropper State (Reused)
const showCropper = ref(false)
const cropperImage = ref('')
const cropperAspect = ref(1)

// Production Link
import { useProductionStore } from '@/stores/production'
const productionStore = useProductionStore()

const handleImageLongPress = (e, imgUrl) => {
  e.preventDefault()
  activeContextImage.value = imgUrl
  // Position menu near the click/touch
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  // Adjust to keep on screen
  const x = Math.min(clientX, window.innerWidth - 160)
  const y = Math.min(clientY, window.innerHeight - 200)
  
  contextMenuPos.value = { x, y }
  showContextMenu.value = true
}

const handleContextAction = (action) => {
  showContextMenu.value = false
  
  if (action === 'save') {
    const link = document.createElement('a')
    link.href = activeContextImage.value
    link.download = 'smart-fruit-image.jpg'
    link.click()
  } else if (action === 'edit') {
    cropperImage.value = activeContextImage.value
    cropperAspect.value = 1 // Simplified
    showCropper.value = true
  } else {
    alert('该功能 (移除物体/提取文字/翻译) 正在开发中 AI...')
  }
}

const startMakingSameStyle = (post) => {
  // Set production store settings based on post (Mock logic for now)
  const mode = post.tag === '罐头' ? 'canned' : (post.tag === '果切' ? 'cut' : 'juice')
  productionStore.setMode(mode)
  productionStore.setFruitCount(3) // Mock count
  router.push({ name: 'production-scheme' })
}

// Crop Confirm (Save edited image locally for demo)
const handleCropConfirm = (newImage) => {
  // In a real app, this would update the post image or save to gallery
  // Here we just download it to simulate "Saving"
  const link = document.createElement('a')
  link.href = newImage
  link.download = 'edited-smart-fruit-image.jpg'
  link.click()
  showCropper.value = false
  alert('图片已编辑并下载！')
}

</script>

<template>
  <div class="min-h-screen bg-cream pb-24 md:pb-8">
    <!-- Header with Filters -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-gray-100 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="p-2 rounded-full hover:bg-gray-100 text-dark-text transition-colors md:hidden">
            <ArrowLeft class="w-6 h-6" />
          </button>
          <div class="flex flex-col">
            <h1 class="text-2xl font-bold font-heading text-dark-text tracking-tight">果汁社区</h1>
            <p class="text-xs text-gray-400">分享你的创意配方，与其他用户交流心得</p>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
        <button 
          v-for="filter in filters" 
          :key="filter"
          @click="activeFilter = filter"
          class="px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap"
          :class="activeFilter === filter ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/30' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'"
        >
          {{ filter }}
        </button>
      </div>
    </header>

    <!-- Post Grid -->
    <div class="max-w-6xl mx-auto px-4 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col h-full border border-gray-50"
        >
          <!-- Image Section with Tag -->
          <div 
             class="relative aspect-[4/3] overflow-hidden cursor-pointer" 
             @click="openDetail(post)"
             @contextmenu.prevent="(e) => handleImageLongPress(e, post.image)"
          >
             <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
             <!-- Tag -->
             <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" :class="post.tagColor">
               {{ post.tag }}
             </div>
             <!-- Tag Overlay for detail -->
             <div class="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="w-3 h-3 rounded-full border-2 border-white"></div>
             </div>
          </div>

          <!-- Content Section -->
          <div class="p-5 flex flex-col flex-1">
             <div class="flex items-center gap-3 mb-3">
               <img :src="post.avatar" class="w-8 h-8 rounded-full object-cover" />
               <span class="text-xs font-bold text-gray-600">{{ post.user }}</span>
             </div>

             <h3 
               class="font-bold text-lg text-dark-text mb-2 leading-tight cursor-pointer hover:text-orange-500 transition-colors"
               @click="openDetail(post)"
             >
               {{ post.title }}
             </h3>
             
             <p class="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
               {{ post.content }}
             </p>

             <div class="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-4 mt-auto">
               <div class="flex items-center gap-1">
                 <Heart class="w-4 h-4" :class="{ 'fill-red-500 text-red-500': post.isLiked }" />
                 {{ post.likes }}
               </div>
               <div class="flex items-center gap-1">
                 <MessageCircle class="w-4 h-4" />
                 {{ post.comments }}
               </div>
             </div>
          </div>
        </div>
      </div>

       <div class="text-center text-gray-300 text-sm mt-12 mb-8 flex items-center justify-center gap-2">
         <div class="w-12 h-[1px] bg-gray-200"></div>
         <span>没有更多内容了</span>
         <div class="w-12 h-[1px] bg-gray-200"></div>
      </div>
    </div>
    
    <!-- Floating Action Button for Create -->
    <button 
      @click="showCreateModal = true"
      class="fixed bottom-24 md:bottom-12 right-6 md:right-12 w-14 h-14 bg-fresh-green-500 rounded-full text-white shadow-lg shadow-fresh-green-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
    >
      <div class="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
      <span class="text-3xl font-light mb-1">+</span>
    </button>

    <!-- Create Post Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showCreateModal = false">
      <div class="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-[2rem] p-6 animate-in slide-in-from-bottom duration-300">
        <div class="flex items-center justify-between mb-4">
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-dark-text">
            <X class="w-6 h-6" />
          </button>
          <span class="font-bold text-lg">发布动态</span>
          <button 
            @click="publishPost"
            :disabled="!newPostContent.trim() && !newPostImage"
            class="text-fresh-green-600 font-bold disabled:opacity-50"
          >
            发布
          </button>
        </div>

        <textarea 
          v-model="newPostContent"
          placeholder="分享你的新鲜事..." 
          class="w-full h-32 bg-transparent text-lg resize-none outline-none placeholder:text-gray-400 mb-4"
        ></textarea>

        <div v-if="newPostImage" class="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
          <img :src="newPostImage" class="w-full h-full object-cover" />
          <button @click="newPostImage = null" class="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-4 border-t border-gray-100 pt-4">
          <button @click="triggerImageUpload" class="flex items-center gap-2 text-fresh-green-600 font-bold bg-fresh-green-50 px-4 py-2 rounded-full">
            <ImageIcon class="w-5 h-5" />
            <span class="text-sm">添加图片</span>
          </button>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>
    </div>

    <!-- Post Detail Overlay -->
    <div v-if="activePostDetail" class="fixed inset-0 z-50 bg-white flex flex-col md:flex-row animate-in slide-in-from-right duration-300">
       <!-- Close Button (Mobile) -->
       <button @click="activePostDetail = null" class="absolute top-4 left-4 z-10 md:hidden bg-black/50 p-2 rounded-full text-white">
         <ArrowLeft class="w-6 h-6" />
       </button>

       <!-- Image Section -->
       <div class="w-full md:w-1/2 bg-black flex items-center justify-center p-4 h-[40vh] md:h-full relative">
          <img :src="activePostDetail.image" class="max-w-full max-h-full object-contain" />
       </div>

       <!-- Content Section -->
       <div class="flex-1 flex flex-col bg-white h-[60vh] md:h-full">
          <!-- Header -->
          <div class="hidden md:flex items-center justify-between p-4 border-b border-gray-100">
             <div class="flex items-center gap-3">
               <img :src="activePostDetail.avatar" class="w-10 h-10 rounded-full object-cover" />
               <h3 class="font-bold text-dark-text">{{ activePostDetail.user }}</h3>
             </div>
             <button @click="activePostDetail = null">
               <X class="w-6 h-6 text-gray-400" />
             </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-6">
             <!-- Post Info -->
             <div>
                <div class="md:hidden flex items-center gap-3 mb-4">
                   <img :src="activePostDetail.avatar" class="w-10 h-10 rounded-full object-cover" />
                   <div>
                     <h3 class="font-bold text-dark-text">{{ activePostDetail.user }}</h3>
                     <p class="text-xs text-gray-400">{{ activePostDetail.time }}</p>
                   </div>
                </div>
                <p class="text-gray-800 leading-relaxed">{{ activePostDetail.content }}</p>
             </div>

             <hr class="border-gray-100" />

             <!-- Comments List (Mock) -->
             <div class="space-y-4">
                <h4 class="font-bold text-sm text-gray-400">评论 ({{ activePostDetail.comments }})</h4>
                <div v-for="i in 3" :key="i" class="flex gap-3">
                   <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                   <div>
                      <p class="text-sm font-bold text-gray-800">用户 {{ i }}</p>
                      <p class="text-sm text-gray-600">看着真不错！我也想试试。</p>
                   </div>
                   <Heart class="w-4 h-4 text-gray-300 ml-auto" />
                </div>
             </div>
          </div>

          <!-- Bottom Actions -->
          <div class="p-4 border-t border-gray-100 bg-white">
             <div class="flex items-center gap-6 mb-4">
                <Heart class="w-7 h-7" :class="activePostDetail.isLiked ? 'text-red-500 fill-current' : 'text-dark-text'" @click="toggleLike(activePostDetail)" />
                <MessageCircle class="w-7 h-7 text-dark-text" />
                <Share2 class="w-7 h-7 text-dark-text ml-auto" />
             </div>
             <div class="text-sm font-bold mb-2">{{ activePostDetail.likes }} 次赞</div>
             <div class="flex gap-3 mb-4">
                <input type="text" placeholder="添加评论..." class="flex-1 text-sm outline-none" />
                <button class="text-fresh-green-600 font-bold text-sm">发布</button>
             </div>
             
             <!-- Make Same Style Button -->
             <button 
               @click="startMakingSameStyle(activePostDetail)"
               class="w-full bg-fresh-green-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-fresh-green-500/20 active:scale-95 transition-transform"
             >
               <Play class="w-5 h-5 fill-current" />
               开始制作同款
             </button>
          </div>
       </div>
    </div>

    <!-- Context Menu -->
    <div 
      v-if="showContextMenu" 
      class="fixed z-[60] bg-gray-900/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl text-white min-w-[160px] animate-in fade-in zoom-in-95 duration-200 origin-top-left"
      :style="{ top: contextMenuPos.y + 'px', left: contextMenuPos.x + 'px' }"
      @click.stop
    >
       <button @click="handleContextAction('save')" class="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-xl transition-colors text-sm text-left">
          <Download class="w-4 h-4" /> 保存图片
       </button>
       <div class="h-[1px] bg-white/10 my-1 mx-2"></div>
       <button @click="handleContextAction('edit')" class="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-xl transition-colors text-sm text-left">
          <Edit class="w-4 h-4" /> 编辑图片
       </button>
       <button @click="handleContextAction('remove')" class="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-xl transition-colors text-sm text-left">
          <Scissors class="w-4 h-4" /> 移除物体
       </button>
       <button @click="handleContextAction('text')" class="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-xl transition-colors text-sm text-left">
          <Type class="w-4 h-4" /> 提取文字
       </button>
       <button @click="handleContextAction('trans')" class="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-xl transition-colors text-sm text-left">
          <Languages class="w-4 h-4" /> 图片翻译
       </button>
    </div>
    <div v-if="showContextMenu" class="fixed inset-0 z-[55] bg-transparent" @click="showContextMenu = false" @touchstart="showContextMenu = false"></div>

    <!-- Image Cropper for Edit Context -->
    <ImageCropper 
      v-if="showCropper" 
      :image-src="cropperImage" 
      :aspect-ratio="cropperAspect"
      @confirm="handleCropConfirm"
      @cancel="showCropper = false"
    />

  </div>
</template>
