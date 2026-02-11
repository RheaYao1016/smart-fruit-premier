<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Settings, LogOut, Heart, Clock, ChevronRight, User, ArrowLeft, Camera, Image as ImageIcon, Edit, X } from 'lucide-vue-next'
import ImageCropper from '@/components/ImageCropper.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const currentView = ref('menu') // menu, posts, favorites, history

// User Info from Store
const userName = computed(() => authStore.userProfile.name)
const userBio = computed(() => authStore.userProfile.bio)
const avatarUrl = computed(() => authStore.userProfile.avatar)
const headerUrl = computed(() => authStore.userProfile.header)
const userGender = computed(() => authStore.userProfile.gender)
const userAge = computed(() => authStore.userProfile.age)
const userLocation = computed(() => authStore.userProfile.location)

// Edit Mode
const showEditProfile = ref(false)
const editName = ref('')
const editBio = ref('')
const editGender = ref('')
const editAge = ref('')
const editLocation = ref('')


// Image Cropper State

// Image Cropper State
const showCropper = ref(false)
const cropperImage = ref('')
const cropperType = ref('avatar') // avatar, header
const cropperAspect = ref(1)

const userStats = ref([
  { label: '制作次数', value: 24, icon: Clock },
  { label: '获赞', value: 128, icon: Heart },
  { label: '收藏', value: 15, icon: User },
])

const menuItems = [
  { id: 'posts', label: '我的发布', icon: User, path: '/profile/posts' },
  { id: 'favorites', label: '收藏配方', icon: Heart, path: '/profile/favorites' },
  { id: 'history', label: '制作记录', icon: Clock, path: '/profile/history' },
  { id: 'settings', label: '系统设置', icon: Settings, path: '/settings' },
]

// File Input Refs
const avatarInput = ref(null)
const headerInput = ref(null)

// Actions
const handleNavigation = (itemId) => {
  if (itemId === 'settings') {
    alert('系统设置功能开发中...')
    return
  }
  currentView.value = itemId
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Profile Editing
const openEditProfile = () => {
  editName.value = userName.value
  editBio.value = userBio.value
  editGender.value = userGender.value || '女'
  editAge.value = userAge.value || 25
  editLocation.value = userLocation.value || '上海'
  showEditProfile.value = true
}

const saveProfile = () => {
  authStore.updateProfile({
    name: editName.value,
    bio: editBio.value,
    gender: editGender.value,
    age: editAge.value,
    location: editLocation.value
  })
  showEditProfile.value = false
}

// Image Handling
const triggerAvatarUpload = () => avatarInput.value.click()
const triggerHeaderUpload = () => headerInput.value.click()

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    cropperImage.value = e.target.result
    cropperType.value = type
    cropperAspect.value = type === 'avatar' ? 1 : 16/9
    showCropper.value = true
    
    // Reset input so same file can be selected again
    event.target.value = ''
  }
  reader.readAsDataURL(file)
}

const handleCropConfirm = (newImage) => {
  if (cropperType.value === 'avatar') authStore.updateProfile({ avatar: newImage })
  if (cropperType.value === 'header') authStore.updateProfile({ header: newImage })
  showCropper.value = false
}
</script>

<template>
  <div class="min-h-screen bg-cream pb-24 md:pb-8">
    
    <!-- Main Menu View -->
    <div v-if="currentView === 'menu'">
      <!-- Header Decor (Clickable for upload) -->
      <div class="relative h-56">
         <!-- Header Image -->
         <div class="absolute inset-0 cursor-pointer group" @click="triggerHeaderUpload">
            <img :src="headerUrl" class="w-full h-full object-cover rounded-b-[3rem] brightness-90 group-hover:brightness-75 transition-all" />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-bold">
                <Camera class="w-4 h-4" /> 更换背景
              </span>
            </div>
         </div>
         <input type="file" ref="headerInput" class="hidden" accept="image/*" @change="(e) => handleFileUpload(e, 'header')" />
         
         <!-- Avatar (Absolute positioned) -->
         <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10 cursor-pointer group" @click.stop="triggerAvatarUpload">
           <div class="w-24 h-24 rounded-full border-4 border-cream bg-white p-1 shadow-xl relative overflow-hidden">
             <img :src="avatarUrl" class="w-full h-full rounded-full object-cover" />
             <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera class="w-6 h-6 text-white" />
             </div>
           </div>
           <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="(e) => handleFileUpload(e, 'avatar')" />
         </div>
      </div>

      <!-- User Info -->
      <div class="text-center mt-14 mb-8 relative px-4">
        <h1 class="text-2xl font-heading font-bold text-dark-text">{{ userName }}</h1>
        <p class="text-gray-400 text-sm mt-1">{{ userBio }}</p>
        
        <!-- New Fields Display -->
        <div class="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
           <span class="bg-gray-100 px-2 py-1 rounded-md">{{ userGender }}</span>
           <span class="bg-gray-100 px-2 py-1 rounded-md">{{ userAge }}岁</span>
           <span class="bg-gray-100 px-2 py-1 rounded-md">{{ userLocation }}</span>
        </div>

        <button @click="openEditProfile" class="absolute top-0 right-4 md:right-8 text-gray-400 hover:text-fresh-green-600 p-2">
           <Edit class="w-5 h-5" />
        </button>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-4 mb-8 px-6">
        <div v-for="(stat, index) in userStats" :key="index" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 text-center min-w-[100px]">
          <h3 class="font-bold text-xl text-dark-text">{{ stat.value }}</h3>
          <p class="text-xs text-gray-400 mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Menu -->
      <div class="px-6 space-y-4">
        <div class="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
          <button 
            v-for="item in menuItems" 
            :key="item.id"
            @click="handleNavigation(item.id)"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-fresh-green-50 text-fresh-green-600 flex items-center justify-center group-hover:bg-fresh-green-500 group-hover:text-white transition-colors">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span class="font-medium text-dark-text">{{ item.label }}</span>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <button 
          @click="handleLogout"
          class="w-full py-4 bg-white text-red-500 font-bold rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showEditProfile = false">
      <div class="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-[2rem] p-6 animate-in slide-in-from-bottom duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-xl">编辑个人资料</h3>
          <button @click="showEditProfile = false" class="p-2 hover:bg-gray-100 rounded-full">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">昵称</label>
            <input v-model="editName" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-fresh-green-500 transition-colors" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">性别</label>
                <select v-model="editGender" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-fresh-green-500 transition-colors">
                  <option>男</option>
                  <option>女</option>
                  <option>保密</option>
                </select>
             </div>
             <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">年龄</label>
                 <input v-model="editAge" type="number" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-fresh-green-500 transition-colors" />
             </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">城市</label>
            <input v-model="editLocation" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-fresh-green-500 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">个性签名</label>
             <textarea v-model="editBio" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-fresh-green-500 transition-colors h-24 resize-none"></textarea>
          </div>
          <button @click="saveProfile" class="w-full btn-primary mt-4">
            保存修改
          </button>
        </div>
      </div>
    </div>

    <!-- Image Cropper -->
    <ImageCropper 
      v-if="showCropper" 
      :image-src="cropperImage" 
      :aspect-ratio="cropperAspect"
      @confirm="handleCropConfirm"
      @cancel="showCropper = false"
    />

    <!-- Sub Views (History, Favorites, Posts) -->
    <div v-else class="min-h-screen bg-cream">
      <header class="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-10">
        <button @click="currentView = 'menu'" class="p-2 rounded-full hover:bg-gray-100 text-dark-text transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-bold font-heading text-dark-text">{{ viewTitle }}</h1>
      </header>

      <div class="p-6 space-y-4">
        <!-- History View -->
        <template v-if="currentView === 'history'">
           <div v-for="item in mockHistory" :key="item.id" class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
             <img :src="item.image" class="w-16 h-16 rounded-xl object-cover" />
             <div>
               <h3 class="font-bold text-dark-text">{{ item.name }}</h3>
               <p class="text-xs text-gray-500">{{ item.time }}</p>
             </div>
             <div class="ml-auto text-fresh-green-600 font-bold text-sm">完成</div>
           </div>
        </template>

        <!-- Favorites View -->
        <template v-if="currentView === 'favorites'">
           <div v-for="item in mockFavorites" :key="item.id" class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
             <img :src="item.image" class="w-16 h-16 rounded-xl object-cover" />
             <div>
               <h3 class="font-bold text-dark-text">{{ item.name }}</h3>
               <p class="text-xs text-gray-500">作者: {{ item.author }}</p>
             </div>
             <Heart class="ml-auto w-6 h-6 text-red-500 fill-current" />
           </div>
        </template>

        <!-- Posts View -->
        <template v-if="currentView === 'posts'">
           <div v-for="item in mockPosts" :key="item.id" class="bg-white p-4 rounded-2xl shadow-sm flex gap-4">
             <img :src="item.image" class="w-20 h-20 rounded-xl object-cover" />
             <div class="flex-1">
               <p class="text-sm text-dark-text mb-2 line-clamp-2">{{ item.content }}</p>
               <div class="flex items-center justify-between text-xs text-gray-400">
                 <span>{{ item.time }}</span>
                 <span class="flex items-center gap-1"><Heart class="w-3 h-3" /> {{ item.likes }}</span>
               </div>
             </div>
           </div>
        </template>
      </div>

       <div class="text-center text-gray-400 text-sm mt-8">
          没有更多内容了
       </div>
    </div>

  </div>
</template>
