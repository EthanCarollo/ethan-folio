<template>
    <section class="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 font-mono">
        <div class="max-w-3xl mx-auto w-full">
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
                <a href="#about" class="text-foreground/70 hover:text-foreground transition-colors block">→ {{
                    $t('hero.about') }}</a>
                <a href="#projects" class="text-foreground/70 hover:text-foreground transition-colors block">→
                    {{ $t('hero.projects') }}</a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ThreeDBar from './ThreeDBar.vue';

const { t, locale } = useI18n();

// Texts for the 3D Bar
const heroTexts = computed(() => [
    t('hero.name'), // Front: "ETHAN CAROLLO"
    'POLYMORPHIC DEV', // Bottom
    "MASTER'S STUDENT", // Back
    'GAME DEV ADDICT' // Top
]);
</script>

<style scoped>
/* Component styles */
</style>
