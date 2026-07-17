<template>
  <div class="locale-dropdown" ref="dropdownRef">
    <button
      class="locale-toggle"
      :class="isScrolled ? 'theme-white' : 'theme-black'"
      @click="isOpen = !isOpen"
      :aria-label="$t('locale.switch')"
      :aria-expanded="isOpen"
    >
      <span class="locale-current">{{ currentLocale.code.toUpperCase() }}</span>
      <svg
        class="locale-chevron"
        :class="{ 'rotate-180': isOpen }"
        width="12" height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="locale-menu" :class="isScrolled ? 'theme-white' : 'theme-black'">
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="locale-option"
          :class="{ active: loc.code === currentLocale.code }"
          @click="switchLocale(loc.code)"
        >
          <span class="locale-code">{{ loc.code.toUpperCase() }}</span>
          <span class="locale-name">{{ loc.name }}</span>
          <svg
            v-if="loc.code === currentLocale.code"
            class="locale-check"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isScrolled?: boolean
}>()

const { locale, locales } = useI18n()
const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const availableLocales = computed(() => {
  return locales.value
})

const currentLocale = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value) || availableLocales.value[0]
})

const switchLocale = (newLocale: string) => {
  if (newLocale === locale.value) {
    isOpen.value = false
    return
  }

  isOpen.value = false

  const cookie = useCookie('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'strict'
  })
  cookie.value = newLocale

  let newPath = ''
  if (newLocale === 'fr') {
    newPath = route.path.replace(/^\/en/, '') || '/'
  } else {
    newPath = route.path.startsWith('/en') ? route.path : `/en${route.path}`
  }

  router.push(newPath)
}

// Fermer le dropdown quand on clique ailleurs
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.locale-dropdown {
  position: relative;
}

.locale-toggle {
  @apply rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-300;
  @apply flex items-center gap-1.5 font-mono text-sm;
  @apply shadow-sm hover:shadow-md;
}

.locale-chevron {
  transition: transform 0.2s ease;
}

.locale-chevron.rotate-180 {
  transform: rotate(180deg);
}

/* Theme Default (Black - Hero) */
.locale-toggle.theme-black {
  @apply bg-black hover:bg-black/80 text-white border border-white/20;
  @apply hover:border-white/40;
}

.locale-menu.theme-black {
  @apply bg-black border border-white/20 shadow-xl shadow-black/50;
}

.locale-menu.theme-black .locale-option {
  @apply text-white/80 hover:bg-white/10 hover:text-white;
}

.locale-menu.theme-black .locale-option.active {
  @apply text-white bg-white/5;
}

	/* Theme White → Theme Auto (browser-aware when scrolled past hero) */
	.locale-toggle.theme-white {
	  @apply bg-background hover:bg-muted text-foreground border border-border;
	  @apply hover:border-foreground/30;
	}

	.locale-menu.theme-white {
	  @apply bg-background border border-border shadow-xl shadow-black/10;
	}

	.locale-menu.theme-white .locale-option {
	  @apply text-foreground/70 hover:bg-muted hover:text-foreground;
	}

	.locale-menu.theme-white .locale-option.active {
	  @apply text-foreground bg-muted;
	}

/* Dropdown menu */
.locale-menu {
  @apply absolute right-0 top-full mt-1.5 rounded-lg overflow-hidden;
  @apply min-w-[160px] backdrop-blur-md;
  z-index: 10000;
}

.locale-option {
  @apply w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-mono;
  @apply transition-colors duration-150 cursor-pointer;
}

.locale-option:not(:last-child) {
  @apply border-b border-white/5;
}

.theme-white .locale-option:not(:last-child) {
  @apply border-b border-border;
}

.locale-code {
  @apply font-semibold text-xs;
  min-width: 24px;
}

.locale-name {
  @apply flex-1 text-left;
}

.locale-check {
  @apply flex-shrink-0;
}

.locale-toggle:active {
  @apply scale-95;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Responsive */
@media (max-width: 640px) {
  .locale-toggle {
    @apply px-2 py-1 text-xs;
  }

  .locale-menu {
    @apply min-w-[140px];
  }
}
</style>
