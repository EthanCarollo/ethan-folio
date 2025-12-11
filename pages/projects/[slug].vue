<template>
    <div class="min-h-screen bg-background font-mono">
        <div v-if="project" class="max-w-3xl mx-auto px-4 py-8 md:py-12">
            <!-- Header -->
            <div class="mb-8 space-y-1 text-sm">
                <div class="text-foreground/60">$ cd ..</div>
                <NuxtLink
                    to="/#projects"
                    class="text-foreground/60 hover:text-foreground transition-colors"
                >
                    ← back
                </NuxtLink>
            </div>

            <!-- Project Info -->
            <div class="space-y-6 mb-8">
                <div class="space-y-1 text-sm">
                    <div class="text-foreground/60">$ cat {{ project.slug }}/info.txt</div>
                    <div class="text-foreground/70 mt-2 space-y-2">
                        <div>
                            <span class="text-foreground/60">title: </span>
                            <span class="text-foreground text-xl">{{ project.title }}</span>
                        </div>
                        <div v-if="project.year">
                            <span class="text-foreground/60">year: </span>
                            <span class="text-foreground">{{ project.year }}</span>
                        </div>
                        <div v-if="project.role">
                            <span class="text-foreground/60">role: </span>
                            <span class="text-foreground">{{ project.role }}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-1 text-sm">
                    <div class="text-foreground/60">$ cat {{ project.slug }}/description.txt</div>
                    <div class="text-foreground/70 mt-2">
                        {{ project.description }}
                    </div>
                </div>
            </div>

            <!-- Project Image -->
            <div class="mb-8 border border-foreground/20 overflow-hidden">
                <img
                    :src="getImageSource(project)"
                    :alt="`${project.title} preview`"
                    class="w-full h-auto object-cover"
                    loading="eager"
                />
            </div>

            <!-- Tech Stack -->
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat {{ project.slug }}/tech_stack.txt</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-for="(tag, tagIndex) in project.tags ?? []" :key="tagIndex" class="pl-4">
                        - {{ tag }}
                    </div>
                </div>
            </div>

            <!-- Tools -->
            <div v-if="project.tools && project.tools.length > 0" class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat {{ project.slug }}/tools.txt</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-for="(tool, toolIndex) in project.tools" :key="toolIndex" class="pl-4">
                        - {{ tool.name }}
                        <a v-if="tool.url" :href="tool.url" target="_blank" rel="noopener noreferrer" class="text-foreground/50 hover:text-foreground underline ml-2">
                            [link]
                        </a>
                    </div>
                </div>
            </div>

            <!-- Key Features -->
            <div v-if="getHighlights(project).length" class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat {{ project.slug }}/features.txt</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-for="(highlight, index) in getHighlights(project)" :key="`highlight-${index}`" class="pl-4">
                        - {{ highlight }}
                    </div>
                </div>
            </div>

            <!-- Gallery -->
            <div v-if="project.gallery && project.gallery.length > 1" class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ ls {{ project.slug }}/gallery/</div>
                <div class="text-foreground/70 mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div
                        v-for="(image, index) in project.gallery"
                        :key="index"
                        @click="openImageModal(`/${image.startsWith('/') ? image.slice(1) : image}`, index)"
                        class="border border-foreground/20 hover:border-foreground/40 transition-all cursor-pointer overflow-hidden bg-muted aspect-square"
                    >
                        <img
                            :src="`/${image.startsWith('/') ? image.slice(1) : image}`"
                            :alt="`${project.title} - Image ${index + 1}`"
                            class="w-full h-full object-cover hover:opacity-80 transition-opacity"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            <!-- Links -->
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat {{ project.slug }}/links.txt</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-if="project.github" class="pl-4">
                        - github: <a :href="project.github" target="_blank" rel="noopener noreferrer" class="text-foreground underline hover:text-foreground/70">{{ project.github }}</a>
                    </div>
                    <div v-if="project.link" class="pl-4">
                        - live: <a :href="project.link" target="_blank" rel="noopener noreferrer" class="text-foreground underline hover:text-foreground/70">{{ project.link }}</a>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="space-y-1 text-sm pt-8 border-t border-foreground/20">
                <div class="flex justify-between items-center">
                    <NuxtLink
                        to="/#projects"
                        class="text-foreground/60 hover:text-foreground transition-colors"
                    >
                        ← all projects
                    </NuxtLink>
                    <div class="flex gap-4">
                        <NuxtLink
                            v-if="previousProject"
                            :to="`/projects/${previousProject.slug}`"
                            class="text-foreground/60 hover:text-foreground transition-colors"
                        >
                            ← prev
                        </NuxtLink>
                        <NuxtLink
                            v-if="nextProject"
                            :to="`/projects/${nextProject.slug}`"
                            class="text-foreground/60 hover:text-foreground transition-colors"
                        >
                            next →
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- 404 State -->
        <div v-else class="max-w-3xl mx-auto px-4 py-20 font-mono">
            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">$ cat project.txt</div>
                <div class="text-foreground/70 mt-2">
                    <div class="mb-4">Project not found</div>
                    <NuxtLink
                        to="/#projects"
                        class="text-foreground/60 hover:text-foreground transition-colors"
                    >
                        $ cd /projects
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Image Modal -->
        <Teleport to="body">
            <Transition name="image-modal">
                <div
                    v-if="selectedImage"
                    @click="closeImageModal"
                    class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer font-mono"
                >
                    <div @click.stop class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <img
                            :src="selectedImage"
                            :alt="`${project?.title} - Full size image`"
                            class="max-w-full max-h-full object-contain border border-foreground/30"
                        />
                        <button
                            @click="closeImageModal"
                            class="absolute top-4 right-4 w-10 h-10 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex items-center justify-center text-sm"
                            aria-label="Close"
                        >
                            <X class="w-5 h-5" />
                        </button>
                        <button
                            v-if="currentImageIndex > 0"
                            @click.stop="navigateImage(-1)"
                            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex items-center justify-center text-sm"
                            aria-label="Previous"
                        >
                            <ChevronLeft class="w-5 h-5" />
                        </button>
                        <button
                            v-if="project && currentImageIndex < project.gallery.length - 1"
                            @click.stop="navigateImage(1)"
                            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex items-center justify-center text-sm"
                            aria-label="Next"
                        >
                            <ChevronRight class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import projectsData from '~/data/projects.json';

const route = useRoute();
const slug = route.params.slug as string;

const project = projectsData.find((p: any) => p.slug === slug);

const currentIndex = projectsData.findIndex((p: any) => p.slug === slug);
const previousProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

const selectedImage = ref<string | null>(null);
const currentImageIndex = ref(0);

const placeholderImage = '/images/project-placeholder.svg';

const getImageSource = (project: any) => {
    const image = project?.image ?? null;
    if (!image || image.length === 0) return placeholderImage;
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
