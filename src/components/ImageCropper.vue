<script setup>
import { ref, onMounted, watch } from 'vue'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-vue-next'

const props = defineProps({
  imageSrc: String,
  aspectRatio: {
    type: Number,
    default: 1 // 1:1 square by default
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const canvasRef = ref(null)
const containerRef = ref(null)
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const lastPos = ref({ x: 0, y: 0 })

// Reset on new image
watch(() => props.imageSrc, () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
})

const startDrag = (e) => {
  isDragging.value = true
  lastPos.value = { 
    x: e.touches ? e.touches[0].clientX : e.clientX, 
    y: e.touches ? e.touches[0].clientY : e.clientY 
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault() // Prevent scrolling on touch
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - lastPos.value.x
  const deltaY = clientY - lastPos.value.y

  position.value = {
    x: position.value.x + deltaX,
    y: position.value.y + deltaY
  }

  lastPos.value = { x: clientX, y: clientY }
}

const stopDrag = () => {
  isDragging.value = false
}


const crop = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    // 1. Calculate the geometry
    // The container is the viewport
    const containerRect = containerRef.value.getBoundingClientRect()
    
    // The crop box dimensions (calculated based on CSS logic: 80% w or 60% h)
    let cropBoxWidth, cropBoxHeight
    if (props.aspectRatio >= 1) {
       cropBoxWidth = containerRect.width * 0.8
       cropBoxHeight = cropBoxWidth / props.aspectRatio
    } else {
       cropBoxHeight = containerRect.height * 0.6
       cropBoxWidth = cropBoxHeight * props.aspectRatio
    }

    // The image's current rendered dimensions and position
    // We need to account for the "object-contain" base sizing + transform
    // But since we use transform exclusively for movement/scale, it's easier to map relative to center.
    
    // Scale factor between natural image size and current rendered scaled size
    // First, determine base rendered size (before zoom) due to object-contain 
    const imgAspect = img.naturalWidth / img.naturalHeight
    const containerAspect = containerRect.width / containerRect.height
    
    let baseRenderedWidth, baseRenderedHeight
    if (imgAspect > containerAspect) {
        baseRenderedWidth = containerRect.width
        baseRenderedHeight = containerRect.width / imgAspect
    } else {
        baseRenderedHeight = containerRect.height
        baseRenderedWidth = containerRect.height * imgAspect
    }

    // Apply current user scale
    const currentRenderedWidth = baseRenderedWidth * scale.value
    const currentRenderedHeight = baseRenderedHeight * scale.value

    // Calculate Image Center relative to Container Center
    // position.x/y are offsets from center
    const imgCenterX = (containerRect.width / 2) + position.value.x
    const imgCenterY = (containerRect.height / 2) + position.value.y

    // Calculate Top-Left of the Image relative to Container Top-Left
    const imgLeft = imgCenterX - (currentRenderedWidth / 2)
    const imgTop = imgCenterY - (currentRenderedHeight / 2)

    // Calculate Crop Box Top-Left relative to Container Top-Left
    const cropBoxLeft = (containerRect.width - cropBoxWidth) / 2
    const cropBoxTop = (containerRect.height - cropBoxHeight) / 2

    // Now, map Crop Box corners to Image Coordinate Space (0 to 1)
    // Relative x in rendered image = (cropBoxLeft - imgLeft)
    const relativeX = cropBoxLeft - imgLeft
    const relativeY = cropBoxTop - imgTop

    // Scale to Natural Image Coordinates
    // Ratio = natural / currentRendered
    const ratio = img.naturalWidth / currentRenderedWidth
    
    const sourceX = relativeX * ratio
    const sourceY = relativeY * ratio
    const sourceWidth = cropBoxWidth * ratio
    const sourceHeight = cropBoxHeight * ratio

    // 2. Setup Canvas
    canvas.width = cropBoxWidth // Output size matches screen pixels for quality (or could be 2x)
    canvas.height = cropBoxHeight
    
    // 3. Draw
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight, // Source rect
      0, 0, canvas.width, canvas.height // Dest rect
    )

    // 4. Export
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    emit('confirm', dataUrl) 
  }
  img.src = props.imageSrc
}


</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
      
      <!-- Toolbar -->
      <div class="p-4 flex justify-between items-center text-white">
        <button @click="$emit('cancel')" class="p-2 hover:bg-white/10 rounded-full">
          <X class="w-6 h-6" />
        </button>
        <span class="font-bold">调整图片</span>
        <button @click="crop" class="p-2 hover:bg-green-500/20 text-green-400 rounded-full">
          <Check class="w-6 h-6" />
        </button>
      </div>

      <!-- Editor Area -->
      <div 
        ref="containerRef"
        class="flex-1 bg-black relative overflow-hidden touch-none"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="stopDrag"
      >
        <!-- Image Layer -->
        <div 
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
           <img 
            :src="imageSrc" 
            :style="{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              maxWidth: 'none',
              maxHeight: 'none'
            }"
            class="h-full object-contain opacity-80"
          />
        </div>

        <!-- Crop Overlay / Mask -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div 
             class="border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
             :style="{
               aspectRatio: aspectRatio,
               width: aspectRatio >= 1 ? '80%' : 'auto',
               height: aspectRatio < 1 ? '60%' : 'auto'
             }"
           ></div>
        </div>
        
        <!-- Grid Lines (Decorative) -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
           <div 
             class="border border-white/50 w-[80%] aspect-square grid grid-cols-3 grid-rows-3"
             v-if="aspectRatio === 1"
           >
              <div class="border-r border-b border-white/50"></div>
              <div class="border-r border-b border-white/50"></div>
              <div class="border-b border-white/50"></div>
              <div class="border-r border-b border-white/50"></div>
              <div class="border-r border-b border-white/50"></div>
              <div class="border-b border-white/50"></div>
              <div class="border-r border-white/50"></div>
              <div class="border-r border-white/50"></div>
              <div></div>
           </div>
        </div>

      </div>

      <!-- Controls -->
      <div class="p-6 bg-gray-800 space-y-4">
         <div class="flex items-center gap-4 text-white">
           <ZoomOut class="w-5 h-5 text-gray-400" />
           <input 
             type="range" 
             v-model="scale" 
             min="0.5" 
             max="3" 
             step="0.1" 
             class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-fresh-green-500"
           />
           <ZoomIn class="w-5 h-5 text-gray-400" />
         </div>
      </div>

    </div>
  </div>
</template>
