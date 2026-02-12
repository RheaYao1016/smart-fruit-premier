<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTopBar from '@/components/AppTopBar.vue'
import BottomTabBar from '@/components/BottomTabBar.vue'

const route = useRoute()
const showShell = computed(() => !route.meta.hideShell)
</script>

<template>
  <div class="min-h-screen bg-app-bg text-stone-800">
    <AppTopBar v-if="showShell" />

    <main
      class="mx-auto w-full max-w-[430px]"
      :class="showShell ? 'px-3 pb-28 pt-3' : ''"
    >
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <BottomTabBar v-if="showShell" />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
