<template>
  <div>
    <div class="fixed top-4 right-4 z-50">
      <LanguageSwitcher />
    </div>
    <slot />
    <MouseTrail v-if="showMouseTrail" />
  </div>
</template>

<script setup lang="ts">
import MouseTrail from "../components/MouseTrail.vue";
import LanguageSwitcher from "../components/LanguageSwitcher.vue";

// Désactiver le MouseTrail sur les pages projet pour améliorer les performances
const route = useRoute()
const showMouseTrail = computed(() => {
  // Désactiver sur les pages de projet et leurs sous-pages
  return !route.path.includes('/projects/')
})
</script>
