<template>
    <section id="home" class="relative h-dvh w-screen transition-all duration-700 ease-in-out"
        :class="hasScrolled ? 'px-8 py-8' : 'px-0 py-0'">
        <div class="bg-black relative h-full w-full flex overflow-hidden items-center justify-center px-4 py-12 sm:py-16 md:py-20 font-mono transition-all duration-700 ease-in-out"
            :class="hasScrolled ? 'rounded-xl' : 'rounded-none'">

            <!-- Server-rendered ASCII loader: visible instantly, hidden when WebGL is ready -->
            <div
                ref="loaderEl"
                class="ascii-hero-loader absolute inset-0 z-10 bg-black flex items-center justify-center overflow-hidden"
            >
                <pre
                    class="text-[#0a0a0a] leading-none font-mono whitespace-pre select-none pointer-events-none"
                    style="font-size: 14px; letter-spacing: 1px; opacity: 0.7;"
                >{{ loaderGrid }}</pre>
            </div>

            <ClientOnly>
                <div class="absolute inset-0 z-0 opacity-20 text-white">
                    <AsciiWave @ready="onAsciiReady" />
                </div>
            </ClientOnly>

            <div class="max-w-4xl mx-auto w-full relative z-10">
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

const { t, locale } = useI18n();
const activeSection = ref('home');
const loaderEl = ref<HTMLElement | null>(null);

// ---- ASCII loader grid (server-rendered, visible from first paint) ----
const loaderChars = '▓▒░◆◇○●□■△▲▽▼☆★♦♢♤♧'
const loaderCols = 60
const loaderRows = 20

const buildLoaderGrid = () => {
  const lines: string[] = []
  for (let y = 0; y < loaderRows; y++) {
    let line = ''
    for (let x = 0; x < loaderCols; x++) {
      const idx = ((x * 7 + y * 13) ^ (x << 3)) % loaderChars.length
      line += loaderChars[Math.abs(idx)]
    }
    lines.push(line)
  }
  return lines.join('\n')
}

const loaderGrid = buildLoaderGrid()

const onAsciiReady = () => {
  if (loaderEl.value) {
    loaderEl.value.style.opacity = '0'
    loaderEl.value.style.transition = 'opacity 0.4s ease-out'
    setTimeout(() => {
      if (loaderEl.value) loaderEl.value.style.display = 'none'
    }, 400)
  }
}

// Texts for the 3D Bar
const heroTexts = computed(() => [
    t('hero.name'), // Front: "ETHAN CAROLLO"
    t('hero.role1'), // Bottom
    t('hero.role2'), // Back
    t('hero.role3') // Top
]);

let observer: IntersectionObserver | null = null;
const hasScrolled = ref(false);

const handleScroll = () => {
    // Trigger animation as soon as scroll starts, or at a very small threshold
    hasScrolled.value = window.scrollY > 50;
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);

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
    window.removeEventListener('scroll', handleScroll);
    if (observer) observer.disconnect();
});
</script>