<template>
    <div class="min-h-screen flex">
        <!-- Added TableOfContents component fixed on the left -->
        <ContentTableOfContents />

        <!-- Adjusted main content with left margin to account for TOC -->
        <div class="flex-1 px-4 py-8 md:py-12 lg:ml-64 ml-0">
            <div v-if="project" class="max-w-3xl mx-auto">

                <!-- Project Info -->
                <div class="space-y-4 mb-8">
                    <div>
                        <div class="text-foreground/60 text-sm mb-2">Project</div>
                        <h1 class="text-foreground text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{{ project.title }}
                        </h1>
                        <div class="text-foreground/70 space-y-2 text-sm">
                            <div v-if="project.date">
                                <span class="text-foreground/60">Date: </span>
                                <span class="text-foreground">{{ project.date }}</span>
                            </div>
                            <div v-if="project.role">
                                <span class="text-foreground/60">Role: </span>
                                <span class="text-foreground">{{ project.role }}</span>
                            </div>
                            <div v-if="project.repo">
                                <span class="text-foreground/60">Repo: </span>
                                <a :href="project.repo" target="_blank"
                                    class="text-foreground/80 hover:text-foreground">{{ project.repo }}</a>
                            </div>
                        </div>
                        <div class="mb-8 mt-6 border-2 border-foreground/20 overflow-hidden rounded-lg">
                            <img :src="project.image" :alt="`${project.title} preview`"
                                class="w-full h-auto object-cover" loading="eager" />
                        </div>
                    </div>
                </div>

                <ContentRenderer :value="project" class="prose prose-invert max-w-none" />
            </div>
            <div v-else class="space-y-1 text-sm">
                <div class="text-foreground/60">Project Not Found</div>
                <div class="text-foreground/70 mt-2">
                    <div class="text-foreground/60">This project doesn't exist</div>
                    <div class="mt-4">
                        <NuxtLink to="/#projects" class="text-foreground/60 hover:text-foreground transition-colors">
                            ← Back to Projects
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ContentTableOfContents from "../../components/ContentTableOfContents.vue";

const route = useRoute()
const { locale } = useI18n()

// Force le rechargement quand la langue change
const { data: project, refresh } = await useAsyncData(
    `projects-${route.params.slug}-${locale.value}`,
    () => {
        return queryCollection('projects').path(`/projects/${route.params.slug}.${locale.value}`).first()
    },
    {
        watch: [locale], // Recharger quand la locale change
        immediate: true
    }
)

// Forcer le refresh quand on change de langue
watch(locale, async (newLocale, oldLocale) => {
    if (newLocale !== oldLocale) {
        console.log(`Changement de langue détecté: ${oldLocale} → ${newLocale}`)

        // Méthode 1 : Refresh via useAsyncData
        await refresh()

        // Méthode 2 : Forcer un rechargement complet si nécessaire
        // setTimeout(() => {
        //     window.location.reload()
        // }, 100)
    }
})

// Fonction de secours pour forcer le rechargement complet
const forcePageReload = () => {
    // Recharger la page complète en conservant la nouvelle langue
    const currentPath = window.location.pathname
    const newPath = locale.value === 'en' && !currentPath.startsWith('/en')
        ? `/en${currentPath}`
        : locale.value === 'fr' && currentPath.startsWith('/en')
            ? currentPath.replace(/^\/en/, '') || '/'
            : currentPath

    window.location.href = newPath
}

// Optionnel : bouton de secours pour forcer le rechargement
// Vous pouvez appeler forcePageReload() si le refresh ne fonctionne pas
</script>

<style>
.image-modal-enter-active,
.image-modal-leave-active {
    transition: opacity 0.2s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
    opacity: 0;
}

/* Responsive styles for project pages */
@media (max-width: 1024px) {
    /* Remise à zéro de la marge quand le sidebar disparaît */
    div[class*="ml-64"] {
        @apply ml-0;
    }
}
/* TOC visibility is now handled by ContentTableOfContents.vue */

@media (max-width: 768px) {
    .flex-1 {
        @apply px-4 py-6;
    }

    .prose {
        @apply text-base;
    }

    .prose img {
        @apply rounded-lg;
    }
}

@media (max-width: 640px) {
    .flex-1 {
        @apply px-3 py-4;
    }

    .prose {
        @apply text-sm;
    }

    .prose h2 {
        @apply text-lg;
    }

    .prose h3 {
        @apply text-base;
    }
}
</style>
