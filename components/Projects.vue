<template>
    <section class="py-20 px-4" id="projects">
        <div class="max-w-5xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-primary border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
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
                    <div class="relative h-64 overflow-hidden border-b-4 border-foreground">
                        <div :class="`${project.color} absolute inset-0 opacity-20`"></div>
                        <div
                            class="relative h-full bg-center bg-cover group-hover:scale-110 transition-transform duration-300"
                            :style="'background-image: url('+ project.image + ')'"
                        ></div>
                    </div>

                    <!-- Compact Info -->
                    <div class="p-4">
                        <h3 class="text-xl font-black text-foreground mb-2 group-hover:underline">{{ project.title }}</h3>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span
                                v-for="(tag, tagIndex) in project.tags.slice(0, 3)"
                                :key="tagIndex"
                                class="px-2 py-1 bg-background border-2 border-foreground font-mono text-xs font-bold"
                            >
                                {{ tag }}
                            </span>
                        </div>
                        <p class="text-sm text-foreground/70 font-bold">Click to view details →</p>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <Teleport to="body">
                <Transition name="modal">
                    <div
                        v-if="selectedProject"
                        @click="closeModal"
                        class="fixed inset-0 bg-foreground/80 flex items-center justify-center p-4 z-50"
                    >
                        <div
                            @click.stop
                            class="bg-card border-4 border-foreground shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                        >
                            <!-- Close Button -->
                            <button
                                @click="closeModal"
                                class="absolute top-4 right-4 w-10 h-10 bg-foreground text-background border-4 border-foreground hover:bg-destructive hover:border-destructive transition-colors font-black text-xl z-10"
                            >
                                ✕
                            </button>

                            <div class="grid md:grid-cols-5 gap-0">
                                <!-- Project Image -->
                                <div class="md:col-span-2 relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-foreground">
                                    <div :class="`${selectedProject.color} absolute inset-0 opacity-20`"></div>
                                    <div class="relative h-64 md:h-full flex items-center justify-center p-8 bg-center bg-cover"
                                         :style="'background-image: url('+ selectedProject.image + ')'">
                                    </div>
                                </div>

                                <!-- Project Content -->
                                <div class="md:col-span-3 p-6 md:p-8">
                                    <div class="flex items-start justify-between mb-4">
                                        <h3 class="text-3xl md:text-4xl font-black text-foreground pr-12">{{ selectedProject.title }}</h3>
                                        <div v-if="selectedProject.year" :class="`${selectedProject.color} border-2 border-foreground px-3 py-1 rotate-2 hidden md:block`">
                                            <span class="font-black text-xs">{{ selectedProject.year }}</span>
                                        </div>
                                    </div>

                                    <p class="text-foreground/80 leading-relaxed mb-6 text-lg">{{ selectedProject.description }}</p>

                                    <div class="mb-6">
                                        <div class="inline-block px-3 py-1 bg-muted border-2 border-foreground mb-3">
                                            <span class="font-black text-xs">TECH STACK</span>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <span
                                                v-for="(tag, tagIndex) in selectedProject.tags"
                                                :key="tagIndex"
                                                class="px-4 py-2 bg-background border-2 border-foreground font-mono text-sm font-bold text-foreground hover:translate-x-1 hover:translate-y-1 transition-transform"
                                            >
                                                {{ tag }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-3">
                                        <a
                                            :href="selectedProject.github"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="px-6 py-3 bg-foreground text-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2"
                                        >
                                            <Github class="w-5 h-5" />
                                            VIEW CODE
                                        </a>
                                        <a v-if="selectedProject.demo"
                                           :href="selectedProject.demo"
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           :class="`px-6 py-3 ${selectedProject.color} text-foreground border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2`"
                                        >
                                            <ExternalLink class="w-5 h-5" />
                                            LIVE DEMO
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </Teleport>
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
    /*
    {
        title: "Task Management App",
        description:
            "Collaborative task manager with real-time updates, drag-and-drop, and team features. Uses WebSockets for live sync.",
        tags: ["Vue", "Node.js", "Socket.io", "MongoDB"],
        color: "bg-secondary",
        github: "https://github.com",
        demo: "https://example.com",
        year: "2024"
    },
    {
        title: "Weather Dashboard",
        description:
            "Beautiful weather app with forecasts, maps, and location search. Integrates multiple weather APIs for accuracy.",
        tags: ["Nuxt", "Tailwind", "OpenWeather API"],
        color: "bg-accent",
        github: "https://github.com",
        demo: "https://example.com",
        year: "2023"
    },
    {
        title: "Portfolio Generator",
        description:
            "SaaS tool for developers to create stunning portfolios. Features drag-and-drop builder and custom themes.",
        tags: ["Vue", "TypeScript", "Supabase", "Tailwind"],
        color: "bg-destructive",
        github: "https://github.com",
        demo: "https://example.com",
        year: "2024"
    },*/
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