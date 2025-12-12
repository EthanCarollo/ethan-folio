<template>
    <section class="py-20 px-4 font-mono" id="projects">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">{{ $t('projects.cdProjects') }}</div>
                <div class="text-foreground/60 mb-6">{{ $t('projects.ls') }}</div>
                <div class="text-foreground/70 pt-6 space-y-2">
                    <NuxtLink
                        v-for="(project, index) in allProjects"
                        :key="index"
                        :to="'/projects/' + project.slug"
                        class="block hover:text-foreground transition-colors"
                    >
                        <div class="flex items-start gap-4">
                            <div class="text-foreground/60 min-w-[100px]">{{ $t('projects.permissions') }}</div>
                            <div class="flex-1 text-foreground/80 hover:text-foreground">
                                <div class="flex items-center">
                                    <div class="">{{ project.title }}&nbsp;</div>
                                    <div class="text-foreground/50 text-xs ">
                                        [ {{ project.tags.slice(0, 3).join(', ') }} ]
                                    </div>
                                </div>
                                <div class="mt-1 flex items-end">
                                    <div class="text-sm">{{project.category}}</div>

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
/* Component styles */
</style>
