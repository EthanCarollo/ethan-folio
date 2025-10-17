<template>
    <section class="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-20 right-20 w-32 h-32 bg-primary border-4 border-foreground rotate-12" />
        <div class="absolute bottom-40 left-10 w-24 h-24 bg-secondary border-4 border-foreground -rotate-6" />
        <div class="absolute top-1/2 right-1/4 w-16 h-16 bg-accent border-4 border-foreground rotate-45" />

        <div class="max-w-5xl mx-auto text-center relative z-10">
            <div class="inline-block mb-6 px-6 py-2 bg-primary border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
                <p class="font-mono text-sm font-bold text-foreground">{{ "<DEVELOPER />" }}</p>
            </div>

            <h1 class="text-6xl md:text-8xl font-black mb-6 leading-none text-balance">ETHAN CAROLLO</h1>

            <div class="inline-block mb-8 px-8 py-4 bg-secondary border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                <p class="text-xl md:text-2xl font-bold text-foreground">Polymorphic Developer & Master's Student</p>
            </div>

            <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed text-foreground/80">
                I build diverse applications using Kotlin, Python, and Nuxt. Passionate about game development, machine learning, and creating innovative solutions.
            </p>

            <div class="flex flex-wrap gap-4 justify-center mb-12">
                <button
                    class="px-6 py-3 bg-foreground text-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-lg inline-flex items-center gap-2"
                >
                    View My Work
                    <ArrowRightIcon class="w-5 h-5" />
                </button>
                <button
                    class="px-6 py-3 bg-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-lg"
                >
                    Get In Touch
                </button>
            </div>

            <div class="flex gap-4 justify-center">
                <a
                    href="https://github.com/EthanCarollo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 bg-card border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                    <GithubIcon class="w-6 h-6" />
                    <span class="sr-only">GitHub</span>
                </a>
                <a
                    href="mailto:alex@example.com"
                    class="p-3 bg-card border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                    <LucideMail class="w-6 h-6" />
                    <span class="sr-only">Email</span>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { GithubIcon, LucideMail, ArrowRightIcon } from 'lucide-vue-next';

</script>