<template>
  <div class="language-switcher">
    <div class="terminal-header">
      <span class="terminal-title">$ locale</span>
    </div>
    
    <div class="language-options">
      <button 
        v-for="locale in availableLocales" 
        :key="locale.code"
        @click="switchLocale(locale.code)"
        class="language-btn"
        :class="{ active: locale.code === currentLocale }"
        :aria-label="`Switch to ${locale.name}`"
      >
        <span class="locale-code">{{ locale.code }}</span>
        <span class="locale-name">{{ locale.name }}</span>
      </button>
    </div>
    
    <div class="terminal-status-bar">
      <span class="status-text">Current: {{ currentLocaleName }}</span>
      <span class="status-indicator" :class="{ active: true }"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()

const availableLocales = computed(() => {
  return locales.value
})

const currentLocale = computed(() => locale.value)
const currentLocaleName = computed(() => {
  const current = availableLocales.value.find(l => l.code === currentLocale.value)
  return current?.name || currentLocale.value
})

const switchLocale = (newLocale: string) => {
  locale.value = newLocale
  // Sauvegarder la préférence dans un cookie
  const cookie = useCookie('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: 'strict'
  })
  cookie.value = newLocale
}
</script>

<style scoped>
.language-switcher {
  @apply border border-foreground/30 rounded-lg overflow-hidden bg-background;
  font-family: 'Space Mono', monospace;
  min-width: 200px;
}

.terminal-header {
  @apply bg-foreground/10 border-b border-foreground/20 px-3 py-2;
}

.terminal-title {
  @apply text-foreground/70 text-sm;
}

.language-options {
  @apply p-3 space-y-2;
}

.language-btn {
  @apply w-full flex items-center justify-between bg-foreground/10 hover:bg-foreground/20 text-foreground border border-foreground/20 rounded px-3 py-2 transition-all duration-200;
  @apply hover:border-foreground/40 hover:shadow-sm;
}

.language-btn.active {
  @apply bg-foreground/20 border-foreground/40 text-foreground shadow-sm;
}

.locale-code {
  @apply font-mono text-sm font-bold;
}

.locale-name {
  @apply text-sm text-foreground/80;
}

.language-btn.active .locale-name {
  @apply text-foreground;
}

.terminal-status-bar {
  @apply bg-foreground/5 border-t border-foreground/20 px-3 py-1 flex items-center justify-between text-xs text-foreground/60;
}

.status-indicator {
  @apply w-2 h-2 rounded-full bg-foreground/40;
}

.status-indicator.active {
  @apply bg-green-500 animate-pulse;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .language-switcher {
    @apply min-w-[160px];
  }
  
  .locale-name {
    @apply hidden;
  }
}
</style>
