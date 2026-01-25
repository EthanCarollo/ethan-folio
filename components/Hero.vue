<template>
    <section id="home" class="relative h-screen w-screen px-8 py-8">
        <div class="bg-black h-full w-full flex rounded-xl overflow-hidden items-center
        justify-center px-4 py-12 sm:py-16 md:py-20 font-mono">
            <div class="max-w-4xl mx-auto w-full">
                <div class="space-y-1 text-sm">
                    <!-- Profile label removed -->
                    <div class="text-foreground mt-2 relative z-10">
                        <ThreeDBar :texts="heroTexts" />
                    </div>
                </div>

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
    t('hero.role1'), // Bottom
    t('hero.role2'), // Back
    t('hero.role3') // Top
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
        threshold: 0.2,
        rootMargin: "-20% 0px -20% 0px"
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer?.observe(section));
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>