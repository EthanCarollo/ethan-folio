<template>
    <div class="min-h-screen pt-24 px-4 sm:px-8 pb-12">
        <div class="max-w-3xl xl:max-w-5xl mx-auto">
            <div class="mb-8">
                <NuxtLink :to="localePath('/')"
                    class="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors font-mono">
                    ← {{ $t('common.back') }}
                </NuxtLink>
            </div>

            <h1 class="text-3xl sm:text-4xl font-bold mb-2 text-foreground font-mono">{{ $t('notes.title') }}</h1>
            <p class="text-foreground/60 mb-8 font-mono text-sm max-w-xl">
                {{ $t('notes.description') }}
            </p>

            <!-- Tag Filter Chips -->
            <div v-if="allTags.length > 0" class="flex flex-wrap gap-2 mb-10">
                <button
                    @click="toggleTag(null)"
                    :class="[
                        'px-3 py-1.5 rounded-full text-xs font-mono border transition-all',
                        selectedTags.size === 0
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-transparent text-foreground/50 border-foreground/20 hover:border-foreground/40 hover:text-foreground/80'
                    ]"
                >
                    {{ $t('notes.allTags') }}
                </button>
                <button
                    v-for="tag in allTags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    :class="[
                        'px-3 py-1.5 rounded-full text-xs font-mono border transition-all',
                        selectedTags.has(tag)
                            ? 'bg-foreground/10 text-foreground border-foreground/50'
                            : 'bg-transparent text-foreground/40 border-foreground/10 hover:border-foreground/30 hover:text-foreground/60'
                    ]"
                >
                    {{ tag }}
                </button>
            </div>

            <div v-if="filteredNotes.length > 0" class="flex flex-col space-y-0">
                <NuxtLink v-for="(note, index) in filteredNotes" :key="note.path" :to="localePath('/notes/' + note.slug)"
                    class="group relative pl-8 py-8 border-l border-foreground/20 hover:border-foreground/50 transition-colors">

                    <!-- Timestamp Marker -->
                    <div
                        class="absolute -left-[5px] top-10 w-2.5 h-2.5 rounded-full bg-background border-2 border-foreground/20 group-hover:border-foreground/60 group-hover:bg-foreground/10 transition-all">
                    </div>

                    <div class="flex flex-col gap-2">
                        <div class="text-xs text-foreground/40 font-mono">{{ note.date }}</div>
                        <h2 class="text-xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                            {{ note.title }}
                        </h2>
                        <p class="text-sm text-foreground/60 line-clamp-2 leading-relaxed max-w-xl">
                            {{ note.description }}
                        </p>
                        <div class="mt-2 flex gap-2 flex-wrap">
                            <span v-for="tag in note.tags" :key="tag"
                                class="text-[10px] uppercase tracking-wider text-foreground/40 group-hover:text-foreground/60">
                                #{{ tag }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-else class="text-center py-20">
                <p class="text-foreground/50 font-mono text-sm">
                    {{ selectedTags.size > 0 ? $t('notes.noMatch') : $t('notes.notFound') }}
                </p>
                <button
                    v-if="selectedTags.size > 0"
                    @click="selectedTags.clear()"
                    class="mt-4 text-xs font-mono text-foreground/40 hover:text-foreground/70 transition-colors underline underline-offset-4"
                >
                    {{ $t('notes.clearFilters') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
const { locale } = useI18n()
const localePath = useLocalePath()

const notes = ref<any[]>([])
const selectedTags = ref<Set<string>>(new Set())

const loadNotes = async () => {
    const data = await queryCollection('notes')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all()

    notes.value = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Collect all unique tags across all notes
const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach(note => {
        (note.tags || []).forEach((tag: string) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
})

// Filter notes by selected tags (OR logic: show note if it has ANY of the selected tags)
const filteredNotes = computed(() => {
    if (selectedTags.value.size === 0) return notes.value
    return notes.value.filter(note =>
        (note.tags || []).some((tag: string) => selectedTags.value.has(tag))
    )
})

const toggleTag = (tag: string | null) => {
    if (tag === null) {
        selectedTags.value = new Set()
        return
    }
    const next = new Set(selectedTags.value)
    if (next.has(tag)) {
        next.delete(tag)
    } else {
        next.add(tag)
    }
    selectedTags.value = next
}

// Initial load
await loadNotes()

// Watch for locale changes to refresh content
watch(locale, () => {
    loadNotes()
})
</script>
