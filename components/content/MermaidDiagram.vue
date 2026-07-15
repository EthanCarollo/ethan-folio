<template>
  <ClientOnly>
    <div class="mermaid-wrapper my-8 flex justify-center overflow-x-auto" v-html="renderedSvg"></div>
    <template #fallback>
      <div class="mermaid-loading my-8 p-6 border border-white/10 rounded-lg text-center text-white/40 font-mono text-sm">
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
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono, monospace',
      },
    })
    const id = 'mermaid-' + Math.random().toString(36).slice(2, 8)
    const { svg } = await mermaid.render(id, props.code)
    renderedSvg.value = svg
  } catch (e) {
    console.error('Mermaid render error:', e)
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
