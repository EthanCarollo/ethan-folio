---
title: "Qwen3.8 + Strata + DSH"
date: "2026-10-22"
slug: "qwen3-8-strata-dsh"
description: "Des experimentations, plutot pas ininteressantes."
tags: ["lab", "ml", "setup", "agent", "coding"]
---

En gros, je faisais ma petite veille sur reddit, et j'avais entendu parlé de Strata justement dans une discussion et aujourd'hui, j'étais curieux de voir ce que ça pouvait donner, donc je suis aller sur le repo, j'ai download, et j'ai testé.

> Le repo : https://github.com/Niko1221/Strata 

# D'abord testons, est ce que c'est interessant ?

En tant qu'utilisateur, ce qui m'interesse déja, est ce que c'est UTILE, genre est ce que ça peut vraiment être game changer ?

En vrai c'est vraiment pas compliqué, une fois que c'est installé, `strata install` dans le terminal, et on peut commencer à tout mettre en place.
Ma config reste très très humble, RTX 5060 TI 16Go, 32Go DDR5 et Ryzen 7 9800X3D, sans oublier mon SSD tout péter de 256Go trouvé dans un vieuw pc portable (pour de l'IA ça reste un setup assez humble).

Premier soucis, je me rends compte que ça a l'air de pas mal streamé depuis le SSD, en tout cas, ça nécessite un SSD rapide, dans mon cas pas ouf, mais il propose un modèle plus humble quand même.

Donc je pars sur ce modele : https://huggingface.co/agentionai/Qwen3.8-Flash-Next-Gyro-GGUF 

> Je connaissais pas du tout cette suite de modèle "Gyro", et pour le coup, les stats annoncées sont assez folle

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

> Donc déja, ça amene le principe de quantization, un truc dont je parlerais plus tard, mais qui en gros, vise à dire "on va réduire la précision des poids du modele pour réduire sa taille", évidemment, ça réduit aussi la précision du modèle, mais la perte peut être moindre dans certains cas grace à quelques astuces, et dans la notre, avec ce modele, "Gyro", on garde 98% de la précision du Q4 en étant en Q3, ce qui est plutot pas mal quoi. sachant que leur Q3 fait 50Go quoi... (le Q4 en fait environ 100 mais bref)

Ok bon les promesses sont sympa, mais avec mon hardware, j'ai qu'une solution, prendre la version "S" du modèle et de prier pour que ce soit clean avec 128K de context window. Et donc Strata setup absolument tout tout seul ! (MERCI) 

Il nous met en place un endpoint api sur notre port 8080 à / pour le format anthropic ou /v1 pour le format open ai, bon c'est cool, c'est une interface en + mais c'est tout.

Donc moi je vais connecter ça à Deepseek Harness, et je vais déja pouvoir faire tourner ça et voir mon hardware bruler :) 

Je vais pouvoir générer mon jeu préféré de tout les temps. Minecraft. En Three.js. Et je ferais un compte rendu débile en disant si ce que ça a fait ça m'a plu ou non. (Je ne ferais pas de benchmark ou quoi que ce soit, ça a déja été fait, là je veux déja voir si c'est à chier et que c'est incapable de faire des tools call et d'avoir ce role "agentique" ou pas)

Pour quelqu'un qui branche souvent des API et qui fait souvent des tests avec des conneries, c'était hyper rapide, pas de mauvaise surprise. C'est parti pour "MinecraftEnMieux"

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image3.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

Je vais faire un prompt un peu débile avec lui même, j'aimerais lui demander de faire un prompt 

```
Fais toi une liste de choses à faire pour produire un jeu de survie en Voxel 3D complet avec Three.js, TypeScript et Vite, inspiré des jeux de construction et de survie comme Minecraft, mais avec une identité visuelle totalement originale.

le projet doit pouvoir être installé, lancé et compilé à partir d'instructions claires. Fournis les commandes d'installation, de lancement et de test, indique les fonctionnalités réellement terminées et signale honnêtement les éventuelles limites. Ne déclare jamais un test réussi sans l'avoir exécuté. Privilégie la qualité, la cohérence artistique, la jouabilité et la fiabilité plutôt que les fonctionnalités superficielles.
```

> Et donc déja je note, mais bordel ça va quasiment aussi vite que Mellum2.1 (12B-A2.5B) sur ma machine

ET IL SE MET DEJA A FAIRE DES CHANGEMENTS LOLLLL...

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image4.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

Bref je lui dis de stopper instant et je lui dis de me filer la liste, et il me demande si elle me convient, il est mignon je l'aime déja.

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image5.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

> En fait c'est con mais ça ramene un sentiment de "controle" d'avoir ce genre de questions, meme si ce n'est qu'un sentiment.

JE LANCE TOUT ON EST PARTI IL EST 19H27. (j'ai déja consommé 197K tokens)


Donc on a un truc qui marche, et qui est franchement correct, pour une premiere itération, c'est pas si mauvais, le jeu se termine vers 21h15 avec environ 20M de tokens consommé (IN/OUT) en étant 100% local ce qui est pour moi super cool.

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image6.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

<TerminalVideoPlayer
src="/qwen38strata_media/videotest.webm"
title="minecraftenmieux.mp4">
</TerminalVideoPlayer>

C'est vraiment excellent ! Pour du local, avoir tout ça sans aucun bug en 3 coups de prompt, je trouve ça très prometteur, je vais un peu refinetune ce jeu en lui donnant des indications, mais c'est excellent !

## Je lui demande des nouveaux trucs

### Une police en pixel art

C'est marrant car vu qu'il a pas accès à internet, il se crée tout un subagent avec une consigne

```
Objectif : générer UNE police pixel-art bitmap, en utilisant opentype.js,...

Rapport final (via send_message) : chemin du fichier, taille, nombre de glyphes,...
```

C'est assez intéressant car comparé à Mellum2.1 que j'avais pu testé, ce modele va être plus complet et concret et avoir des chemins de pensées + explicable par l'humain, là où Mellum peut être beaucoup plus surprenant en faisant des trucs un peu WTF et en "reflechissant" de façon pas compréhensible humainement.

C'est surement dû au fait que le modèle est bien + gros, comparé au modèle de Mellum, celui qu'on utilise là est environ 10x plus gros... Ceci explique potentiellement celà.

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/imagefont.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

> La font est assez spécial, on voit des maladresses mais ça reste super interessant que l'agent ai eu cette démarche

### Les Shader

Je veux avoir un shader à la minecraft, un truc de fou, j'attends beaucoup de ce changement.

```
J'aimerais que tu mettes en place un plan pour faire des shaders et avoir un rendu visuel vraiment très clean
```

Ca me fait un plan très complet avec des criteres et des preuves mesurables pour chaque critères, ce qui permet de potentiellement tester pour le modele.

| Critère | Preuve mesurable (capture / test) |
| --- | --- |
| Ombres portées cohérentes | un relief projette une ombre sur le sol ; pas d'acné ni de « peter panning » sur les voxels |
...


# Les perfs 

Et qu'est ce que ça en dit niveau "perf" hardware

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/qwen38strata_media/image2.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

Ok déja, on voit un truc, 1500 t/s, c'est d'ingestion hein, sinon je suis + aux alentour de 60/70 en output ce qui est déja une petite folie ! 

# Bon pourquoi ça marche ?

Déja, il faut comprendre bien pourquoi c'est Qwen3.8 Flash Next qui est utilisé. C'est un modèle "MoE" de 125B de paramètres et de 6B actif (c'est à dire que sur ces 125B, 6B seront utilisé). 

> Très important, mais de l'autres coté on a une partie du modèle qui est un "n-gram" de 51B et une couche de MTP qui fait 4B de paramètres, ça existe, mais ça ne sera pas maintenant dans l'explication

Donc que fait Strata ?

En me basant completement sur ce qui est écrit dans le readme du github, voici ce que je comprends :

Qwen3.8-Flash-Next (le modèle sur lequel est basé Strata) utilise 10 de ses 24 576 experts à chaque prédiction de token.

Prenons notre setup : 16 Go de VRAM dans notre fusée (RTX 5060 Ti), 32 Go de RAM dans notre Twingo et un modèle de 52 Go stocké sur notre vélo (le SSD).
Strata essaie de garder un maximum d'experts en VRAM pour profiter de la vitesse du GPU. Quand un expert n'y tient pas, le CPU peut calculer avec les données en RAM, plus lentement. Le SSD stocke le modèle et permet de charger les données nécessaires.

Mais Strata optimise aussi la génération avec deux techniques complémentaires (déja présente dans le modèle de base en réalité) :

- N-gram (51B) : recherche des séquences déjà présentes dans l'historique pour proposer rapidement des continuations. (un gros historique)
- MTP (4B, Multi-Token Prediction) : utilise la capacité de prédiction auxiliaire du modèle pour proposer plusieurs tokens à l'avance.

Le modèle principal vérifie ensuite ces propositions, ce qui permet parfois de générer plusieurs tokens en un seul passage plutôt que de les calculer un par un et de drastiquement augmenter le nombre de token, mais ce qui veut aussi dire que la vitesse peut grandement varier en fonction du moment et de parametre qu'on ne maitrise pas.



