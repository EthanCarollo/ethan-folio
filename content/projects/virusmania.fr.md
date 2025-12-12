---
title: VirusMania
date: 01-12-2025
image: /virusmania_media/virusmania_banner.png
role: Lead Developer
category: VideoGame
slug: virusmania
tags: ["Unity"]
---

# Introduction

Le but de ce projet, au départ, l'idée était de faire suite
à un jeu que l'on avait fait avec un ami (hello Théo si tu 
passes par là), nous avons donc rejoint une GameJam sur
itch.io sur le sujet de la transformation, un peu naivement,
(c'est seulement à la fin de la Jam que nous avons compris
exactement le sous texte de la GameJam). Nous étions donc lancé
et c'est ainsi que nous avons eu l'idée un
peu bizarre d'un jeu dans le style cartoon
où le personnage principal, est un 
scientifique enfermé par l'état pour créer des Virus afin
de controler la population, le jeu s'inspire grandement
des noms comme [PlateUp!](https://store.steampowered.com/app/1599600/PlateUp/?l=french)
ou même [OverCooked](https://store.steampowered.com/app/448510/Overcooked/).
Pour la répartition des rôles, Théo a décidé qu'il voulait
faire beaucoup + de modelisation 3D, et de mon côté, je
suis sur la partie technique comme à mon habitude.


# Les débuts

Pour commencer, on est parti sur Unity car, bien que nous avions
1 mois pour faire ce projet, le rythme scolaire et professionnel
que nous avions ne nous permettait pas de prendre le temps de
découvrir une technologie si nous souhaitions faire quelque chose
de clean, et étant donné que nous avions déja travaillé ensemble
auparavant sur un jeu Unity, nous avons pu rapidement prendre nos
aises. Après avoir défini le gameplay, nous avons fait un prototype
le plus rapidement possible, Théo s'est occupé de faire le personnage,
pendant que je faisais le reste de la logique.

<TerminalVideoPlayer
src="/virusmania_media/les_debuts.webm"
title="virusmania-prototype.mp4">
</TerminalVideoPlayer>

A partir de ce premier prototype, une chose était déja un peu sûr,
on est parti un peu trop loin au niveau de nos ambitions, on a donc décidé
d'aggrandir un peu nos rangs et de travailler avec de nouvelles personnes.

# L'équipe s'aggrandit

C'est donc ainsi que Mederic et Danielle ont rejoint l'aventure
pour réaliser l'idée un peu bête de 2 développeurs qui s'ennuyaient
un jeudi matin. Et c'est ainsi que le rythme de production global du
jeu a commencé à s'accélerer

<TerminalVideoPlayer
src="/virusmania_media/animation_movement.webm"
title="animation-movement.mp4">
</TerminalVideoPlayer>

> Pour ainsi pouvoir mieux s'organiser, on a décidé de migrer d'un
> Github Project à [Linear](https://linear.app),
> un outil de gestion de projet ainsi simple et 
> sobre, pas très puissant, mais exactement ce qu'il nous fallait.

# Début des problèmes 1 - Les metaball

Pour faire des Virus qui se mélange correctement, on a réfléchi. Pas
suffisamment longtemps. Et on a décidé de partir sur un systeme de metaball
ou chaque Virus se mélange convenablement.
Mais les metaball c'est quoi ? Pour faire simple, voici un gif qui va 
parfaitement l'illustrer :

<div class="w-full flex justify-center">
<img src="/virusmania_media/gifmetaball.gif" />
</div>

> Efficace non ? Et bah ça c'était tellement galère à faire, qu'on a
> décidé de mettre ça de coté pour la première version.

<TerminalVideoPlayer
src="/virusmania_media/metaball.webm"
title="metaball.mp4">
</TerminalVideoPlayer>

> Un de nos rares essais qui mangeaient beaucoup trop de performances
> pour le rendu visuel que c'est finalement

# Début des problèmes 2 - Le style cartoon

C'est mignon le style cartoon, mais en vrai c'est comment
qu'on fait un style cartoon à peu près potable ?

Prenons l'exemple d'un jeu à peine connu, Fortnite.

Et on voit qu'il y a 2 choses, un contour (outline) et
pour l'ombrage, on est sur quelque chose par étapes (foncé,
 moins foncé, pas foncé,...). En gros, c'est pas si compliqué
à faire, mais c'est compliqué à **bien faire**.

Donc en route pour regarder si il y a des shaders qui sont pas mal
pour faire ça !

## Le ToonShading

Pour le ToonShading (l'effet
d'ombrage par étape dont on parlait + haut), il y en a, mais aucun
n'est suffisamment bien pour nous, et c'est ainsi que nous sommes
en route pour créer notre propre ToonShader sur Unity !

> Disclaimer, je ne connaissais pas du tout le langage de programmation
> de shader utilisé par Unity et toute les subtilités qui venaient avec,
> et j'étais encore moins à l'aise à l'idée de faire un .shadergraph

Donc pour ce shader, la consigne était simple, avoir un rendu step
par step de la lumière sur un objet. Donc c'est assez simple.

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
// On découpe pour avoir un dégradé avec des steps plutot que lisse
var render = floor(lookAtLight * steps) / (steps - 1.0);
```
> Une version extremement simplifié ecrite en pseudo code JS. 
> L'idée c'est de regarder si la texture fait face à la lumière, 
> et au lieu du dégradé habituel, on va arrondir la valeur
> avec notre système. Ainsi on a que des zones de couleurs plates

## L'outline 

Pour l'outline, 
[QuickOutline](https://github.com/chrisnolet/quickoutline) existe. Donc on va
normalement moins s'embeter. (Spoiler : non).

Je vais vous raccourcir tout le problème, quickoutline merge les
lignes des différents objets ensemble, donc si t'as deux objets COMPLETEMENT
différents à coté avec QuickOutline, bah leurs outine va se rejoindre...

Bref merci, [zacccharv](https://github.com/zacccharv), un contributeur
a proposé une version modifié de la lib qui regle ce soucis !
([La pull request](https://github.com/chrisnolet/QuickOutline/pull/45))

> Bon, ça a pas tout réglé, on a du faire des ajustements par dessus mais
> c'est grâce à cette impulsion que le problème s'est réglé donc immense
> merci à lui.

# UserInterface

Pour l'UI, Mederic a eu une première idée, d'avoir des container fluide
qui sont animés.

<div class="w-full flex justify-center">
<img src="/virusmania_media/first_ui.png" />
</div>

> Sauf que là on a un soucis, on l'import comment ? Vidéo ? On va faire une
> vidéo pour chaque container ? Un SVG ? On fait comment pour que ce soit un
> petit peu responsive avec ça ?

Et donc on a prit la décision de recoder un shader pour l'UI pour faire ça !
En vrai, on va s'épargner la partie technique (le shader est dispo [ici](https://github.com/methil-mods/virusmania/blob/b2a17c13c57f273e7c823add9de65a9161a79670/unity/Assets/Resources/Shaders/MethilUiWavyBlob.shader))

<TerminalVideoPlayer
src="/virusmania_media/essai_rate_ui.webm"
title="essai_ui_bad.mp4">
</TerminalVideoPlayer>

> Ca c'était raté par exemple.

<TerminalVideoPlayer
src="/virusmania_media/essai_reussi.webm"
title="essai_ui_good.mp4">
</TerminalVideoPlayer>

> Ca c'était vraiment mieux et paramétrable !

# Gameplay

Maintenant, il a tout fallu mettre en forme pour avoir le gameplay
dans sa forme "finale", pour avoir un vrai
jeu et pas que des morceaux par ci par là, et donc avec une boucle
de gameplay simple :

1. Récuperer un brief de création de virus
2. Acheter ce qu'il faut pour faire le virus
3. Combiner des éléments ensemble pour faire le virus
4. EnvoyeR le virus

> Tout simple !

<TerminalVideoPlayer
src="/virusmania_media/virusmania_game.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>


# L'onboarding

Et oui c'est pas fini, maintenant on doit se coller à l'onboarding,
l'une des parties les plus intéressantes car elle nécessite de comprendre
comment l'utilisateur va apprendre à intéragir avec nos mécaniques de
jeux, elle peut même par moment démontrer qu'une mécanique est mal
pensée.

<TerminalVideoPlayer
src="/virusmania_media/onboarding.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>

> Une petite vidéo de la première version de l'onboarding avant qu'il
> soit démoli par tout les retours !

# Remerciements

C'était long, mais voilà, un mois intensif à travailler sur le projet,
j'ai pas parlé de tout le monde parce qu'au final du monde s'est rajouté
dans l'équipe, donc je mets ici les remerciements :

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

> C'est la première fois que je travaillais sur un projet perso avec autant
> de gens, mais ça a permit de créer une sorte de groupe avec une identité,
> j'en suis très content.

# Jouer !

C'est la fin de la jam, le jeu est envoyé !

Voici le lien du itch.io où le jeu est disponible, n'hésitez pas à laisser
un commentaire si le jeu vous a plu !
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

> Un virus qui glow

<div class="w-full flex justify-center">
<img src="/virusmania_media/accueil_page.png" />
</div>
 
> La page d'accueil (Danielle au dessin !)

<div class="w-full flex justify-center">
<img src="/virusmania_media/color_virusmania.png" />
</div>

> Une façon de communiqué les couleurs, hmmm,.. singulière

<div class="w-full flex justify-center">
<img src="/virusmania_media/fourmimania.png" />
</div>

> Le vrai logo de fourmimania

