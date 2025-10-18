<template>
    <section class="py-20 px-4 bg-stone-100 overflow-hidden">
        <div class="max-w-4xl mx-auto mb-12">
            <div class="inline-block px-8 py-4 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                <h2 class="text-5xl md:text-6xl font-black">SKILLS</h2>
            </div>
        </div>

        <!-- First row - moving right -->
        <div class="relative mb-8">
            <div class="flex gap-6 animate-scroll-right">
                <div
                    v-for="(skill, index) in skills"
                    :key="`row1-${index}`"
                    :class="`${skill.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-8 py-4 flex-shrink-0 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200`"
                >
                    <span class="text-2xl font-black whitespace-nowrap">{{ skill.name }}</span>
                </div>
            </div>
        </div>

        <!-- Second row - moving left -->
        <div class="relative mb-8">
            <div class="flex gap-6 animate-scroll-left">
                <div
                    v-for="(skill, index) in skills2"
                    :key="`row2-${index}`"
                    :class="`${skill.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-8 py-4 flex-shrink-0 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 rotate-1`"
                >
                    <span class="text-2xl font-black whitespace-nowrap">{{ skill.name }}</span>
                </div>
            </div>
        </div>

        <!-- Third row - moving right slower -->
        <div class="relative">
            <div class="flex gap-6 animate-scroll-right-slow">
                <div
                    v-for="(skill, index) in skills3"
                    :key="`row3-${index}`"
                    :class="`${skill.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-8 py-4 flex-shrink-0 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 -rotate-1`"
                >
                    <span class="text-2xl font-black whitespace-nowrap">{{ skill.name }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const tripleArray = (arr) => {
    return [...arr, ...arr, ...arr]
}

const skills = tripleArray([
    { name: "Vue", color: "bg-green-400" },
    { name: "Nuxt", color: "bg-emerald-400" },
    { name: "TypeScript", color: "bg-blue-400" },
    { name: "Kotlin", color: "bg-purple-400" },
    { name: "Python", color: "bg-yellow-400" },
    { name: "Three.JS", color: "bg-pink-400" },
]);

// Double the skills array for seamless infinite loop
const skills2 = tripleArray([
    { name: "Node.js", color: "bg-lime-400" },
    { name: "Express", color: "bg-orange-400" },
    { name: "PostgreSQL", color: "bg-cyan-400" },
    { name: "PHP", color: "bg-indigo-400" },
    { name: "Gleam", color: "bg-purple-400" },
]);

// Reversed array for opposite direction
const skills3 = tripleArray([
    { name: "Git", color: "bg-red-400" },
    { name: "GH Actions", color: "bg-violet-400" },
    { name: "Docker", color: "bg-sky-400" },
    { name: "Coolify", color: "bg-teal-400" },
    { name: "Unity", color: "bg-yellow-400" },
]);
</script>

<style scoped>
@keyframes scroll-right {
    0% {
        transform: translateX(-50%);
    }
    100% {
        transform: translateX(0%);
    }
}

@keyframes scroll-left {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(-50%);
    }
}

.animate-scroll-right {
    animation: scroll-right 40s linear infinite;
    will-change: transform;
}

.animate-scroll-left {
    animation: scroll-left 40s linear infinite;
    will-change: transform;
}

.animate-scroll-right-slow {
    animation: scroll-right 60s linear infinite;
    will-change: transform;
}
</style>