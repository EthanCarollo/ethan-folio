<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
    title: () => t('seo.title'),
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: () => t('seo.description') },
        { name: 'author', content: 'Ethan Carollo' }
    ]
})
</script>
