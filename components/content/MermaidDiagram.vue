<template>
  <ClientOnly>
    <div class="mermaid-wrapper my-8 flex justify-center overflow-x-auto" v-html="renderedSvg"></div>
    <template #fallback>
      <div class="mermaid-loading my-8 p-6 border border-border rounded-lg text-center text-muted-foreground font-mono text-sm">
        chargement du diagramme...
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{ code: string }>()

const renderedSvg = ref('')

onMounted(async () => {
  try {
    const mermaid = (await import('mermaid')).default

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark ? {
        primaryColor: '#6366f1',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono, monospace',
      } : {
        primaryColor: '#4f46e5',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#6366f1',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#e2e8f0',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono, monospace',
      },
    })
    const id = 'mermaid-' + Math.random().toString(36).slice(2, 8)
    const { svg } = await mermaid.render(id, props.code)
    renderedSvg.value = svg
  } catch (e) {
    renderedSvg.value = `<pre class="text-red-400 text-xs p-4">Erreur de rendu du diagramme</pre>`
  }
})
</script>

<style scoped>
.mermaid-wrapper :deep(svg) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
