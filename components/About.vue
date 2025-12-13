<template>
    <section class="py-20 px-4 font-mono" id="about">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">Background</div>
            </div>

            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">About Me</div>
                <div class="text-foreground/70 mt-2">
                    <p v-if="rotatingWords[currentWordIndex]">
                        {{ $t('about.backgroundText', { word: rotatingWords[currentWordIndex].toLowerCase() }) }}
                    </p>
                </div>
            </div>

            <div class="space-y-1 text-sm">
                <div class="text-foreground/60 mb-2">Interests</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-for="(item, index) in items" :key="index" class="pl-4">
                        - {{ item }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
const { t, locale } = useI18n();

// Utiliser des refs réactives pour les mots et items
const rotatingWords = ref<string[]>([]);
const currentWordIndex = ref(0);
const items = ref<string[]>([]);

// Fonction pour mettre à jour les traductions
const updateTranslations = () => {
    rotatingWords.value = [
        t('about.words[0]'),
        t('about.words[1]'),
        t('about.words[2]'),
        t('about.words[3]')
    ];
    
    items.value = [
        t('about.interests[0]'),
        t('about.interests[1]'),
        t('about.interests[2]'),
        t('about.interests[3]')
    ];
};

const longestWord = computed(() => rotatingWords.value.reduce((a, b) => a.length > b.length ? a : b));

let wordInterval: ReturnType<typeof setInterval>;

// Watcher pour détecter les changements de locale
watch(locale, () => {
    updateTranslations();
});

onMounted(() => {
    updateTranslations(); // Initialisation
    wordInterval = setInterval(() => {
        currentWordIndex.value = (currentWordIndex.value + 1) % rotatingWords.value.length;
    }, 2500);
});

onUnmounted(() => {
    if (wordInterval) clearInterval(wordInterval);
});
</script>

<style scoped>
/* Component styles */
</style>
