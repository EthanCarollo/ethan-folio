<template>
    <nav :aria-label="$t('hero.home')" class="fixed top-4 left-4 z-40 flex flex-col items-start justify-start gap-2
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
    </nav>
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
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@media (max-width: 767px) {
  .nav-blend-fallback {
    mix-blend-mode: normal;
    top: auto;
    left: max(0.75rem, env(safe-area-inset-left));
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: calc(0.75rem + env(safe-area-inset-bottom));
    flex-direction: row;
    align-items: stretch;
    gap: 0;
    padding: 4px;
    border: 1px solid rgb(var(--color-foreground) / 0.2);
    border-radius: 12px;
    background: rgb(var(--color-background) / 0.98);
    font-size: 10px;
  }

  .nav-blend-fallback > a {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 44px;
    align-items: center;
    justify-content: center;
  }

  .nav-blend-fallback > div {
    display: none;
  }
}
</style>
