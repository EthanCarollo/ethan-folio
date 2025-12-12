<template>
    <section class="min-h-screen flex items-center justify-center px-4 py-20 font-mono">
        <div class="max-w-3xl mx-auto w-full">
            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">$ whoami</div>
                <div class="text-foreground mt-2">
                    <div class="mb-4">
                        <span class="text-foreground/60">&gt; </span>
                        <span class="text-foreground text-2xl md:text-3xl">ETHAN CAROLLO</span>
                    </div>
                    <div class="text-foreground/70 mb-6">
                        {{ currentTitle }}
                    </div>
                </div>
            </div>

            <div class="mt-8 space-y-1 text-sm">
                <div class="text-foreground/60">$ pwd</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>~/portfolio</div>
                </div>
            </div>

            <div class="mt-8 space-y-1 text-sm">
                <div class="text-foreground/60">$ ls -la</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>total 2</div>
                    <a href="#about" class="hover:text-foreground transition-colors block">drwxr-xr-x about/</a>
                    <a href="#projects" class="hover:text-foreground transition-colors block">drwxr-xr-x projects/</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const titles = [
    "Polyvalent Developer & Master's Student",
    'Game Dev Enthusiast',
    'Code Craftsman & Problem Solver',
    'Machine Learning Explorer'
];

const currentTitle = ref(titles[0]);
let titleInterval: ReturnType<typeof setInterval>;

onMounted(() => {
    titleInterval = setInterval(() => {
        const currentIndex = titles.indexOf(currentTitle.value);
        const nextIndex = (currentIndex + 1) % titles.length;
        currentTitle.value = titles[nextIndex];
    }, 3000);
});

onUnmounted(() => {
    if (titleInterval) clearInterval(titleInterval);
});
</script>

<style scoped>
/* Component styles */
</style>
