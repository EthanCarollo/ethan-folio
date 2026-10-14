<template>
    <div>
        <!-- Desktop Sidebar -->
        <div v-if="hasHeadings" class="toc-desktop hidden lg:block">
            <div class="toc-header flex flex-col">
                <NuxtLink :to="localePath('/')" class="text-sm text-link underline underline-offset-2">
                    {{ t('toc.backToHome') }}
                </NuxtLink>
                <span class="toc-title">{{ t('toc.title') }}</span>
            </div>

            <nav class="toc-nav">
                <ul class="toc-list">
                    <li v-for="heading in headings" :key="heading.id" class="toc-item"
                        :class="[`toc-level-${heading.level}`, { 'toc-active': heading.id === activeHeading }]">
                        <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)" class="toc-link">
                            {{ heading.text }}
                        </a>
                    </li>
                </ul>
            </nav>

        </div>

        <!-- Mobile Accordion -->
        <div v-if="hasHeadings" class="mb-8 overflow-hidden rounded border border-border lg:hidden">
            <details class="group">
                <summary class="cursor-pointer bg-muted px-4 py-3 text-sm font-semibold text-foreground">
                    {{ t('toc.title') }}
                </summary>
                <div class="bg-background p-4">
                    <nav class="toc-mobile-nav">
                        <ul class="space-y-3">
                            <li class="mb-4 pb-4 border-b border-foreground/10">
                                <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-sm text-link underline underline-offset-2">
                                     {{ t('toc.backToHome') }}
                                </NuxtLink>
                            </li>
                            <li v-for="heading in headings" :key="heading.id"
                                class="toc-item-mobile"
                                :class="[`pl-${(heading.level - 1) * 4}`]">
                                <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)" 
                                   class="block text-foreground/80 hover:text-foreground transition-colors"
                                   :class="{ 'text-foreground font-bold py-1': heading.id === activeHeading }">
                                    {{ heading.text }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const localePath = useLocalePath()

interface Heading {
    id: string
    text: string
    level: number
}

const headings = ref<Heading[]>([])
const activeHeading = ref<string>('')
const hasHeadings = ref(false)

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

const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        const yOffset = -20
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y })
        activeHeading.value = id
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
  }
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
})
</script>

<style scoped>
.toc-desktop {
    @apply fixed bottom-0 left-0 top-16 w-64 overflow-y-auto border-r border-border bg-background p-4;
    z-index: 30;
}

.toc-header {
    @apply mb-4 space-y-2 border-b border-border pb-3;
}

.toc-title {
    @apply text-sm font-semibold text-foreground;
}

.toc-list {
    @apply m-0 list-none space-y-1 p-0;
}

.toc-link {
    @apply block rounded px-2 py-1 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-foreground;
}

.toc-level-2 {
    @apply pl-4;
}

.toc-level-3 {
    @apply pl-8 text-sm;
}

.toc-active .toc-link {
    @apply border-l-2 border-link bg-muted text-link;
}
</style>
