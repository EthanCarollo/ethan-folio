---
title: "I wish I had done more with Gleam"
date: "2026-06-26"
slug: "iwouldlikegleam"
description: "I love Gleam and it's a shame I haven't used it more."
tags: ["lab", "gleam", "node"]
---

# Gleam the little star

I love Gleam, I haven't done that much of it in my whole life, and it's something I kinda regret.

> Gleam is basically a super fun functional programming language based on the BEAM, pretty much the JVM equivalent for Erlang and all those languages (I'm an eggxpert).

## Why I like Gleam

Honestly I don't really know, at first I was in freshman year and thought the star was really funny, then I started looking into it and found it super cool. This note is gonna be more of a collection of cool stuff I'd like to do one day with Gleam, and honestly I don't even know why I'm making a note about it, but I just find it interesting.

The thing I liked the most was being able to connect JavaScript to Gleam and run it directly with a Node environment, they call them FFIs. In reality it almost comes down to transpiling Gleam into JavaScript the same way TypeScript does, except here: no OOP, no superfluous fluff, your program only works if it actually works. Otherwise it won't execute, kinda like Rust but with concepts that are way easier to understand and way more fun.

So the goal of this note is just to compile the cool stuff I wanna do with Gleam. The first thing obviously is making a whole site entirely in Gleam, with an Erlang server, and a Postgres database.

## I would have loved to

With Gleam, I would have loved to:

Make a video game with P5.js (yeah you can theoretically connect P5.js functions to call them in Gleam and then transpile the code), I had a project like that, Dinozoria, a 2D top-down game where you just had to make some kind of park.

![image](/dinozoria/guthiboopsyouspelleditwrongimage.png)

> It was honestly pretty bad ngl but it was made in Gleam and anyway I put a lot of love into it. But the game isn't even finished, honestly it's barely even started either (https://dinozoria.vercel.app/).

The problem well, is that after a while it gets crazy complex in real life to make a video game without OOP, like for real that means abstraction is super tough, there are structs but nothing is mutable in Gleam so you "recreate" your struct instance kinda in a loop and it's crazy hard for a global game state, and when you wanna manage a 2D array you struggle a lot.

I've always wanted to make a site entirely in Gleam too, in static, like I know [Lustre](https://github.com/lustre-labs/lustre) in Gleam does that but I never got around to applying it, maybe later.
