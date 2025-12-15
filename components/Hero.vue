<template>
    <section id="home" class="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 font-mono">
        <div class="max-w-4xl mx-auto w-full">
            <div class="space-y-1 text-sm">
                <!-- Profile label removed -->
                <div class="text-foreground mt-2 relative z-10">
                    <ThreeDBar :texts="heroTexts" />
                </div>
            </div>

            <!-- Navigation -->
            <div
                class="mt-8 flex flex-row items-center justify-center gap-6 md:fixed md:bottom-8 md:left-8 md:z-40 md:mt-0 md:flex-col md:items-start md:justify-start md:gap-2 text-sm font-mono">
                <div class="text-foreground/60 mb-1 hidden md:block">{{ $t('hero.navigation') }}</div>

                <a href="#home" class="block transition-all duration-300"
                    :class="activeSection === 'home' ? 'text-foreground opacity-100 font-bold' : 'text-foreground/70 opacity-70 hover:opacity-100'">
                    → {{ $t('hero.home') }}
                </a>

                <a href="#about" class="block transition-all duration-300"
                    :class="activeSection === 'about' ? 'text-foreground opacity-100 font-bold' : 'text-foreground/70 opacity-70 hover:opacity-100'">
                    → {{ $t('hero.about') }}
                </a>

                <a href="#projects" class="block transition-all duration-300"
                    :class="activeSection === 'projects' ? 'text-foreground opacity-100 font-bold' : 'text-foreground/70 opacity-70 hover:opacity-100'">
                    → {{ $t('hero.projects') }}
                </a>

                <a href="#contact" class="block transition-all duration-300"
                    :class="activeSection === 'contact' ? 'text-foreground opacity-100 font-bold' : 'text-foreground/70 opacity-70 hover:opacity-100'">
                    → {{ $t('hero.contact') }}
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import ThreeDBar from './ThreeDBar.vue';

const { t, locale } = useI18n();
const activeSection = ref('home');

// Texts for the 3D Bar
const heroTexts = computed(() => [
    t('hero.name'), // Front: "ETHAN CAROLLO"
    'POLYMORPHIC DEV', // Bottom
    "MASTER'S STUDENT", // Back
    'GAME DEV ADDICT' // Top
]);

let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeSection.value = entry.target.id;
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: "-20% 0px -20% 0px" // Adjust detection area to center based
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer?.observe(section));
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<style scoped>
/* Component styles */
</style>
