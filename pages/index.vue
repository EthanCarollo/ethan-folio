<template>
    <main class="min-h-screen">
        <HomeNavigation />
        <Hero />
        <About />
        <Projects />
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