<template>
    <section class="py-20 px-4 bg-muted">
        <div class="max-w-5xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-secondary border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">SKILLS</h2>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="(category, index) in skillCategories" :key="index" class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div :class="`${category.color} border-b-4 border-foreground p-4`">
                        <h3 class="text-2xl font-black text-center text-foreground">{{ category.title }}</h3>
                    </div>

                    <div class="p-6">
                        <ul class="space-y-3">
                            <li
                                v-for="(skill, skillIndex) in category.skills"
                                :key="skillIndex"
                                class="px-4 py-2 bg-muted border-2 border-foreground font-bold text-center text-foreground"
                            >
                                {{ skill }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { /* Add any icons you need here */ } from 'lucide-vue-next';
const skillCategories = [
    {
        title: "Frontend",
        color: "bg-primary",
        skills: ["Vue", "Nuxt", "TypeScript", "Kotlin", "Python", "Three.JS"],
    },
    {
        title: "Backend",
        color: "bg-secondary",
        skills: ["Node.js", "Express", "PostgreSQL", "PHP"],
    },
    {
        title: "Tools",
        color: "bg-accent",
        skills: ["Git", "GH Actions", "Docker", "Coolify"],
    },
]
</script>
