<template>
    <div>
        <!-- Desktop Sidebar -->
        <div v-if="hasHeadings" class="toc-desktop hidden lg:block">
            <div class="toc-header flex flex-col">
                <NuxtLink :to="localePath('/')" class="text-foreground/70 text-sm font-mono hover:text-foreground">{{
                    t('toc.backToHome') }}</NuxtLink>
                <span class="toc-title">{{ t('toc.title') }}</span>
            </div>

            <nav class="toc-nav" :aria-label="t('toc.title')">
                <ul class="toc-list">
                    <li v-for="heading in headings" :key="heading.id" class="toc-item"
                        :class="[`toc-level-${heading.level}`, { 'toc-active': heading.id === activeHeading }]">
                        <a :href="`#${heading.id}`" @click.prevent.stop="scrollToHeading(heading.id)" class="toc-link">
                            <span class="toc-prefix">{{ getPrefix(heading.level) }}</span>
                            {{ heading.text }}
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="toc-indicator" :style="{ top: `${indicatorPosition}px` }"></div>
        </div>

        <!-- The mobile controls are fixed, so they never take space from the article. -->
        <button v-if="hasHeadings" type="button" class="toc-mobile-trigger lg:hidden"
            aria-haspopup="dialog" aria-controls="toc-mobile-dialog" :aria-expanded="isMobileMenuOpen"
            @click="openMobileMenu">
            <span aria-hidden="true">☰</span>
            {{ t('toc.title') }}
            <span class="text-foreground/50 text-xs">{{ headings.length }}</span>
        </button>

        <dialog ref="mobileDialogRef" id="toc-mobile-dialog" class="toc-mobile-dialog lg:hidden"
            aria-labelledby="toc-mobile-title" @click="closeMobileMenu" @close="handleMobileClose">
            <section class="toc-mobile-panel" @click.stop>
                <div class="flex items-center justify-between gap-4 p-4 border-b border-foreground/20">
                    <h2 id="toc-mobile-title" class="text-sm font-bold">{{ t('toc.title') }}</h2>
                    <button type="button" autofocus @click="closeMobileMenu"
                        class="min-h-11 px-3 rounded border border-foreground/20 hover:bg-foreground/10 text-sm">
                        {{ t('toc.close') }} <span aria-hidden="true">✕</span>
                    </button>
                </div>
                <nav class="toc-mobile-nav overflow-y-auto overscroll-contain p-4" data-lenis-prevent
                    :aria-label="t('toc.title')">
                    <NuxtLink :to="localePath('/')" @click="closeMobileMenu"
                        class="block pb-4 mb-3 border-b border-foreground/10 text-sm text-foreground/70 hover:text-foreground">
                        {{ t('toc.backToHome') }}
                    </NuxtLink>
                    <ul class="space-y-1">
                        <li v-for="heading in headings" :key="heading.id"
                            :class="heading.level === 1 ? 'font-bold' : 'ml-4'">
                            <a :href="`#${heading.id}`" @click.prevent.stop="scrollToHeading(heading.id)"
                                class="toc-link min-h-11 flex items-center break-words"
                                :class="{ 'text-foreground bg-foreground/10': heading.id === activeHeading }"
                                :aria-current="heading.id === activeHeading ? 'location' : undefined">
                                <span class="toc-prefix shrink-0" aria-hidden="true">{{ getPrefix(heading.level) }}</span>
                                {{ heading.text }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </section>
        </dialog>
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
const isMobileMenuOpen = ref(false)
const mobileDialogRef = ref<HTMLDialogElement | null>(null)
let previousBodyOverflow = ''
let desktopMedia: MediaQueryList | null = null

const openMobileMenu = () => {
    if (!mobileDialogRef.value || isMobileMenuOpen.value) return
    previousBodyOverflow = document.body.style.overflow
    mobileDialogRef.value.showModal()
    isMobileMenuOpen.value = true
    document.body.style.overflow = 'hidden'
}

const handleMobileClose = () => {
    if (!isMobileMenuOpen.value) return
    isMobileMenuOpen.value = false
    document.body.style.overflow = previousBodyOverflow
}

const closeMobileMenu = () => {
    mobileDialogRef.value?.close()
    handleMobileClose()
}

const handleBreakpointChange = () => {
    if (desktopMedia?.matches) closeMobileMenu()
}

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
        updateActiveHeading()
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
    closeMobileMenu()
    const element = document.getElementById(id)
    if (element) {
        const yOffset = -80
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        activeHeading.value = id
        window.history.replaceState(window.history.state, '', `#${encodeURIComponent(id)}`)
    }
}

const updateActiveHeading = () => {
  if (headings.value.length === 0) return
  
  let foundIndex = 0

  // Utiliser une boucle for classique pour performance
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)

    if (element && element.getBoundingClientRect().top <= 100) {
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
    setupContentObserver()
    desktopMedia = window.matchMedia('(min-width: 1024px)')
    desktopMedia.addEventListener('change', handleBreakpointChange)
    window.addEventListener('scroll', throttledUpdate)
    window.addEventListener('resize', throttledUpdate)
})

watch(() => route.fullPath, async () => {
    closeMobileMenu()
    await nextTick()
    extractHeadings()
    setupContentObserver()
})

onUnmounted(() => {
    closeMobileMenu()
    desktopMedia?.removeEventListener('change', handleBreakpointChange)
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
    overflow-y: auto;
    z-index: 40;
}

.toc-mobile-trigger {
    @apply fixed z-40 flex items-center gap-3 rounded-full border border-foreground/20 bg-background px-4 py-3 text-sm font-mono text-foreground shadow-lg;
    left: max(1rem, env(safe-area-inset-left));
    bottom: calc(1rem + env(safe-area-inset-bottom));
}

.toc-mobile-dialog {
    @apply fixed inset-0 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 text-foreground font-mono;
    height: 100dvh;
}

.toc-mobile-dialog[open] {
    display: flex;
    align-items: flex-end;
}

.toc-mobile-dialog::backdrop {
    background: rgb(0 0 0 / 65%);
}

.toc-mobile-panel {
    @apply flex w-full flex-col overflow-hidden rounded-t-2xl border border-foreground/20 bg-background shadow-xl;
    max-height: 80vh;
    max-height: 80dvh;
    padding-bottom: env(safe-area-inset-bottom);
}

.toc-mobile-nav {
    min-height: 0;
}

@media (min-width: 1024px) {
    .toc-mobile-trigger {
        display: none;
    }
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
