<template>
    <main class="min-h-screen">
        <HomeNavigation />
        <Hero />
        <hr class="border-t border-foreground/10 mx-auto max-w-6xl" />
        <About />
        <hr class="border-t border-foreground/10 mx-auto max-w-6xl" />
        <Projects />
        <hr class="border-t border-foreground/10 mx-auto max-w-6xl" />
        <LatestNotes />
        <hr class="border-t border-foreground/10 mx-auto max-w-6xl" />
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
    ogType: 'website',
    ogTitle: () => t('seo.title'),
    ogDescription: () => t('seo.description'),
    ogImage: 'https://ethan-folio.fr/images/ethan-carollo-open-graph.png',
    twitterCard: 'summary_large_image',
    twitterImage: 'https://ethan-folio.fr/images/ethan-carollo-open-graph.png',
})
</script>