<template>
    <div class="min-h-screen">
        <ContentTableOfContents />

        <main class="px-4 py-10 sm:px-6 sm:py-14 lg:ml-64">
            <article v-if="project" class="mx-auto max-w-5xl">
                <header class="border-b border-border pb-7">
                    <p class="text-sm font-medium text-muted-foreground">{{ project.category }}</p>
                    <h1 class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {{ project.title }}
                    </h1>

                    <dl class="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                        <div v-if="project.date">
                            <dt class="font-semibold text-foreground">Date</dt>
                            <dd class="text-muted-foreground">{{ formatDate(project.date) }}</dd>
                        </div>
                        <div v-if="project.role">
                            <dt class="font-semibold text-foreground">Role</dt>
                            <dd class="text-muted-foreground">{{ project.role }}</dd>
                        </div>
                        <div v-if="project.repo">
                            <dt class="font-semibold text-foreground">Repository</dt>
                            <dd><a :href="project.repo" target="_blank" rel="noopener noreferrer">{{ project.repo }}</a></dd>
                        </div>
                    </dl>

                    <img
                        v-if="project.image"
                        :src="project.image"
                        :alt="`${project.title} preview`"
                        class="mt-7 w-full rounded border border-border object-cover"
                        loading="eager"
                    />
                </header>

                <ContentRenderer :value="project" class="prose mx-auto mt-8 max-w-4xl" />

                <NuxtLink :to="localePath('/#projects')" class="mt-12 inline-block text-link underline underline-offset-2">
                    ← Back to Projects
                </NuxtLink>
            </article>

            <div v-else class="mx-auto max-w-5xl py-14">
                <h1 class="text-2xl font-bold">Project not found</h1>
                <NuxtLink :to="localePath('/#projects')" class="mt-4 inline-block text-link underline underline-offset-2">
                    ← Back to Projects
                </NuxtLink>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const formatDate = (date: unknown) => {
    const [year, month, day] = String(date ?? '').split('-')
    if (!year || !month || !day) return String(date ?? '')
    return `${day}/${month}/${year}`
}

const { data: project, refresh } = await useAsyncData(
    `projects-${route.params.slug}-${locale.value}`,
    () => queryCollection('projects').path(`/projects/${route.params.slug}.${locale.value}`).first(),
    { watch: [locale] }
)

watch(locale, async (newLocale, oldLocale) => {
    if (newLocale !== oldLocale) await refresh()
})

const site = useSiteConfig()

useSeoMeta({
    titleTemplate: '%s',
    title: () => (project.value ? `${project.value.title} — ${site.name}` : undefined),
    description: () => project.value?.description,
    ogTitle: () => project.value?.title,
    ogDescription: () => project.value?.description,
    ogImage: () => project.value?.image ? `${site.url}${project.value.image}` : undefined,
    twitterCard: 'summary_large_image',
    twitterImage: () => project.value?.image ? `${site.url}${project.value.image}` : undefined,
})
</script>
