<template>
    <div class="min-h-screen bg-background">
        <div v-if="project" class="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <!-- Header Section with Back Button -->
            <header class="mb-8">
                <NuxtLink
                    to="/#projects"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 font-black text-foreground uppercase text-sm"
                >
                    <span>←</span>
                    <span>Back to Projects</span>
                </NuxtLink>
            </header>

            <!-- Hero Section -->
            <section class="mb-8">
                <div class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div class="grid md:grid-cols-[450px_1fr] gap-0">
                        <!-- Project Image -->
                        <figure class="md:border-r-4 border-b-4 md:border-b-0 border-foreground relative overflow-hidden bg-muted flex items-center justify-center min-h-[350px] md:min-h-[500px]">
                            <div :class="`${project.color ?? 'bg-primary'} absolute inset-0 opacity-20`"></div>
                            <img
                                :src="getImageSource(project)"
                                :alt="`${project.title ?? 'Project'} preview`"
                                class="relative w-full h-full object-cover"
                                loading="eager"
                            />
                        </figure>

                        <!-- Project Header Info -->
                        <div class="p-8 md:p-10 flex flex-col justify-center gap-6">
                            <div class="flex items-start justify-between gap-4 flex-wrap">
                                <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight flex-1 min-w-0">
                                    {{ project.title ?? 'Untitled Project' }}
                                </h1>
                                <div
                                    v-if="project.year"
                                    :class="`${project.color ?? 'bg-primary'} border-4 border-foreground px-5 py-2.5 text-base md:text-lg font-black whitespace-nowrap flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`"
                                >
                                    {{ project.year }}
                                </div>
                            </div>
                            
                            <div v-if="project.role" class="inline-block">
                                <span class="px-4 py-2 bg-background border-2 border-foreground font-black text-xs uppercase tracking-wider text-foreground">
                                    {{ project.role }}
                                </span>
                            </div>

                            <p class="text-foreground/80 leading-relaxed text-base md:text-lg font-medium">
                                {{ project.description ?? 'Stay tuned for more details about this project.' }}
                            </p>

                            <!-- Action Buttons in Header -->
                            <div class="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    v-if="project.github"
                                    :href="project.github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="px-6 py-3 bg-foreground text-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2 uppercase text-xs md:text-sm"
                                >
                                    <Github class="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Code</span>
                                </a>
                                <a
                                    v-if="project.link"
                                    :href="project.link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :class="`px-6 py-3 ${project.color ?? 'bg-primary'} text-foreground border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2 uppercase text-xs md:text-sm`"
                                >
                                    <ExternalLink class="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Live Site</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Content Sections -->
            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <!-- Tech Stack Section -->
                <section class="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                    <h2 class="font-black text-sm uppercase tracking-wider border-b-4 border-foreground pb-3 mb-6 text-foreground">
                        Tech Stack
                    </h2>
                    <div class="flex flex-wrap gap-3">
                        <span
                            v-for="(tag, tagIndex) in project.tags ?? []"
                            :key="tagIndex"
                            class="px-4 py-2.5 bg-background border-2 border-foreground font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {{ tag }}
                        </span>
                    </div>
                </section>

                <!-- Key Features Section -->
                <section v-if="getHighlights(project).length" class="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                    <h2 class="font-black text-sm uppercase tracking-wider border-b-4 border-foreground pb-3 mb-6 text-foreground">
                        Key Features
                    </h2>
                    <ul class="space-y-4">
                        <li
                            v-for="(highlight, index) in getHighlights(project)"
                            :key="`highlight-${index}`"
                            class="flex gap-3 text-sm md:text-base text-foreground/80 leading-relaxed"
                        >
                            <span class="mt-2 h-2 w-2 rounded-full bg-foreground flex-shrink-0"></span>
                            <span class="font-bold">{{ highlight }}</span>
                        </li>
                    </ul>
                </section>
            </div>

            <!-- Tools Section -->
            <section v-if="project.tools && project.tools.length > 0" class="mb-8">
                <div class="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                    <h2 class="font-black text-sm uppercase tracking-wider border-b-4 border-foreground pb-3 mb-6 text-foreground">
                        Tools Used
                    </h2>
                    <div class="flex flex-wrap gap-3">
                        <a
                            v-for="(tool, toolIndex) in project.tools"
                            :key="toolIndex"
                            :href="tool.url"
                            :target="tool.url ? '_blank' : undefined"
                            :rel="tool.url ? 'noopener noreferrer' : undefined"
                            :class="`px-4 py-2.5 bg-background border-2 border-foreground font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${tool.url ? 'hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer' : ''}`"
                        >
                            {{ tool.name }}
                            <ExternalLink v-if="tool.url" class="inline-block w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>
            </section>

            <!-- Gallery Section -->
            <section v-if="project.gallery && project.gallery.length > 1" class="mb-8">
                <div class="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                    <h2 class="font-black text-sm uppercase tracking-wider border-b-4 border-foreground pb-3 mb-6 text-foreground">
                        Gallery
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div
                            v-for="(image, index) in project.gallery"
                            :key="index"
                            @click="openImageModal(`/${image.startsWith('/') ? image.slice(1) : image}`, index)"
                            class="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-muted aspect-square group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            <img
                                :src="`/${image.startsWith('/') ? image.slice(1) : image}`"
                                :alt="`${project.title} - Image ${index + 1}`"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer Navigation -->
            <footer class="flex justify-between items-center gap-4">
                <NuxtLink
                    to="/#projects"
                    class="px-6 py-3 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 font-black text-foreground uppercase text-sm"
                >
                    ← All Projects
                </NuxtLink>
                
                <!-- Next/Previous Project Navigation -->
                <div class="flex gap-3">
                    <NuxtLink
                        v-if="previousProject"
                        :to="`/projects/${previousProject.slug}`"
                        class="px-6 py-3 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 font-black text-foreground uppercase text-sm"
                    >
                        ← Previous
                    </NuxtLink>
                    <NuxtLink
                        v-if="nextProject"
                        :to="`/projects/${nextProject.slug}`"
                        class="px-6 py-3 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 font-black text-foreground uppercase text-sm"
                    >
                        Next →
                    </NuxtLink>
                </div>
            </footer>
        </div>

        <!-- 404 State -->
        <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
            <div class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12">
                <h1 class="text-4xl font-black text-foreground mb-4">Project Not Found</h1>
                <p class="text-foreground/70 mb-8">The project you're looking for doesn't exist.</p>
                <NuxtLink
                    to="/#projects"
                    class="inline-block px-6 py-3 bg-foreground text-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black uppercase text-sm"
                >
                    Back to Projects
                </NuxtLink>
            </div>
        </div>

        <!-- Image Modal/Lightbox -->
        <Teleport to="body">
            <Transition name="image-modal">
                <div
                    v-if="selectedImage"
                    @click="closeImageModal"
                    class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
                >
                    <div @click.stop class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <img
                            :src="selectedImage"
                            :alt="`${project?.title} - Full size image`"
                            class="max-w-full max-h-full object-contain border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                        />
                        <!-- Close Button -->
                        <button
                            @click="closeImageModal"
                            class="absolute top-4 right-4 w-12 h-12 bg-foreground text-background hover:bg-destructive transition-colors font-black text-xl z-10 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                            aria-label="Close image"
                        >
                            <X class="w-6 h-6" />
                        </button>
                        <!-- Navigation Buttons -->
                        <button
                            v-if="currentImageIndex > 0"
                            @click.stop="navigateImage(-1)"
                            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-foreground text-background hover:bg-primary transition-colors font-black text-xl z-10 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                            aria-label="Previous image"
                        >
                            <ChevronLeft class="w-6 h-6" />
                        </button>
                        <button
                            v-if="project && currentImageIndex < project.gallery.length - 1"
                            @click.stop="navigateImage(1)"
                            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-foreground text-background hover:bg-primary transition-colors font-black text-xl z-10 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                            aria-label="Next image"
                        >
                            <ChevronRight class="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import projectsData from '~/data/projects.json';

const route = useRoute();
const slug = route.params.slug as string;

const project = projectsData.find((p: any) => p.slug === slug);

// Find previous and next projects for navigation
const currentIndex = projectsData.findIndex((p: any) => p.slug === slug);
const previousProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

// Image modal state
const selectedImage = ref<string | null>(null);
const currentImageIndex = ref(0);

const placeholderImage = '/images/project-placeholder.svg';

const getImageSource = (project: any) => {
    const image = project?.image ?? null;
    if (!image || image.length === 0) return placeholderImage;
    // Ensure the path starts with / for public assets
    return image.startsWith('/') ? image : `/${image}`;
};

const getHighlights = (project: any) => {
    const highlights = project?.highlights ?? [];
    return highlights.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
};

const openImageModal = (imagePath: string, index: number) => {
    selectedImage.value = imagePath;
    currentImageIndex.value = index;
    if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
    }
};

const closeImageModal = () => {
    selectedImage.value = null;
    if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
    }
};

const navigateImage = (direction: number) => {
    if (!project || !project.gallery) return;
    const newIndex = currentImageIndex.value + direction;
    if (newIndex >= 0 && newIndex < project.gallery.length) {
        currentImageIndex.value = newIndex;
        const image = project.gallery[newIndex];
        selectedImage.value = `/${image.startsWith('/') ? image.slice(1) : image}`;
    }
};

// Keyboard navigation
const handleKeyPress = (e: KeyboardEvent) => {
    if (!selectedImage.value) return;
    
    if (e.key === 'Escape') {
        closeImageModal();
    } else if (e.key === 'ArrowLeft') {
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        navigateImage(1);
    }
};

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyPress);
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
        document.body.style.overflow = '';
    }
});

useHead({
    title: project ? `${project.title} - Ethan Carollo` : 'Project Not Found - Ethan Carollo',
    meta: [
        { name: 'description', content: project?.description ?? 'Project not found' }
    ]
});
</script>

<style scoped>
/* Page transition animations handled by app.vue */
</style>

<style>
/* Image Modal Transitions */
.image-modal-enter-active,
.image-modal-leave-active {
    transition: opacity 0.3s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
    opacity: 0;
}

.image-modal-enter-active > div,
.image-modal-leave-active > div {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.image-modal-enter-from > div,
.image-modal-leave-to > div {
    transform: scale(0.9);
}
</style>
