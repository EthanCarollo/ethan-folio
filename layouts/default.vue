<template>
    <div class="relative min-h-screen">
        <slot />
    </div>
    <!-- Conteneur pour le LocaleChip avec z-index élevé et promotion GPU -->
    <div class="fixed top-4 right-4 md:top-12 md:right-12 z-[9999] pointer-events-none"
        style="transform: translateZ(1000px);">
        <div class="pointer-events-auto">
            <LocaleChip />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()

const showMouseTrail = computed(() => {
    return !route.path.includes('/projects/')
})

const isIndexPage = computed(() => {
    return route.path === '/'
})
</script>
