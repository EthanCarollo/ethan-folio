<template>
    <div class="relative min-h-screen">
        <slot />
    </div>
    <!-- Conteneur pour le LocaleChip avec z-index élevé et promotion GPU -->
    <div class="fixed z-[9999] pointer-events-none transition-all duration-500 ease-in-out"
        :class="hasScrolled ? 'top-4 right-4 md:top-4 md:right-4' : 'top-4 right-4 md:top-12 md:right-12'"
        style="transform: translateZ(1000px);">
        <div class="pointer-events-auto">
            <LocaleChip :is-scrolled="hasScrolled" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()

const showMouseTrail = computed(() => {
    return !route.path.includes('/projects/')
})

const isIndexPage = computed(() => {
    return route.path === '/'
})

// Scroll detection logic
const hasScrolled = ref(false)

const handleScroll = () => {
    // Threshold can be adjusted, using window.innerHeight (Hero height) as trigger point
    // or a smaller value if they want it to happen sooner. 
    // User said "au fur et à mesure que je scrolle", implies gradual or after a point.
    // Using 50px buffer to start transition early or full height?
    // HomeNavigation uses window.scrollY > window.innerHeight. Let's match that context or slightly earlier?
    // "quand on a scrollé toute la page" -> likely full viewport height (Hero).
    hasScrolled.value = window.scrollY > (window.innerHeight - 100)
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
