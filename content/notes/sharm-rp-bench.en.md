---
title: "Sharm RP Bench: scoring an LLM on narration"
date: "2026-09-18"
slug: "sharm-rp-bench"
description: "Sharm is the roleplay model I'm building. Sharm RP Bench is the test rig that says whether it can actually tell a story and play characters."
tags: ["lab", "ml", "llm"]
---

# Sharm, the model we're trying to score

**Sharm** is the name of the model I'm working on right now. A model built for **roleplay**: telling stories, playing characters, holding a role. Basically what a tabletop GM does — setting the scene, giving the characters a voice, moving the plot forward, and letting the player decide what happens next. In the app, it's the narrator, and it never plays on the player's behalf.

Problem is, "this model is good at roleplay" means nothing until you measure something. MMLU, GSM8K, HumanEval: none of them tell you whether a model can hold a character across twenty turns without forgetting that someone walked out of the room. And more importantly, **pretty prose** is not the same thing as **text the engine can actually display**.

Hence **Sharm RP Bench**, a test rig dedicated to interactive narration, in French and English. It isn't public yet: it should be soon, most likely open for everyone, and I'll add a link here once it's clean.

# What we actually ask of a roleplay model

Not to be good at prose, but to get these right:

- **Structural compliance**: tagged blocks, no text outside tags, no Markdown.
- **Scene**: who is present, in which slot, three visible characters max, no re-introductions.
- **Emotions**: an emotion from a closed vocabulary, played at the lowest intensity that fits.
- **Step discipline**: one step advanced per turn, reveals woven in, future steps not burned.
- **Causality**: a conditional event only fires once its condition is met.
- **Player agency**: the narrator never speaks the player's lines and never decides for them.
- **Memory**: corrected dates, sealed objects, promises kept, contradictions forbidden.
- **Diegesis**: no fourth wall, no interface vocabulary, weather consistent with the location.
- **Language**: the answer stays entirely in the scenario's language.

Player agency is the one that breaks the most models: an LLM trained to write stories wants to **conclude** something, where a tabletop narrator has to stop and hand the turn back.

# Five axes out of 20, totalling 100

The corpus is 16 scenarios in French and English, 164 turns to play.

| Axis | Scored by |
| --- | --- |
| Memory and state | factual assertions + judge |
| Causality and respect for choices | assertions + judge |
| Meaning and coherence | judge |
| Turn discipline | local checks + judge |
| Characters and emotional accuracy | judge |

Three scoring rules that change everything:

- **Every cap is a minimum, not an average.** A brilliant answer that breaks the protocol can't be rescued by a generous judge: if the model spoke for the player, that turn's causality is capped, full stop.
- **An interrupted generation scores 0**, with its error and completion rate recorded.
- **A missing or invalid judge leaves the total empty**, never 0 and never quietly dropped from the averages.

# The tagged protocol, where everything is decided

In the mode that reproduces the application, the expected output isn't prose but a series of blocks:

```xml
<location id="interior-retro-record-store-day" />

<stage id="aoi" action="speak" slot="center" depth="front" emotion="curious" />
<dialog speaker="aoi" emotion="curious">Tu es venue chercher ce disque ?</dialog>
```

What gets checked: `<location>` first and from the allowed list, an imposed scene composition based on how many characters are present, three visible max with one per slot, an emotion from the closed vocabulary, dialogue with no narrative aside, action with no dialogue, a budget of 2 to 3 blocks, no unrequested tag, and weather consistent with an indoor location. Every violation caps the axis involved and leaves the exact excerpt in the report.

# What it finds on a real session

The most telling piece is a real session from the application, six turns, in French:

- **`<location>` missing on all six answers**, even though the system prompt declares it mandatory;
- **`<choices>` present twice**, even though the safeguard forbids it;
- **2–3 block budget exceeded** four times out of six;
- a character name quoted without a `<character>` tag.

That's exactly the gap between "pretty text" and "text the engine can display". Those deviations shipped in production without anyone counting them; now they're measured and visible.

# A strict judge, not yet calibrated

The judge runs at temperature 0, with no access to future turns or hidden rules, and every deduction requires **an exact excerpt and a justification**: off-scale scores, invented excerpts and incomplete JSON are rejected. And the limit, I'd rather spell it out: **it isn't calibrated against human annotations yet**. The agreement harness exists (weighted kappa, 0.60 target per axis), but no public ranking before that.

# Conclusion

Sharm is the model; Sharm RP Bench is how we know whether it does the job. Not to crown an LLM, but to answer one precise question: can this model hold a roleplay session inside a real narrative engine, with characters that stay where they belong, a plot that doesn't burn its own steps, and a player who keeps control?

For now, the most honest answer the bench gives is: **the automated checks already say a lot, the judge still needs calibrating.** Which is already better than "it looks decent".