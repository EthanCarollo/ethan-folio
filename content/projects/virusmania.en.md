---
title: VirusMania
date: 01-12-2025
image: /virusmania_media/virusmania_banner.png
role: Lead Developer
category: Game Dev
slug: virusmania
tags: ["Unity", "C#"]
repo: "https://github.com/methil-mods/virusmania"
---

# Introduction

The initial goal of this project was to build a sequel to a game we had created with a friend (hi Théo if you're reading this). We joined a transformation-themed Game Jam on itch.io, a bit naively: we only understood its subtext once the Jam ended. Still, we kept going, and that's how we imagined this slightly odd cartoon-style game where the main character is a scientist imprisoned by the State to craft viruses capable of controlling the population. The game draws heavy inspiration from titles like [PlateUp!](https://store.steampowered.com/app/1599600/PlateUp/?l=french) and [OverCooked](https://store.steampowered.com/app/448510/Overcooked/). Role-wise, Théo focused on 3D modelling while I, as usual, took care of the technical side.


# Getting Started

We kicked things off with Unity because, even though we technically had a month to ship the project, our school and work schedules didn't leave enough time to learn a whole new technology while aiming for a polished result. Since we had already shipped a Unity game together, we quickly found our footing again. Once the gameplay was defined, we built a prototype as fast as possible: Théo handled the character while I implemented the rest of the logic.

<TerminalVideoPlayer
src="/virusmania_media/les_debuts.webm"
title="virusmania-prototype.mp4">
</TerminalVideoPlayer>

From that first prototype, one thing was already clear: our ambitions were a bit over the top. We therefore decided to expand the team and bring a few more people on board.

# Growing the Team

That's how Médéric and Danielle joined the adventure to bring to life the slightly wild idea of two developers bored on a Thursday morning. The game's overall production pace accelerated from that moment on.

<TerminalVideoPlayer
src="/virusmania_media/animation_movement.webm"
title="animation-movement.mp4">
</TerminalVideoPlayer>

> To stay organized, we migrated from a GitHub Project to [Linear](https://linear.app),
> a project-management tool that's simple and clean—not the most powerful, but exactly what we needed.

# First Problems – Metaballs

To make viruses blend nicely, we brainstormed... but not for long enough. We decided to use a metaball system so every virus could merge gracefully.
But what are metaballs exactly? Here's a gif that illustrates them perfectly:

<div class="w-full flex justify-center">
<img src="/virusmania_media/gifmetaball.gif" />
</div>

> Effective, right? Unfortunately it was so painful to implement that we shelved it for the first release.

<TerminalVideoPlayer
src="/virusmania_media/metaball.webm"
title="metaball.mp4">
</TerminalVideoPlayer>

> One of our rare attempts—great-looking, but way too expensive performance-wise for the visual payoff.

# Second Problems – Cartoon Style

Cartoon visuals are cute, but how do you build a reasonably good-looking cartoon render?

Take Fortnite, for instance.

You can spot two key ingredients: an outline, and a stepped shading style (dark, less dark, not dark, ...). It's not that complicated to build, but it's hard to do it **well**.

So we went hunting for nice shaders that could help!

## Toon Shading

There are already plenty of Toon Shading resources (the step-based lighting effect mentioned above), but none of them really hit the mark for us. So we decided to craft our own Toon Shader in Unity!

> Disclaimer: I barely knew Unity's shader language or its subtleties, and I was even less confident about building a Shader Graph.

The brief for this shader was simple: render light in discrete steps on the object. On paper, pretty straightforward.

<TerminalVideoPlayer
src="/virusmania_media/toon_on_metaball.webm"
title="toon1.mp4">
</TerminalVideoPlayer>

<TerminalVideoPlayer
src="/virusmania_media/toon_on_guy.webm"
title="toon2.mp4">
</TerminalVideoPlayer>

> And just like that, we had our Toon shader! It still had a few quirks
> (it doesn't account for shadows when another object stands in front of the light), but it was exactly what we needed—nothing more.


```js
// Grab the main light direction
var mainLightDirection = GetMainLight().direction;
// Determine how much the surface faces the light
var lookAtLight = saturate(dot(N, -mainDir));
// Quantize the gradient so it becomes stepped instead of smooth
var render = floor(lookAtLight * steps) / (steps - 1.0);
```
> A highly simplified version in pseudo JS.
> The idea is to check whether the texture faces the light and, instead of the usual gradient, round the value using our system. That leaves us with flat color zones only.

## Outline

[QuickOutline](https://github.com/chrisnolet/quickoutline) already exists, so we thought outlining would be easier. (Spoiler: nope.)

In short, QuickOutline merges the lines of different meshes. So if you place two completely different objects next to each other, their outlines end up touching.

Thankfully [zacccharv](https://github.com/zacccharv), a contributor, proposed a patched version of the library that fixes the issue!
([Pull request](https://github.com/chrisnolet/QuickOutline/pull/45))

> It didn't solve everything—we still had to tweak a few things—but that contribution gave us the push we needed. Huge thanks to them.

# User Interface

For the UI, Médéric's first idea was to have animated, fluid containers.

<div class="w-full flex justify-center">
<img src="/virusmania_media/first_ui.png" />
</div>

> Problem: how do we import that? Video? A video per container? SVG? And how do we keep it even slightly responsive?

We decided to write a dedicated shader to reproduce the effect!
I'll spare you the technical breakdown (the shader lives [here](https://github.com/methil-mods/virusmania/blob/b2a17c13c57f273e7c823add9de65a9161a79670/unity/Assets/Resources/Shaders/MethilUiWavyBlob.shader)).

<TerminalVideoPlayer
src="/virusmania_media/essai_rate_ui.webm"
title="essai_ui_bad.mp4">
</TerminalVideoPlayer>

> That one was a failure.

<TerminalVideoPlayer
src="/virusmania_media/essai_reussi.webm"
title="essai_ui_good.mp4">
</TerminalVideoPlayer>

> That one was way better—and fully tunable!

# Gameplay

Next up: stitching everything together into an almost "final" gameplay loop so it felt like an actual game rather than scattered pieces. We chose a simple loop:

1. Receive a virus-creation brief
2. Purchase the required resources
3. Combine the elements to craft the virus
4. Send the virus

> Easy!

<TerminalVideoPlayer
src="/virusmania_media/virusmania_game.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>


# Onboarding

Still not done! We also had to design the onboarding, which is one of the most interesting phases because it forces you to understand how players learn to interact with your mechanics. Sometimes it even proves that a mechanic is poorly thought out.

<TerminalVideoPlayer
src="/virusmania_media/onboarding.webm"
title="onboarding.mp4">
</TerminalVideoPlayer>

> A short video of the first onboarding version, before feedback shredded it!

# Credits

That was a long month of intense work. I didn't mention everyone earlier because more and more people joined along the way, so here are the credits:

## Development
- **Ethan Carollo** — Lead Developer & Project Manager — [GitHub](https://github.com/EthanCarollo)
- **Théo Lessage** — Developer — [GitHub](https://github.com/nak0x)

## Art Direction & Design
- **Médéric Chapiseau** — Visual Art Direction, main 3D models, game UI — [Portfolio](https://medericchapiseau.com)
- **Danielle Levinzon** — Main menu design & itch.io page — [Portfolio](https://daniellelevinzon.github.io/Portfolio)

## 3D Modeling
- **Théo Lessage** — 3D Modeling — [GitHub](https://github.com/nak0x)
- **Mathieu** — 3D Modeling — [GitHub](https://github.com/math-pixel)
- **Ugo Mollier-Billet** — 3D Modeling — [Portfolio](https://www.ugoportfolio.fr)

## Sound Design
- **P-A** — Sound production & full sound design — [SoundCloud](https://soundcloud.com/paaaa_als)

## Testing & Ideas
- **Emmanuel Moulin** — Testing, idea proposals & README writing 😎 — [GitHub](https://github.com/Kibishi47) 

> It was my first time running a personal project with so many people, but that let us build a team with its own identity, and I'm really happy about it.

# Play!

The Jam is over and the game is submitted!

Here's the itch.io link where you can download it—feel free to leave a comment if you enjoyed it:
https://ethanzxv.itch.io/virusmania

> Thanks for reading ^^'

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

> A glowing virus

<div class="w-full flex justify-center">
<img src="/virusmania_media/accueil_page.png" />
</div>
 
> The home page (Danielle drew it!)

<div class="w-full flex justify-center">
<img src="/virusmania_media/color_virusmania.png" />
</div>

> A... peculiar way to communicate color palettes

<div class="w-full flex justify-center">
<img src="/virusmania_media/fourmimania.png" />
</div>

> The real Fourmimania logo
