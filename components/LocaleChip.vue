<template>
  <div class="locale-toggle-container">
    <button class="locale-toggle" @click="toggleLocale" :aria-label="`Switch to ${nextLocale.name}`">
      <span class="locale-current">{{ currentLocale.code.toUpperCase() }}</span>
      <span class="locale-separator">→</span>
      <span class="locale-next">{{ nextLocale.code.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const route = useRoute()
const router = useRouter()

const availableLocales = computed(() => {
  return locales.value
})

const currentLocale = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value) || availableLocales.value[0]
})

const nextLocale = computed(() => {
  // Get the other locale (toggle between the two)
  return availableLocales.value.find(l => l.code !== locale.value) || availableLocales.value[0]
})

const toggleLocale = () => {
  const newLocale = nextLocale.value.code

  // Sauvegarder la préférence dans un cookie
  const cookie = useCookie('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: 'strict'
  })
  cookie.value = newLocale

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
</script>

<style scoped>
.locale-toggle-container {
  /* Positioning handled by parent */
}

.locale-toggle {
  @apply bg-black hover:bg-black/80 text-white border border-white/20 rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-200;
  @apply flex items-center gap-2 font-mono text-sm;
  @apply hover:border-white/40 hover:shadow-sm;
}

.locale-toggle:active {
  @apply scale-95;
}

.locale-current {
  @apply text-white font-bold;
}

.locale-separator {
  @apply text-white/40 text-xs;
}

.locale-next {
  @apply text-white/60;
}

.locale-toggle:hover .locale-next {
  @apply text-white/80;
}

/* Responsive */
@media (max-width: 640px) {
  .locale-toggle-container {
    @apply top-2 right-2;
  }

  .locale-toggle {
    @apply px-2 py-1 text-xs;
  }
}
</style>
