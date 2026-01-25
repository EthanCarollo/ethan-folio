<template>
    <div>
        <slot />
        <div class="fixed top-4 right-4 z-[999999] flex flex-col items-end gap-2 text-right">
            toto
            <LocaleChip />
        </div>
    </div>
</template>

<script setup lang="ts">
const showMouseTrail = computed(() => {
    return !useRoute().path.includes('/projects/')
})

const isIndexPage = computed(() => {
    return useRoute().path === '/'
})
</script>
