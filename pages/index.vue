<template>
    <main class="min-h-screen">
        <HomeNavigation />
        <Hero />
        <hr class="border-t border-white/10 mx-auto max-w-6xl" />
        <About />
        <hr class="border-t border-white/10 mx-auto max-w-6xl" />
        <Projects />
        <hr class="border-t border-white/10 mx-auto max-w-6xl" />
        <LatestNotes />
        <hr class="border-t border-white/10 mx-auto max-w-6xl" />
        <Contact />
    </main>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
    titleTemplate: '%s' // Prevent appending "| Site Name"
})

useSeoMeta({
    title: () => t('seo.title'),
    description: () => t('seo.description'),
    ogTitle: () => t('seo.title'),
    ogDescription: () => t('seo.description'),
    twitterCard: 'summary_large_image',
})
</script>