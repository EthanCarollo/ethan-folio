---
title: "Composite"
date: "11-04-2025"
image: "/composite_media/06.png"
category: "Visual Arts"
tags: ["TouchDesigner", "MadMapper"]
slug: "composite"
repo: "https://github.com/EthanCarollo/composite"
---

# Introduction

Composite est un projet réalisé dans le cadre d'un Workshop avec le collectif [FullStory](https://fullstory.fr/) pour les 10 ans des [Papeteries](https://www.lespapeteries.com/). 
Pour ce faire, j'ai collaboré avec Théo ([Nak0x](https://github.com/nak0x)), Paul Figari et Elsa Freppaz. 

Ce Workshop s'est déroulé de manière intensive sur **une seule semaine**. Nous avons donc dû découvrir un tout nouveau logiciel de A à Z (TouchDesigner) et apprendre à collaborer dessus de façon efficace afin de produire le meilleur résultat possible pour la fin de la semaine.

# L'idée originale

L'idée de départ venait de Paul Figari : il souhaitait créer une œuvre interactive sous la forme d'un cadavre exquis projeté sur plusieurs petits carrés. En réfléchissant à la manière d'y parvenir, le groupe a trouvé l'inspiration via une vidéo sur Instagram. Dans cette vidéo, une personne utilisait une caméra Kinect pour filmer une manifestation avec un rendu très stylisé. 

En creusant cette piste, nous avons découvert le logiciel **TouchDesigner**, qui s'est avéré incroyablement puissant pour réaliser ce genre d'effets visuels interactifs. Convaincus par le potentiel, nous sommes partis acheter des caméras Kinect pour nous lancer.

# Découverte de l'outil et de la structure

S'attaquer à TouchDesigner en quelques jours était un véritable défi. C'est un environnement de programmation visuelle nodale avec une courbe d'apprentissage abrupte. Pendant que nous apprenions à maîtriser la logique algorithmique pour récupérer et traiter le signal de la Kinect, une autre étape cruciale se profilait : la création de la surface de projection.

Nous avons donc acheté du carton, pour le découper et l'assembler afin de bâtir la structure sur laquelle nos visuels finaux allaient être mappés (grâce à MadMapper). Il fallait s'assurer que l'ensemble tienne debout assez solidement pour l'exposition !

<div class="w-full flex justify-center py-4">
<img src="/composite_media/4.gif" class="rounded-lg shadow-md max-w-full" />
</div>

# Stratégie de collaboration

Étant donné le temps imparti très court (seulement 5 jours de production), l'organisation était clé. Nous avons dû diviser les tâches intelligemment entre l'apprentissage des nodes, la composition visuelle, et la projection finale via MadMapper. 

Pour trouver un flux de travail efficace, nous avons pris la décision de découper chaque petit effet visuel dans son propre fichier module `.tox`. Cela nous permettait de travailler en parallèle avant de finalement tous les assembler à la fin sur le signal principal de la Kinect.

Ce qui constituait d'ailleurs un défi supplémentaire et particulièrement amusant : pour se partager les fichiers `.tox`, toute l'équipe (designers comme développeurs) a dû utiliser **Git** sur le [repository du projet](https://github.com/EthanCarollo/composite) !

# Le rendu final

Le résultat de cette semaine intensive a été projeté en direct pour les 10 ans des Papeteries, mêlant les visuels générés par notre groupe à la structure physique de la salle de projection.

<div class="flex flex-col items-center gap-4 py-4">
<img src="/composite_media/1.gif" class="rounded-lg shadow-md max-w-full" />
<img src="/composite_media/3.gif" class="rounded-lg shadow-md max-w-full" />
</div>

> Le rendu final tourne sur un PC windows fourni par la CCI avec une carte graphique équivalente à une GTX 1050. Pour des raisons de performances et de stabilité, nous avons dû faire des compromis sur la qualité visuelle de certains effets (c'est pour cette raison que le rendu de la case en bas à droite est légèrement atténué).

# Vidéo Récapitulative

Pour en apprendre un peu plus sur les coulisses du projet, Elsa a réalisé une superbe vidéo retraçant notre aventure lors de cette semaine de Workshop. N'hésitez pas à aller la visionner : [Voir la vidéo d'Elsa sur YouTube](https://www.youtube.com/watch?v=P60B5-lntTk) !
