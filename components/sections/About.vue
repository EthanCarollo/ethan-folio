<template>
    <section class="py-12 sm:py-16 md:py-20 px-4 font-mono mt-1" id="about">
        <div class="max-w-3xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                <div class="col-span-1 md:col-span-3">
                    <!-- Top section: Photo and Intro Text side-by-side on mobile -->
                    <div class="flex flex-row gap-6 md:grid md:grid-cols-3 md:gap-12 items-start mb-8">
                        <!-- Intro Text container: takes remaining width on mobile, 2 columns on desktop -->
                        <div class="flex-1 md:col-start-1 md:col-span-2 md:row-start-1">
                            <div class="space-y-1 text-sm">
                                <div class="text-foreground/60 mb-2">{{ $t('about.title') }}</div>
                                <div class="text-foreground/70 mt-2">
                                    <p v-if="rotatingWords[currentWordIndex]">
                                        {{ $t('about.backgroundText', { word: rotatingWords[currentWordIndex].toLowerCase() })
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Photo container: shrinks on mobile, takes full column on desktop -->
                        <div class="w-1/3 md:w-full md:col-start-3 md:row-start-1 shrink-0">
                            <div class="relative group">
                                <div class="aspect-[3/4] w-full relative overflow-hidden bg-foreground/5 rounded-lg">
                                    <img src="/images/photome.png" alt="Ethan Carollo"
                                        class="w-full h-full object-cover filter rounded-lg" />
                                    <!-- Border frame effect -->
                                    <div class="absolute inset-0 border-2 border-foreground/10 pointer-events-none rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom section: Interests and Links, full width -->
                    <div class="md:grid md:grid-cols-3 md:gap-12">
                        <div class="md:col-span-2 space-y-8">
                            <div class="space-y-1 text-sm">
                                <div class="text-foreground/60 mb-2">{{ $t('about.interestsTitle') }}</div>
                                <div class="text-foreground/70 mt-2 space-y-1">
                                    <div v-for="(item, index) in items" :key="index" class="pl-4">
                                        - {{ item }}
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2">
                                <a href="https://github.com/EthanCarollo" target="_blank" rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors group/link">
                                    <span class="group-hover/link:translate-x-1 transition-transform">→</span>
                                    GitHub
                                </a>
                            </div>
                        </div>
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
