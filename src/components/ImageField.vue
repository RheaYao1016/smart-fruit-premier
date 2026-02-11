<script setup>
import { computed, ref } from 'vue'
import { ImagePlus, PencilLine, Link } from 'lucide-vue-next'
import ImageEditor from '@/components/ImageEditor.vue'
import { estimateDataUrlBytes, formatBytes, normalizeImageValue } from '@/utils/image'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '图片' },
  aspectHint: { type: String, default: '推荐 1:1' }
})

const emit = defineEmits(['update:modelValue'])

const editorOpen = ref(false)
const editorSrc = ref('')
const urlInput = ref('')
const tip = ref('')

const preview = computed(() => normalizeImageValue(props.modelValue))
const bytes = computed(() => estimateDataUrlBytes(preview.value))

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onChooseFile(event) {
  const [file] = event.target.files || []
  if (!file) return
  editorSrc.value = await readFile(file)
  editorOpen.value = true
  event.target.value = ''
}

function onEditorSave(payload) {
  emit('update:modelValue', payload.image)
  if (payload.strategy === 'dataUrl') {
    tip.value = `已保存为 DataURL（${formatBytes(payload.size)}）`
  } else {
    tip.value = '已保存为网络链接'
  }
}

function applyUrl() {
  const value = String(urlInput.value || '').trim()
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    tip.value = '请输入有效图片链接'
    return
  }
  emit('update:modelValue', value)
  tip.value = '已更新为网络图片'
}

function openEdit() {
  if (!preview.value) return
  editorSrc.value = preview.value
  editorOpen.value = true
}
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-3">
    <div class="mb-2 flex items-center justify-between">
      <label class="text-sm font-medium text-stone-700">{{ label }}</label>
      <span class="text-xs text-stone-400">{{ aspectHint }}</span>
    </div>

    <div class="flex gap-3">
      <div class="h-20 w-20 overflow-hidden rounded-xl bg-stone-100">
        <img v-if="preview" :src="preview" class="h-full w-full object-cover" />
        <div v-else class="flex h-full w-full items-center justify-center text-xs text-stone-400">无图</div>
      </div>

      <div class="flex-1 space-y-2">
        <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-3 py-2 text-xs text-stone-600">
          <ImagePlus class="h-4 w-4" /> 选择并编辑
          <input type="file" accept="image/*" class="hidden" @change="onChooseFile" />
        </label>

        <button
          class="flex w-full items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-600 disabled:opacity-40"
          :disabled="!preview"
          @click="openEdit"
        >
          <PencilLine class="h-4 w-4" /> 编辑或替换
        </button>
      </div>
    </div>

    <div class="mt-3 flex gap-2">
      <input
        v-model="urlInput"
        type="url"
        placeholder="或粘贴网络图片链接"
        class="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-xs"
      />
      <button class="rounded-xl border border-amber-500 px-3 py-2 text-xs font-semibold text-amber-600" @click="applyUrl">
        <Link class="mx-auto h-4 w-4" />
      </button>
    </div>

    <p class="mt-2 text-xs text-stone-500">
      {{ tip || (preview.startsWith('data:image') ? `当前本地存储体积约 ${formatBytes(bytes)}` : '当前使用网络链接存储') }}
    </p>

    <ImageEditor v-model:open="editorOpen" :src="editorSrc" :title="`${label}编辑`" @save="onEditorSave" />
  </div>
</template>
