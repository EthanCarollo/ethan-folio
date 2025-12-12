<template>
    <section class="py-20 px-4 font-mono" id="projects">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cd projects</div>
                <div class="text-foreground/60">$ ls -la</div>
                <div class="text-foreground/70 mt-2 space-y-2">
                    <NuxtLink
                        v-for="(project, index) in projects"
                        :key="index"
                        :to="`/projects/${project.slug}`"
                        class="block hover:text-foreground transition-colors"
                    >
                        <div class="flex items-start gap-4">
                            <div class="text-foreground/60 min-w-[100px]">drwxr-xr-x</div>
                            <div class="flex-1">
                                <div class="text-foreground">{{ project.title }}</div>
                                <div class="text-foreground/50 text-xs mt-1">
                                    {{ project.tags.slice(0, 3).join(', ') }}
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import projects from '~/data/projects.json';
</script>

<style scoped>
/* Component styles */
</style>
