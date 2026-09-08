<template>
  <div class="h-screen w-full flex flex-col font-mono bg-[#09090b] text-[#f4f4f5] overflow-hidden selection:bg-white selection:text-black">
    <!-- Header minimaliste et sobre -->
    <header class="h-12 shrink-0 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between text-xs bg-black/40 backdrop-blur-md z-30">
      <div class="flex items-center gap-3">
        <span class="font-bold tracking-wider text-white">ETHAN CAROLLO</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Sélecteur de langue intégré directement dans la barre -->
        <LocaleChip />

        <!-- Toggle manuel pour afficher / masquer le viewer à droite -->
        <button
          @click="showViewer = !showViewer"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all text-xs text-white/80 cursor-pointer"
          :class="showViewer ? 'bg-white/10 border-white/40' : ''"
        >
          <span>{{ showViewer ? 'Masquer viewer' : 'Projets' }}</span>
        </button>

        <!-- Bouton de bascule vers le site classique -->
        <button
          @click="$emit('switch-to-standard')"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all text-xs text-white/80 cursor-pointer"
        >
          <span>⌂</span>
          <span class="font-semibold">{{ $t('viewMode.standard') }}</span>
          <span class="text-white/40">→</span>
        </button>
      </div>
    </header>

    <!-- Split-Screen Immersif : Console TUI (pleine largeur par défaut, ou partagée quand le viewer est actif) -->
    <div class="flex-1 grid grid-cols-1 min-h-0 relative" :class="showViewer ? 'lg:grid-cols-12' : ''">
      <!-- Panneau Console / Dialogue -->
      <div
        class="flex flex-col h-full relative z-10 bg-[#09090b]/90 backdrop-blur-md transition-all duration-300"
        :class="showViewer ? 'lg:col-span-7 border-r border-white/10' : 'max-w-4xl mx-auto w-full'"
      >
        <!-- Zone de messages scrollable -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm scroll-smooth"
        >
          <!-- Historique des messages -->
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="space-y-1.5"
          >
            <!-- Message Utilisateur -->
            <div v-if="msg.role === 'user'" class="flex items-start gap-2 text-white/90">
              <span class="text-white/40 select-none">›</span>
              <span class="font-semibold text-white">{{ msg.content }}</span>
            </div>

            <!-- Message Assistant -->
            <div v-else class="border-l border-white/20 pl-3 py-1 bg-white/[0.01]">
              <div
                class="chat-markdown text-xs sm:text-sm leading-relaxed text-white/80"
                v-html="renderMarkdown(msg.content)"
              />
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex items-center gap-2 text-xs text-white/40 py-2">
            <span class="animate-pulse font-mono">...</span>
          </div>
        </div>

        <!-- Input terminal en bas avec les actions rapides juste au-dessus -->
        <div class="p-3 sm:p-4 border-t border-white/10 bg-black/40 space-y-2.5">
          <!-- Actions rapides positionnées au-dessus de l'input -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              v-for="chip in quickActions"
              :key="chip.label"
              @click="inspectOrAsk(chip)"
              class="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/15 hover:border-white/40 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>›</span>
              <span>{{ chip.label }}</span>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="relative flex items-center">
            <span class="absolute left-3 text-white/40 text-xs select-none">›</span>
            <input
              ref="inputRef"
              v-model="inputQuery"
              type="text"
              placeholder="Question sur un projet (composite, virusmania, rituals) ou contact..."
              class="w-full pl-7 pr-20 py-2.5 bg-white/5 border border-white/15 rounded text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors font-mono"
              :disabled="isLoading"
            />
            <button
              type="submit"
              :disabled="!inputQuery.trim() || isLoading"
              class="absolute right-1.5 px-3 py-1 rounded bg-white text-black text-[11px] font-bold hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              EXEC ↵
            </button>
          </form>
        </div>
      </div>

      <!-- Panneau Droit : Viewport Immersif Shader & Live Inspector (Masqué par défaut avec transition fluide) -->
      <Transition name="viewer-slide">
        <div
          v-if="showViewer"
          class="hidden lg:flex lg:col-span-5 flex-col h-full bg-black relative overflow-hidden transition-all duration-500 ease-out border-l border-white/10 shadow-2xl"
        >
        <!-- Arrière-plan Shader WebGL ASCII Wave interactif -->
        <div class="absolute inset-0 opacity-40 pointer-events-none">
          <ClientOnly>
            <AsciiWave />
          </ClientOnly>
        </div>

        <!-- Overlay scanlines subtil -->
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>

        <!-- Contenu du Viewport : Inspection temps réel du projet actif -->
        <div class="relative z-10 flex-1 flex flex-col p-6 justify-between">
          <!-- Header viewport -->
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <div class="text-xs uppercase tracking-wider text-white/70 font-semibold">
              {{ activeInspector.title }}
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] text-white/40 font-mono">{{ activeInspector.category }}</span>
              <button
                @click="showViewer = false"
                class="text-white/40 hover:text-white text-xs cursor-pointer"
                title="Fermer le viewer"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Aperçu Visuel du Projet actif -->
          <div class="my-auto space-y-4">
            <div class="relative rounded-lg overflow-hidden border border-white/20 bg-black/60 aspect-video group">
              <img
                :src="activeInspector.image"
                :alt="activeInspector.title"
                class="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white/80 border border-white/10 font-mono">
                {{ activeInspector.category }}
              </div>
            </div>

            <!-- Fiche technique / télémétrie du projet -->
            <div class="space-y-2 bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/15">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span>{{ activeInspector.title }}</span>
                </h3>
                <NuxtLink
                  :to="`/projects/${activeInspector.slug}`"
                  class="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Doc complète</span>
                  <span>↗</span>
                </NuxtLink>
              </div>

              <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span class="text-white/40 block text-[9px] uppercase">Rôle</span>
                  <span class="text-white/80 font-mono">{{ activeInspector.role }}</span>
                </div>
                <div>
                  <span class="text-white/40 block text-[9px] uppercase">Période</span>
                  <span class="text-white/80 font-mono">{{ activeInspector.date }}</span>
                </div>
              </div>

              <!-- Tags / Tech -->
              <div class="pt-2 flex flex-wrap gap-1 border-t border-white/10">
                <span
                  v-for="t in activeInspector.tags"
                  :key="t"
                  class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono"
                >
                  {{ t }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer viewport : Navigation directe -->
          <div class="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <span>PROJETS</span>
            <div class="flex gap-2">
              <button
                v-for="p in presetProjects"
                :key="p.slug"
                @click="setInspectorProject(p)"
                class="px-2 py-0.5 rounded border transition-colors cursor-pointer"
                :class="activeInspector.slug === p.slug ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/15 hover:border-white/40 text-white/60'"
              >
                {{ p.slug }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

defineEmits(['switch-to-standard'])

interface ProjectInfo {
  slug: string
  title: string
  category: string
  role: string
  date: string
  image: string
  tags: string[]
}

const presetProjects: ProjectInfo[] = [
  {
    slug: 'composite',
    title: 'Composite',
    category: 'Visual Arts / Interactive Installation',
    role: 'Co-creator & TouchDesigner dev',
    date: '2025-04',
    image: '/composite_media/06.png',
    tags: ['TouchDesigner', 'MadMapper', 'Kinect', 'Modules .tox']
  },
  {
    slug: 'virusmania',
    title: 'VirusMania',
    category: 'Game Dev (Game Jam)',
    role: 'Lead Developer',
    date: '2025-12',
    image: '/virusmania_media/virusmania_banner.png',
    tags: ['Unity', 'C#', 'Gameplay', 'Multiplayer']
  },
  {
    slug: 'rituals',
    title: 'Rituals',
    category: 'Game Dev & Machine Learning',
    role: 'Solo Developer',
    date: '2025-10',
    image: '/images/rituals.png',
    tags: ['Unity', 'C#', 'PyTorch', 'CNN AI']
  }
]

// Viewer masqué par défaut selon la demande
const showViewer = ref(false)
const activeInspector = ref<ProjectInfo>(presetProjects[0])

const quickActions = [
  { label: 'Composite', slug: 'composite', prompt: 'Détaille l\'installation interactive Composite' },
  { label: 'VirusMania', slug: 'virusmania', prompt: 'Parle-moi de VirusMania et de son dev' },
  { label: 'Rituals', slug: 'rituals', prompt: 'Comment marche le modèle CNN dans Rituals ?' },
  { label: 'Contact', slug: null, prompt: 'Comment contacter Ethan ?' }
]

const inputQuery = ref('')
const isLoading = ref(false)
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const setInspectorProject = (p: ProjectInfo) => {
  activeInspector.value = p
  showViewer.value = true
}

const inspectOrAsk = (action: { label: string; slug: string | null; prompt: string }) => {
  if (action.slug) {
    const found = presetProjects.find(p => p.slug === action.slug)
    if (found) {
      activeInspector.value = found
      showViewer.value = true
    }
  }
  inputQuery.value = action.prompt
  handleSubmit()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSubmit = async () => {
  const query = inputQuery.value.trim()
  if (!query || isLoading.value) return

  // Si un projet est mentionné, ouvrir automatiquement le viewer sur le projet correspondant
  const lower = query.toLowerCase()
  for (const p of presetProjects) {
    if (lower.includes(p.slug)) {
      activeInspector.value = p
      showViewer.value = true
      break
    }
  }

  messages.value.push({ role: 'user', content: query })
  inputQuery.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const res: any = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value.map(m => ({ role: m.role, content: m.content })),
        query
      }
    })

    // Si le LLM a renvoyé un projet à inspecter, afficher et synchroniser le viewer
    if (res?.inspect) {
      const target = presetProjects.find(p => p.slug === res.inspect)
      if (target) {
        activeInspector.value = target
        showViewer.value = true
      }
    }

    messages.value.push({
      role: 'assistant',
      content: res?.content || 'Donnée indisponible.'
    })
  } catch (err) {
    console.error('Chat error:', err)
    messages.value.push({
      role: 'assistant',
      content: 'Erreur réseau. Écrivez directement à **etcarollo@gmail.com**.'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
    nextTick(() => inputRef.value?.focus())
  }
}

const renderMarkdown = (text: string) => {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-white/5 border border-white/10 p-2 rounded my-1 text-[11px] overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[11px]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-cyan-400 hover:text-cyan-300 font-semibold">$1 ↗</a>')
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.chat-markdown :deep(a) {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Viewer fluid slide-in animation */
.viewer-slide-enter-active,
.viewer-slide-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.viewer-slide-enter-from,
.viewer-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
