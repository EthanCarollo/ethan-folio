<template>
    <figure class="my-6">
        <video
            :src="src"
            :poster="poster"
            :autoplay="autoplay"
            :muted="forceMute || autoplay"
            controls
            playsinline
            preload="metadata"
            class="block max-h-[70vh] w-full rounded border border-border bg-black"
        >
            <p>Your browser does not support the video element.</p>
        </video>
        <figcaption v-if="title" class="mt-2 text-sm text-muted-foreground">
            {{ title }}
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    src: string
    poster?: string
    title?: string
    autoplay?: boolean
    forceMute?: boolean
}>(), {
    autoplay: false,
    forceMute: false
})
</script>
