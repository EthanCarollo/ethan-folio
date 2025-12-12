<template>
  <div>
    <div class="fixed top-4 right-4 z-50">
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
</script>
