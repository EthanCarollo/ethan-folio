<template>
    <div>
        <!-- Desktop Sidebar -->
        <div class="toc-desktop hidden lg:block" :class="{ 'toc-visible': hasHeadings }">
            <div class="toc-header flex flex-col">
                <NuxtLink to="/" class="text-foreground/70 text-sm font-mono hover:text-foreground">{{
                    $t('toc.backToHome') }}</NuxtLink>
                <span class="toc-title">{{ $t('toc.title') }}</span>
            </div>

            <nav class="toc-nav">
                <ul class="toc-list">
                    <li v-for="heading in headings" :key="heading.id" class="toc-item"
                        :class="[`toc-level-${heading.level}`, { 'toc-active': heading.id === activeHeading }]">
                        <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)" class="toc-link">
                            <span class="toc-prefix">{{ getPrefix(heading.level) }}</span>
                            {{ heading.text }}
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="toc-indicator" :style="{ top: `${indicatorPosition}px` }"></div>
        </div>

        <!-- Mobile Chip -->
        <button v-if="hasHeadings" @click="isMobileMenuOpen = true"
            class="lg:hidden fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-2 rounded-full shadow-lg font-mono text-xs flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <span class="text-lg">≡</span>
            {{ $t('toc.title') }}
        </button>

        <!-- Mobile Menu Overlay -->
        <div v-if="isMobileMenuOpen" class="lg:hidden fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm p-6 overflow-y-auto"
            @click.self="isMobileMenuOpen = false">
            
            <div class="flex justify-between items-center mb-8">
                <span class="text-foreground font-mono font-bold">{{ $t('toc.title') }}</span>
                <button @click="isMobileMenuOpen = false" class="text-foreground p-2 text-xl">✕</button>
            </div>

            <nav class="toc-mobile-nav">
                <ul class="space-y-4">
                     <li class="mb-6">
                        <NuxtLink to="/" class="text-foreground/70 text-sm font-mono hover:text-foreground flex items-center gap-2">
                             {{ $t('toc.backToHome') }}
                        </NuxtLink>
                    </li>
                    <li v-for="heading in headings" :key="heading.id"
                        class="toc-item-mobile"
                        :class="[`pl-${(heading.level - 1) * 4}`]">
                        <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)" 
                           class="block text-foreground/80 py-2 border-b border-foreground/10"
                           :class="{ 'text-foreground font-bold': heading.id === activeHeading }">
                            {{ heading.text }}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Heading {
    id: string
    text: string
    level: number
}

const headings = ref<Heading[]>([])
const activeHeading = ref<string>('')
const indicatorPosition = ref(0)
const hasHeadings = ref(false)
const isMobileMenuOpen = ref(false)

const observer = ref<MutationObserver | null>(null)

const extractHeadings = () => {
    // Utiliser requestAnimationFrame pour éviter le blocage
    requestAnimationFrame(() => {
        const contentElement = document.querySelector('.prose')
        if (!contentElement) return

        // Limiter aux H1 et H2 uniquement pour réduire le nombre d'éléments
        const headingElements = contentElement.querySelectorAll('h1, h2')
        const newHeadings: Heading[] = []

        // Utiliser une boucle for classique pour meilleures performances
        for (let i = 0; i < headingElements.length; i++) {
            const element = headingElements[i] as HTMLElement
            if (!element.id) {
                element.id = `heading-${i}-${element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''}`
            }

            newHeadings.push({
                id: element.id,
                text: element.textContent || '',
                level: parseInt(element.tagName.charAt(1))
            })
        }

        headings.value = newHeadings
        hasHeadings.value = newHeadings.length > 0
    })
}

const setupContentObserver = () => {
    if (observer.value) {
        observer.value.disconnect()
    }

    const contentElement = document.querySelector('.prose')
    if (!contentElement) return

    observer.value = new MutationObserver(() => {
        extractHeadings()
    })

    observer.value.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true
    })
}

const getPrefix = (level: number): string => {
    switch (level) {
        case 1: return '# '
        case 2: return '## '
        case 3: return '### '
        default: return '- '
    }
}

const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        const yOffset = -20
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        activeHeading.value = id
        isMobileMenuOpen.value = false // Close menu on mobile
    }
}

const updateActiveHeading = () => {
  if (headings.value.length === 0) return
  
  const scrollPosition = window.scrollY + 100
  let foundIndex = -1

  // Utiliser une boucle for classique pour performance
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)

    if (element && element.offsetTop <= scrollPosition) {
      foundIndex = i
      break
    }
  }

  if (foundIndex !== -1) {
    activeHeading.value = headings.value[foundIndex].id
    updateIndicatorPosition(foundIndex)
  }
}

const updateIndicatorPosition = (headingIndex: number) => {
    const itemHeight = 32
    indicatorPosition.value = headingIndex * itemHeight + 48
}

const throttle = (func: Function, delay: number) => {
    let timeoutId: number | null = null
    return (...args: any[]) => {
        if (timeoutId) return
        timeoutId = window.setTimeout(() => {
            func(...args)
            timeoutId = null
        }, delay)
    }
}

const throttledUpdate = throttle(updateActiveHeading, 200) // Augmenter le délai pour réduire les calculs

onMounted(() => {
    extractHeadings()
    window.addEventListener('scroll', throttledUpdate)
    window.addEventListener('resize', throttledUpdate)
})

onUnmounted(() => {
    window.removeEventListener('scroll', throttledUpdate)
    window.removeEventListener('resize', throttledUpdate)
    if (observer.value) {
        observer.value.disconnect()
    }
})
</script>

<style scoped>
/* Fixed position for TOC to always stay on the left */
.toc-desktop {
    @apply fixed left-0 top-0 w-64 min-h-screen max-h-screen bg-background border-r border-foreground/20 p-4;
    overflow-y: hidden;
    z-index: 40;
}

.toc-visible {
    @apply block;
}

.toc-header {
  @apply mb-4 pb-2 border-b border-foreground/20 space-y-2;
}

.toc-nav-item {
  @apply mb-2;
}

.toc-title {
    @apply text-foreground/70 text-sm font-mono;
}

.toc-nav {
    @apply relative;
}

.toc-list {
    @apply list-none m-0 p-0 space-y-1;
}

.toc-item {
    @apply relative;
}

.toc-link {
    @apply block text-foreground/70 hover:text-foreground transition-colors text-sm font-mono no-underline;
    @apply py-1 px-2 rounded hover:bg-foreground/5;
}

.toc-prefix {
    @apply text-foreground/50 mr-1;
}

.toc-level-1 {
    @apply font-bold;
}

.toc-level-2 {
    @apply ml-4 text-foreground/60;
}

.toc-level-3 {
    @apply ml-8 text-foreground/50 text-xs;
}

.toc-active .toc-link {
    @apply text-foreground bg-foreground/10;
}

.toc-indicator {
    @apply absolute left-0 w-1 h-6 bg-foreground rounded-r-full transition-all duration-300;
    @apply -ml-4;
}

/* Scrollbar personnalisée */
.toc-desktop::-webkit-scrollbar {
    @apply w-2;
}

.toc-desktop::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.toc-desktop::-webkit-scrollbar-thumb {
    @apply bg-foreground/20 rounded-full;
}

.toc-desktop::-webkit-scrollbar-thumb:hover {
    @apply bg-foreground/30;
}
</style>
