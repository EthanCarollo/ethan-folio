import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.openrouterApiKey || process.env.OPENROUTER_API_KEY
    const model = config.openrouterModel || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'

    const body = await readBody(event)
    const { messages = [], query = '' } = body || {}

    // 1. Fetch live knowledge from Nuxt Content
    let projects: any[] = []
    let notes: any[] = []

    try {
        projects = await queryCollection(event, 'projects').all()
        notes = await queryCollection(event, 'notes').all()
    } catch (e) {
        console.warn('Could not query collections dynamically, using fallback', e)
    }

    // 2. Format knowledge into concise structured context
    const projectsSummary = projects.map((p: any) => {
        return `- PROJET: "${p.title}" | Catégorie: ${p.category || 'N/A'} | Date: ${p.date} | Rôle: ${p.role || 'N/A'} | Tags: ${(p.tags || []).join(', ')} | URL: /projects/${p.slug} | Repo: ${p.repo || 'N/A'} | Lien démo: ${p.link || 'N/A'}`
    }).join('\n')

    const notesSummary = notes.map((n: any) => {
        return `- NOTE/ARTICLE: "${n.title}" | Date: ${n.date} | Tags: ${(n.tags || []).join(', ')} | URL: /notes/${n.slug} | Résumé: ${n.description || ''}`
    }).join('\n')

    const systemPrompt = `Tu es l'assistant personnel et interactif du portfolio d'Ethan Carollo.
Ton ton est professionnel, sobre, direct, humble et rigoureux (esprit développeur / atelier créatif).
Tu parles à la première personne en tant que représentant fidèle du travail d'Ethan, ou à la troisième personne ("Ethan a développé...", "Ethan étudie...").
Tu réponds dans la langue employée par l'utilisateur (français par défaut, anglais si la question est en anglais).
Ne survends pas. Sois précis, technique et concis.
Quand tu mentionnes un projet ou un article, insère un lien markdown cliquable au format [Titre du projet](/projects/slug) ou [Titre de la note](/notes/slug).

=== DONNÉES DU PROFIL D'ETHAN CAROLLO ===
- Identité : Ethan Carollo, Développeur Polymorphe & étudiant en Master Développement Interactif aux Gobelins Annecy.
- Localisation : Annecy, France.
- Contact : etcarollo@gmail.com | GitHub : https://github.com/EthanCarollo
- Domaines de prédilection :
  * Game Dev & Temps Réel : Unity, C#, shaders, mécaniques de gameplay, Game Jams (Itch.io).
  * Machine Learning & IA : PyTorch, CNN pour reconnaissance de gestes/rituels, fine-tuning de LLMs avec Unsloth (ex: Qwen), compréhension approfondie des LLMs et agents autonomes (tool calling).
  * Développement Mobile : Kotlin, applications Android natives.
  * Art Interactif & Installations : TouchDesigner, MadMapper, captation spatiale Kinect, architecture modulaire (.tox), travail avec collectifs (FullStory, Les Papeteries).
  * Web moderne & Typage : Nuxt 4, Vue 3, TypeScript, Tailwind CSS, explorations en Gleam et Rust.
  * Pipeline : Git, CI/CD, conteneurisation Docker.

=== PROJETS RÉALISÉS PAR ETHAN ===
${projectsSummary || `
- "Composite" : Installation interactive d'art visuel / cadavre exquis projeté. Workshop 5 jours avec le collectif FullStory. Stack: TouchDesigner, MadMapper, caméras Kinect, modules .tox versionnés sous Git. URL: /projects/composite | Repo: https://github.com/EthanCarollo/composite
- "VirusMania" : Jeu vidéo cartoon coopératif inspiré de PlateUp!/Overcooked (Game Jam Itch.io). Rôle: Lead Developer. Stack: Unity, C#. URL: /projects/virusmania | Repo: https://github.com/methil-mods/virusmania
- "Rituals" : Jeu vidéo d'escape game et horreur cosmique (Cosmic Horrors Jam 4). Intègre un CNN PyTorch pour reconnaître les rituels dessinés par le joueur. Stack: Unity, C#, PyTorch, AI. URL: /projects/rituals | Repo: https://github.com/methil-mods/rituals | Démo: https://ethanzxv.itch.io/rituals
`}

=== ARTICLES ET NOTES TECHNIQUES D'ETHAN ===
${notesSummary || `
- "Tool Calling et Agents LLM" (/notes/tool-calling-agents) : Analyse technique complète de la construction d'agents autonomes à partir de zéro avec llama-cpp-python et Qwen.
- "Fine-tuning Qwen avec Unsloth" (/notes/finetuning-qwen-unsloth) : Méthode, gains de mémoire VRAM et quantification pour adapter des LLMs en local.
- "I would like Gleam" (/notes/iwouldlikegleam) : Retours d'expérience sur le langage fonctionnel typé compilé sur BEAM (Erlang).
- "GPT-OSS 20B" (/notes/gpt-oss-20b) : Architecture et performance des modèles open-weights.
- "Espace latent" (/notes/espace-latent) : Réflexions sur les représentations d'embeddings et espaces vectoriels.
- "Pokesket" (/notes/pokesket) : Expérimentation mobile et interaction tactile.
`}

Directives de réponse :
1. Donne des réponses structurées en markdown avec code ou listes courtes si pertinent.
2. Si la question concerne ses disponibilités ou un contact, propose poliment l'adresse etcarollo@gmail.com.
3. Si la question porte sur un sujet non couvert par la base de connaissances, indique poliment qu'Ethan n'a pas documenté ce point spécifique sur son portfolio mais invite à le contacter directement.`

    // Fallback if no API key is set yet: provide a local intelligent assistant
    if (!apiKey) {
        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : query
        return {
            role: 'assistant',
            content: getLocalFallbackResponse(lastUserMessage, { projects, notes })
        }
    }

    try {
        const conversation = [
            { role: 'system', content: systemPrompt },
            ...messages
        ]

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://ethan-folio.fr',
                'X-Title': 'Ethan Carollo Portfolio',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: conversation,
                temperature: 0.5,
                max_tokens: 800
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('OpenRouter error:', response.status, errText)
            throw createError({
                statusCode: response.status,
                statusMessage: `OpenRouter API error: ${errText}`
            })
        }

        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || "Désolé, aucune réponse générée."

        return {
            role: 'assistant',
            content: reply
        }
    } catch (err: any) {
        console.error('Server chat error:', err)
        // Graceful fallback to avoid breaking user experience
        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : query
        return {
            role: 'assistant',
            content: getLocalFallbackResponse(lastUserMessage, { projects, notes })
        }
    }
})

function getLocalFallbackResponse(userInput: string, data: { projects: any[], notes: any[] }): string {
    const input = (userInput || '').toLowerCase()

    if (input.includes('composite') || input.includes('touchdesigner') || input.includes('kinect')) {
        return `**[Composite](/projects/composite)** est une installation visuelle interactive conçue en 5 jours lors d'un workshop avec le collectif FullStory pour les 10 ans des Papeteries.\n\n- **Technologies** : TouchDesigner, MadMapper, caméras Kinect.\n- **Spécificité** : Découpage nodale en modules \`.tox\` versionnés sous Git pour permettre une collaboration fluide entre développeurs et designers.\n- **Dépôt** : [github.com/EthanCarollo/composite](https://github.com/EthanCarollo/composite)`
    }

    if (input.includes('virusmania') || input.includes('jam') || input.includes('jeu') || input.includes('game') || input.includes('unity')) {
        return `Ethan travaille activement sur des projets de jeu vidéo sous Unity / C# :\n\n1. **[VirusMania](/projects/virusmania)** : Jeu cartoon de coopération inspiré d'Overcooked/PlateUp! développé lors d'une Game Jam. Ethan y occupait le rôle de *Lead Developer*.\n2. **[Rituals](/projects/rituals)** : Escape game d'horreur cosmique où le joueur trace des symboles reconnus par un modèle de deep learning CNN (PyTorch).\n\nConsultez la section [Projets](/projects) pour découvrir l'intégralité des réalisations.`
    }

    if (input.includes('contact') || input.includes('email') || input.includes('embauche') || input.includes('stage') || input.includes('alternance') || input.includes('freelance')) {
        return `Vous pouvez contacter Ethan directement par email à **etcarollo@gmail.com** ou consulter son profil sur [GitHub](https://github.com/EthanCarollo).\n\nIl est actuellement étudiant en Master Développement Interactif aux **Gobelins Annecy** et ouvert aux échanges professionnels et projets techniques.`
    }

    if (input.includes('note') || input.includes('article') || input.includes('llm') || input.includes('unsloth') || input.includes('gleam') || input.includes('agent')) {
        return `Ethan publie régulièrement des notes techniques approfondies sur son carnet de bord :\n\n- **[Tool Calling et Agents LLM](/notes/tool-calling-agents)** : Comprendre et implémenter des agents autonomes sans framework avec \`llama-cpp-python\`.\n- **[Fine-tuning Qwen avec Unsloth](/notes/finetuning-qwen-unsloth)** : Réduction d'empreinte mémoire et adaptation de modèles open-weights.\n- **[I would like Gleam](/notes/iwouldlikegleam)** : Analyse du langage fonctionnel typé sur l'écosystème BEAM.\n\nRetrouvez tous les articles dans l'espace [Notes](/notes).`
    }

    return `Bonjour, je suis l'interface interactive du portfolio d'**Ethan Carollo**.\n\nEthan est développeur en Master Développement Interactif aux **Gobelins Annecy**, spécialisé en Unity/C#, architectures temps réel, TouchDesigner, apprentissage profond (PyTorch, fine-tuning LLM) et développement web/mobile (Nuxt, Kotlin).\n\nVous pouvez me questionner sur :\n- Ses projets récents (ex: *[Composite](/projects/composite)*, *[VirusMania](/projects/virusmania)*, *[Rituals](/projects/rituals)*)\n- Ses articles techniques (*[Tool Calling](/notes/tool-calling-agents)*, *[Unsloth](/notes/finetuning-qwen-unsloth)*)\n- Ses compétences et technologies de prédilection\n- Ses coordonnées pour une collaboration`
}
