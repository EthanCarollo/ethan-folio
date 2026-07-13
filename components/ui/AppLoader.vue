<template>
  <Teleport to="body">
    <Transition name="loader-fade">
      <div
        v-if="visible"
        class="app-loader-overlay"
      >
        <pre
          class="app-loader-grid"
          v-text="grid"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: true,
})

const chars = '▓▒░◆◇○●□■△▲▽▼☆★♦♢♤♧'
const cols = 60
const rows = 24

const grid = computed(() => {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const idx = ((x * 7 + y * 13) ^ (x << 3)) % chars.length
      line += chars[Math.abs(idx)]
    }
    lines.push(line)
  }
  return lines.join('\n')
})
</script>

<style>
.app-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.app-loader-grid {
  color: #0a0a0a;
  line-height: 1;
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  white-space: pre;
  user-select: none;
  pointer-events: none;
  opacity: 0.7;
  animation: app-loader-pulse 1.5s ease-in-out infinite;
}

@keyframes app-loader-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}

.loader-fade-leave-active {
  transition: opacity 0.35s ease-out;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
