<template>
    <PortfolioChat />
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
    title: () => `${t('viewMode.chat')} — ${t('seo.title')}`,
    description: () => t('seo.description'),
    robots: 'noindex, nofollow',
})
</script>
