<template>
    <section id="notes" class="py-8 sm:py-10 md:py-12 px-4 font-mono">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-4">
                <div class="text-foreground/60 mb-2">{{ $t('notes.title') }}</div>

                <div class="pt-6">
                    <div v-if="notes && notes.length > 0" class="flex flex-col space-y-0 mb-8">
                        <NuxtLink v-for="(note, index) in notes" :key="note.path"
                            :to="localePath('/notes/' + note.slug)"
                            class="group relative pl-6 py-4 border-l-2 border-foreground/10 hover:border-foreground/40 transition-colors">

                            <!-- Timestamp Marker -->
                            <div
                                class="absolute -left-[5px] top-6 w-2 h-2 rounded-full bg-background border-2 border-foreground/20 group-hover:border-foreground/60 group-hover:bg-foreground/10 transition-all">
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="text-xs text-foreground/40 font-mono">{{ note.date }}</div>
                                <h3
                                    class="text-base font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                                    {{ note.title }}
                                </h3>
                                <p class="text-xs text-foreground/60 line-clamp-1 leading-relaxed max-w-xl">
                                    {{ note.description }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>

                    <div v-else class="text-center py-10 mb-8">
                        <p class="text-foreground/50 font-mono">{{ $t('notes.notFound') }}</p>
                    </div>

                    <div>
                        <NuxtLink :to="localePath('/notes')"
                            class="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors group">
                            <span>{{ $t('notes.viewAll') }}</span>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
const { locale } = useI18n()
const localePath = useLocalePath()

const notes = ref<any[]>([])

const loadLatestNotes = async () => {
    notes.value = await queryCollection('notes')
        .order('date', 'DESC')
        .where('stem', 'LIKE', '%.' + locale.value)
        .limit(3)
        .all()
}

// Initial load (using await in setup is fine with Suspense, but for components better to use onMounted or just reactive load if not critical for hydration wait)
// Actually top-level await is fine in script setup in Nuxt 3 pages/components.
await loadLatestNotes()

watch(locale, () => {
    loadLatestNotes()
})
</script>
