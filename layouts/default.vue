<template>
    <div class="min-h-screen bg-background text-foreground">
        <HomeNavigation v-if="!isChatPage" />
        <slot />
    </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isChatPage = computed(() => {
    const path = route.path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/'
    return path === '/chat'
})
</script>
