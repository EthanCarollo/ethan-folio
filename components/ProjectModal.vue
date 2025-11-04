<script setup lang="ts">
import { Github, ExternalLink, X } from 'lucide-vue-next';

type Project = {
    title?: string;
    description?: string;
    tags?: string[];
    color?: string;
    github?: string;
    link?: string;
    image?: string;
    year?: string;
    role?: string;
    highlights?: string[];
};

defineProps<{
    project: Project | null
}>();

defineEmits<{
    close: []
}>();

const placeholderImage = '/images/project-placeholder.svg';

const getImageSource = (project: Project | null) => {
    const image = project?.image ?? null;
    return image && image.length > 0 ? image : placeholderImage;
};

const getHighlights = (project: Project | null) => {
    const highlights = project?.highlights ?? [];
    return highlights.filter((item) => typeof item === 'string' && item.trim().length > 0);
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="project"
                @click="$emit('close')"
                class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            >
                <div
                    @click.stop
                    class="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
                >
                    <!-- Close Button -->
                    <button
                        @click="$emit('close')"
                        class="absolute top-6 right-6 w-12 h-12 bg-black text-white hover:bg-red-500 transition-colors font-black text-xl z-10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <X class="w-6 h-6" />
                    </button>

                    <div class="grid md:grid-cols-[420px_1fr] gap-0">
                        <!-- Project Image -->
                        <figure class="md:border-r-4 border-b-4 md:border-b-0 border-black relative overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                            <div :class="`${project.color ?? 'bg-blue-400'} absolute inset-0 opacity-20`"></div>
                            <img
                                :src="getImageSource(project)"
                                :alt="`${project.title ?? 'Project'} preview`"
                                class="relative w-full h-full object-cover"
                                loading="lazy"
                            />
                        </figure>

                        <!-- Project Content -->
                        <div class="p-8 md:p-10 pr-16 flex flex-col gap-8">
                            <!-- Header -->
                            <header class="space-y-5">
                                <div class="flex items-start justify-between gap-6">
                                    <h3 class="text-4xl md:text-5xl font-black text-black leading-tight flex-1">
                                        {{ project.title ?? 'Untitled Project' }}
                                    </h3>
                                    <div
                                        v-if="project.year"
                                        :class="`${project.color ?? 'bg-yellow-300'} border-3 border-black px-4 py-2 text-sm font-black self-start whitespace-nowrap flex-shrink-0 mr-0 md:mr-16`"
                                    >
                                        {{ project.year }}
                                    </div>
                                </div>
                                
                                <p v-if="project.role" class="text-base font-bold text-gray-600 uppercase tracking-wider">
                                    {{ project.role }}
                                </p>

                                <p class="text-gray-700 leading-relaxed text-lg">
                                    {{ project.description ?? 'Stay tuned for more details about this project.' }}
                                </p>
                            </header>

                            <!-- Main Content Grid -->
                            <div class="grid gap-8 md:grid-cols-2">
                                <!-- Tech Stack -->
                                <section class="space-y-4">
                                    <h4 class="font-black text-sm uppercase tracking-wider border-b-4 border-black pb-2">
                                        Tech Stack
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span
                                            v-for="(tag, tagIndex) in project.tags ?? []"
                                            :key="tagIndex"
                                            class="px-3 py-1.5 bg-white border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            {{ tag }}
                                        </span>
                                    </div>
                                </section>

                                <!-- Highlights -->
                                <section v-if="getHighlights(project).length" class="space-y-4">
                                    <h4 class="font-black text-sm uppercase tracking-wider border-b-4 border-black pb-2">
                                        Key Features
                                    </h4>
                                    <ul class="space-y-2">
                                        <li
                                            v-for="(highlight, index) in getHighlights(project)"
                                            :key="`highlight-${index}`"
                                            class="flex gap-3 text-sm text-gray-700 leading-snug"
                                        >
                                            <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-black flex-shrink-0"></span>
                                            <span class="font-medium">{{ highlight }}</span>
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            <!-- Footer Actions -->
                            <footer class="flex flex-wrap items-center gap-4 pt-4">
                                <a
                                    v-if="project.github"
                                    :href="project.github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="px-6 py-3 bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold inline-flex items-center gap-2 uppercase text-sm"
                                >
                                    <Github class="w-4 h-4" />
                                    Code
                                </a>
                                <a
                                    v-if="project.link"
                                    :href="project.link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :class="`px-6 py-3 ${project.color ?? 'bg-blue-400'} text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold inline-flex items-center gap-2 uppercase text-sm`"
                                >
                                    <ExternalLink class="w-4 h-4" />
                                    Live Site
                                </a>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
    transition: transform 0.25s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
    transform: scale(0.95);
}
</style>
