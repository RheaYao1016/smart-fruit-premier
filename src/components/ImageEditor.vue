<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, RefreshCw, X } from 'lucide-vue-next'
import { DEFAULT_IMAGE_THRESHOLD, estimateDataUrlBytes, formatBytes } from '@/utils/image'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  title: { type: String, default: '图片编辑' },
  thresholdBytes: { type: Number, default: DEFAULT_IMAGE_THRESHOLD }
})

const emit = defineEmits(['update:open', 'save'])

const imageRef = ref(null)
let cropper = null

const internalSrc = ref('')
const exportFormat = ref('image/webp')
const quality = ref(0.9)
const useCompression = ref(false)
const aspect = ref('free')
const exportPreview = ref(null)
const urlFallback = ref('')
const extraTip = ref('')

const aspectMap = {
  free: NaN,
  square: 1,
  r43: 4 / 3,
  r169: 16 / 9
}

const sizeText = computed(() => formatBytes(exportPreview.value?.size || 0))
const exceedThreshold = computed(() => (exportPreview.value?.size || 0) > props.thresholdBytes)

function destroyCropper() {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

async function initCropper() {
  await nextTick()
  destroyCropper()
  if (!imageRef.value || !internalSrc.value) return

  cropper = new Cropper(imageRef.value, {
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.9,
    responsive: true,
    background: false,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: false
  })
}

function setAspect(next) {
  aspect.value = next
  if (!cropper) return
  cropper.setAspectRatio(aspectMap[next])
}

function rotateLeft() {
  cropper?.rotate(-90)
}

function rotateRight() {
  cropper?.rotate(90)
}

function zoomIn() {
  cropper?.zoom(0.1)
}

function zoomOut() {
  cropper?.zoom(-0.1)
}

function reset() {
  cropper?.reset()
}

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
  internalSrc.value = await readFile(file)
  exportPreview.value = null
  extraTip.value = ''
  await initCropper()
  event.target.value = ''
}

function canvasToBlob(canvas, type, q) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, q)
  })
}

async function buildExport() {
  if (!cropper) return null
  const canvas = cropper.getCroppedCanvas({
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
  if (!canvas) return null

  const finalQuality = useCompression.value ? Number(quality.value) : 1
  const blob = await canvasToBlob(canvas, exportFormat.value, finalQuality)
  if (!blob) return null

  const dataUrl = await readFile(blob)
  exportPreview.value = {
    dataUrl,
    size: blob.size,
    format: exportFormat.value,
    quality: finalQuality
  }

  if (blob.size > props.thresholdBytes) {
    extraTip.value = `当前导出约 ${formatBytes(blob.size)}，已超过建议阈值 ${formatBytes(props.thresholdBytes)}。可继续保存，或改用网络链接。`
  } else {
    extraTip.value = '导出完成，可直接保存。'
  }

  return exportPreview.value
}

async function saveAsDataUrl() {
  const payload = exportPreview.value || await buildExport()
  if (!payload) return
  emit('save', {
    image: payload.dataUrl,
    size: payload.size,
    format: payload.format,
    quality: payload.quality,
    exceedThreshold: payload.size > props.thresholdBytes,
    strategy: 'dataUrl'
  })
  emit('update:open', false)
}

function saveAsUrl() {
  const url = String(urlFallback.value || '').trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    extraTip.value = '请输入有效的 http/https 图片链接'
    return
  }
  emit('save', {
    image: url,
    size: estimateDataUrlBytes(url),
    format: 'url',
    quality: 1,
    exceedThreshold: false,
    strategy: 'url'
  })
  emit('update:open', false)
}

function close() {
  emit('update:open', false)
}

watch(
  () => props.open,
  async (value) => {
    if (value) {
      internalSrc.value = props.src
      exportPreview.value = null
      extraTip.value = ''
      await initCropper()
      return
    }
    destroyCropper()
  }
)

watch(
  () => props.src,
  async (value) => {
    internalSrc.value = value
    exportPreview.value = null
    extraTip.value = ''
    if (props.open) await initCropper()
  }
)

onBeforeUnmount(() => destroyCropper())
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[70] bg-black/60 p-3">
      <div class="mx-auto flex h-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white">
        <div class="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <h3 class="text-base font-semibold text-stone-800">{{ title }}</h3>
          <button class="h-9 w-9 rounded-full bg-stone-100 text-stone-700" @click="close">
            <X class="mx-auto h-5 w-5" />
          </button>
        </div>

        <div class="grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 md:grid-cols-[1fr_280px]">
          <div class="rounded-2xl bg-stone-900 p-2">
            <div class="relative h-[40vh] overflow-hidden rounded-xl md:h-[56vh]">
              <img ref="imageRef" :src="internalSrc" alt="editor" class="max-h-full max-w-full" />
            </div>
          </div>

          <div class="space-y-3 rounded-2xl bg-stone-50 p-3">
            <div class="space-y-2">
              <label class="text-xs font-medium text-stone-500">裁剪比例</label>
              <div class="grid grid-cols-2 gap-2">
                <button class="rounded-xl border px-2 py-2 text-xs" :class="aspect==='free' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200'" @click="setAspect('free')">自由</button>
                <button class="rounded-xl border px-2 py-2 text-xs" :class="aspect==='square' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200'" @click="setAspect('square')">1:1</button>
                <button class="rounded-xl border px-2 py-2 text-xs" :class="aspect==='r43' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200'" @click="setAspect('r43')">4:3</button>
                <button class="rounded-xl border px-2 py-2 text-xs" :class="aspect==='r169' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200'" @click="setAspect('r169')">16:9</button>
              </div>
            </div>

            <div class="grid grid-cols-5 gap-2">
              <button class="rounded-xl border border-stone-200 p-2" @click="rotateLeft"><RotateCcw class="mx-auto h-4 w-4" /></button>
              <button class="rounded-xl border border-stone-200 p-2" @click="rotateRight"><RotateCw class="mx-auto h-4 w-4" /></button>
              <button class="rounded-xl border border-stone-200 p-2" @click="zoomIn"><ZoomIn class="mx-auto h-4 w-4" /></button>
              <button class="rounded-xl border border-stone-200 p-2" @click="zoomOut"><ZoomOut class="mx-auto h-4 w-4" /></button>
              <button class="rounded-xl border border-stone-200 p-2" @click="reset"><RefreshCw class="mx-auto h-4 w-4" /></button>
            </div>

            <label class="block rounded-xl border border-dashed border-stone-300 bg-white px-3 py-2 text-center text-xs text-stone-600">
              重新选择图片
              <input type="file" accept="image/*" class="hidden" @change="onChooseFile" />
            </label>

            <div class="space-y-2 rounded-xl bg-white p-3">
              <div class="flex items-center justify-between text-xs">
                <span>导出格式</span>
                <select v-model="exportFormat" class="rounded-lg border border-stone-200 px-2 py-1 text-xs">
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </div>

              <label class="flex items-center justify-between text-xs">
                <span>推荐压缩</span>
                <input v-model="useCompression" type="checkbox" class="h-4 w-4 accent-amber-500" />
              </label>

              <label class="block text-xs">质量 {{ Math.round(quality * 100) }}%</label>
              <input v-model="quality" type="range" min="0.4" max="1" step="0.05" class="w-full accent-amber-500" />

              <button class="w-full rounded-xl bg-stone-800 px-3 py-2 text-xs font-medium text-white" @click="buildExport">
                导出预览
              </button>

              <div v-if="exportPreview" class="rounded-lg bg-stone-50 p-2 text-xs text-stone-600">
                导出大小：{{ sizeText }}
                <span v-if="exceedThreshold" class="mt-1 block text-amber-600">超过 2MB 建议值，建议改用 URL 保存。</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs text-stone-500">网络链接保存（可选）</label>
              <input
                v-model="urlFallback"
                type="url"
                class="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                placeholder="https://example.com/your-image.jpg"
              />
            </div>

            <p class="text-xs text-stone-500">{{ extraTip || '默认不限制图片大小。为移动端体验，建议按需开启压缩。' }}</p>

            <div class="grid grid-cols-2 gap-2">
              <button class="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white" @click="saveAsDataUrl">保存为DataURL</button>
              <button class="rounded-xl border border-amber-500 px-3 py-2 text-xs font-semibold text-amber-600" @click="saveAsUrl">使用URL保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
