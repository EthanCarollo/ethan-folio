<template>
  <div class="terminal-image-player my-6">
    <div class="terminal-header">
      <div class="terminal-title">{{ title || 'image-viewer.png' }}</div>
    </div>
    
    <div class="image-container">
      <img
        :src="src"
        :alt="title || 'Image'"
        class="image-element"
        loading="lazy"
        @click="toggleFullscreen"
      />
    </div>
    
    <div class="terminal-status-bar">
      <span class="status-text">Image Viewer Mode</span>
      <span class="status-indicator active"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  title?: string
}

const props = defineProps<Props>()

const toggleFullscreen = () => {
  const img = document.querySelector(`img[src="${props.src}"]`) as HTMLImageElement
  if (img) {
    if (img.requestFullscreen) {
      img.requestFullscreen()
    }
  }
}
</script>

<style scoped>
.terminal-image-player {
  @apply border border-foreground/30 rounded-lg overflow-hidden bg-background;
  font-family: 'Space Mono', monospace;
}

.terminal-header {
  @apply bg-foreground/10 border-b border-foreground/20 px-3 py-2;
}

.terminal-title {
  @apply text-foreground/70 text-sm text-center;
}

.image-container {
  @apply relative bg-black cursor-pointer;
}

.image-element {
  @apply w-full h-auto block;
  max-height: 70vh;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.image-element:hover {
  @apply transform scale-105;
}

.terminal-status-bar {
  @apply bg-foreground/5 border-t border-foreground/20 px-3 py-1 flex items-center justify-between text-xs text-foreground/60;
}

.status-indicator {
  @apply w-2 h-2 rounded-full bg-green-500 animate-pulse;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .image-element {
    max-height: 50vh;
  }
}
</style>
