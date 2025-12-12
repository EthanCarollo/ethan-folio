<template>
  <div>
    <slot />
    <MouseTrail v-if="showMouseTrail" />
  </div>
</template>

<script setup lang="ts">
import MouseTrail from "../components/MouseTrail.vue";

// Désactiver le MouseTrail sur les pages projet pour améliorer les performances
const route = useRoute()
const showMouseTrail = computed(() => {
  // Désactiver sur les pages de projet et leurs sous-pages
  return !route.path.includes('/projects/')
})
</script>
