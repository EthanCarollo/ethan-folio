---
title: "J'aurais aimé faire plus avec Gleam"
date: "2026-08-19"
slug: "iwouldlikegleam"
description: "J'adore Gleam et c'est dommage de pas l'avoir plus utilisé."
tags: ["lab", "gleam", "node"]
---

# Gleam la petite étoile

J'adore Gleam, j'en ai pas fait beaucoup beaucoup dans toute ma vie, et c'est un truc que je regrette.

> Gleam en gros c'est un langage de programmation fonctionnel super rigolo basé sur la BEAM, c'est en gros l'équivalent JVM pour Erlang et tous ces langages-là (je suis un esspert).

## Pourquoi j'aime Gleam

En vrai je sais pas, au début j'étais en première année et je trouvais l'étoile vraiment rigolote, puis j'ai commencé à me pencher dessus et j'ai trouvé ça cool. Cette note sera plus un recueil de trucs cools que j'aimerais faire un jour avec Gleam et je sais même pas pourquoi en vrai j'en fais une note, mais juste je trouve ça intéressant.

Le truc que j'ai le plus apprécié c'est la possibilité de connecter du JavaScript à Gleam et de l'exécuter directement avec un environnement Node, ils appellent ça des FFI. Ça revient presque en réalité à transpiler du Gleam en JavaScript de la même façon que TypeScript le fait, sauf que là : pas de POO, pas de trucs superflus, ton programme il marche que si il marche. Sinon il s'exécute pas, un peu à la manière de Rust mais avec des concepts bien plus simples à comprendre et plus rigolos.

Du coup le but de cette note, c'est juste de compiler les trucs cools que j'ai envie de faire avec Gleam.

## J'aurais aimé

Avec Gleam, j'aurais aimé :

Faire un jeu vidéo avec P5.js (oui on peut théoriquement connecter les fonctions de P5.js pour les calls en Gleam et ensuite transpiler le code), j'avais eu un projet comme ça, Dinozoria, un jeu 2D en top-down où il fallait juste faire une sorte de parc.

![image](/dinozoria/guthiboopsyouspelleditwrongimage.png)

> C'était pas mal nul quand même mais c'était fait en Gleam et bref j'avais mis beaucoup d'amour dedans. Mais le jeu est même pas fini, il est même pas commencé aussi en vrai (https://dinozoria.vercel.app/).

Le souci bah c'est qu'au bout d'un moment ça devient hyper complexe en vrai de faire un jeu vidéo sans POO, genre vraiment ça veut dire que l'abstraction c'est hyper chaud, y a des struct mais rien n'est mutable en Gleam donc tu "recrées" ton instance d'une struct un peu en boucle et c'est vachement chaud pour un état global de jeu et quand tu veux gérer un tableau 2D tu galères beaucoup.

J'ai toujours voulu faire un site entièrement en Gleam aussi, en statique, genre je sais que [Lustre](https://github.com/lustre-labs/lustre) en Gleam fait ça mais j'ai jamais pu l'appliquer, peut-être plus tard.