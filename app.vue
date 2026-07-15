<template>
    <AppLoader :visible="isLoading" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
const isLoading = ref(true)

useHead({
    title: 'Ethan Carollo - Polymorphic Developer',
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Ethan Carollo, a polymorphic developer skilled in web and mobile applications, video games, and continuous delivery cycles.' },
        { name: 'keywords', content: 'Ethan Carollo, developer, web applications, mobile applications, video games, continuous delivery, Kotlin, Python, Nuxt, Unity' },
        { name: 'author', content: 'Ethan Carollo' }
    ]
})

// Hide loader once fonts are loaded AND Nuxt hydration is done
onMounted(async () => {
    // Wait for fonts (Space Mono from Google Fonts)
    if (document.fonts?.ready) {
        await document.fonts.ready
    }
    // Small delay to let the browser paint the loader before hiding
    await new Promise(r => setTimeout(r, 100))
    isLoading.value = false
})

// Show loader during page transitions
const router = useRouter()
router.beforeEach(() => {
    isLoading.value = true
})
router.afterEach(() => {
    // Let the new page render before hiding
    nextTick(() => {
        isLoading.value = false
    })
})
</script>
