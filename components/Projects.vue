<template>
    <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-primary border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">PROJECTS</h2>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <div
                    v-for="(project, index) in projects"
                    :key="index"
                    class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                    <div :class="`${project.color} border-b-4 border-foreground p-6`">
                        <h3 class="text-2xl font-black text-foreground">{{ project.title }}</h3>
                    </div>

                    <div class="p-6">
                        <p class="text-foreground/80 leading-relaxed mb-6">{{ project.description }}</p>

                        <div class="flex flex-wrap gap-2 mb-6">
              <span
                  v-for="(tag, tagIndex) in project.tags"
                  :key="tagIndex"
                  class="px-3 py-1 bg-muted border-2 border-foreground font-mono text-sm font-bold text-foreground"
              >
                {{ tag }}
              </span>
                        </div>

                        <div class="flex gap-3">
                            <a
                                :href="project.github"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="px-4 py-2 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold bg-transparent inline-flex items-center gap-2 text-sm"
                            >
                                <Github class="w-4 h-4" />
                                Code
                            </a>
                            <a
                                :href="project.demo"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="px-4 py-2 bg-foreground text-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold inline-flex items-center gap-2 text-sm"
                            >
                                <ExternalLink class="w-4 h-4" />
                                Demo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next';
const projects = [
    /*{
        title: "E-Commerce Platform",
        description:
            "A full-featured online store with cart, checkout, and payment integration. Built with Nuxt, Stripe, and PostgreSQL.",
        tags: ["Nuxt", "TypeScript", "Stripe", "PostgreSQL"],
        color: "bg-primary",
        github: "https://github.com/EthanCarollo",
        demo: "https://games.ethan-folio.fr",
    },
    {
        title: "Task Management App",
        description:
            "Collaborative task manager with real-time updates, drag-and-drop, and team features. Uses WebSockets for live sync.",
        tags: ["Vue", "Node.js", "Socket.io", "MongoDB"],
        color: "bg-secondary",
        github: "https://github.com",
        demo: "https://example.com",
    },
    {
        title: "Weather Dashboard",
        description:
            "Beautiful weather app with forecasts, maps, and location search. Integrates multiple weather APIs for accuracy.",
        tags: ["Nuxt", "Tailwind", "OpenWeather API"],
        color: "bg-accent",
        github: "https://github.com",
        demo: "https://example.com",
    },
    {
        title: "Portfolio Generator",
        description:
            "SaaS tool for developers to create stunning portfolios. Features drag-and-drop builder and custom themes.",
        tags: ["Vue", "TypeScript", "Supabase", "Tailwind"],
        color: "bg-destructive",
        github: "https://github.com",
        demo: "https://example.com",
    },*/
]
</script>
