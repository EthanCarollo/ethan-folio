<template>
    <figure class="my-6">
        <img
            :src="src"
            :alt="title || ''"
            loading="lazy"
            decoding="async"
            class="mx-auto max-h-[70vh] w-auto max-w-full rounded border border-border"
        />
        <figcaption v-if="title" class="mt-2 text-center text-sm text-muted-foreground">
            {{ title }}
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
defineProps<{
    src: string
    title?: string
}>()
</script>
