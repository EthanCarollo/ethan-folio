<template>
    <div>
        <!-- Mode 1: Standard portfolio (default) -->
        <main v-if="currentMode === 'standard'" class="min-h-screen relative">
            <HomeNavigation @switch-to-chat="setMode('chat')" />
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

        <!-- Mode 2: Interactive chat atelier -->
        <PortfolioChat
            v-else
            @switch-to-standard="setMode('standard')"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// The standard portfolio is the default; explicit visitor preferences are restored below.
const currentMode = ref<'chat' | 'standard'>('standard')

const setMode = (mode: 'chat' | 'standard') => {
    currentMode.value = mode
    if (process.client) {
        localStorage.setItem('portfolio_view_mode', mode)
        // Also update query without reloading
        const query = { ...route.query }
        if (mode === 'standard') {
            query.view = 'standard'
        } else {
            delete query.view
        }
        router.replace({ query })
    }
}

onMounted(() => {
    // Check URL query first
    if (route.query.view === 'standard') {
        currentMode.value = 'standard'
    } else if (process.client) {
        const saved = localStorage.getItem('portfolio_view_mode')
        if (saved === 'standard' || saved === 'chat') {
            currentMode.value = saved
        }
    }
})

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
