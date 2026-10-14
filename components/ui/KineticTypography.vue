<template>
  <div class="relative w-full max-w-2xl mx-auto text-center font-mono py-8 select-none">
    <!-- Main Interactive Display Name -->
    <div
      ref="containerEl"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      class="group relative inline-block cursor-crosshair py-2"
    >
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white transition-transform duration-200">
        <span
          v-for="(char, idx) in currentTitle"
          :key="idx"
          class="inline-block transition-all duration-300 transform group-hover:text-cyan-300"
          :style="getCharStyle(idx)"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </h1>

      <!-- Glitch / Wireframe Aura behind on hover -->
      <div
        class="absolute -inset-2 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />
    </div>

    <!-- Interactive Subtitle Switcher (Cycles roles on click) -->
    <div class="mt-4 flex items-center justify-center gap-2">
      <button
        @click="cycleRole"
        class="px-3 py-1.5 rounded-full border border-white/15 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-950/20 text-xs text-white/80 transition-all flex items-center gap-2 cursor-pointer group"
        title="Cliquez pour changer de rôle"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="tracking-widest uppercase font-mono">{{ activeRole }}</span>
        <span class="text-white/30 text-[10px] group-hover:translate-x-0.5 transition-transform">↺</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  texts?: string[]
}>()

const { t } = useI18n()

const roles = computed(() => {
  return [
    t('hero.role1'),
    t('hero.role2'),
    t('hero.role3')
  ]
})

const roleIndex = ref(0)
const activeRole = computed(() => roles.value[roleIndex.value] || roles.value[0])

const cycleRole = () => {
  roleIndex.value = (roleIndex.value + 1) % roles.value.length
}

// Interactive typographic wave / mouse distortion effect
const mouseX = ref(0.5)
const mouseY = ref(0.5)
const isHovering = ref(false)
const containerEl = ref<HTMLElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (!containerEl.value) return
  const rect = containerEl.value.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width
  mouseY.value = (e.clientY - rect.top) / rect.height
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
  mouseX.value = 0.5
  mouseY.value = 0.5
}

const currentTitle = "ETHAN CAROLLO"

const getCharStyle = (idx: number) => {
  if (!isHovering.value) {
    return {}
  }
  const charPos = idx / currentTitle.length
  const dist = Math.abs(charPos - mouseX.value)
  const offset = Math.sin(dist * Math.PI * 2) * (1 - Math.min(dist, 1)) * 6
  return {
    transform: `translateY(${offset}px)`
  }
}

// Auto cycle roles every 6s if user doesn't click
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    cycleRole()
  }, 6000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
