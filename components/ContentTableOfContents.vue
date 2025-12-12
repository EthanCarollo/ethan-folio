<template>
    <div class="toc-container" :class="{ 'toc-visible': hasHeadings }">
    <div class="toc-header">
      <div class="toc-nav-item">
        <NuxtLink to="/" class="toc-link">
          <span class="toc-prefix">$ </span>
          cd ..
        </NuxtLink>
      </div>
      <span class="toc-title">$ ls -la</span>
    </div>

        <nav class="toc-nav">
            <ul class="toc-list">
                <li
                    v-for="heading in headings"
                    :key="heading.id"
                    class="toc-item"
                    :class="[`toc-level-${heading.level}`, { 'toc-active': heading.id === activeHeading }]"
                >
                    <a
                        :href="`#${heading.id}`"
                        @click.prevent="scrollToHeading(heading.id)"
                        class="toc-link"
                    >
                        <span class="toc-prefix">{{ getPrefix(heading.level) }}</span>
                        {{ heading.text }}
                    </a>
                </li>
            </ul>
        </nav>

        <div class="toc-indicator" :style="{ top: `${indicatorPosition}px` }"></div>
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

const observer = ref<MutationObserver | null>(null)

const extractHeadings = () => {
    nextTick(() => {
        const contentElement = document.querySelector('.prose')
        if (!contentElement) return

        const headingElements = contentElement.querySelectorAll('h1, h2, h3')
        const newHeadings: Heading[] = []

        headingElements.forEach((element, index) => {
            if (!element.id) {
                element.id = `heading-${index}-${element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''}`
            }

            newHeadings.push({
                id: element.id,
                text: element.textContent || '',
                level: parseInt(element.tagName.charAt(1))
            })
        })

        headings.value = newHeadings
        hasHeadings.value = newHeadings.length > 0

        setupContentObserver()
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
    }
}

const updateActiveHeading = () => {
    const scrollPosition = window.scrollY + 100

    for (let i = headings.value.length - 1; i >= 0; i--) {
        const heading = headings.value[i]
        const element = document.getElementById(heading.id)

        if (element && element.offsetTop <= scrollPosition) {
            activeHeading.value = heading.id
            updateIndicatorPosition(i)
            break
        }
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

const throttledUpdate = throttle(updateActiveHeading, 100)

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
.toc-container {
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
.toc-container::-webkit-scrollbar {
    @apply w-2;
}

.toc-container::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.toc-container::-webkit-scrollbar-thumb {
    @apply bg-foreground/20 rounded-full;
}

.toc-container::-webkit-scrollbar-thumb:hover {
    @apply bg-foreground/30;
}

/* Hide TOC on mobile screens */
@media (max-width: 768px) {
    .toc-container {
        @apply hidden;
    }
}
</style>
