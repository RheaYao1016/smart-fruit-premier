<template>
  <div class="min-h-[calc(100vh-160px)] md:min-h-screen">
    <!-- Mobile Header Override -->
    <div class="md:hidden flex items-center justify-between px-6 py-4 mb-4">
      <button @click="$router.push('/')" class="text-dark-text font-bold text-sm">
        取消
      </button>
      <h1 class="text-lg font-bold text-dark-text">制作流程</h1>
      <div class="w-8"></div> <!-- Spacer -->
    </div>

    <!-- Desktop Header (kept but simplified) -->
    <div class="hidden md:flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-fresh-green-600">智能制作流程</h1>
      <button @click="$router.push('/')" class="text-gray-400 hover:text-dark-text transition-colors">退出</button>
    </div>

    <!-- Content Area -->
    <div class="bg-white md:bg-white/80 md:backdrop-blur-xl rounded-t-[2rem] md:rounded-3xl p-6 md:p-8 shadow-none md:shadow-xl md:border border-gray-100 min-h-[600px] relative transition-all">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
