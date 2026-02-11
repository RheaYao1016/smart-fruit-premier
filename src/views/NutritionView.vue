<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNutritionStore } from '@/stores/nutrition'
import { useAuthStore } from '@/stores/auth'
import ImageField from '@/components/ImageField.vue'

const router = useRouter()
const nutritionStore = useNutritionStore()
const authStore = useAuthStore()

const search = ref('')
const showEditor = ref(false)
const editingId = ref('')

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

const isAdmin = computed(() => authStore.role === 'admin')

const list = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return nutritionStore.sortedItems.filter((item) => {
    if (!keyword) return true
    return [item.title, item.summary, item.detail].join(' ').toLowerCase().includes(keyword)
  })
})

function openCreate() {
  editingId.value = ''
  form.value = {
    title: '',
    summary: '',
    cover: '',
    detail: '',
    fruits: '',
    waterMl: 0,
    sugarG: 0,
    temperature: ''
  }
  showEditor.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = {
    title: item.title,
    summary: item.summary,
    cover: item.cover,
    detail: item.detail,
    fruits: item.recipe.fruits,
    waterMl: item.recipe.waterMl,
    sugarG: item.recipe.sugarG,
    temperature: item.recipe.temperature
  }
  showEditor.value = true
}

function save() {
  const payload = {
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
  }

  if (editingId.value) {
    nutritionStore.updateItem(editingId.value, payload)
  } else {
    nutritionStore.createItem(payload)
  }
  showEditor.value = false
}

function remove(id) {
  nutritionStore.deleteItem(id)
}
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <input
        v-model="search"
        type="text"
        placeholder="搜索标题/内容"
        class="w-full rounded-xl border border-stone-200 px-3 py-2.5"
      />
      <button v-if="isAdmin" class="mt-3 w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white" @click="openCreate">
        新增科普内容
      </button>
    </section>

    <section class="grid grid-cols-1 gap-3">
      <article v-for="item in list" :key="item.id" class="card overflow-hidden">
        <img :src="item.cover" class="h-40 w-full object-cover" />
        <div class="space-y-2 p-4">
          <h3 class="text-base font-semibold">{{ item.title }}</h3>
          <p class="line-clamp-2 text-sm text-stone-600">{{ item.summary }}</p>
          <div class="flex gap-2">
            <button class="rounded-xl border border-stone-300 px-3 py-2 text-xs" @click="router.push(`/nutrition/${item.id}`)">查看详情</button>
            <button v-if="isAdmin" class="rounded-xl border border-amber-400 px-3 py-2 text-xs text-amber-600" @click="openEdit(item)">编辑</button>
            <button v-if="isAdmin" class="rounded-xl border border-red-300 px-3 py-2 text-xs text-red-500" @click="remove(item.id)">删除</button>
          </div>
        </div>
      </article>
    </section>

    <div v-if="showEditor" class="fixed inset-0 z-[65] bg-black/50 p-3" @click.self="showEditor = false">
      <div class="mx-auto max-h-full max-w-xl space-y-3 overflow-y-auto rounded-3xl bg-white p-4">
        <h3 class="text-lg font-semibold">{{ editingId ? '编辑科普' : '新增科普' }}</h3>
        <input v-model="form.title" type="text" placeholder="标题" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
        <input v-model="form.summary" type="text" placeholder="简介" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
        <ImageField v-model="form.cover" label="封面图" aspect-hint="建议 16:9" />
        <textarea v-model="form.detail" rows="4" placeholder="详情介绍" class="w-full rounded-xl border border-stone-200 px-3 py-2"></textarea>

        <div class="grid grid-cols-2 gap-2">
          <input v-model="form.fruits" type="text" placeholder="水果配比" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.temperature" type="text" placeholder="饮用温度" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.waterMl" type="number" placeholder="注水量 ml" class="rounded-xl border border-stone-200 px-3 py-2" />
          <input v-model="form.sugarG" type="number" placeholder="糖量 g" class="rounded-xl border border-stone-200 px-3 py-2" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button class="rounded-xl border border-stone-300 px-4 py-2.5" @click="showEditor = false">取消</button>
          <button class="rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-white" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
