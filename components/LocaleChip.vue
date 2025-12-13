<template>
  <div class="locale-chip-container">
    <!-- Click to toggle instead of hover -->
    <div
      class="locale-chip"
      :class="{ 'is-open': showDropdown }"
      @click="toggleDropdown"
      role="button"
      :aria-expanded="showDropdown"
      aria-label="Select Language"
    >
      <span class="locale-current">{{ currentLocale.code.toUpperCase() }}</span>
      <span class="dropdown-icon" :class="{ 'is-open': showDropdown }">▼</span>
    </div>

    <!-- Click outside to close -->
    <transition name="dropdown">
      <div v-if="showDropdown" class="locale-dropdown" v-click-outside="closeDropdown">
        <div class="dropdown-header">
          <span class="dropdown-title">Language</span>
        </div>

        <div class="locale-options">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="switchLocale(locale.code)"
            class="locale-option"
            :class="{ active: locale.code === currentLocale.code }"
            :aria-label="`Switch to ${locale.name}`"
          >
            <span class="locale-code">{{ locale.code.toUpperCase() }}</span>
            <span class="locale-name">{{ locale.name }}</span>
            <span v-if="locale.code === currentLocale.code" class="check-mark">✓</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const showDropdown = ref(false)

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Close dropdown
const closeDropdown = () => {
  showDropdown.value = false
}

const availableLocales = computed(() => {
  return locales.value
})

const currentLocale = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value) || availableLocales.value[0]
})

const switchLocale = (newLocale: string) => {
  showDropdown.value = false
  
  // Sauvegarder la préférence dans un cookie
  const cookie = useCookie('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: 'strict'
  })
  cookie.value = newLocale
  
  // Obtenir la route actuelle et construire la nouvelle URL avec préfixe
  const route = useRoute()
  const router = useRouter()
  
  // Construire le nouveau chemin avec le préfixe de langue
  let newPath = ''
  if (newLocale === 'fr') {
    // Pour le français (langue par défaut), on enlève le préfixe
    newPath = route.path.replace(/^\/en/, '') || '/'
  } else {
    // Pour l'anglais, on ajoute le préfixe /en
    newPath = route.path.startsWith('/en') ? route.path : `/en${route.path}`
  }
  
  // Navigation avec refresh pour garantir le chargement correct
  router.push(newPath)
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.locale-chip-container {
  @apply relative;
}

.locale-chip {
  @apply bg-foreground/10 hover:bg-foreground/20 text-foreground border border-foreground/30 rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-200;
  @apply flex items-center gap-2 font-mono text-sm;
  @apply hover:border-foreground/50 hover:shadow-sm;
}

.locale-chip.is-open {
  @apply bg-foreground/20 border-foreground/50 shadow-sm;
}

.locale-label {
  @apply text-foreground/60 text-xs;
}

.locale-current {
  @apply text-foreground font-bold;
}

.dropdown-icon {
  @apply text-foreground/60 text-xs transition-transform duration-200;
}

.dropdown-icon.is-open {
  @apply rotate-180;
}

.locale-dropdown {
  @apply absolute top-full right-0 mt-2 w-48 bg-background border border-foreground/30 rounded-lg shadow-xl;
  @apply z-50 overflow-hidden;
}

.dropdown-header {
  @apply bg-foreground/10 border-b border-foreground/20 px-3 py-2;
}

.dropdown-title {
  @apply text-foreground/70 text-xs font-mono;
}

.locale-options {
  @apply p-1 space-y-1;
}

.locale-option {
  @apply w-full flex items-center justify-between text-left bg-transparent hover:bg-foreground/10 text-foreground px-3 py-2 rounded transition-all duration-150;
  @apply hover:border-foreground/30;
}

.locale-option.active {
  @apply bg-foreground/20 text-foreground border border-foreground/40;
}

.locale-code {
  @apply font-mono text-sm font-bold;
}

.locale-name {
  @apply text-sm text-foreground/80 ml-2;
}

.check-mark {
  @apply text-green-500 ml-auto;
}

/* Animation du dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Positionnement fixe en haut */
.locale-chip-container {
  @apply fixed top-4 right-4 z-50;
}

/* Responsive */
@media (max-width: 640px) {
  .locale-dropdown {
    @apply w-40 right-0 left-auto;
  }
  
  .locale-name {
    @apply text-xs;
  }
}
</style>
