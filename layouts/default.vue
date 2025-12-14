<template>
  <div>
    <div v-if="isIndexPage" class="fixed top-4 left-4 z-50 transition-opacity duration-500"
      :class="hasScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'">
      <h1 class="text-foreground font-bold font-mono text-lg tracking-tight">ETHAN CAROLLO</h1>
    </div>
    <div class="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 text-right">
      <LocaleChip />
    </div>
    <slot />
    <MouseTrail v-if="showMouseTrail" />
  </div>
</template>

<script setup lang="ts">
import MouseTrail from "../components/MouseTrail.vue";
import LocaleChip from "../components/LocaleChip.vue";

// Désactiver le MouseTrail sur les pages projet pour améliorer les performances
// @ts-ignore - useRoute est disponible globalement dans Nuxt
const showMouseTrail = computed(() => {
  // Désactiver sur les pages de projet et leurs sous-pages
  return !useRoute().path.includes('/projects/')
})

const isIndexPage = computed(() => {
  return useRoute().path === '/'
})

const hasScrolled = ref(false)

const handleScroll = () => {
  hasScrolled.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
