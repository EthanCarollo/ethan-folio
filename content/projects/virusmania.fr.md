---
title: VirusMania
date: 01-12-2025
image: /virusmania_media/virusmania_banner.png
role: Lead Developer
category: VideoGame
slug: virusmania
tags: ["Unity"]
repo: "https://github.com/methil-mods/virusmania"
---

# Introduction

Le but de ce projet, au départ, était de donner une suite à un jeu que nous avions réalisé avec un ami (hello Théo si tu passes par là). Nous avons donc rejoint une Game Jam sur itch.io ayant pour thème la transformation, un peu naïvement : ce n'est qu'à la fin de la Jam que nous avons compris exactement son sous-texte. Nous étions néanmoins lancés et c'est ainsi qu'est née cette idée un peu étrange d'un jeu cartoon dans lequel le personnage principal est un scientifique enfermé par l'État pour créer des virus capables de contrôler la population. Le jeu s'inspire grandement de titres comme [PlateUp!](https://store.steampowered.com/app/1599600/PlateUp/?l=french) ou même [OverCooked](https://store.steampowered.com/app/448510/Overcooked/). Pour la répartition des rôles, Théo voulait se concentrer sur la modélisation 3D tandis que, comme d'habitude, je me chargeais de la partie technique.


# Les débuts

Pour commencer, nous sommes partis sur Unity car, même si nous avions un mois pour réaliser ce projet, nos rythmes scolaire et professionnel ne nous permettaient pas d'explorer sereinement une nouvelle technologie tout en livrant quelque chose de propre. Comme nous avions déjà travaillé ensemble sur un jeu Unity, nous avons pu reprendre nos marques très vite. Après avoir défini le gameplay, nous avons produit un prototype au plus vite : Théo s'est occupé du personnage pendant que je construisais le reste de la logique.

<TerminalVideoPlayer
src="/virusmania_media/les_debuts.webm"
title="virusmania-prototype.mp4">
</TerminalVideoPlayer>

À partir de ce premier prototype, une chose était déjà presque sûre : nous étions partis un peu trop loin dans nos ambitions. Nous avons donc décidé d'agrandir nos rangs et de travailler avec de nouvelles personnes.

# L'équipe s'agrandit

C'est ainsi que Médéric et Danielle ont rejoint l'aventure pour donner vie à l'idée un peu folle de deux développeurs qui s'ennuyaient un jeudi matin. Le rythme de production global du jeu s'est alors nettement accéléré.

<TerminalVideoPlayer
src="/virusmania_media/animation_movement.webm"
title="animation-movement.mp4">
</TerminalVideoPlayer>

> Pour mieux nous organiser, nous avons migré d'un GitHub Project à [Linear](https://linear.app),
> un outil de gestion de projet simple et sobre : pas le plus puissant, mais exactement ce qu'il nous fallait.

# Début des problèmes 1 - Les metaballs

Pour faire des virus qui se mélangent correctement, on a réfléchi... pas suffisamment longtemps. Nous avons décidé de partir sur un système de metaballs où chaque virus fusionne proprement.
Mais les metaballs, c'est quoi ? Pour faire simple, voici un gif qui les illustre parfaitement :

<div class="w-full flex justify-center">
<img src="/virusmania_media/gifmetaball.gif" />
</div>

> Efficace, non ? Eh bien c'était tellement galère à faire que nous avons décidé de mettre ça de côté pour la première version.

<TerminalVideoPlayer
src="/virusmania_media/metaball.webm"
title="metaball.mp4">
</TerminalVideoPlayer>

> L'un de nos rares essais, qui consommait beaucoup trop de performances pour un rendu visuel finalement assez limité.

# Début des problèmes 2 - Le style cartoon

Le style cartoon, c'est mignon... mais concrètement, comment est-ce qu'on en fabrique un qui soit potable ?

Prenons l'exemple d'un jeu à peine connu : Fortnite.

On y constate deux éléments clés : un contour (outline) et, côté ombrage, un rendu par paliers (foncé, moins foncé, pas foncé, ...). En soi ce n'est pas très compliqué à faire, mais c'est compliqué à **bien** faire.

Direction donc une petite veille pour voir s'il existe des shaders intéressants pour ça !

## Le ToonShading

Concernant le ToonShading (l'effet d'ombrage par étapes évoqué plus haut), on trouve déjà des ressources, mais aucune ne nous satisfaisait vraiment. Nous sommes donc partis créer notre propre ToonShader sur Unity !

> Disclaimer : je ne connaissais pas du tout le langage de programmation de shaders utilisé par Unity ni toutes les subtilités associées, et j'étais encore moins à l'aise à l'idée de faire un Shader Graph.

Pour ce shader, la consigne était simple : obtenir un rendu de lumière étape par étape sur un objet. Sur le papier, c'est assez straightforward.

<TerminalVideoPlayer
src="/virusmania_media/toon_on_metaball.webm"
title="toon1.mp4">
</TerminalVideoPlayer>

<TerminalVideoPlayer
src="/virusmania_media/toon_on_guy.webm"
title="toon2.mp4">
</TerminalVideoPlayer>

> Et hop on avait notre shader de Toon ! Avec certes quelques defauts
> (actuellement il ne prend pas en compte l'ombre si un objet est
> devant) mais c'est parfait et on avait pas besoin de mieux !


```js
// On prend la direction de la lumière light
var mainLightDirection = GetMainLight().direction;
// Et ici on obtient de "combien la surface regarde vers la lumière"
var lookAtLight = saturate(dot(N, -mainDir));
// On découpe pour avoir un dégradé avec des steps plutôt que quelque chose de lisse
var render = floor(lookAtLight * steps) / (steps - 1.0);
```
> Une version extrêmement simplifiée écrite en pseudo-code JS.
> L'idée est de vérifier si la texture fait face à la lumière et, au lieu du dégradé habituel, d'arrondir la valeur avec notre système. On n'obtient ainsi que des zones de couleurs plates.

## L'outline 

Pour l'outline, [QuickOutline](https://github.com/chrisnolet/quickoutline) existe déjà. On pensait donc s'embêter un peu moins. (Spoiler : non.)

Pour faire simple, QuickOutline fusionne les lignes des différents objets. Donc si tu as deux objets complètement différents côte à côte avec QuickOutline, leurs outlines finissent par se rejoindre...

Heureusement, [zacccharv](https://github.com/zacccharv), un contributeur, a proposé une version modifiée de la librairie qui règle ce souci !
([La pull request](https://github.com/chrisnolet/QuickOutline/pull/45))

> Bon, ça n'a pas tout réglé, nous avons dû faire quelques ajustements par-dessus, mais c'est grâce à cette impulsion que le problème s'est débloqué, donc immense merci à lui.

# User Interface

Pour l'UI, Médéric a eu une première idée : des conteneurs fluides, animés.

<div class="w-full flex justify-center">
<img src="/virusmania_media/first_ui.png" />
</div>

> Sauf que là, on a un souci : on l'importe comment ? Vidéo ? Une vidéo pour chaque conteneur ? Un SVG ? Et on fait comment pour que ce soit un minimum responsive ?

Nous avons donc pris la décision de recoder un shader pour l'UI afin d'obtenir cet effet !
On s'épargne les détails techniques (le shader est dispo [ici](https://github.com/methil-mods/virusmania/blob/b2a17c13c57f273e7c823add9de65a9161a79670/unity/Assets/Resources/Shaders/MethilUiWavyBlob.shader)).

<TerminalVideoPlayer
src="/virusmania_media/essai_rate_ui.webm"
title="essai_ui_bad.mp4">
</TerminalVideoPlayer>

> Ça, c'était raté par exemple.

<TerminalVideoPlayer
src="/virusmania_media/essai_reussi.webm"
title="essai_ui_good.mp4">
</TerminalVideoPlayer>

> Ça, c'était vraiment mieux — et paramétrable !

# Gameplay

Il a ensuite fallu mettre tout cela en forme pour obtenir un gameplay presque « final », histoire d'avoir un vrai jeu plutôt qu'un assemblage de morceaux éparpillés. Nous sommes donc partis sur une boucle de gameplay simple :

1. Récupérer un brief de création de virus
2. Acheter ce qu'il faut pour fabriquer le virus
3. Combiner les éléments pour créer le virus
4. Envoyer le virus

> Tout simple !

<TerminalVideoPlayer
src="/virusmania_media/virusmania_game.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>


# L'onboarding

Et oui, ce n'est pas fini : nous devions encore nous attaquer à l'onboarding, l'une des parties les plus intéressantes, car elle oblige à comprendre comment l'utilisateur va apprendre à interagir avec nos mécaniques de jeu. Parfois, elle révèle même qu'une mécanique est mal pensée.

<TerminalVideoPlayer
src="/virusmania_media/onboarding.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>

> Une petite vidéo de la première version de l'onboarding avant qu'elle ne soit démolie par tous les retours !

# Remerciements

C'était long, mais voilà : un mois intensif à travailler sur le projet. Je n'ai pas mentionné tout le monde parce qu'au fil du temps, de nouvelles personnes se sont greffées à l'équipe, donc voici les remerciements :

## Development
- **Ethan Carollo** — Lead Developer & Project Manager — [GitHub](https://github.com/EthanCarollo)
- **Théo Lessage** — Developer — [GitHub](https://github.com/nak0x)

## Art Direction & Design
- **Médéric Chapiseau** — Visual Art Direction, main 3D models, game UI — [Portfolio](https://medericchapiseau.com)
- **Danielle Levinzon** — Main menu design & itch.io page — [Portfolio](https://daniellelevinzon.github.io/Portfolio)

## 3D Modeling
- **Théo Lessage** — 3D Modeling — [GitHub](https://github.com/nak0x)
- **Mathieu** — 3D Modeling — [GitHub](https://github.com/math-pixel)
- **Ugo Mollier-Billet** - 3D Modeling — [Portfolio](https://www.ugoportfolio.fr)

## Sound Design
- **P-A** — Sound production & full sound design — [SoundCloud](https://soundcloud.com/paaaa_als)

## Testing & Ideas
- **Emmanuel Moulin** — Testing, idea proposals & README writing 😎 — [GitHub](https://github.com/Kibishi47) 

> C'était la première fois que je travaillais sur un projet perso avec autant de monde, mais cela nous a permis de créer un groupe avec sa propre identité, et j'en suis très content.

# Jouer !

La Jam est terminée, le jeu est envoyé !

Voici le lien itch.io où le jeu est disponible. N'hésitez pas à laisser
un commentaire si le jeu vous plaît :
https://ethanzxv.itch.io/virusmania

> Merci d'avoir lu ^^'

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

# Bonus

<div class="w-full flex justify-center">
<img src="/virusmania_media/virusglow.png" />
</div>

> Un virus qui brille

<div class="w-full flex justify-center">
<img src="/virusmania_media/accueil_page.png" />
</div>
 
> La page d'accueil (Danielle au dessin !)

<div class="w-full flex justify-center">
<img src="/virusmania_media/color_virusmania.png" />
</div>

> Une façon de communiquer les couleurs, hmmm... singulière

<div class="w-full flex justify-center">
<img src="/virusmania_media/fourmimania.png" />
</div>

> Le vrai logo de Fourmimania
