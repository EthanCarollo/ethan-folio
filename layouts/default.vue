<template>
    <div class="relative min-h-screen">
        <slot />
    </div>
    <!-- Conteneur pour le LocaleChip avec z-index élevé et promotion GPU -->
    <div
        v-if="!isChatPage"
        class="fixed z-[100] pointer-events-none transition-all duration-500 ease-in-out"
        :class="(hasScrolled || shouldDisableAnimation) ? 'top-4 right-4 md:top-4 md:right-4' : 'top-4 right-4 md:top-12 md:right-12'"
        style="transform: translateZ(1000px);">
        <div class="pointer-events-auto flex items-center gap-3">
            <NuxtLink
                :to="localePath('/chat')"
                class="rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors"
                :class="(hasScrolled || shouldDisableAnimation) ? 'border-border bg-background text-foreground hover:bg-muted' : 'border-white/20 bg-black text-white hover:bg-white/10'"
            >
                /chat
            </NuxtLink>
            <LocaleChip :is-scrolled="hasScrolled || shouldDisableAnimation" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()
const localePath = useLocalePath()

const shouldDisableAnimation = computed(() => {
    return route.path.includes('/projects/') || route.path.includes('/notes/')
})

const isChatPage = computed(() => {
    const path = route.path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/'
    return /^\/chat\/?$/.test(path)
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
