<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNutritionStore } from '@/stores/nutrition'
import { useAuthStore } from '@/stores/auth'
import ImageField from '@/components/ImageField.vue'

const route = useRoute()
const router = useRouter()
const nutritionStore = useNutritionStore()
const authStore = useAuthStore()

const item = computed(() => nutritionStore.getById(String(route.params.id)))
const isAdmin = computed(() => authStore.role === 'admin')
const editing = ref(false)

const form = ref({
  title: '',
  summary: '',
  cover: '',
  detail: '',
  fruits: '',
  waterMl: 0,
  sugarG: 0,
  temperature: ''
})

function startEdit() {
  if (!item.value) return
  form.value = {
    title: item.value.title,
    summary: item.value.summary,
    cover: item.value.cover,
    detail: item.value.detail,
    fruits: item.value.recipe.fruits,
    waterMl: item.value.recipe.waterMl,
    sugarG: item.value.recipe.sugarG,
    temperature: item.value.recipe.temperature
  }
  editing.value = true
}

function save() {
  nutritionStore.updateItem(item.value.id, {
    title: form.value.title,
    summary: form.value.summary,
    cover: form.value.cover,
    detail: form.value.detail,
    recipe: {
      fruits: form.value.fruits,
      waterMl: Number(form.value.waterMl),
      sugarG: Number(form.value.sugarG),
      temperature: form.value.temperature
    }
  })
  editing.value = false
}

function remove() {
  if (!item.value) return
  nutritionStore.deleteItem(item.value.id)
  router.push('/nutrition')
}
</script>

<template>
  <div v-if="item" class="space-y-4">
    <section class="card overflow-hidden">
      <img :src="item.cover" class="h-52 w-full object-cover" />
      <div class="space-y-2 p-4">
        <h1 class="text-xl font-semibold">{{ item.title }}</h1>
        <p class="text-sm text-stone-600">{{ item.summary }}</p>
      </div>
    </section>

    <section class="card p-4">
      <h2 class="font-semibold">配比参数</h2>
      <ul class="mt-2 space-y-1 text-sm text-stone-600">
        <li>水果数量：{{ item.recipe.fruits }}</li>
        <li>注水量：{{ item.recipe.waterMl }} ml</li>
        <li>糖量：{{ item.recipe.sugarG }} g</li>
        <li>饮用温度：{{ item.recipe.temperature }}</li>
      </ul>
    </section>

    <section class="card p-4">
      <h2 class="font-semibold">详情</h2>
      <p class="mt-2 text-sm leading-6 text-stone-600">{{ item.detail }}</p>
    </section>

    <section v-if="isAdmin" class="card p-4">
      <h3 class="font-semibold">管理员操作</h3>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button class="rounded-xl border border-amber-400 px-3 py-2 text-sm text-amber-600" @click="startEdit">编辑</button>
        <button class="rounded-xl border border-red-300 px-3 py-2 text-sm text-red-500" @click="remove">删除</button>
      </div>
    </section>

    <div v-if="editing" class="fixed inset-0 z-[65] bg-black/50 p-3" @click.self="editing = false">
      <div class="mx-auto max-h-full max-w-xl space-y-3 overflow-y-auto rounded-3xl bg-white p-4">
        <h3 class="text-lg font-semibold">编辑科普内容</h3>
        <input v-model="form.title" type="text" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
        <input v-model="form.summary" type="text" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
        <ImageField v-model="form.cover" label="封面图" aspect-hint="建议 16:9" />
        <textarea v-model="form.detail" rows="4" class="w-full rounded-xl border border-stone-200 px-3 py-2"></textarea>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="form.fruits" type="text" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.temperature" type="text" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.waterMl" type="number" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.sugarG" type="number" class="rounded-xl border border-stone-200 px-3 py-2" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button class="rounded-xl border border-stone-300 px-4 py-2.5" @click="editing = false">取消</button>
          <button class="rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-white" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card p-4 text-sm text-stone-500">内容不存在</div>
</template>
