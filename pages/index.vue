<template>
    <main>
        <Hero />
        <About />
        <Projects />
        <LatestNotes />
        <Contact />
    </main>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
    titleTemplate: '%s'
})

useSeoMeta({
    title: () => t('seo.title'),
    description: () => t('seo.description'),
    ogType: 'website',
    ogTitle: () => t('seo.title'),
    ogDescription: () => t('seo.description'),
    ogImage: 'https://ethan-folio.fr/images/ethan-carollo-open-graph.png',
    twitterCard: 'summary_large_image',
    twitterImage: 'https://ethan-folio.fr/images/ethan-carollo-open-graph.png',
})
</script>
