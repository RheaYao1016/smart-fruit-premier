<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import ImageEditor from '@/components/ImageEditor.vue'

const router = useRouter()
const communityStore = useCommunityStore()
const authStore = useAuthStore()

const form = ref({
  title: '',
  content: '',
  tags: ['果汁'],
  recipeMode: 'juice',
  recipeFruits: '',
  recipeWaterMl: 100,
  recipeSugarG: 10,
  recipeTemp: '冷饮'
})

const images = ref([])
const customTag = ref('')
const withRecipe = ref(true)
const previewOpen = ref(false)
const error = ref('')

const editorOpen = ref(false)
const editorSrc = ref('')
const editingIndex = ref(-1)
const replaceIndex = ref(-1)
const replaceInputRef = ref(null)

const tagOptions = ['果汁', '罐头', '果切', '健康', '家庭', '创意']

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function addImages(event) {
  const files = Array.from(event.target.files || [])
  for (const file of files) {
    if (images.value.length >= 9) break
    const dataUrl = await readFile(file)
    images.value.push(dataUrl)
  }

  if (images.value.length) {
    editingIndex.value = images.value.length - 1
    editorSrc.value = images.value[editingIndex.value]
    editorOpen.value = true
  }

  event.target.value = ''
}

function toggleTag(tag) {
  if (form.value.tags.includes(tag)) {
    form.value.tags = form.value.tags.filter((item) => item !== tag)
  } else {
    form.value.tags.push(tag)
  }
}

function addCustomTag() {
  const tag = customTag.value.trim()
  if (!tag) return
  if (!form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  customTag.value = ''
}

function editImage(index) {
  editingIndex.value = index
  editorSrc.value = images.value[index]
  editorOpen.value = true
}

function triggerReplace(index) {
  replaceIndex.value = index
  replaceInputRef.value?.click()
}

async function onReplaceFile(event) {
  const [file] = event.target.files || []
  if (!file) return
  const dataUrl = await readFile(file)
  editingIndex.value = replaceIndex.value
  editorSrc.value = dataUrl
  editorOpen.value = true
  event.target.value = ''
}

function removeImage(index) {
  images.value.splice(index, 1)
}

function onEditorSave(payload) {
  if (editingIndex.value >= 0) {
    images.value[editingIndex.value] = payload.image
  }
}

function publish() {
  error.value = ''
  if (!form.value.title.trim() || !form.value.content.trim()) {
    error.value = '标题和正文必填'
    return
  }

  const recipe = withRecipe.value
    ? {
        mode: form.value.recipeMode,
        fruits: form.value.recipeFruits,
        waterMl: Number(form.value.recipeWaterMl),
        sugarG: Number(form.value.recipeSugarG),
        temp: form.value.recipeTemp
      }
    : null

  const result = communityStore.createPost({
    title: form.value.title,
    content: form.value.content,
    tags: form.value.tags,
    images: images.value,
    recipe
  }, authStore.currentUser)

  if (!result.success) {
    error.value = result.message
    return
  }

  router.replace(`/community/${result.data.id}`)
}
</script>

<template>
  <div class="space-y-4">
    <section class="card p-4">
      <h2 class="text-lg font-semibold">发布帖子</h2>
      <p class="mt-1 text-xs text-stone-500">支持 1~9 张图片，每张可编辑和替换。</p>
    </section>

    <section class="card space-y-3 p-4">
      <input v-model="form.title" type="text" placeholder="标题" class="w-full rounded-xl border border-stone-200 px-3 py-2" />
      <textarea v-model="form.content" rows="4" placeholder="正文" class="w-full rounded-xl border border-stone-200 px-3 py-2"></textarea>

      <div>
        <p class="mb-2 text-xs text-stone-500">标签</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in tagOptions"
            :key="item"
            class="rounded-full px-3 py-1 text-xs"
            :class="form.tags.includes(item) ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'"
            @click="toggleTag(item)"
          >
            {{ item }}
          </button>
        </div>
        <div class="mt-2 flex gap-2">
          <input v-model="customTag" type="text" placeholder="自定义标签" class="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-xs" />
          <button class="rounded-xl border border-amber-500 px-3 py-2 text-xs text-amber-600" @click="addCustomTag">添加</button>
        </div>
      </div>
    </section>

    <section class="card space-y-3 p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">配方字段（可选）</p>
        <label class="text-xs text-stone-600"><input v-model="withRecipe" type="checkbox" class="mr-1" />启用</label>
      </div>

      <div v-if="withRecipe" class="grid grid-cols-2 gap-2">
        <select v-model="form.recipeMode" class="rounded-xl border border-stone-200 px-3 py-2">
          <option value="juice">果汁</option>
          <option value="canned">罐头</option>
          <option value="cut">果切</option>
        </select>
        <input v-model="form.recipeTemp" type="text" placeholder="温度" class="rounded-xl border border-stone-200 px-3 py-2" />
        <input v-model="form.recipeFruits" type="text" placeholder="水果结构化描述" class="col-span-2 rounded-xl border border-stone-200 px-3 py-2" />
        <input v-model="form.recipeWaterMl" type="number" placeholder="注水 ml" class="rounded-xl border border-stone-200 px-3 py-2" />
        <input v-model="form.recipeSugarG" type="number" placeholder="糖量 g" class="rounded-xl border border-stone-200 px-3 py-2" />
      </div>
    </section>

    <section class="card space-y-3 p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">配图（{{ images.length }}/9）</p>
        <label class="rounded-xl border border-dashed border-stone-300 px-3 py-2 text-xs text-stone-600">
          添加图片
          <input type="file" multiple accept="image/*" class="hidden" @change="addImages" />
        </label>
      </div>

      <div v-if="images.length" class="grid grid-cols-3 gap-2">
        <div v-for="(img, index) in images" :key="index" class="relative overflow-hidden rounded-xl border border-stone-200">
          <img :src="img" class="h-24 w-full object-cover" />
          <div class="absolute inset-x-0 bottom-0 grid grid-cols-3 bg-black/50 text-[10px] text-white">
            <button class="py-1" @click="editImage(index)">编辑</button>
            <button class="py-1" @click="triggerReplace(index)">替换</button>
            <button class="py-1" @click="removeImage(index)">删除</button>
          </div>
        </div>
      </div>

      <button class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" @click="previewOpen = true">发帖预览</button>
    </section>

    <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500">{{ error }}</p>

    <div class="grid grid-cols-2 gap-2">
      <button class="rounded-xl border border-stone-300 px-4 py-3" @click="router.push('/community')">取消</button>
      <button class="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white" @click="publish">发布</button>
    </div>

    <input ref="replaceInputRef" type="file" accept="image/*" class="hidden" @change="onReplaceFile" />

    <ImageEditor v-model:open="editorOpen" :src="editorSrc" title="编辑帖子图片" @save="onEditorSave" />

    <div v-if="previewOpen" class="fixed inset-0 z-[65] bg-black/50 p-3" @click.self="previewOpen = false">
      <div class="mx-auto max-h-full max-w-xl overflow-y-auto rounded-3xl bg-white p-4">
        <h3 class="text-lg font-semibold">发帖预览</h3>
        <p class="mt-2 text-base font-semibold">{{ form.title || '（未填写标题）' }}</p>
        <p class="mt-1 text-sm text-stone-600">{{ form.content || '（未填写正文）' }}</p>
        <div class="mt-2 flex flex-wrap gap-1">
          <span v-for="t in form.tags" :key="t" class="rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">#{{ t }}</span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <img v-for="(img, idx) in images" :key="idx" :src="img" class="h-32 w-full rounded-xl object-cover" />
        </div>
        <button class="mt-4 w-full rounded-xl border border-stone-300 px-4 py-2.5" @click="previewOpen = false">关闭预览</button>
      </div>
    </div>
  </div>
</template>
