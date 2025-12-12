<template>
    <div v-if="project" class="max-w-3xl mx-auto px-4 py-8 md:py-12 min-h-screen">
        <div class="mb-8 space-y-1 text-sm text-foreground/70">
            <a href="/" class="hover:text-foreground transition-colors block">$ cd ..</a>
            <!--
            <div class="text-foreground/60">$ ls</div>
            <div class="text-foreground/70 mt-2 space-y-1">
                <div>README.md  src/  assets/</div>
            </div>
            -->
        </div>
        <!-- Project Info -->
        <div class="space-y-6 mb-8">
            <div class=" text-sm">
                <div class="text-foreground/60 mb-1">$ cat README.md</div>
                <div class="text-foreground/70 mt-2 space-y-2">
                    <div>
                        <span class="text-foreground/60"># </span>
                        <span class="text-foreground text-xl">{{ project.title }}</span>
                    </div>
                    <div v-if="project.date">
                        <span class="text-foreground/60">Date: </span>
                        <span class="text-foreground">{{ project.date }}</span>
                    </div>
                    <div v-if="project.role">
                        <span class="text-foreground/60">Role: </span>
                        <span class="text-foreground">{{ project.role }}</span>
                    </div>
                </div>
                <div class="mb-8 mt-6 border-2 border-foreground/20 overflow-hidden ">
                    <img
                        :src="project.image"
                        :alt="`${project.title} preview`"
                        class="w-full h-auto object-cover"
                        loading="eager"
                    />
                </div>
            </div>
        </div>

        <!-- Project Image
        <div class="mb-8 border border-foreground/20 overflow-hidden">
            <img
                :src="getImageSource(project)"
                :alt="`${project.title} preview`"
                class="w-full h-auto object-cover"
                loading="eager"
            />
        </div>
        -->
        <ContentRenderer
            :value="project"
            class="prose prose-invert max-w-none" />
    </div>
    <div v-else class="min-h-screen min-w-screen">
        <div class="space-y-1 text-sm">
            <div class="text-foreground/60">$ cd nonexistent-project</div>
            <div class="text-foreground/70 mt-2">
                <div class="text-foreground/60">bash: cd: nonexistent-project: No such file or directory</div>
                <div class="mt-4">
                    <NuxtLink
                        to="/#projects"
                        class="text-foreground/60 hover:text-foreground transition-colors"
                    >
                        $ cd /projects
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const slug = useRoute().params.slug
const { data: project } = await useAsyncData(`projects-${slug}`, () => {
    return queryCollection('projects').path(`/projects/${slug}.${locale.value}`).first()
})
</script>

<style scoped>
</style>

<style>
.image-modal-enter-active,
.image-modal-leave-active {
    transition: opacity 0.2s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
    opacity: 0;
}
</style>
