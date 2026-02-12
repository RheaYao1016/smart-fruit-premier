<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  X,
  Sparkles,
  Wand2,
  Scissors,
  Stars,
  SlidersHorizontal
} from 'lucide-vue-next'
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
const fineRotation = ref(0)
const baseRotation = ref(0)
const selectedSticker = ref('none')

const stickers = [
  { value: 'none', label: '无', emoji: '' },
  { value: 'spark', label: '星光', emoji: '✨' },
  { value: 'fresh', label: '清新', emoji: '🍃' },
  { value: 'fire', label: '热力', emoji: '🔥' },
  { value: 'heart', label: '喜爱', emoji: '💛' }
]

const aspectMap = {
  free: NaN,
  square: 1,
  r43: 4 / 3,
  r169: 16 / 9
}

const sizeText = computed(() => formatBytes(exportPreview.value?.size || 0))
const exceedThreshold = computed(() => (exportPreview.value?.size || 0) > props.thresholdBytes)
const activeSticker = computed(() => stickers.find((item) => item.value === selectedSticker.value) || stickers[0])

function resetEditorState() {
  exportPreview.value = null
  extraTip.value = ''
  fineRotation.value = 0
  baseRotation.value = 0
  selectedSticker.value = 'none'
}

function destroyCropper() {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

function applyRotation() {
  if (!cropper) return
  cropper.rotateTo(baseRotation.value + fineRotation.value)
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
    scalable: false,
    ready() {
      setAspect(aspect.value)
      applyRotation()
    }
  })
}

function setAspect(next) {
  aspect.value = next
  if (!cropper) return
  cropper.setAspectRatio(aspectMap[next])
}

function rotateLeft() {
  baseRotation.value -= 90
  applyRotation()
}

function rotateRight() {
  baseRotation.value += 90
  applyRotation()
}

function zoomIn() {
  cropper?.zoom(0.1)
}

function zoomOut() {
  cropper?.zoom(-0.1)
}

function reset() {
  cropper?.reset()
  resetEditorState()
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
  resetEditorState()
  await initCropper()
  event.target.value = ''
}

function canvasToBlob(canvas, type, q) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, q)
  })
}

function drawSticker(canvas) {
  const sticker = activeSticker.value
  if (!sticker.emoji) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const padding = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.02))
  const fontSize = Math.max(28, Math.round(Math.min(canvas.width, canvas.height) * 0.12))

  ctx.save()
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.shadowColor = 'rgba(0,0,0,0.28)'
  ctx.shadowBlur = 8
  ctx.fillText(sticker.emoji, canvas.width - padding, padding)
  ctx.restore()
}

async function buildExport() {
  if (!cropper) return null
  const canvas = cropper.getCroppedCanvas({
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
  if (!canvas) return null

  drawSticker(canvas)

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

watch(fineRotation, () => {
  applyRotation()
})

watch(
  () => props.open,
  async (value) => {
    if (value) {
      internalSrc.value = props.src
      resetEditorState()
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
    resetEditorState()
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
          <h3 class="inline-flex items-center gap-2 text-base font-semibold text-stone-800">
            <Sparkles class="h-4 w-4 text-amber-500 animate-pulse-soft" />
            {{ title }}
          </h3>
          <button class="h-9 w-9 rounded-full bg-stone-100 text-stone-700" @click="close">
            <X class="mx-auto h-5 w-5" />
          </button>
        </div>

        <div class="grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 md:grid-cols-[1fr_300px]">
          <div class="rounded-2xl bg-stone-900 p-2">
            <div class="relative h-[40vh] overflow-hidden rounded-xl md:h-[56vh]">
              <div class="pointer-events-none absolute left-3 top-3 z-10 floating-icon">
                <Wand2 class="h-5 w-5 text-amber-200" />
              </div>
              <div class="pointer-events-none absolute bottom-3 left-3 z-10 floating-icon delay-2">
                <Scissors class="h-5 w-5 text-emerald-200" />
              </div>
              <div class="pointer-events-none absolute right-3 top-3 z-10 floating-icon delay-1">
                <Stars class="h-5 w-5 text-sky-200" />
              </div>

              <img ref="imageRef" :src="internalSrc" alt="editor" class="max-h-full max-w-full" />

              <div
                v-if="activeSticker.emoji"
                class="pointer-events-none absolute right-4 top-4 z-10 text-4xl sticker-float"
              >
                {{ activeSticker.emoji }}
              </div>
            </div>
          </div>

          <div class="space-y-3 rounded-2xl bg-stone-50 p-3">
            <div class="rounded-xl border border-stone-200 bg-white p-2">
              <label class="mb-2 inline-flex items-center gap-2 text-xs font-medium text-stone-600">
                <SlidersHorizontal class="h-4 w-4" />
                裁剪比例
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button class="rounded-xl border px-2 py-2 text-xs transition-all" :class="aspect==='free' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200 hover:border-amber-300'" @click="setAspect('free')">自由</button>
                <button class="rounded-xl border px-2 py-2 text-xs transition-all" :class="aspect==='square' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200 hover:border-amber-300'" @click="setAspect('square')">1:1</button>
                <button class="rounded-xl border px-2 py-2 text-xs transition-all" :class="aspect==='r43' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200 hover:border-amber-300'" @click="setAspect('r43')">4:3</button>
                <button class="rounded-xl border px-2 py-2 text-xs transition-all" :class="aspect==='r169' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-stone-200 hover:border-amber-300'" @click="setAspect('r169')">16:9</button>
              </div>
            </div>

            <div class="rounded-xl border border-stone-200 bg-white p-2">
              <label class="mb-2 block text-xs font-medium text-stone-600">旋转与缩放</label>
              <div class="grid grid-cols-5 gap-2">
                <button class="tool-btn" @click="rotateLeft"><RotateCcw class="mx-auto h-4 w-4" /></button>
                <button class="tool-btn" @click="rotateRight"><RotateCw class="mx-auto h-4 w-4" /></button>
                <button class="tool-btn" @click="zoomIn"><ZoomIn class="mx-auto h-4 w-4" /></button>
                <button class="tool-btn" @click="zoomOut"><ZoomOut class="mx-auto h-4 w-4" /></button>
                <button class="tool-btn" @click="reset"><RefreshCw class="mx-auto h-4 w-4" /></button>
              </div>

              <label class="mt-3 block text-xs text-stone-500">微调旋转 {{ fineRotation }}°</label>
              <input v-model="fineRotation" type="range" min="-45" max="45" step="1" class="w-full accent-amber-500" />
            </div>

            <label class="block rounded-xl border border-dashed border-stone-300 bg-white px-3 py-2 text-center text-xs text-stone-600">
              重新选择图片
              <input type="file" accept="image/*" class="hidden" @change="onChooseFile" />
            </label>

            <div class="rounded-xl border border-stone-200 bg-white p-3">
              <label class="mb-2 block text-xs font-medium text-stone-600">动态图标贴纸</label>
              <div class="grid grid-cols-5 gap-1">
                <button
                  v-for="item in stickers"
                  :key="item.value"
                  class="rounded-lg border px-1 py-1.5 text-center text-[10px] transition-all"
                  :class="selectedSticker === item.value ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 hover:border-amber-300 text-stone-600'"
                  @click="selectedSticker = item.value"
                >
                  <div class="text-sm">{{ item.emoji || '○' }}</div>
                  <div>{{ item.label }}</div>
                </button>
              </div>
            </div>

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

              <button class="w-full rounded-xl bg-stone-800 px-3 py-2 text-xs font-medium text-white transition-transform hover:scale-[1.01]" @click="buildExport">
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
              <button class="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.01]" @click="saveAsDataUrl">保存为DataURL</button>
              <button class="rounded-xl border border-amber-500 px-3 py-2 text-xs font-semibold text-amber-600 transition-transform hover:scale-[1.01]" @click="saveAsUrl">使用URL保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.tool-btn {
  border-radius: 0.75rem;
  border: 1px solid rgb(231 229 228);
  padding: 0.5rem;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.tool-btn:hover {
  transform: translateY(-1px);
  border-color: rgb(251 191 36);
  background: rgb(255 251 235);
}

.floating-icon {
  animation: floatUpDown 2.8s ease-in-out infinite;
}

.floating-icon.delay-1 {
  animation-delay: 0.4s;
}

.floating-icon.delay-2 {
  animation-delay: 0.8s;
}

.sticker-float {
  animation: stickerBounce 1.6s ease-in-out infinite;
}

.animate-pulse-soft {
  animation: pulseSoft 1.6s ease-in-out infinite;
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); opacity: 0.85; }
  50% { transform: translateY(-6px); opacity: 1; }
}

@keyframes stickerBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.06); }
}

@keyframes pulseSoft {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
}
</style>
