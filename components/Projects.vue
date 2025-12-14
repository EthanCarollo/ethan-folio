<template>
    <section class="py-12 sm:py-16 md:py-20 px-4 font-mono" id="projects">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">{{ $t('projects.title') }}</div>
                <div class="text-foreground/70 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NuxtLink v-for="(project, index) in allProjects" :key="index" :to="'/projects/' + project.slug"
                        class="block hover:text-foreground transition-colors">
                        <article
                            class="group border border-foreground/20 rounded-lg overflow-hidden hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200 h-full flex flex-col">
                            <!-- Project Image Banner -->
                            <div v-if="project.image" class="w-full h-32 sm:h-36 overflow-hidden bg-foreground/5">
                                <img :src="project.image" :alt="`${project.title} preview`"
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy" />
                            </div>
                            <div class="p-3 flex flex-col gap-2 flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-foreground line-clamp-1">{{
                                    project.title }}</h3>
                                <p class="text-xs sm:text-sm text-foreground/70 line-clamp-1">
                                    {{ project.category }} <span class="mx-1 opacity-50">•</span> {{ project.date }}
                                </p>
                                <div class="flex flex-wrap gap-1 sm:gap-2 mt-auto pt-2">
                                    <span v-for="tag in project.tags?.slice(0, 3)" :key="tag"
                                        class="text-xs bg-foreground/10 text-foreground/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate max-w-[80px] sm:max-w-none">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// Forcer le re-render quand la locale change
const allProjects = ref([]);

const loadProjects = async () => {
    allProjects.value = await queryCollection('projects')
        .order('date', 'DESC')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all();
};

// Charger les projets au montage et quand la locale change
watch(locale, () => {
    loadProjects();
}, { immediate: true });
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
