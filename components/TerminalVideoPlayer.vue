<template>
  <div class="terminal-video-player my-6">
    <div class="terminal-header">
      <div class="terminal-title">{{ title || 'video-player.mp4' }}</div>
    </div>
    
    <div class="video-container">
      <video
        ref="videoPlayer"
        :src="src"
        :poster="poster"
        class="video-element"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
      >
        <p class="text-foreground/60 p-4">Your browser does not support the video tag.</p>
      </video>
      
      <div class="video-controls">
        <div class="controls-row">
          <button 
            @click="togglePlay" 
            class="control-btn play-btn"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
          >
            <span v-if="!isPlaying">▶</span>
            <span v-else>⏸</span>
          </button>
          
          <div class="time-display">
            <span class="time-current">{{ formatTime(currentTime) }}</span>
            <span class="time-separator">/</span>
            <span class="time-total">{{ formatTime(duration) }}</span>
          </div>
          
          <div class="progress-container" @click="seek">
            <div class="progress-bar">
              <div class="progress-filled" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>
          
          <button 
            v-if="!props.forceMute && !isMuted"
            @click="toggleMute" 
            class="control-btn volume-btn"
            aria-label="Mute"
          >
            <span v-if="volume > 0.5">🔊</span>
            <span v-else>🔉</span>
          </button>
          
          <button 
            v-else-if="!props.forceMute"
            @click="toggleMute" 
            class="control-btn volume-btn"
            aria-label="Unmute"
          >
            🔇
          </button>
          
          <input
            v-if="!props.forceMute && !isMuted"
            v-model="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="volume-slider"
            @input="onVolumeChange"
          />
          
          <button 
            @click="toggleFullscreen" 
            class="control-btn fullscreen-btn"
            aria-label="Toggle fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
    
    <div class="terminal-status-bar">
      <span class="status-text">{{ statusText }}</span>
      <span class="status-indicator" :class="{ active: isPlaying }"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  src: string
  poster?: string
  title?: string
  autoplay?: boolean
  forceMute?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  forceMute: false
})

const videoPlayer = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const statusText = ref('Ready')

const progressPercentage = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const onLoadedMetadata = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration
  }
}

const onTimeUpdate = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime
  }
}

const onPlay = () => {
  isPlaying.value = true
  statusText.value = 'Playing'
}

const onPause = () => {
  isPlaying.value = false
  statusText.value = 'Paused'
}

const onEnded = () => {
  isPlaying.value = false
  statusText.value = 'Finished'
}

const togglePlay = () => {
  if (!videoPlayer.value) return
  
  if (isPlaying.value) {
    videoPlayer.value.pause()
  } else {
    videoPlayer.value.play()
  }
}

const toggleMute = () => {
  if (!videoPlayer.value || props.forceMute) return
  
  videoPlayer.value.muted = !videoPlayer.value.muted
  isMuted.value = videoPlayer.value.muted
}

const onVolumeChange = () => {
  if (!videoPlayer.value || props.forceMute) return
  
  videoPlayer.value.volume = volume.value
  if (volume.value === 0) {
    videoPlayer.value.muted = true
    isMuted.value = true
  }
}

const seek = (event: MouseEvent) => {
  if (!videoPlayer.value) return
  
  const progressContainer = event.currentTarget as HTMLElement
  const rect = progressContainer.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  
  videoPlayer.value.currentTime = percentage * duration.value
}

const toggleFullscreen = () => {
  if (!videoPlayer.value) return
  
  if (!document.fullscreenElement) {
    videoPlayer.value.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  if (videoPlayer.value) {
    // Forcer le mode muet si forceMute est activé
    if (props.forceMute) {
      videoPlayer.value.muted = true
      isMuted.value = true
    }
    
    if (props.autoplay) {
      videoPlayer.value.play()
    }
    
    // Si pas de poster spécifié, capturer la première frame comme thumbnail
    if (!props.poster && !props.forceMute) {
      videoPlayer.value.addEventListener('loadeddata', () => {
        // Créer un canvas pour capturer la première frame
        const canvas = document.createElement('canvas')
        canvas.width = videoPlayer.value!.videoWidth
        canvas.height = videoPlayer.value!.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(videoPlayer.value!, 0, 0, canvas.width, canvas.height)
          const dataURL = canvas.toDataURL('image/jpeg')
          // Utiliser la capture comme poster
          videoPlayer.value!.setAttribute('poster', dataURL)
        }
      })
    }
  }
})
</script>

<style scoped>
.terminal-video-player {
  @apply border border-foreground/30 rounded-lg overflow-hidden bg-background;
  font-family: 'Space Mono', monospace;
}

.terminal-header {
  @apply bg-foreground/10 border-b border-foreground/20 px-3 py-2;
}

.terminal-title {
  @apply text-foreground/70 text-sm text-center;
}

.video-container {
  @apply relative bg-black;
}

.video-element {
  @apply w-full h-auto block;
  max-height: 70vh;
}

.video-controls {
  @apply bg-foreground/10 border-t border-foreground/20 p-3;
}

.controls-row {
  @apply flex items-center gap-3;
}

.control-btn {
  @apply bg-foreground/20 hover:bg-foreground/30 text-foreground border border-foreground/30 rounded px-3 py-1 transition-colors;
  @apply flex items-center justify-center min-w-[32px] h-8;
}

.control-btn:hover {
  @apply bg-foreground/30;
}

.time-display {
  @apply text-foreground/80 text-sm font-mono flex items-center gap-1;
}

.time-separator {
  @apply text-foreground/60 mx-1;
}

.progress-container {
  @apply flex-1 cursor-pointer;
}

.progress-bar {
  @apply bg-foreground/20 h-2 rounded-full overflow-hidden;
}

.progress-filled {
  @apply bg-foreground h-full transition-all duration-100;
}

.volume-slider {
  @apply w-20 h-2 bg-foreground/20 rounded-full appearance-none cursor-pointer;
}

.volume-slider::-webkit-slider-thumb {
  @apply w-3 h-3 bg-foreground rounded-full appearance-none cursor-pointer;
}

.volume-slider::-moz-range-thumb {
  @apply w-3 h-3 bg-foreground rounded-full cursor-pointer border-0;
}

.terminal-status-bar {
  @apply bg-foreground/5 border-t border-foreground/20 px-3 py-1 flex items-center justify-between text-xs text-foreground/60;
}

.status-indicator {
  @apply w-2 h-2 rounded-full bg-foreground/40;
}

.status-indicator.active {
  @apply bg-green-500 animate-pulse;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .controls-row {
    @apply flex-wrap gap-2;
  }
  
  .time-display {
    @apply order-first w-full justify-center mb-2;
  }
  
  .progress-container {
    @apply order-last w-full mt-2;
  }
}
</style>
