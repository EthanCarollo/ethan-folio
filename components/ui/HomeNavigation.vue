<template>
    <div class="fixed top-4 left-4 z-40 flex flex-col items-start justify-start gap-2
        md:top-8 md:left-12 md:gap-3 text-sm font-mono mix-blend-exclusion nav-blend-fallback transition-opacity duration-500"
        :class="hasScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'">
        <a href="#home" class="white block transition-all duration-300"
            :class="activeSection === 'home' ? 'text-white opacity-100 font-bold underline' : 'text-white/70 opacity-70 hover:opacity-100'">
            {{ $t('hero.home') }}
        </a>
        <div class="w-4 h-[1px] bg-white/10 ml-1"></div>

        <a href="#about" class="block transition-all duration-300"
            :class="activeSection === 'about' ? 'text-white opacity-100 font-bold underline' : 'text-white/70 opacity-70 hover:opacity-100'">
            {{ $t('hero.about') }}
        </a>
        <div class="w-4 h-[1px] bg-white/10 ml-1"></div>

        <a href="#projects" class="block transition-all duration-300"
            :class="activeSection === 'projects' ? 'text-white opacity-100 font-bold underline' : 'text-white/70 opacity-70 hover:opacity-100'">
            {{ $t('hero.projects') }}
        </a>
        <div class="w-4 h-[1px] bg-white/10 ml-1"></div>

        <a href="#notes" class="block transition-all duration-300"
            :class="activeSection === 'notes' ? 'text-white opacity-100 font-bold underline' : 'text-white/70 opacity-70 hover:opacity-100'">
            {{ $t('hero.notes') }}
        </a>
        <div class="w-4 h-[1px] bg-white/10 ml-1"></div>

        <a href="#contact" class="block transition-all duration-300"
            :class="activeSection === 'contact' ? 'text-white opacity-100 font-bold underline' : 'text-white/70 opacity-70 hover:opacity-100'">
            {{ $t('hero.contact') }}
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const activeSection = ref('home');

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
    hasScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Désactiver mix-blend-mode sur mobile (coûteux en GPU, illisible) */
@media (max-width: 767px) {
  .nav-blend-fallback {
    mix-blend-mode: normal;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0 8px 8px 0;
    padding: 8px 6px;
  }
}
</style>