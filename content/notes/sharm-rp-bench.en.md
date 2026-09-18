---
title: "Sharm RP Bench: scoring an LLM on narration"
date: "2026-09-18"
slug: "sharm-rp-bench"
description: "Sharm is the roleplay model I'm building. Sharm RP Bench is the test rig that says whether it can actually tell a story and play characters."
tags: ["lab", "ml", "llm"]
---

# Sharm, the model we're trying to score

**Sharm** is the name of the model I'm working on right now. A model built for **roleplay**: telling stories, playing characters, holding a role. Basically doing what a tabletop GM does — setting the scene, giving the characters a voice, moving the plot forward, and letting the player decide what happens next.

In the app, it's the narrator. It places the scene, brings characters in and out, advances a chapter step, and above all **it never plays on the player's behalf**.

Problem is, "this model is good at roleplay" means nothing until you measure something. MMLU, GSM8K, HumanEval: none of them tell you whether a model can hold a character across twenty turns without forgetting that someone walked out of the room. And more importantly, **pretty prose** is not the same thing as **text the engine can actually display**.

Hence **sharm-rp-bench**: a test rig dedicated to interactive narration, in French and English, that scores any LLM on what the application really asks of it, turn after turn.

# What we actually ask of a roleplay model

A roleplay model isn't judged on its prose, it's judged on nine things:

1. **Structural compliance**: tagged blocks, no text outside tags, consistent tags.
2. **Scene state machine**: who is present, in which slot, how many characters are visible (three max), no re-introductions.
3. **Emotional calibration**: the emotion comes from a closed vocabulary of 34 entries, and the played intensity has to stay restrained.
4. **Step discipline**: one step advanced per turn, reveals woven in, future steps not burned.
5. **Causality and gating**: a conditional event only fires once its condition is met.
6. **Player agency**: the narrator never speaks the player's lines and never decides for them.
7. **Factual memory**: corrected dates, sealed objects, promises kept, contradictions forbidden.
8. **Diegesis**: no fourth wall, no interface vocabulary, weather consistent with the location.
9. **Language**: the answer is entirely in the scenario's language.

Point 6 is the one that breaks the most models. An LLM trained to write stories wants to **conclude** something, where a tabletop narrator has to stop and hand the turn back.

# Two protocols, one scale

The corpus holds two families of scenarios:

| | Literary (`literary/v2`) | Engine (`lorebound-engine/v1`) |
| --- | --- | --- |
| Scenario | fixed system prompt + scripted turns | character sheets, locations, steps, initial scene |
| System prompt | constant | **rebuilt every turn** (current step + scene) |
| Expected output | free prose | tagged blocks |
| Checks | per-turn regex | regex + structural audit |
| Dedicated diagnostic | — | `aggregate.structure` |

The **engine** mode is the interesting one: instead of describing a prompt, the scenario describes **the application**. The runner rebuilds the production system prompt on every turn, exactly like the real narrator does. That's what lets us say "this model works inside the app" rather than "this model writes nicely".

# The five axes

Each answer is scored on five axes from 0 to 20, totalling 100:

| Axis | Field | Scored by |
| --- | --- | --- |
| Memory and state | `state` | factual assertions + judge |
| Causality and respect for choices | `causality` | assertions + judge |
| Meaning and coherence | `coherence` | judge |
| Turn discipline | `turnDiscipline` | local checks + judge |
| Characters and emotional accuracy | `characterCalibration` | judge |

Three scoring rules that change everything:

- **Every cap is a minimum, not an average.** A brilliant answer that breaks the protocol can't be rescued by a generous judge: if the model spoke for the player, that turn's causality is capped at 6/20, full stop.
- **An interrupted generation scores 0**, with its error and completion rate recorded in the report.
- **A missing or invalid judge leaves the total `null`**, never 0 and never quietly dropped from the averages.

# The tagged protocol, where everything is decided

In engine mode the expected output isn't prose, it's a series of blocks. The parser, the scene state machine and the compliance audit check:

```xml
<location id="interior-retro-record-store-day" />

<stage id="aoi" action="speak" slot="center" depth="front" emotion="curious" />
<dialog speaker="aoi" emotion="curious">Tu es venue chercher ce disque ?</dialog>

<stage id="haru" action="enter" slot="right" depth="back" emotion="neutral" />
<action>Aoi referme le carton et le pousse sous le comptoir.</action>
```

What gets checked: `<location>` first and from the allowed list, valid `<stage>` directives with the imposed composition (1 character = center, 2 = left+right, 3 = far-left+center+far-right), three visible characters max, one per slot, an `emotion` key from the closed vocabulary, dialogue with no narrative aside, action with no dialogue, no text outside tags, no Markdown, no unrequested `<choices>` tag, a budget of 2 to 3 blocks, and weather consistent with an INDOOR location.

Every violation carries a **cap**, its exact excerpt, and feeds a `structureScore` = 100 − Σ(20 − cap) for the turn. That score is diagnostic: it doesn't enter the total out of 100, but it caps the axes involved.

::mermaid-diagram
---
code: |
  flowchart TD
      A[FR/EN scenario] --> B[Runner: prompt rebuild]
      B --> C[Model under test]
      C --> D[Tagged block parser]
      D --> E[Scene state machine]
      D --> F[Compliance audit]
      E --> G[Deterministic caps]
      F --> G
      C --> H[Strict LLM judge]
      G --> I[Per-turn combination: minimum]
      H --> I
      I --> J[JSON report + leaderboard]
---
::

# What the audit of a real session found

The most telling piece is the export fixture: a real session from the application, six turns, in French. What the engine audit finds in it:

- **`<location>` missing on all six answers**, even though the system prompt declares it mandatory;
- **`<choices>` present twice**, even though the safeguard forbids it;
- **2–3 block budget exceeded** four times out of six;
- a character name quoted without a `<character>` tag on one answer.

That's exactly the gap between "pretty text" and "text the engine can display". Those deviations are tolerated in production, but now they're measured, locked by a test, and visible in the report.

# A strict judge, and not yet calibrated

The LLM judge runs at temperature 0, one call per answer, with no access to future turns or hidden rules. Every deduction requires **an exact excerpt and a justification**. Off-scale scores, invented excerpts, wrong identifiers and incomplete JSON are rejected. Errors stay in the report without interrupting the other audits, and ten FR/EN examples show the judge both the mistakes and the sober answers or the justified strong emotions.

The `rubricHash` is stamped into every report: **two reports with a different rubric fingerprint aren't comparable**, and self-judging (same model answering and judging) is flagged as such.

And the limit, I'd rather spell it out: **the judge isn't calibrated against human annotations yet**. The agreement harness exists (weighted quadratic kappa, violation precision/recall, 0.60 target per axis), but no human annotation has been done yet. So **no public ranking** before that kappa.

# How it gets used

The `sharm-rp-bench` repo runs on Node ≥ 20, ESM, with **zero npm dependencies**: the tests use a simulated local HTTP API, so `npm test` never spends a remote call.

```bash
npm run check                      # tests + corpus validation, before every commit
node cli.mjs --dry-run             # validate a scenario with no API call

# Score a candidate model
node cli.mjs --model my-model --judge-model my-judge --runs 3
npm run benchmark:corpus -- --model my-model --judge-model my-judge --runs 3

# Replay an application export (teacher forcing, turn by turn)
node cli.mjs --replay export.jsonl --replay-mode all --concurrency 4 \
  --model my-model --judge-model my-judge

# Compare models and measure judge agreement
npm run leaderboard -- --results results --prices prices.json
npm run agreement -- --annotations annotations/set-01.json
```

The corpus is 16 scenarios (8 literary stories and 2 engine scenarios, each in FR and EN), **164 turns and 396 assertions**, plus the structural checks. Each turn carries its user message and its assertions: `matchAny`, `matchAll`, `forbidAny`, with a weight. Hidden rules have a `[fromTurn, untilTurn)` time window so they can expire exactly on the reveal turn.

On the full corpus, one complete run is **144 generation calls and 144 judge calls**. The leaderboard gathers score /100, the five axes, the compliance score, judge coverage, run-to-run standard deviation, estimated cost and average latency. Reports land in `results/` (gitignored: they contain transcripts), and API keys are never written into them.

# What's still open

- **Human annotations**: the real work. Without them, the judge is a protocol choice, not ground truth.
- **A per-turn export on the application side**, so each step instruction can be replayed exactly instead of reconstructing the contract as best we can.
- **Semantic detection** of premature reveals and unrequested ellipses: regexes don't understand every paraphrase or every negation.
- **Judge variance**: temperature zero doesn't guarantee identical decisions, so intra-judge variance has to be measured on a subsample.

# Conclusion

Sharm is the model; sharm-rp-bench is how we know whether it does the job. The point isn't to crown an LLM, it's to answer one precise question: can this model hold a roleplay session inside a real narrative engine, with characters that stay where they belong, a plot that doesn't burn its own steps, and a player who keeps control?

And for now, the most honest answer the bench gives is: **the deterministic checks already say a lot, the judge still needs calibrating.** Which is already better than "it looks decent".