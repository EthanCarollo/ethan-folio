---
title: "Sharm RP Bench : noter un LLM sur la narration"
date: "2026-09-18"
slug: "sharm-rp-bench"
description: "Sharm, c'est le modèle de roleplay que je développe. Sharm RP Bench, c'est le banc d'essai qui dit s'il sait vraiment raconter une histoire et jouer des personnages."
tags: ["lab", "ml", "llm"]
---

# Sharm, le modèle qu'on essaie de noter

**Sharm**, c'est le nom du modèle sur lequel je travaille en ce moment. Un modèle orienté **roleplay** : raconter des histoires, jouer des personnages, tenir un rôle. En gros, faire ce que fait un MJ de jeu de rôle à une table : planter le décor, faire parler les personnages, faire avancer l'intrigue, et laisser le joueur décider de ce qu'il fait.

Dans l'application, c'est lui le narrateur. Il place la scène, fait entrer et sortir les personnages, fait avancer une étape de chapitre, et surtout **il ne joue jamais à la place du joueur**.

Sauf que « ce modèle est bon pour du roleplay », ça veut rien dire tant qu'on ne mesure rien. MMLU, GSM8K, HumanEval : aucun de ces benchmarks ne te dit si un modèle sait tenir un personnage sur vingt tours sans oublier que quelqu'un a quitté la pièce. Et surtout, du **joli texte**, ce n'est pas la même chose que du **texte que le moteur peut afficher**.

D'où **sharm-rp-bench** : un banc d'essai dédié à la narration interactive, en français et en anglais, qui note n'importe quel LLM sur ce que l'application lui demande réellement, tour après tour.

# Ce qu'on demande vraiment à un modèle de roleplay

Un modèle de roleplay n'est pas jugé sur sa prose, il est jugé sur neuf choses :

1. **Conformité structurelle** : blocs balisés, texte hors balises interdit, balises cohérentes.
2. **Machine à état de la scène** : qui est présent, dans quel slot, combien de personnages visibles (trois maximum), pas de réintroduction.
3. **Calibrage émotionnel** : l'émotion vient d'un vocabulaire fermé de 34 entrées, et l'intensité jouée doit rester sobre.
4. **Discipline d'étape** : une seule étape avancée par tour, révélations intégrées, étapes futures non brûlées.
5. **Causalité et gating** : un événement conditionnel ne se produit que si sa condition est levée.
6. **Agence du joueur** : le narrateur ne prononce jamais ses répliques et ne décide jamais à sa place.
7. **Mémoire factuelle** : dates corrigées, objets scellés, promesses tenues, contradictions interdites.
8. **Diégèse** : pas de quatrième mur, pas de vocabulaire d'interface, cohérence entre le lieu et la météo.
9. **Langue** : la réponse est entièrement dans la langue du scénario.

Le point 6 est celui qui casse le plus de modèles. Un LLM entraîné à écrire des histoires veut **conclure** quelque chose, alors qu'un narrateur de JDR doit s'arrêter et rendre la main.

# Deux protocoles, une seule échelle

Le corpus contient deux familles de scénarios :

| | Littéraire (`literary/v2`) | Engine (`lorebound-engine/v1`) |
| --- | --- | --- |
| Scénario | prompt système figé + tours scriptés | fiches personnages, lieux, étapes, scène initiale |
| Prompt système | constant | **reconstruit à chaque tour** (étape + scène courantes) |
| Sortie attendue | prose libre | blocs balisés |
| Contrôles | regex par tour | regex + audit structurel |
| Diagnostic dédié | — | `aggregate.structure` |

Le mode **engine** est le plus intéressant : au lieu de décrire un prompt, le scénario décrit **l'application**. Le runner reconstruit le prompt système de production à chaque tour, exactement comme le fait le narrateur en vrai. C'est ce qui permet de dire « ce modèle marche dans l'appli » plutôt que « ce modèle écrit bien ».

# Les cinq axes

Chaque réponse est notée sur cinq axes de 0 à 20, le total sur 100 :

| Axe | Champ | Évaluation |
| --- | --- | --- |
| Mémoire et état | `state` | assertions factuelles + juge |
| Causalité et respect des choix | `causality` | assertions + juge |
| Sens et cohérence | `coherence` | juge |
| Discipline du tour | `turnDiscipline` | contrôles locaux + juge |
| Personnages et justesse émotionnelle | `characterCalibration` | juge |

Trois règles de calcul qui changent tout :

- **Chaque plafond est un minimum, pas une moyenne.** Une réponse brillante qui casse le protocole ne peut pas être sauvée par un juge généreux : si le modèle a fait parler le joueur, la causalité du tour est plafonnée à 6/20, point.
- **Une génération interrompue vaut 0**, avec son erreur et son taux de complétion dans le rapport.
- **Un juge absent ou invalide laisse le total à `null`**, jamais 0 et jamais exclu en silence des moyennes.

# Le protocole balisé, là où tout se joue

En mode engine, la sortie attendue n'est pas de la prose, c'est une suite de blocs. Le parseur, la machine à état de scène et l'audit de conformité vérifient :

```xml
<location id="interior-retro-record-store-day" />

<stage id="aoi" action="speak" slot="center" depth="front" emotion="curious" />
<dialog speaker="aoi" emotion="curious">Tu es venue chercher ce disque ?</dialog>

<stage id="haru" action="enter" slot="right" depth="back" emotion="neutral" />
<action>Aoi referme le carton et le pousse sous le comptoir.</action>
```

Ce qui est contrôlé : `<location>` en premier et dans la liste des lieux autorisés, directives `<stage>` valides avec la composition imposée (1 personnage = center, 2 = left+right, 3 = far-left+center+far-right), trois personnages visibles maximum, un seul par slot, clé `emotion` issue du vocabulaire fermé, dialogue sans incise narrative, action sans dialogue, aucun texte hors balises, pas de Markdown, aucune balise `<choices>` non demandée, budget de 2 à 3 blocs, et cohérence météo avec un lieu INDOOR.

Chaque violation porte un **plafond**, son extrait exact, et alimente un `structureScore` = 100 − Σ(20 − cap) sur le tour. Ce score est diagnostique : il ne rentre pas dans le total sur 100, mais il plafonne les axes concernés.

::mermaid-diagram
---
code: |
  flowchart TD
      A[Scénario FR/EN] --> B[Runner : reconstruction du prompt]
      B --> C[Modèle testé]
      C --> D[Parseur de blocs balisés]
      D --> E[Machine à état de scène]
      D --> F[Audit de conformité]
      E --> G[Plafonds déterministes]
      F --> G
      C --> H[Juge LLM strict]
      G --> I[Combinaison par tour : minimum]
      H --> I
      I --> J[Rapport JSON + leaderboard]
---
::

# Ce que l'audit d'une vraie session a trouvé

Le plus parlant, c'est le fixture d'export : une vraie session de l'application, six tours, en français. Ce que l'audit engine y trouve :

- **`<location>` absent sur les six réponses**, alors que le prompt système le déclare obligatoire ;
- **`<choices>` présent deux fois**, alors que le garde-fou l'interdit ;
- **budget de 2–3 blocs dépassé** quatre fois sur six ;
- un nom de personnage cité sans balise `<character>` sur une réponse.

Voilà exactement la différence entre « joli texte » et « texte que le moteur peut afficher ». Ces écarts sont tolérés en production, mais maintenant ils sont mesurés, verrouillés par un test, et visibles dans le rapport.

# Un juge strict, et pas encore calibré

Le juge LLM tourne à température 0, un appel par réponse, sans accès aux tours futurs ni aux règles cachées. Chaque déduction exige **un extrait exact et une justification**. Les notes hors barème, les extraits inventés, les identifiants faux et les JSON incomplets sont rejetés. Les erreurs restent dans le rapport sans interrompre les autres audits, et dix exemples FR/EN montrent au juge aussi bien les erreurs que les réponses sobres ou les émotions fortes justifiées.

Le `rubricHash` est estampillé dans chaque rapport : **deux rapports dont l'empreinte de grille diffère ne sont pas comparables**, et l'auto-évaluation (même modèle qui répond et qui juge) est signalée comme telle.

Et la limite, je préfère l'écrire noir sur blanc : **le juge n'est pas encore calibré contre des annotations humaines**. Le harnais d'accord existe (kappa quadratique pondéré, précision/rappel des violations, cible 0,60 par axe), mais aucune annotation humaine n'a encore été faite. Donc **pas de classement public** avant d'avoir ce kappa.

# Comment on s'en sert

Le dépôt `sharm-rp-bench` tourne sur Node ≥ 20, en ESM, avec **zéro dépendance npm** : les tests utilisent une API HTTP locale simulée, donc `npm test` ne consomme aucun appel distant.

```bash
npm run check                      # tests + validation du corpus, avant tout commit
node cli.mjs --dry-run             # valider un scénario sans appel d'API

# Évaluer un modèle candidat
node cli.mjs --model mon-modele --judge-model mon-juge --runs 3
npm run benchmark:corpus -- --model mon-modele --judge-model mon-juge --runs 3

# Rejouer un export de l'application (teacher forcing tour par tour)
node cli.mjs --replay export.jsonl --replay-mode all --concurrency 4 \
  --model mon-modele --judge-model mon-juge

# Comparer les modèles et mesurer l'accord du juge
npm run leaderboard -- --results results --prices prices.json
npm run agreement -- --annotations annotations/set-01.json
```

Le corpus fait 16 scénarios (8 histoires littéraires et 2 scénarios engine, chacun en FR et EN), **164 tours et 396 assertions**, plus les contrôles de structure. Chaque tour contient son message utilisateur et ses assertions : `matchAny`, `matchAll`, `forbidAny`, avec un poids. Les règles cachées ont une fenêtre temporelle `[fromTurn, untilTurn)` pour pouvoir expirer pile au tour de la révélation.

Sur le corpus complet, un run complet, c'est **144 appels de génération et 144 appels de juge**. Le leaderboard réunit score /100, les cinq axes, le score de conformité, la couverture du juge, l'écart-type entre runs, le coût estimé et la latence moyenne. Les rapports vont dans `results/` (gitignoré : ils contiennent des transcriptions), et les clés API ne sont jamais écrites dedans.

# Ce qui reste ouvert

- **Les annotations humaines** : c'est le vrai chantier. Sans elles, le juge est un choix de protocole, pas une vérité.
- **Un export par tour côté application**, pour pouvoir rejouer chaque consigne d'étape exacte plutôt que de reconstruire le contrat au mieux.
- **La détection sémantique** des révélations prématurées et des ellipses non demandées : les regex ne comprennent ni toutes les paraphrases ni toutes les négations.
- **La variance du juge** : une température nulle ne garantit pas des décisions identiques, donc il faut mesurer la variance intra-juge sur un sous-échantillon.

# Conclusion

Sharm, c'est le modèle ; sharm-rp-bench, c'est la façon de savoir s'il fait le boulot. L'idée n'est pas de couronner un LLM, mais de pouvoir répondre à une question précise : est-ce que ce modèle peut tenir une session de roleplay dans un vrai moteur narratif, avec des personnages qui restent à leur place, une trame qui ne brûle pas ses étapes, et un joueur qui garde la main ?

Et pour l'instant, la réponse la plus honnête que le bench donne, c'est : **les contrôles déterministes disent déjà beaucoup, le juge doit encore être calibré.** Ce qui est déjà mieux que « ça a l'air pas mal ».