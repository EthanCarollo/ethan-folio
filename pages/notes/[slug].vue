<template>
    <div class="min-h-screen flex flex-col items-center pt-24 pb-20 px-4 sm:px-8">
        <article class="max-w-2xl w-full" v-if="note">
            <header class="mb-10 text-center">
                <div class="text-xs text-foreground/50 font-mono mb-4">{{ note.date }}</div>
                <h1 class="text-3xl sm:text-4xl font-bold text-foreground mb-6">{{ note.title }}</h1>
                <div class="flex flex-wrap justify-center gap-2 mb-8">
                    <span v-for="tag in note.tags" :key="tag"
                        class="text-xs px-2 py-1 bg-foreground/5 text-foreground/60 rounded-full font-mono">
                        {{ tag }}
                    </span>
                </div>
                <hr class="border-foreground/10 w-24 mx-auto" />
            </header>

            <ContentRenderer :value="note" class="prose prose-invert max-w-none w-full" />

            <div class="mt-16 pt-8 border-t border-foreground/10 flex justify-center">
                <NuxtLink to="/notes"
                    class="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors">
                    ← Back to Notes
                </NuxtLink>
            </div>
        </article>

        <div v-else class="py-20 text-center text-foreground/60 font-mono">
            Note not found.
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { data: note } = await useAsyncData(`note-${route.params.slug}`, () => {
    return queryCollection('notes').path(`/notes/${route.params.slug}.${locale.value}`).first()
})

useSeoMeta({
    title: () => note.value?.title,
    description: () => note.value?.description,
})
</script>
