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

    const systemPrompt = `Tu es l'interface TUI interactive du portfolio d'Ethan Carollo (étudiant Gobelins Annecy, Master Dev Interactif).
Style obligatoire :
- Ultra concis, direct, zéro bavardage, zéro formule de politesse superflue.
- Style technique d'ingénieur créatif / changelog.
- Maximum 3 à 5 lignes par réponse.
- Intègre systématiquement les liens cliquables [Nom](/projects/slug) ou [Note](/notes/slug) quand tu mentionnes un projet ou article.
- Réponds dans la langue de l'utilisateur.

=== DONNÉES DU PROFIL D'ETHAN CAROLLO ===
- Identité : Ethan Carollo, Développeur Polymorphe & étudiant Master Dev Interactif aux Gobelins Annecy.
- Localisation : Annecy, FR. Contact : etcarollo@gmail.com | GitHub : https://github.com/EthanCarollo
- Compétences clés : Unity (C#), PyTorch / CNN, LLM fine-tuning (Unsloth), TouchDesigner (Kinect, MadMapper, modules .tox), Kotlin (Android), Nuxt 4, Gleam, Rust.

=== PROJETS ===
${projectsSummary || `
- "Composite" : Installation interactive. TouchDesigner, MadMapper, Kinect, modules .tox versionnés Git. URL: /projects/composite
- "VirusMania" : Jeu vidéo cartoon coopératif (Itch.io jam). Lead Developer. Unity, C#. URL: /projects/virusmania
- "Rituals" : Escape game horreur cosmique avec CNN PyTorch pour reconnaissance de rituels dessinés. Unity, C#, PyTorch. URL: /projects/rituals
`}

=== ARTICLES / LAB NOTES ===
${notesSummary || `
- "Tool Calling et Agents LLM" (/notes/tool-calling-agents)
- "Fine-tuning Qwen avec Unsloth" (/notes/finetuning-qwen-unsloth)
- "I would like Gleam" (/notes/iwouldlikegleam)
- "GPT-OSS 20B" (/notes/gpt-oss-20b)
- "Espace latent" (/notes/espace-latent)
- "Pokesket" (/notes/pokesket)
`}`

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
        return `**[Composite](/projects/composite)** — Installation interactive (TouchDesigner, MadMapper, Kinect). Modules \`.tox\` versionnés Git. Repo: [github.com/EthanCarollo/composite](https://github.com/EthanCarollo/composite)`
    }

    if (input.includes('virusmania') || input.includes('jam') || input.includes('jeu') || input.includes('game') || input.includes('unity')) {
        return `**Game Dev (Unity / C#)** :\n- **[VirusMania](/projects/virusmania)** : Coop cartoon (Lead Dev).\n- **[Rituals](/projects/rituals)** : Escape game horreur cosmique avec CNN PyTorch.`
    }

    if (input.includes('contact') || input.includes('email') || input.includes('stage') || input.includes('alternance') || input.includes('job')) {
        return `Contact direct : **etcarollo@gmail.com** | GitHub : [github.com/EthanCarollo](https://github.com/EthanCarollo) (Master Dev Interactif — Gobelins Annecy).`
    }

    if (input.includes('note') || input.includes('article') || input.includes('llm') || input.includes('unsloth') || input.includes('gleam') || input.includes('agent')) {
        return `**Lab Notes** :\n- **[Tool Calling & Agents](/notes/tool-calling-agents)**\n- **[Fine-tuning Qwen Unsloth](/notes/finetuning-qwen-unsloth)**\n- **[Gleam](/notes/iwouldlikegleam)**`
    }

    return `Terminal Ethan Carollo — Master Dev Interactif Gobelins Annecy.\nProjets : **[Composite](/projects/composite)**, **[VirusMania](/projects/virusmania)**, **[Rituals](/projects/rituals)**.\nStack : Unity, PyTorch, TouchDesigner, Kotlin, Nuxt.`
}
