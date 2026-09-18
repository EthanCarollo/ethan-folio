---
title: "Sharm RP Bench : noter un LLM sur la narration"
date: "2026-09-18"
slug: "sharm-rp-bench"
description: "Sharm, c'est le modèle de roleplay que je développe. Sharm RP Bench, c'est le banc d'essai qui dit s'il sait vraiment raconter une histoire et jouer des personnages."
tags: ["lab", "ml", "llm"]
---

# Sharm, le modèle qu'on essaie de noter

**Sharm**, c'est le nom du modèle sur lequel je travaille en ce moment. Un modèle orienté **roleplay** : raconter des histoires, jouer des personnages, tenir un rôle. Ce que fait un MJ de jeu de rôle à une table — planter le décor, faire parler les personnages, faire avancer l'intrigue, et laisser le joueur décider de la suite. Dans l'application, c'est lui le narrateur, et il ne joue jamais à la place du joueur.

Sauf que « ce modèle est bon pour du roleplay », ça ne veut rien dire tant qu'on ne mesure rien. MMLU, GSM8K, HumanEval : aucun de ces benchmarks ne dit si un modèle tient un personnage sur vingt tours sans oublier que quelqu'un a quitté la pièce. Et du **joli texte**, ce n'est pas la même chose que du **texte que le moteur peut afficher**.

D'où **Sharm RP Bench**, le banc d'essai dédié à la narration interactive, en français et en anglais. Il n'est pas encore public : il devrait l'être bientôt, probablement en accès libre pour tout le monde, et je remettrai un lien ici quand ce sera propre.

# Ce qu'on demande vraiment à un modèle de roleplay

Pas d'être doué en prose, mais :

- **Conformité structurelle** : blocs balisés, aucun texte hors balises, pas de Markdown.
- **Scène** : qui est présent, dans quel slot, trois personnages visibles maximum, pas de réintroduction.
- **Émotions** : une émotion issue d'un vocabulaire fermé, avec l'intensité la plus faible qui correspond.
- **Discipline d'étape** : une seule étape avancée par tour, révélations intégrées, étapes futures non brûlées.
- **Causalité** : un événement conditionnel ne se produit que si sa condition est levée.
- **Agence du joueur** : le narrateur ne prononce jamais ses répliques et ne décide jamais à sa place.
- **Mémoire** : dates corrigées, objets scellés, promesses tenues, contradictions interdites.
- **Diégèse** : pas de quatrième mur, pas de vocabulaire d'interface, cohérence entre le lieu et la météo.
- **Langue** : la réponse reste entièrement dans la langue du scénario.

C'est l'agence du joueur qui casse le plus de modèles : un LLM entraîné à écrire des histoires veut **conclure** quelque chose, alors qu'un narrateur de JDR doit s'arrêter et rendre la main.

# Cinq notes sur 20, total sur 100

Le corpus, ce sont 16 scénarios en français et en anglais, 164 tours à jouer.

| Axe | Évaluation |
| --- | --- |
| Mémoire et état | assertions factuelles + juge |
| Causalité et respect des choix | assertions + juge |
| Sens et cohérence | juge |
| Discipline du tour | contrôles locaux + juge |
| Personnages et justesse émotionnelle | juge |

Trois règles de calcul qui changent tout :

- **Chaque plafond est un minimum, pas une moyenne.** Une réponse brillante qui casse le protocole ne peut pas être sauvée par un juge généreux : si le modèle a parlé à la place du joueur, la causalité du tour est plafonnée, point.
- **Une génération interrompue vaut 0**, avec son erreur et son taux de complétion.
- **Un juge absent ou invalide laisse le total vide**, jamais 0 et jamais exclu en silence des moyennes.

# Le protocole balisé, là où tout se joue

Dans le mode qui reproduit l'application, la sortie attendue n'est pas de la prose mais une suite de blocs :

```xml
<location id="interior-retro-record-store-day" />

<stage id="aoi" action="speak" slot="center" depth="front" emotion="curious" />
<dialog speaker="aoi" emotion="curious">Tu es venue chercher ce disque ?</dialog>
```

Ce qui est vérifié : `<location>` en premier et dans la liste des lieux autorisés, composition de la scène imposée selon le nombre de personnages présents, trois visibles maximum et un seul par slot, émotion prise dans le vocabulaire fermé, dialogue sans incise narrative, action sans dialogue, budget de 2 à 3 blocs, aucune balise non demandée, et cohérence de la météo avec un lieu intérieur. Chaque violation plafonne l'axe concerné et laisse l'extrait exact dans le rapport.

# Ce que ça donne sur une vraie session

Le plus parlant, c'est une session réelle de l'application, six tours, en français :

- **`<location>` absent sur les six réponses**, alors que le prompt système le déclare obligatoire ;
- **`<choices>` présent deux fois**, alors que le garde-fou l'interdit ;
- **budget de 2–3 blocs dépassé** quatre fois sur six ;
- un nom de personnage cité sans balise `<character>`.

Voilà exactement la différence entre « joli texte » et « texte que le moteur peut afficher ». Ces écarts passaient en production sans que personne ne les compte ; maintenant ils sont mesurés et visibles.

# Un juge strict, pas encore calibré

Le juge tourne à température 0, sans accès aux tours suivants ni aux règles cachées, et chaque déduction exige **un extrait exact et une justification** : notes hors barème, extraits inventés et JSON incomplets sont rejetés. Et la limite, je préfère l'écrire noir sur blanc : **il n'est pas encore calibré contre des annotations humaines**. Le harnais d'accord existe (kappa pondéré, cible de 0,60 par axe), mais pas de classement public avant de l'avoir.

# Conclusion

Sharm, c'est le modèle ; Sharm RP Bench, c'est la façon de savoir s'il fait le boulot. Pas pour couronner un LLM, mais pour répondre à une question précise : est-ce que ce modèle peut tenir une session de roleplay dans un vrai moteur narratif, avec des personnages qui restent à leur place, une trame qui ne brûle pas ses étapes, et un joueur qui garde la main ?

Pour l'instant, la réponse la plus honnête que le bench donne, c'est : **les contrôles automatiques disent déjà beaucoup, le juge doit encore être calibré.** Ce qui est déjà mieux que « ça a l'air pas mal ».