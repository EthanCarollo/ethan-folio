<template>
    <section class="py-20 px-4" id="projects">
        <div class="max-w-5xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-primary border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-1 transition-transform">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">PROJECTS</h2>
            </div>

            <!-- Grid of compact cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="(project, index) in projects"
                    :key="index"
                    @click="openModal(project)"
                    class="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                    <!-- Image -->
                    <div class="cursor-pointer relative h-64 overflow-hidden border-b-4 border-foreground">
                        <div :class="`${project.color} absolute inset-0 opacity-20`"></div>
                        <div
                            class="cursor-pointer  relative h-full bg-center bg-cover group-hover:scale-110 transition-transform duration-300"
                            :style="'background-image: url('+ project.image + ')'"
                        ></div>
                    </div>

                    <!-- Compact Info -->
                    <div class="p-4 cursor-pointer">
                        <h3 class="text-xl font-black text-foreground mb-2 group-hover:underline cursor-pointer">{{ project.title }}</h3>
                        <div class="flex flex-wrap gap-2 mb-3 cursor-pointer">
                            <span
                                v-for="(tag, tagIndex) in project.tags.slice(0, 3)"
                                :key="tagIndex"
                                class="px-2 py-1 bg-background border-2 cursor-pointer border-foreground font-mono text-xs font-bold"
                            >
                                {{ tag }}
                            </span>
                        </div>
                        <p class="text-sm text-foreground/70 font-bold cursor-pointer">Click to view details →</p>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <ProjectModal
                :project="selectedProject"
                @close="closeModal"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Github, ExternalLink } from 'lucide-vue-next';

const selectedProject = ref(null);

const openModal = (project) => {
    selectedProject.value = project;
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    selectedProject.value = null;
    document.body.style.overflow = '';
};

const projects = [
    {
        title: "PersonaBot",
        description:
            "An iOS app that lets users create and customize intelligent bots with unique knowledge bases and behaviors. It combines a Swift frontend with a Python backend using Retrieval-Augmented Generation (RAG) via OpenAI's ChatGPT and LlamaIndex for fully personalized bot experiences.",
        tags: ["Swift", "Python", "LlamaIndex"],
        color: "bg-primary",
        github: "https://github.com/EthanCarollo/PersonaBot",
        image: "images/personabot/personabot-thumbnail.png",
    },
    {
        title: "GamesFolio",
        description:
            "A simple portfolio built with Three.js showcasing all the games I’ve created in my free time or during my studies, mostly developed with Unity.",
        tags: ["Nuxt", "Three.js"],
        color: "bg-secondary",
        github: "https://github.com/EthanCarollo/games-ethan-folio",
        link: "https://games.ethan-folio.fr",
        image: "images/games-folio/games-thumbnail.png",
    },
]
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
    transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
    transform: scale(0.9);
}
</style>