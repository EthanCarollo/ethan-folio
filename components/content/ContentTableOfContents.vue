<template>
    <div>
        <!-- Desktop Sidebar -->
        <div v-if="hasHeadings" class="toc-desktop hidden lg:block">
            <div class="toc-header flex flex-col">
                <NuxtLink :to="localePath('/')" class="text-foreground/70 text-sm font-mono hover:text-foreground">
                    {{ t('toc.backToHome') }}
                </NuxtLink>
                <span class="toc-title">{{ t('toc.title') }}</span>
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

        <!-- Mobile Accordion -->
        <div v-if="hasHeadings" class="lg:hidden w-full mb-8 border border-foreground/20 rounded-lg overflow-hidden bg-background">
            <details ref="mobileDetailsRef" class="group">
                <summary class="flex justify-between items-center p-4 bg-foreground/5 cursor-pointer font-mono text-sm text-foreground/80 hover:bg-foreground/10 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                    <span class="flex items-center gap-2">
                        <span class="text-xs transition-transform duration-200 group-open:rotate-90">▶</span>
                        <span class="font-semibold">{{ t('toc.title') }}</span>
                    </span>
                    <span class="text-xs text-foreground/50 font-mono group-open:hidden">
                        {{ headings.length }}
                    </span>
                    <span class="text-xs text-foreground/50 font-mono hidden group-open:inline-block">
                        ✕ {{ t('toc.close') }}
                    </span>
                </summary>
                <div class="p-4 bg-background border-t border-foreground/10">
                    <nav class="toc-mobile-nav">
                        <ul class="space-y-2">
                            <li class="mb-3 pb-3 border-b border-foreground/10">
                                <NuxtLink :to="localePath('/')" class="text-foreground/70 text-xs font-mono hover:text-foreground flex items-center gap-2">
                                     {{ t('toc.backToHome') }}
                                </NuxtLink>
                            </li>
                            <li v-for="heading in headings" :key="heading.id"
                                class="toc-item-mobile text-sm font-mono"
                                :class="heading.level === 1 ? 'font-semibold' : 'pl-4 text-foreground/70'">
                                <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)" 
                                   class="block py-1.5 px-2 rounded hover:bg-foreground/5 transition-colors"
                                   :class="{ 'text-foreground font-bold bg-foreground/10': heading.id === activeHeading, 'text-foreground/80': heading.id !== activeHeading }">
                                    <span class="text-foreground/40 mr-1">{{ getPrefix(heading.level) }}</span>
                                    {{ heading.text }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="mt-4 pt-3 border-t border-foreground/10 flex justify-end">
                        <button type="button" @click="closeMobileMenu" class="text-xs font-mono text-foreground/60 hover:text-foreground px-3 py-1.5 rounded border border-foreground/20 hover:bg-foreground/5 transition-colors">
                            ✕ {{ t('toc.close') }}
                        </button>
                    </div>
                </div>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

interface Heading {
    id: string
    text: string
    level: number
}

const headings = ref<Heading[]>([])
const activeHeading = ref<string>('')
const indicatorPosition = ref(0)
const hasHeadings = ref(false)
const mobileDetailsRef = ref<HTMLDetailsElement | null>(null)

const observer = ref<MutationObserver | null>(null)

const extractHeadings = () => {
    requestAnimationFrame(() => {
        const contentElement = document.querySelector('.prose')
        if (!contentElement) return

        const headingElements = contentElement.querySelectorAll('h1, h2')
        const newHeadings: Heading[] = []

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
        observer.value = null
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

const closeMobileMenu = () => {
    if (mobileDetailsRef.value) {
        mobileDetailsRef.value.open = false
    }
}

const scrollToHeading = (id: string) => {
    closeMobileMenu()
    requestAnimationFrame(() => {
        const element = document.getElementById(id)
        if (element) {
            const yOffset = -80
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
            activeHeading.value = id
        }
    })
}

const updateActiveHeading = () => {
  if (headings.value.length === 0) return
  
  const scrollPosition = window.scrollY + 100
  let foundIndex = -1

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

const throttledUpdate = throttle(updateActiveHeading, 200)

const handleOutsideClick = (event: MouseEvent) => {
    if (!mobileDetailsRef.value || !mobileDetailsRef.value.open) return
    const target = event.target as Node | null
    if (target && !mobileDetailsRef.value.contains(target)) {
        closeMobileMenu()
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mobileDetailsRef.value && mobileDetailsRef.value.open) {
        closeMobileMenu()
    }
}

onMounted(() => {
    extractHeadings()
    setupContentObserver()
    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', throttledUpdate, { passive: true })
    window.addEventListener('click', handleOutsideClick)
    window.addEventListener('keydown', handleKeydown)
})

watch(() => route.fullPath, () => {
    nextTick(() => {
        extractHeadings()
        setupContentObserver()
    })
})

onUnmounted(() => {
    window.removeEventListener('scroll', throttledUpdate)
    window.removeEventListener('resize', throttledUpdate)
    window.removeEventListener('click', handleOutsideClick)
    window.removeEventListener('keydown', handleKeydown)
    if (observer.value) {
        observer.value.disconnect()
    }
})
</script>

<style scoped>
/* Fixed position for TOC to always stay on the left */
.toc-desktop {
    @apply fixed left-0 top-0 w-64 min-h-screen max-h-screen bg-background border-r border-foreground/20 p-4;
    overflow-y: auto;
    z-index: 40;
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
