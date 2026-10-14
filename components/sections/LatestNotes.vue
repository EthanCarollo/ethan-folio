<template>
    <section id="notes" class="border-b border-border px-4 py-14 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-6xl">
            <h2 class="section-title">{{ $t('notes.title') }}</h2>
            <p class="mt-2 max-w-2xl text-muted-foreground">{{ $t('notes.description') }}</p>

            <div v-if="notes.length" class="mt-5 divide-y divide-border">
                <NuxtLink
                    v-for="note in notes"
                    :key="note.path"
                    :to="localePath('/notes/' + note.slug)"
                    class="block py-5 text-foreground no-underline hover:bg-muted/50"
                >
                    <time class="text-sm text-muted-foreground">{{ note.date }}</time>
                    <h3 class="mt-1 text-lg font-semibold hover:text-link">{{ note.title }}</h3>
                    <p class="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{{ note.description }}</p>
                </NuxtLink>
            </div>

            <p v-else class="mt-6 text-muted-foreground">{{ $t('notes.notFound') }}</p>

            <NuxtLink :to="localePath('/notes')" class="mt-6 inline-block font-medium text-link underline underline-offset-2">
                {{ $t('notes.viewAll') }}
            </NuxtLink>
        </div>
    </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const notes = ref<any[]>([])

const loadLatestNotes = async () => {
    const data = await queryCollection('notes')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all()

    notes.value = data
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
}

await loadLatestNotes()
watch(locale, loadLatestNotes)
</script>
