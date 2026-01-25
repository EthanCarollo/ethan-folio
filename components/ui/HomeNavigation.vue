<template>
    <div class="mt-8 flex flex-row items-center justify-center gap-6
        md:fixed md:bottom-6 md:left-6 md:z-40 md:mt-0 md:flex-col md:items-start md:justify-start
        md:gap-2 text-sm font-mono mix-blend-mode mix-blend-exclusion transition-opacity duration-500"
        :class="hasScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'">
        <!-- 
        <div class="text-white/60 mb-1 hidden md:block">{{ $t('hero.navigation') }}</div>
        -->

        <a href="#home" class="white block transition-all duration-300"
            :class="activeSection === 'home' ? 'text-white opacity-100 font-bold' : 'text-white/70 opacity-70 hover:opacity-100'">
            → {{ $t('hero.home') }}
        </a>

        <a href="#about" class="block transition-all duration-300"
            :class="activeSection === 'about' ? 'text-white opacity-100 font-bold' : 'text-white/70 opacity-70 hover:opacity-100'">
            → {{ $t('hero.about') }}
        </a>

        <a href="#projects" class="block transition-all duration-300"
            :class="activeSection === 'projects' ? 'text-white opacity-100 font-bold' : 'text-white/70 opacity-70 hover:opacity-100'">
            → {{ $t('hero.projects') }}
        </a>

        <a href="#notes" class="block transition-all duration-300"
            :class="activeSection === 'notes' ? 'text-white opacity-100 font-bold' : 'text-white/70 opacity-70 hover:opacity-100'">
            → Notes
        </a>

        <a href="#contact" class="block transition-all duration-300"
            :class="activeSection === 'contact' ? 'text-white opacity-100 font-bold' : 'text-white/70 opacity-70 hover:opacity-100'">
            → {{ $t('hero.contact') }}
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

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


const hasScrolled = ref(false)

const handleScroll = () => {
    hasScrolled.value = window.scrollY > window.innerHeight
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>