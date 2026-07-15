---
title: "Tool Calling et Agents LLM"
date: "2026-07-15"
slug: "tool-calling-agents"
description: "Comprendre comment un LLM peut interagir avec des outils externes et comment on construit un agent à partir de ça."
tags: ["lab", "ml"]
---

# Introduction

Bon, aujourd'hui on va parler d'un truc qui est au cœur de tous les trucs un peu sérieux qu'on fait avec les LLMs : le **tool calling** (ou *function calling*, c'est pareil). C'est ce qui permet à un modèle de ne pas juste cracher du texte, mais d'interagir avec le monde extérieur — appeler une API, lire un fichier, exécuter du code, lancer une recherche web, etc.

Et à partir de ce mécanisme tout simple, on construit ce qu'on appelle des **agents** : des boucles autonomes où le LLM décide, agit, observe, et recommence.

Bref, on va décortiquer tout ça, et comme d'hab, on va tester avec un petit **Qwen3-4B** en local pour voir ce que ça donne.

> Parce que comprendre comment ça marche derrière la magie, c'est quand même plus satisfaisant que de juste appeler `agent.run()` sans savoir ce qui se passe.

# Un LLM de base, c'est juste une fonction `texte → texte`

Faut se rappeler un truc fondamental : un LLM, à la base, c'est une boîte noire qui prend du texte en entrée et qui prédit le token suivant, encore et encore, jusqu'à produire une réponse complète.

```
prompt → [LLM] → réponse
```

C'est tout. Pas d'accès à internet, pas de calculatrice, pas de mémoire externe. Juste du texte. Le modèle ne peut pas :

- Connaître la météo d'aujourd'hui
- Faire une addition sur des grands nombres de façon fiable
- Lire un fichier sur ton disque
- Savoir l'heure qu'il est

C'est là que le **tool calling** entre en jeu.

# Le tool calling, c'est quoi ?

Le principe est simple : au lieu de répondre directement, le LLM peut décider de **demander l'exécution d'une fonction externe**. Il ne l'exécute pas lui-même (il en est incapable), il émet une instruction structurée du genre :

> *"Hé, je sais pas répondre à ça tout seul, peux-tu appeler la fonction `get_weather` avec comme paramètre `city: Paris` ?"*

Et c'est ton code (le "runtime") qui intercepte cette demande, exécute la vraie fonction, et renvoie le résultat au modèle pour qu'il puisse continuer.

Le flux devient :

```
prompt → [LLM] → "je veux appeler get_weather(Paris)"
                      ↓
              appel réel à get_weather(Paris) → "18°C, nuageux"
                      ↓
résultat → [LLM] → "Il fait 18°C à Paris avec un ciel nuageux."
```

> C'est un peu comme si le LLM levait la main en disant "je délègue, revenez vers moi avec le résultat".

# Comment ça marche techniquement ?

## 1. On définit les outils disponibles

On fournit au modèle une description des fonctions qu'il peut appeler. Selon le modèle et le framework, ça peut être au format JSON Schema, ou via un format propriétaire. Exemple classique :

```json
[
  {
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Récupère la météo actuelle pour une ville donnée",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "Le nom de la ville (ex: Paris, Tokyo)"
          }
        },
        "required": ["city"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "calculate",
      "description": "Évalue une expression mathématique",
      "parameters": {
        "type": "object",
        "properties": {
          "expression": {
            "type": "string",
            "description": "L'expression mathématique à évaluer"
          }
        },
        "required": ["expression"]
      }
    }
  }
]
```

Ce bloc (le *tool schema*) est injecté dans le prompt système, ou passé via un champ dédié de l'API selon le modèle.

## 2. Le modèle décide (ou pas) d'appeler un outil

Quand le modèle reçoit un message utilisateur, il a deux choix :

- **Répondre normalement** avec du texte (pas besoin d'outil)
- **Émettre un `tool_call`** — une réponse structurée qui dit "je veux appeler telle fonction avec tels arguments"

La réponse structurée ressemble à ça :

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\": \"Paris\"}"
      }
    }
  ]
}
```

> Le modèle ne décide pas "au hasard" : il a été fine-tuné (ou prompté) pour reconnaître quand une demande nécessite un outil et pour formater sa réponse correctement.

## 3. On exécute l'outil et on renvoie le résultat

Ton code intercepte le `tool_call`, exécute la vraie fonction, et ajoute le résultat dans l'historique de conversation comme un message de rôle `tool` :

```json
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "Paris: 18°C, partiellement nuageux, humidité 65%"
}
```

## 4. Le modèle reprend la main

Avec le résultat de l'outil dans son contexte, le modèle génère maintenant sa réponse finale à l'utilisateur :

> "Actuellement à Paris, il fait 18°C avec un ciel partiellement nuageux et une humidité de 65%."

Et voilà, c'est tout le mécanisme. Simple, non ?

# Testons avec Qwen3-4B en local

Bon, assez de théorie, on va faire tourner ça pour de vrai. Qwen3-4B supporte nativement le tool calling, et on peut le tester avec `llama-cpp-python` qui gère très bien ça.

## Setup

```python
from llama_cpp import Llama

llm = Llama(
    model_path="~/models/qwen3-4b-Q4_K_M.gguf",
    n_ctx=4096,
    n_gpu_layers=12,      # 12 couches sur le GPU, le reste sur le CPU
    verbose=False,
)
```

## Définir nos outils

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Récupère la météo actuelle pour une ville",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "La ville"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_time",
            "description": "Donne l'heure actuelle",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]
```

## La logique d'exécution des outils

```python
from datetime import datetime
import json

def execute_tool(tool_name: str, arguments: dict) -> str:
    """Exécute l'outil demandé et retourne le résultat."""
    if tool_name == "get_weather":
        city = arguments.get("city", "inconnue")
        # Dans la vraie vie, on appellerait une API météo
        return f"Météo à {city}: 22°C, ensoleillé."
    
    elif tool_name == "get_time":
        return f"Heure actuelle: {datetime.now().strftime('%H:%M:%S')}"
    
    return "Outil inconnu."
```

## La boucle de conversation

```python
messages = [
    {"role": "system", "content": "Tu es un assistant utile. "
     "Utilise les outils disponibles quand c'est nécessaire."},
    {"role": "user", "content": "Quel temps fait-il à Tokyo ? Et quelle heure est-il ?"}
]

# Premier appel : le modèle va demander des outils
response = llm.create_chat_completion(
    messages=messages,
    tools=tools,
    tool_choice="auto",   # le modèle décide lui-même
)

msg = response["choices"][0]["message"]

# Si le modèle veut appeler des outils
if msg.get("tool_calls"):
    messages.append(msg)  # on ajoute la demande d'outil à l'historique
    
    for tool_call in msg["tool_calls"]:
        tool_name = tool_call["function"]["name"]
        arguments = json.loads(tool_call["function"]["arguments"])
        
        print(f"[Tool] Appel de {tool_name}({arguments})")
        result = execute_tool(tool_name, arguments)
        
        # On ajoute le résultat dans l'historique
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "content": result
        })
    
    # Deuxième appel : le modèle synthétise les résultats
    final_response = llm.create_chat_completion(
        messages=messages,
        tools=tools,
    )
    
    print(final_response["choices"][0]["message"]["content"])
```

Et là, normalement, le modèle va :

1. **Premier call** → demander `get_weather("Tokyo")` et `get_time()`
2. Ton code exécute les deux fonctions
3. **Deuxième call** → le modèle reçoit les résultats et répond : *"À Tokyo, il fait 22°C avec un temps ensoleillé, et il est actuellement 14:32:15."*

> Et voilà, t'as un LLM qui interagit avec le monde extérieur. C'est pas magique, c'est juste un pipeline bien orchestré.

# De là à l'agent, il n'y a qu'un pas

Un **agent**, c'est fondamentalement ce qu'on vient de faire, mais dans une boucle plus large et plus autonome. Le LLM ne se contente pas de répondre à une question, il **poursuit un objectif** sur plusieurs étapes.

## La boucle agent classique

```
┌─────────────────────────────────────────┐
│                                         │
│  1. THINK   →  Le LLM réfléchit         │
│       ↓                                 │
│  2. ACT     →  Le LLM choisit un outil  │
│       ↓                                 │
│  3. OBSERVE →  L'outil est exécuté      │
│       ↓                                 │
│  4. LOOP    →  On recommence jusqu'à    │
│               atteindre l'objectif      │
│                                         │
└─────────────────────────────────────────┘
```

Concrètement, voici une boucle agent minimale :

```python
def agent_loop(user_query: str, max_steps: int = 10) -> str:
    """
    Boucle agent : le LLM peut appeler des outils en boucle
    jusqu'à ce qu'il décide de répondre à l'utilisateur.
    """
    messages = [
        {"role": "system", "content": 
         "Tu es un agent autonome. Utilise les outils disponibles "
         "pour accomplir la tâche demandée. Quand tu as terminé, "
         "réponds directement à l'utilisateur sans appeler d'outil."},
        {"role": "user", "content": user_query}
    ]
    
    for step in range(max_steps):
        print(f"\n--- Step {step + 1} ---")
        
        response = llm.create_chat_completion(
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )
        
        msg = response["choices"][0]["message"]
        
        # Si pas de tool_call, l'agent a fini
        if not msg.get("tool_calls"):
            return msg.get("content", "")
        
        # Sinon, on exécute les outils
        messages.append(msg)
        for tool_call in msg["tool_calls"]:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            
            print(f"  → {name}({args})")
            result = execute_tool(name, args)
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call["id"],
                "content": result
            })
    
    return "Agent bloqué (max steps atteint)."
```

## Exemple d'exécution

Imaginons qu'on donne à l'agent des outils comme `search_web`, `read_file`, `execute_python`, et la tâche :

> *"Trouve les 3 derniers articles sur les avancées en IA cette semaine, résume-les, et écris un petit paragraphe de synthèse."*

La boucle agent pourrait faire :

| Step | Action | Résultat |
|------|--------|----------|
| 1 | `search_web("avancées IA juillet 2026")` | 5 URLs trouvées |
| 2 | `read_file(url_1)` | Contenu de l'article 1 |
| 3 | `read_file(url_2)` | Contenu de l'article 2 |
| 4 | `read_file(url_3)` | Contenu de l'article 3 |
| 5 | *(pas de tool_call)* → réponse finale | Synthèse des 3 articles |

> L'agent a pris 5 étapes pour accomplir sa mission. À chaque étape, il a observé le résultat avant de décider de la suite.

# Les différents types d'agents

À partir de cette boucle de base, on peut construire des architectures plus sophistiquées :

## Agent simple (ReAct)

C'est ce qu'on vient de faire. **Reasoning + Acting**. Le modèle alterne entre pensée et action. Simple, efficace, mais peut partir en vrille sur des tâches complexes.

## Agent planificateur (Plan-and-Execute)

Le LLM commence par établir un **plan** complet, puis l'exécute étape par étape.

```
User: "Fais une analyse du marché des GPU en 2026"

Plan:
  1. Rechercher les parts de marché NVIDIA/AMD/Intel
  2. Récupérer les prix moyens par gamme
  3. Chercher les annonces récentes de nouveaux modèles
  4. Synthétiser les informations
  5. Rédiger l'analyse

Exécution: étape 1 → 2 → 3 → 4 → 5
```

> Ça évite que l'agent ne parte dans tous les sens, mais c'est moins flexible si le plan se révèle mauvais en cours de route.

## Multi-agent

Plusieurs agents spécialisés qui collaborent. Un agent "chef d'orchestre" distribue le travail.

```
Agent Orchestrateur
    ├── Agent Recherche → search_web, scrape_page
    ├── Agent Code     → execute_python, read_file
    └── Agent Rédaction → format_output, save_file
```

> C'est le délire complet, mais c'est aussi là que ça devient vraiment puissant. Chaque agent a ses propres outils et sa propre "personnalité".

# Ce qui peut mal tourner (et ça tourne souvent mal)

Quelques pièges classiques du tool calling et des agents :

**Boucle infinie** : l'agent appelle des outils en boucle sans jamais s'arrêter. D'où le `max_steps` dans le code plus haut — toujours mettre une limite.

**Hallucination d'outils** : le modèle invente une fonction qui n'existe pas. Ou il appelle `get_weather` avec des paramètres inventés.

**Mauvais parsing des arguments** : le modèle sort un JSON mal formé. Sur les petits modèles (coucou Qwen3-4B), c'est pas rare. Une astuce : utiliser le *grammar sampling* de llama.cpp pour forcer un format JSON valide.

**Accumulation de contexte** : chaque appel d'outil ajoute du texte dans l'historique. Sur 20 étapes, le contexte peut exploser et dépasser la taille max. Il faut parfois élaguer (*trimming*) ou résumer les étapes passées.

```python
# Exemple : limiter l'historique en ne gardant
# que les N derniers messages
MAX_HISTORY = 20
if len(messages) > MAX_HISTORY:
    # Garder le système + les derniers messages
    messages = [messages[0]] + messages[-(MAX_HISTORY - 1):]
```

# Pourquoi Qwen est particulièrement bon pour ça

Qwen3 (et Qwen2.5 avant lui) a été spécifiquement entraîné pour le tool calling. Dans les benchmarks, même le petit 4B s'en sort honorablement sur des tâches d'appel d'outils simples.

La famille Qwen expose un format de tool calling qui suit de près le standard OpenAI, ce qui le rend compatible avec la plupart des frameworks (LangChain, CrewAI, llama-cpp-python, Ollama...).

Et en local, avec un Qwen3-4B quantifié en Q4_K_M, ça tient dans ~3 Go de RAM et ça tourne à ~30-40 tokens/seconde sur une RTX 5060 — largement assez pour prototyper des agents sans payer d'API.

> Pour du prototypage d'agent, t'as pas besoin d'un modèle à 70B. Un petit 4B bien entraîné fait largement le taf, et t'apprends 10x plus en le faisant tourner toi-même qu'en appelant une API magique.

# Conclusion

Le tool calling, c'est le mécanisme fondamental qui transforme un LLM de "perroquet stochastique" en un vrai **agent autonome** capable d'interagir avec le monde. C'est pas sorcier : le modèle émet une demande structurée, ton code l'exécute, et le modèle synthétise le résultat.

À partir de là, les possibilités sont énormes :

- Un agent qui lit tes mails et rédige des brouillons de réponse
- Un agent qui explore une codebase et suggère des refactors
- Un agent qui fait de la revue de code automatique
- Un agent qui navigue sur le web pour faire de la recherche

Et tout ça, ça tourne **en local**, sur ton PC, sans rien envoyer à un cloud. Franchement, c'est cool.

> Prochaine étape : construire un vrai agent multi-outils avec du RAG et de la mémoire persistante. Mais ça, c'est pour une prochaine note :)</tool>

