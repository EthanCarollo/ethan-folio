<template>
  <div class="h-screen w-full flex flex-col font-mono bg-background text-foreground overflow-hidden selection:bg-foreground selection:text-background">
    <!-- Top Bar: Minimalist workspace header -->
    <header class="h-14 shrink-0 border-b border-foreground/15 px-4 sm:px-6 flex items-center justify-between text-xs bg-background/80 backdrop-blur-md z-20">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="font-bold tracking-wider">ETHAN CAROLLO</span>
        </div>
        <span class="text-foreground/30 hidden sm:inline">•</span>
        <span class="text-foreground/60 hidden sm:inline tracking-wide">GOBELINS LAB // INTERACTIVE DEV</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Switch to standard portfolio button -->
        <button
          @click="$emit('switch-to-standard')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-foreground/25 hover:border-foreground/60 hover:bg-foreground/5 transition-all text-xs text-foreground cursor-pointer group"
          :title="$t('viewMode.switchToStandard')"
        >
          <span class="opacity-70 group-hover:opacity-100">⌂</span>
          <span class="font-semibold">{{ $t('viewMode.standard') }}</span>
          <span class="text-foreground/40 group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </header>

    <!-- Main Chat Workspace -->
    <div class="flex-1 flex flex-col min-h-0 relative max-w-4xl w-full mx-auto px-4 sm:px-6">
      <!-- Conversation History -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto py-6 space-y-6 pr-1 sm:pr-2 scroll-smooth"
      >
        <!-- Initial Welcome Message -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 select-none">
              EC
            </div>
            <div class="space-y-3 flex-1">
              <div class="text-xs text-foreground/40 uppercase tracking-wider flex items-center gap-2">
                <span>SYSTEM PROMPT // ETHAN-LAB</span>
                <span>•</span>
                <span>READY</span>
              </div>
              <div class="text-sm leading-relaxed text-foreground/90 bg-foreground/[0.03] border border-foreground/10 rounded-lg p-4 space-y-3">
                <p>
                  Bienvenue dans l'interface interactive du portfolio d'<strong>Ethan Carollo</strong> (étudiant en Master Développement Interactif à Gobelins Annecy).
                </p>
                <p class="text-foreground/75 text-xs">
                  Tout le contenu du site (projets Unity/TouchDesigner, notes techniques, stack et démarches) est indexé ici. Posez directement vos questions ou sélectionnez une requête rapide ci-dessous :
                </p>
              </div>

              <!-- Quick Queries Shortcuts -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button
                  v-for="prompt in suggestedPrompts"
                  :key="prompt"
                  @click="sendSuggestedPrompt(prompt)"
                  class="text-xs px-2.5 py-1.5 rounded border border-foreground/15 hover:border-foreground/40 hover:bg-foreground/5 text-foreground/80 text-left transition-colors cursor-pointer"
                >
                  › {{ prompt }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Message History -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="space-y-2"
        >
          <!-- User message -->
          <div v-if="msg.role === 'user'" class="flex items-start gap-3 justify-end pl-8">
            <div class="bg-foreground text-background rounded-lg px-4 py-2.5 text-sm max-w-xl break-words">
              {{ msg.content }}
            </div>
          </div>

          <!-- Assistant message -->
          <div v-else class="flex items-start gap-3 pr-4">
            <div class="w-6 h-6 rounded bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 select-none">
              EC
            </div>
            <div class="space-y-1.5 flex-1 max-w-2xl">
              <div class="text-xs text-foreground/40 font-mono flex items-center gap-2">
                <span>ETHAN // LAB</span>
              </div>
              <div
                class="chat-markdown text-sm leading-relaxed text-foreground/90 bg-foreground/[0.02] border border-foreground/10 rounded-lg p-4 overflow-x-auto"
                v-html="renderMarkdown(msg.content)"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-start gap-3">
          <div class="w-6 h-6 rounded bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 select-none animate-pulse">
            ..
          </div>
          <div class="flex items-center gap-2 text-xs text-foreground/60 py-2">
            <span class="inline-block w-2 h-2 rounded-full bg-foreground/40 animate-ping"></span>
            <span>Recherche dans la base de connaissances...</span>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="py-4 border-t border-foreground/15 bg-background shrink-0">
        <form @submit.prevent="handleSubmit" class="relative flex items-center">
          <span class="absolute left-3.5 text-foreground/40 text-sm select-none">›</span>
          <input
            ref="inputRef"
            v-model="inputQuery"
            type="text"
            placeholder="Posez une question sur mes projets, Unity, TouchDesigner, stack..."
            class="w-full pl-8 pr-24 py-3 bg-foreground/[0.03] border border-foreground/20 rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/60 transition-colors font-mono"
            :disabled="isLoading"
          />
          <div class="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              :disabled="!inputQuery.trim() || isLoading"
              class="px-3 py-1.5 rounded bg-foreground text-background text-xs font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              <span>Envoyer</span>
              <span>↵</span>
            </button>
          </div>
        </form>
        <div class="flex items-center justify-between text-[11px] text-foreground/40 mt-2 px-1">
          <span>Propulsé par OpenRouter & base de connaissances vectorisée</span>
          <span class="hidden sm:inline">Touche Entrée ↵ pour envoyer</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

defineEmits(['switch-to-standard'])

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const inputQuery = ref('')
const isLoading = ref(false)
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const suggestedPrompts = [
  "Quels sont tes projets récents en Game Dev ?",
  "Parle-moi du projet Composite avec TouchDesigner",
  "Comment abordes-tu le fine-tuning LLM et les agents ?",
  "Comment contacter Ethan pour un stage ou projet ?"
]

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendSuggestedPrompt = (prompt: string) => {
  inputQuery.value = prompt
  handleSubmit()
}

const handleSubmit = async () => {
  const query = inputQuery.value.trim()
  if (!query || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: query
  })

  inputQuery.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const payloadMessages = messages.value.map(m => ({
      role: m.role,
      content: m.content
    }))

    const res: any = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: payloadMessages,
        query
      }
    })

    messages.value.push({
      role: 'assistant',
      content: res?.content || "Désolé, aucune réponse n'a pu être formulée."
    })
  } catch (err) {
    console.error('Erreur chat:', err)
    messages.value.push({
      role: 'assistant',
      content: "Une erreur est survenue lors de la communication avec le serveur. N'hésitez pas à me contacter par email à **etcarollo@gmail.com**."
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

// Minimalist safe markdown renderer for links, bold, code and line breaks
const renderMarkdown = (text: string) => {
  if (!text) return ''

  // Escape HTML tags to prevent XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks ```code```
  escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre class="bg-foreground/5 border border-foreground/15 p-3 rounded my-2 text-xs overflow-x-auto"><code>$1</code></pre>')

  // Inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="bg-foreground/10 px-1 py-0.5 rounded text-xs">$1</code>')

  // Bold **text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')

  // Markdown links [text](url) -> formatted anchor
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-2 text-foreground font-semibold hover:opacity-75 transition-opacity">$1 ↗</a>')

  // Line breaks to <br> or paragraphs
  escaped = escaped.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')

  return escaped
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.chat-markdown :deep(a) {
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}
.chat-markdown :deep(code) {
  font-family: inherit;
}
</style>
