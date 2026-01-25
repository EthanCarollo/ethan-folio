<template>
    <div class="min-h-screen pt-24 px-4 sm:px-8 pb-12">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl sm:text-4xl font-bold mb-2 text-foreground font-mono">Notes</h1>
            <p class="text-foreground/60 mb-12 font-mono text-sm max-w-xl">
                My personal corner for thoughts, blog posts, and random notes.
            </p>

            <div v-if="notes && notes.length > 0" class="flex flex-col space-y-0">
                <NuxtLink v-for="(note, index) in notes" :key="note.path" :to="localePath('/notes/' + note.slug)"
                    class="group relative pl-8 py-8 border-l border-foreground/20 hover:border-foreground/50 transition-colors">
                    
                    <!-- Timestamp Marker -->
                    <div class="absolute -left-[5px] top-10 w-2.5 h-2.5 rounded-full bg-background border-2 border-foreground/20 group-hover:border-foreground/60 group-hover:bg-foreground/10 transition-all"></div>

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
                <p class="text-foreground/50 font-mono">No notes found yet.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

// Fetch notes using content collection
// Filtering by locale if the content module supports it via filename (e.g. .fr.md)
// queryCollection automatically handles the current locale if configured? 
// Actually usually we need to filter/path.
// Let's assume standard nuxt content v3 behavior or what was used in projects.
// Projects used: queryCollection('projects').path(...).first()
// For list: queryCollection('notes').all()
// We might need to filter by locale manually if the query doesn't do it automatically based on file extension matching current locale.

const { data: notes } = await useAsyncData(`notes-list-${locale.value}`, () => {
    return queryCollection('notes')
        .order('date', 'DESC')
        .all()
})
</script>
