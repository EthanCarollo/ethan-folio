<template>
    <section class="py-20 px-4 font-mono" id="about">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cd about</div>
                <div class="text-foreground/60">$ ls</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>background.txt  interests.txt</div>
                </div>
            </div>

            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat background.txt</div>
                <div class="text-foreground/70 mt-2">
                    <p>
                        I'm Ethan Carollo, a 
                        <span class="inline-block relative">
                            <span
                                v-for="(word, index) in rotatingWords"
                                :key="word"
                                class="absolute inset-0 transition-all duration-500 ease-in-out"
                                :class="{
                                    'opacity-100 translate-y-0': index === currentWordIndex,
                                    'opacity-0 translate-y-2': index !== currentWordIndex
                                }"
                            >
                                {{ word.toLowerCase() }}
                            </span>
                            <span class="invisible">{{ longestWord.toLowerCase() }}</span>
                        </span>
                        developer and a Master's student at Annecy Gobelins. 
                        I work with a variety of languages, including Kotlin for Android and Python for machine learning. 
                        I also love Nuxt and spend my free time developing games with Unity.
                    </p>
                </div>
            </div>

            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">$ cat interests.txt</div>
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

const rotatingWords = [
    'Versatile',
    'Adaptable',
    'Resilient',
    'All-round'
];

const longestWord = rotatingWords.reduce((a, b) => a.length > b.length ? a : b);
const currentWordIndex = ref(0);

let wordInterval: ReturnType<typeof setInterval>;

onMounted(() => {
    wordInterval = setInterval(() => {
        currentWordIndex.value = (currentWordIndex.value + 1) % rotatingWords.length;
    }, 2500);
});

onUnmounted(() => {
    if (wordInterval) clearInterval(wordInterval);
});

const items = [
    "Develop web applications",
    "Create mobile applications",
    "Design and build video games",
    "Implement continuous delivery cycles",
]
</script>

<style scoped>
/* Component styles */
</style>
