<template>
    <section class="min-h-screen flex items-center justify-center px-4 py-20 font-mono">
        <div class="max-w-3xl mx-auto w-full">
            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">Profile</div>
                <div class="text-foreground mt-2">
                    <div class="mb-4">
                        <span class="text-foreground/60">> </span>
                        <span class="text-foreground text-2xl md:text-3xl">{{ $t('hero.name') }}</span>
                    </div>
                    <div class="text-foreground/70 mb-6">
                        {{ currentTitle }}
                    </div>
                </div>
            </div>

            <div class="mt-8 space-y-1 text-sm">
                <div class="text-foreground/60">Location</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>{{ $t('hero.path') }}</div>
                </div>
            </div>

            <div class="mt-8 space-y-1 text-sm">
                <div class="text-foreground/60">Navigation</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>{{ $t('hero.total') }}</div>
                    <a href="#about" class="hover:text-foreground transition-colors block">{{ $t('hero.about') }}</a>
                    <a href="#projects" class="hover:text-foreground transition-colors block">{{ $t('hero.projects') }}</a>
                    <a href="#blog" class="hover:text-foreground transition-colors block">{{ $t('hero.blog') }}</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
const { t, locale } = useI18n();

// Utiliser une ref réactive pour le titre
const currentTitle = ref('');
let titleInterval: ReturnType<typeof setInterval>;

// Fonction pour mettre à jour le titre
const updateTitle = () => {
    currentTitle.value = t('hero.title');
};

// Watcher pour détecter les changements de locale
watch(locale, () => {
    updateTitle();
});

onMounted(() => {
    updateTitle(); // Initialisation
    titleInterval = setInterval(() => {
        updateTitle();
    }, 3000);
});

onUnmounted(() => {
    if (titleInterval) clearInterval(titleInterval);
});
</script>

<style scoped>
/* Component styles */
</style>
