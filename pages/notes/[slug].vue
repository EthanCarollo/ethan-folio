<template>
    <div class="min-h-screen">
        <ContentTableOfContents />

        <main class="px-4 py-10 sm:px-6 sm:py-14 lg:ml-64">
            <article v-if="note" class="mx-auto max-w-4xl">
                <header class="border-b border-border pb-6">
                    <time class="text-sm text-muted-foreground">{{ note.date }}</time>
                    <h1 class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {{ note.title }}
                    </h1>
                    <div v-if="note.tags?.length" class="mt-4 flex flex-wrap gap-2">
                        <span
                            v-for="tag in note.tags"
                            :key="tag"
                            class="rounded border border-border px-2 py-1 text-sm text-muted-foreground"
                        >
                            {{ tag }}
                        </span>
                    </div>
                </header>

                <ContentRenderer :value="note" class="prose mx-auto mt-8 max-w-3xl" />

                <nav class="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm">
                    <NuxtLink :to="localePath('/')" class="text-link underline underline-offset-2">
                        {{ t('notes.backToHome') }}
                    </NuxtLink>
                    <NuxtLink :to="localePath('/notes')" class="text-link underline underline-offset-2">
                        {{ t('notes.backToNotes') }}
                    </NuxtLink>
                </nav>
            </article>

            <p v-else class="mx-auto max-w-4xl py-14 text-muted-foreground">Note not found.</p>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const { data: note, refresh } = await useAsyncData(`note-${route.params.slug}-${locale.value}`, () => {
    return queryCollection('notes').path(`/notes/${route.params.slug}.${locale.value}`).first()
}, {
    watch: [locale]
})

watch(locale, async (newLocale, oldLocale) => {
    if (newLocale !== oldLocale) await refresh()
})

useSeoMeta({
    title: () => note.value?.title,
    description: () => note.value?.description,
})
</script>
