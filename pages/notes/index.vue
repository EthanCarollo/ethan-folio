<template>
    <main class="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
        <div class="mx-auto max-w-4xl">
            <NuxtLink :to="localePath('/')" class="text-sm text-link underline underline-offset-2">
                ← {{ $t('common.back') }}
            </NuxtLink>

            <h1 class="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {{ $t('notes.title') }}
            </h1>
            <p class="mt-2 max-w-2xl text-muted-foreground">{{ $t('notes.description') }}</p>

            <div v-if="allTags.length" class="mt-7 flex flex-wrap gap-2">
                <button
                    @click="toggleTag(null)"
                    :aria-pressed="selectedTags.size === 0"
                    :class="[
                        'rounded border px-3 py-1.5 text-sm',
                        selectedTags.size === 0
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                    ]"
                >
                    {{ $t('notes.allTags') }}
                </button>
                <button
                    v-for="tag in allTags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    :aria-pressed="selectedTags.has(tag)"
                    :class="[
                        'rounded border px-3 py-1.5 text-sm',
                        selectedTags.has(tag)
                            ? 'border-link bg-muted text-link'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    ]"
                >
                    {{ tag }}
                </button>
            </div>

            <div v-if="filteredNotes.length" class="mt-8 divide-y divide-border border-y border-border">
                <NuxtLink
                    v-for="note in filteredNotes"
                    :key="note.path"
                    :to="localePath('/notes/' + note.slug)"
                    class="block py-6 text-foreground no-underline hover:bg-muted/50"
                >
                    <time class="text-sm text-muted-foreground">{{ note.date }}</time>
                    <h2 class="mt-1 text-xl font-semibold hover:text-link">{{ note.title }}</h2>
                    <p class="mt-2 max-w-3xl leading-7 text-muted-foreground">{{ note.description }}</p>
                    <p v-if="note.tags?.length" class="mt-3 text-sm text-muted-foreground">
                        {{ note.tags.join(' · ') }}
                    </p>
                </NuxtLink>
            </div>

            <div v-else class="py-14 text-muted-foreground">
                <p>{{ selectedTags.size ? $t('notes.noMatch') : $t('notes.notFound') }}</p>
                <button
                    v-if="selectedTags.size"
                    @click="clearFilters"
                    class="mt-3 text-link underline underline-offset-2"
                >
                    {{ $t('notes.clearFilters') }}
                </button>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const site = useSiteConfig()

useSeoMeta({
    titleTemplate: '%s',
    title: () => `${t('notes.title')} — ${site.name}`,
    description: () => t('notes.description'),
    ogTitle: () => `${t('notes.title')} — ${site.name}`,
    ogDescription: () => t('notes.description'),
})

const notes = ref<any[]>([])
const selectedTags = ref<Set<string>>(new Set())

const loadNotes = async () => {
    const data = await queryCollection('notes')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all()

    notes.value = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const allTags = computed(() => {
    const tags = new Set<string>()
    notes.value.forEach(note => (note.tags || []).forEach((tag: string) => tags.add(tag)))
    return Array.from(tags).sort()
})

const filteredNotes = computed(() => {
    if (!selectedTags.value.size) return notes.value
    return notes.value.filter(note => (note.tags || []).some((tag: string) => selectedTags.value.has(tag)))
})

const toggleTag = (tag: string | null) => {
    if (tag === null) {
        selectedTags.value = new Set()
        return
    }

    const next = new Set(selectedTags.value)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    selectedTags.value = next
}

const clearFilters = () => {
    selectedTags.value = new Set()
}

await loadNotes()
watch(locale, loadNotes)
</script>
