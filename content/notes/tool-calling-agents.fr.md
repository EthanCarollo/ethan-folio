---
title: "Tool Calling et Agents LLM"
date: "2026-07-15"
slug: "tool-calling-agents"
description: "Comprendre comment un LLM peut interagir avec des outils externes et comment on construit un agent à partir de ça."
tags: ["lab", "ml"]
---

# Introduction

Bon, aujourd'hui on va parler de **tool calling** (aussi appelé *function calling*, c'est pareil). C'est le mécanisme qui permet à un LLM de ne pas juste cracher du texte, mais d'interagir avec le monde extérieur : appeler une API, lire un fichier, exécuter du code, lancer une recherche web, etc.

Et ce qui est encore plus intéressant, c'est qu'à partir de ce mécanisme tout simple, on peut construire ce qu'on appelle des **agents**. Des boucles autonomes où le LLM décide, agit, observe, et recommence jusqu'à atteindre un objectif.

Bref, on va décortiquer tout ça en partant de zéro, avec du code barebone, sans framework, juste avec `llama-cpp-python` et un petit **Qwen3-4B** en local.

> Parce que comprendre ce qui se passe derrière la magie, c'est quand même plus satisfaisant que de juste appeler `agent.run()` sans savoir comment ça marche.

# Un LLM de base, c'est juste `texte -> texte`

Faut jamais oublier ce truc fondamental : un LLM, à la base, c'est une boîte noire qui prend du texte en entrée et qui prédit le token suivant, encore et encore, jusqu'à produire une réponse complète.

```
prompt -> [LLM] -> réponse
```

C'est tout. Pas d'accès à internet, pas de calculatrice, pas de mémoire externe. Juste du texte qui rentre et du texte qui sort. Le modèle ne peut pas :

- Connaître la météo d'aujourd'hui
- Faire une addition sur des grands nombres de façon fiable
- Lire un fichier sur ton disque
- Savoir l'heure qu'il est

C'est là que le **tool calling** entre en jeu.

# Le tool calling, c'est quoi ?

Le principe est simple : au lieu de répondre directement, le LLM peut décider de **demander l'exécution d'une fonction externe**. Il ne l'exécute pas lui-même (il en est incapable), il émet une instruction structurée du genre :

> *"Je sais pas répondre à ça tout seul, peux-tu appeler la fonction `get_weather` avec `city: Paris` ?"*

Et c'est ton code (le "runtime") qui intercepte cette demande, exécute la vraie fonction, et renvoie le résultat au modèle pour qu'il puisse continuer.

Le flux devient :

```
prompt -> [LLM] -> "je veux appeler get_weather(Paris)"
                         ↓
                 appel réel à get_weather(Paris) -> "18°C, nuageux"
                         ↓
résultat -> [LLM] -> "Il fait 18°C à Paris avec un ciel nuageux."
```

> C'est un peu comme si le LLM levait la main en disant "je délègue, revenez vers moi avec le résultat".

# Comment ça marche techniquement ?

## 1. On définit les outils disponibles

On fournit au modèle une description des fonctions qu'il peut appeler. Le format standard, c'est du **JSON Schema** :

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
            "description": "Le nom de la ville, ex: Paris, Tokyo"
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

Ce bloc s'appelle le **tool schema**. Il est injecté dans le prompt système pour que le modèle sache ce qu'il peut faire.

## 2. Le modèle décide (ou pas) d'appeler un outil

Quand le modèle reçoit un message utilisateur, il a deux choix :

- **Répondre normalement** avec du texte. Pas besoin d'outil, il gère tout seul.
- **Émettre un `tool_call`**. Une réponse structurée qui dit "je veux appeler telle fonction avec tels arguments".

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

> Le modèle ne décide pas au hasard. Il a été fine-tuné pour reconnaître quand une demande nécessite un outil et pour formater sa réponse correctement.

## 3. On exécute l'outil et on renvoie le résultat

Ton code intercepte le `tool_call`, exécute la vraie fonction, et ajoute le résultat dans l'historique de conversation :

```json
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "Paris: 18°C, partiellement nuageux, humidité 65%"
}
```

## 4. Le modèle reprend la main

Avec le résultat de l'outil dans son contexte, le modèle génère sa réponse finale :

> "Actuellement à Paris, il fait 18°C avec un ciel partiellement nuageux et une humidité de 65%."

Et voilà, c'est tout le mécanisme. Simple, non ?

# Testons en barebone avec Qwen3-4B et llama-cpp

Bon, assez de théorie. On va faire tourner ça pour de vrai, **sans framework, sans `create_chat_completion`**, juste avec l'API d'inférence brute de `llama-cpp-python`. Le but c'est de voir exactement ce qui se passe sous le capot.

## Setup de base

```python
from llama_cpp import Llama

llm = Llama(
    model_path="~/models/qwen3-4b-Q4_K_M.gguf",
    n_ctx=4096,
    n_gpu_layers=12,      # 12 couches sur GPU, le reste sur CPU
    verbose=False,
)
```

## Étape 1 : formater le prompt avec les outils

Qwen attend un format de chat spécifique. On va construire notre prompt à la main avec le template de chat Qwen et nos définitions d'outils intégrées dans le message système.

```python
import json

# Nos outils au format JSON Schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Récupère la météo actuelle pour une ville",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "La ville"}
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

SYSTEM_PROMPT = f"""Tu es un assistant utile. Tu as accès aux outils suivants.
Quand tu as besoin d'un outil, réponds UNIQUEMENT avec un bloc JSON comme ceci :
{{"tool_call": {{"name": "<nom_outil>", "arguments": {{...}}}} }}

Outils disponibles :
{json.dumps(tools, indent=2, ensure_ascii=False)}"""

user_query = "Quel temps fait-il à Tokyo ? Et quelle heure est-il ?"

# Construction du prompt avec le template de chat Qwen
# Format: <|im_start|>system\n...<|im_end|>\n<|im_start|>user\n...<|im_end|>\n<|im_start|>assistant\n
prompt = f"""<|im_start|>system
{SYSTEM_PROMPT}<|im_end|>
<|im_start|>user
{user_query}<|im_end|>
<|im_start|>assistant
"""
```

> On utilise le format `<|im_start|>` / `<|im_end|>` qui est le template natif de Qwen. Pas de magie, juste des tokens spéciaux.

## Étape 2 : première inférence brute

```python
# Inférence brute, sans outil automatique
output = llm(
    prompt,
    max_tokens=512,
    temperature=0.1,   # basse température pour du JSON propre
    stop=["<|im_end|>", "<|im_start|>"],
)

raw_response = output["choices"][0]["text"].strip()
print(f"Réponse brute du modèle:\n{raw_response}")
```

Le modèle va produire quelque chose comme :

```json
{"tool_call": {"name": "get_weather", "arguments": {"city": "Tokyo"}}}
```

> Voilà, c'est ça le tool calling en barebone. Le modèle répond avec un JSON qu'on va parser nous-mêmes. Aucun framework ne fait ça pour nous, c'est juste du texte.

## Étape 3 : parser le tool call et exécuter

```python
import re
from datetime import datetime

def parse_tool_call(text: str) -> dict | None:
    """Extrait un appel d'outil depuis la réponse JSON du modèle."""
    try:
        # Essaie de parser du JSON direct
        data = json.loads(text)
        if "tool_call" in data:
            return data["tool_call"]
    except json.JSONDecodeError:
        pass
    
    # Fallback: cherche un bloc JSON avec regex
    match = re.search(r'\{.*"tool_call".*\}', text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group())
            if "tool_call" in data:
                return data["tool_call"]
        except json.JSONDecodeError:
            pass
    
    return None

def execute_tool(name: str, arguments: dict) -> str:
    """Exécute l'outil demandé et retourne le résultat."""
    if name == "get_weather":
        city = arguments.get("city", "inconnue")
        # Dans la vraie vie, appel d'API météo ici
        return f"Météo à {city}: 22°C, ensoleillé, humidité 40%"
    
    elif name == "get_time":
        return f"Heure actuelle: {datetime.now().strftime('%H:%M:%S')}"
    
    return f"Erreur: outil '{name}' inconnu."

# Parse et exécute
tool_call = parse_tool_call(raw_response)

if tool_call:
    print(f"Tool appelé: {tool_call['name']}({tool_call['arguments']})")
    result = execute_tool(tool_call["name"], tool_call["arguments"])
    print(f"Résultat: {result}")
```

> Le parsing peut être fragile sur les petits modèles. Le JSON est parfois mal formé ou tronqué, d'où le fallback avec regex. En prod, on utiliserait le *grammar sampling* de llama.cpp pour forcer un JSON valide, mais on verra ça une autre fois.

## Étape 4 : renvoyer le résultat pour la réponse finale

```python
# On reconstruit le prompt avec l'historique complet
prompt += raw_response + "<|im_end|>\n"
prompt += f"<|im_start|>tool\n{result}<|im_end|>\n"
prompt += "<|im_start|>assistant\n"

# Deuxième inférence : le modèle synthétise le résultat
final_output = llm(
    prompt,
    max_tokens=512,
    temperature=0.7,
    stop=["<|im_end|>", "<|im_start|>"],
)

final_response = final_output["choices"][0]["text"].strip()
print(f"Réponse finale:\n{final_response}")
```

Et là, le modèle répond naturellement :

> "À Tokyo, il fait 22°C avec un temps ensoleillé et 40% d'humidité. L'heure actuelle est 14:32:15."

> Et voilà. Zéro framework, zéro magie. Juste du prompt engineering, un appel d'inférence, du parsing JSON, et un deuxième appel d'inférence. C'est tout ce que font les "gros" frameworks comme LangChain derrière leurs abstractions.

# De là à l'agent, il n'y a qu'un pas

Un **agent**, c'est fondamentalement ce qu'on vient de faire, mais dans une **boucle** plus large. Le LLM ne se contente pas de répondre à une question, il poursuit un **objectif** sur plusieurs étapes, en décidant à chaque tour s'il a besoin d'un outil ou s'il peut répondre.

## La boucle agent

::mermaid-diagram
---
code: |
  flowchart TD
      A[🎯 Objectif utilisateur] --> B[🤖 Le LLM réfléchit]
      B --> C{Outil nécessaire ?}
      C -->|Oui| D[📞 Émission d'un tool_call]
      D --> E[⚙️ Exécution de l'outil]
      E --> F[📥 Résultat injecté dans le contexte]
      F --> B
      C -->|Non| G[💬 Réponse finale à l'utilisateur]
---
::

## Implémentation barebone d'une boucle agent

Reprenons notre code d'inférence brute et emballons-le dans une boucle :

```python
def agent_loop(user_query: str, tools: list, max_steps: int = 10) -> str:
    """
    Boucle agent barebone.
    Le LLM peut appeler des outils en boucle jusqu'à ce qu'il
    décide de répondre directement à l'utilisateur.
    """
    
    system_prompt = f"""Tu es un agent autonome. Tu as accès aux outils suivants.
Pour appeler un outil, réponds UNIQUEMENT avec :
{{"tool_call": {{"name": "<nom>", "arguments": {{...}} }} }}
Quand tu as terminé ta mission, réponds directement à l'utilisateur SANS JSON.

Outils disponibles :
{json.dumps(tools, indent=2, ensure_ascii=False)}"""
    
    # Initialisation du prompt avec le template Qwen
    prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
    prompt += f"<|im_start|>user\n{user_query}<|im_end|>\n"
    prompt += "<|im_start|>assistant\n"
    
    step_count = 0
    
    while step_count < max_steps:
        step_count += 1
        
        # Inférence
        output = llm(
            prompt,
            max_tokens=512,
            temperature=0.1,
            stop=["<|im_end|>", "<|im_start|>"],
        )
        
        response_text = output["choices"][0]["text"].strip()
        
        # On essaie de parser un tool_call
        tool_call = parse_tool_call(response_text)
        
        if tool_call is None:
            # Pas d'outil demandé, l'agent a fini sa mission
            print(f"[Agent] Mission accomplie en {step_count} étape(s).")
            return response_text
        
        # Exécution de l'outil
        tool_name = tool_call["name"]
        tool_args = tool_call["arguments"]
        
        print(f"[Step {step_count}] Appel de {tool_name}({tool_args})")
        tool_result = execute_tool(tool_name, tool_args)
        
        # On ajoute à l'historique et on continue
        prompt += response_text + "<|im_end|>\n"
        prompt += f"<|im_start|>tool\n{tool_result}<|im_end|>\n"
        prompt += "<|im_start|>assistant\n"
    
    return "[Erreur] Agent bloqué, max steps atteint."
```

## Exemple d'exécution

Imaginons qu'on donne à l'agent des outils comme `search_web`, `read_page`, `execute_python`, et la tâche :

> *"Trouve les 3 dernières news sur Qwen, résume-les en une phrase chacune, et écris une mini synthèse."*

La boucle pourrait faire :

| Step | Action du LLM | Résultat |
|------|--------------|----------|
| 1 | `search_web("Qwen latest news 2026")` | 5 URLs trouvées |
| 2 | `read_page(url_1)` | Contenu de l'article 1 |
| 3 | `read_page(url_2)` | Contenu de l'article 2 |
| 4 | `read_page(url_3)` | Contenu de l'article 3 |
| 5 | *(pas de tool_call)* → réponse finale | Synthèse des 3 articles |

> L'agent a pris 5 étapes pour accomplir sa mission. À chaque tour, il observe le résultat avant de décider de la suite. C'est ça la magie de la boucle agent. Et c'est juste une boucle `while` avec des appels d'inférence.

# Les différents types d'agents

À partir de cette boucle de base, on peut construire des trucs plus élaborés :

## Agent simple (ReAct)

C'est ce qu'on vient de faire. **Reasoning + Acting**. Le modèle alterne entre penser et agir. Simple, direct, efficace. Mais ça peut partir en vrille sur des tâches complexes où il faut planifier à l'avance.

## Agent planificateur (Plan-and-Execute)

Le LLM commence par établir un **plan complet**, puis l'exécute étape par étape. C'est plus structuré.

```
User: "Fais une analyse du marché des GPU en 2026"

Plan:
  1. Rechercher les parts de marché NVIDIA/AMD/Intel
  2. Récupérer les prix moyens par gamme
  3. Chercher les annonces récentes de nouveaux modèles
  4. Synthétiser les informations
  5. Rédiger l'analyse

Exécution: 1 -> 2 -> 3 -> 4 -> 5
```

> C'est plus robuste, mais moins flexible si le plan se révèle mauvais en cours de route. L'agent peut pas vraiment improviser.

## Multi-agent

Plusieurs agents spécialisés qui collaborent, orchestrés par un agent "chef". Chacun a ses propres outils et sa propre "personnalité".

```
Agent Orchestrateur
  ├── Agent Recherche -> search_web, scrape_page
  ├── Agent Code      -> execute_python, read_file
  └── Agent Rédaction -> format_output, save_file
```

> C'est là que ça devient vraiment puissant, mais aussi plus complexe à debugger. Chaque agent fait tourner sa propre boucle, et ils communiquent entre eux via le chef d'orchestre.

# Ce qui peut foirer (et ça foire souvent)

Le tool calling et les agents, c'est puissant mais c'est loin d'être infaillible. Quelques pièges classiques :

**Boucle infinie.** L'agent appelle des outils en boucle sans jamais s'arrêter. D'où le `max_steps` dans le code plus haut. Mets toujours une limite, crois-moi.

**Hallucination d'outils.** Le modèle invente une fonction qui n'existe pas, ou appelle `get_weather` avec des paramètres qui n'ont aucun sens. Sur Qwen3-4B, ça arrive, surtout si le tool schema est complexe.

**JSON mal formé.** Le modèle sort un JSON invalide ou tronqué. C'est LE problème numéro 1 avec les petits modèles. Solutions :

```python
# Option 1 : Grammar sampling avec llama.cpp
# Force le modèle à ne générer que du JSON valide
grammar = llama_cpp.LlamaGrammar.from_json_schema(
    json.dumps({
        "type": "object",
        "properties": {
            "tool_call": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "arguments": {"type": "object"}
                },
                "required": ["name", "arguments"]
            }
        },
        "required": ["tool_call"]
    })
)

output = llm(prompt, max_tokens=256, grammar=grammar)
# Là, t'es GARANTI d'avoir du JSON valide.
```

> Le grammar sampling, c'est un cheat code. Tu restreins les tokens que le modèle a le droit de générer pour qu'ils respectent un schéma. Zéro parsing, zéro regex, zéro erreur. C'est utilisable avec n'importe quel modèle GGUF.

**Explosion du contexte.** Chaque appel d'outil ajoute du texte dans l'historique. Sur 20 étapes, le contexte peut facilement dépasser la taille max du modèle. Il faut parfois élaguer l'historique :

```python
MAX_HISTORY = 15

if step_count > MAX_HISTORY:
    # On garde le système + les derniers messages
    # Attention, c'est simplifié, dans la vraie vie faut
    # gérer les paires tool_call / tool_result ensemble
    messages = messages[:2] + messages[-(MAX_HISTORY - 2):]
```

# Pourquoi Qwen est particulièrement bon pour ça

Qwen3 (et Qwen2.5 avant lui) a été spécifiquement entraîné pour le tool calling. Dans les benchmarks, même le petit 4B s'en sort honorablement sur des tâches d'appel d'outils simples, surtout si on utilise le grammar sampling pour éviter les erreurs de parsing.

La famille Qwen suit le format de tool calling standard (proche d'OpenAI), ce qui le rend compatible avec à peu près tous les frameworks du marché. Mais encore une fois, t'as pas besoin de framework pour faire du tool calling avec Qwen. Le template `<|im_start|>` est simple et prévisible.

Et en local, avec un Qwen3-4B quantifié en Q4_K_M, ça tient dans environ 3 Go de RAM et ça tourne à 30-40 tokens/seconde sur une RTX 5060. Largement assez pour prototyper des agents sans débourser un centime en API.

> Pour du prototypage d'agent, t'as pas besoin d'un modèle à 70B. Un petit 4B bien entraîné fait le taf, et tu comprends 10x mieux ce qui se passe en le faisant tourner toi-même qu'en appelant une API magique.

# Conclusion

Le tool calling, c'est le mécanisme fondamental qui transforme un LLM de simple générateur de texte en un vrai **agent autonome** capable d'interagir avec le monde. Y'a rien de magique : le modèle émet une demande structurée, ton code l'exécute, et le modèle synthétise le résultat. C'est juste une boucle.

Et une fois que t'as pigé ça, les possibilités sont énormes :

- Un agent qui lit tes mails et rédige des brouillons de réponse
- Un agent qui explore une codebase et suggère des refactors
- Un agent qui fait de la revue de code automatique
- Un agent qui navigue sur le web pour faire de la recherche
- Un agent qui contrôle ton PC avec des commandes shell

Et tout ça, ça tourne **en local**, sur ta machine, sans rien envoyer à personne. Franchement, c'est le pied.

> Prochaine étape : construire un vrai agent multi-outils avec du RAG, de la mémoire persistante, et du grammar sampling pour des appels d'outils fiables à 100%. Stay tuned.
