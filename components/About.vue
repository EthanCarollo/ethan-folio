<template>
    <section class="py-20 px-4 font-mono" id="about">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">{{ $t('about.cdAbout') }}</div>
                <div class="text-foreground/60">{{ $t('about.ls') }}</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>{{ $t('about.files') }}</div>
                </div>
            </div>

            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">{{ $t('about.catBackground') }}</div>
                <div class="text-foreground/70 mt-2">
                    <p>
                        {{ $t('about.backgroundText', { word: rotatingWords[currentWordIndex].toLowerCase() }) }}
                    </p>
                </div>
            </div>

            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">{{ $t('about.catInterests') }}</div>
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
import { ref, onMounted, onUnmounted } from 'vue';
const { t } = useI18n();

const rotatingWords = computed(() => [
    t('about.words[0]'),
    t('about.words[1]'),
    t('about.words[2]'),
    t('about.words[3]')
]);

const longestWord = computed(() => rotatingWords.value.reduce((a, b) => a.length > b.length ? a : b));
const currentWordIndex = ref(0);

let wordInterval: ReturnType<typeof setInterval>;

onMounted(() => {
    wordInterval = setInterval(() => {
        currentWordIndex.value = (currentWordIndex.value + 1) % rotatingWords.value.length;
    }, 2500);
});

onUnmounted(() => {
    if (wordInterval) clearInterval(wordInterval);
});

const items = computed(() => [
    t('about.interests[0]'),
    t('about.interests[1]'),
    t('about.interests[2]'),
    t('about.interests[3]')
]);
</script>

<style scoped>
/* Component styles */
</style>
