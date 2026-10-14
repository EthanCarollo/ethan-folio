<template>
    <section id="projects" class="border-b border-border px-4 py-14 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-6xl">
            <h2 class="section-title">{{ $t('projects.title') }}</h2>
            <p class="mt-2 max-w-2xl text-muted-foreground">{{ $t('projects.description') }}</p>

            <div class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <NuxtLink
                    v-for="project in allProjects"
                    :key="project.slug"
                    :to="localePath('/projects/' + project.slug)"
                    class="group overflow-hidden rounded border border-border bg-background text-foreground no-underline hover:border-link"
                >
                    <img
                        v-if="project.image"
                        :src="project.image"
                        :alt="`${project.title} preview`"
                        class="aspect-video w-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    <div class="p-5">
                        <h3 class="text-lg font-semibold group-hover:text-link">{{ project.title }}</h3>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ project.category }}<span class="mx-2">·</span>{{ formatDate(project.date) }}
                        </p>
                        <p v-if="project.tags?.length" class="mt-3 text-sm text-muted-foreground">
                            {{ project.tags.slice(0, 4).join(' · ') }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const formatDate = (date: unknown) => {
    const [year, month, day] = String(date ?? '').split('-')
    if (!year || !month || !day) return String(date ?? '')
    return `${day}/${month}/${year}`
}

const allProjects = ref<any[]>([])

const loadProjects = async () => {
    allProjects.value = await queryCollection('projects')
        .order('date', 'DESC')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all()
}

await loadProjects()

watch(locale, loadProjects)
</script>
