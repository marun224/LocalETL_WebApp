---
title: Read the SQL your pipeline generates
description: Every visual data tool generates something. Whether you can read it determines whether you can review, debug or ever leave it.
published: 2026-09-07
minutes: 6
tags: ['pipelines', 'tooling']
---

Visual ETL has a reputation problem, and it was earned.

A generation of drag-and-drop tools — Informatica, SSIS, Talend — let you build
a pipeline by wiring boxes together, then compiled that into something nobody
could read. Talend generated Java. SSIS produced a binary-ish XML package.
Informatica had its own internal representation.

The pipeline worked. But it had properties that only became obvious later.

## What "unreadable output" actually costs

**You cannot review it.** A pull request containing a regenerated package is a
diff nobody can evaluate. So the review becomes "Bob says it works," and the
team's normal quality process simply does not apply to this one category of
change.

**You cannot debug it properly.** When the nightly load fails, you get the
tool's error, not the database's. "Component tMap_3 failed" does not tell you
that a join key changed type upstream. The layer meant to simplify things is
now between you and the actual problem.

**You cannot leave.** This is the one that compounds. Five years of business
logic exists only as boxes in a proprietary canvas. Migrating means
reconstructing intent from a diagram, because there is no portable artefact.
The switching cost is not the licence — it is the archaeology.

Talend Open Studio reached end of life in January 2024. Teams still running it
discovered exactly how much their pipelines were worth outside the tool that
made them: very little, because what they owned was a diagram rather than
logic.

## Why the old tools did it

Not stupidity — constraints. In 2005 there was no portable execution target
that could do what these tools needed. SQL dialects diverged sharply. Pushdown
optimisation was primitive. Generating code for a runtime you controlled was
genuinely the reasonable engineering choice.

Those constraints have mostly gone. SQL is far more standardised, engines are
better at optimising generated queries, and there are now embeddable engines
that run the same SQL everywhere. The technical reason for opacity expired.
The commercial reason for it did not.

## The test

Ask any visual data tool one question:

> **Show me the SQL this node will run.**

There are three possible answers.

**"Here it is, and you can edit it."** The canvas is a convenience layer. Good.

**"Here it is, read-only."** Useful for debugging, but you cannot fix what it
gets wrong — and it will get something wrong, because it does not know your
data.

**"It does not work like that."** The tool is the only thing that understands
your pipeline. Price that in.

## What readable output buys you

**Reviewable.** A pipeline is a text file. It diffs. A colleague reads the
change without opening the application, and your existing review process
applies unmodified.

**Debuggable.** A failure reports the compiled SQL and the engine's own error
message. Usually the fix is obvious from reading it, which is not something
anyone ever said about a stack trace from a generated Java class.

**Escapable.** The SQL runs somewhere else. If you outgrow the tool, or it gets
acquired, or it reaches end of life, your work is portable — because what you
built was SQL, and the canvas was just how you typed it.

That last one is the real argument, and it is uncomfortable for vendors
because it amounts to making yourself easy to leave. But a tool that is easy
to leave is a tool you can adopt without a committee, which is worth more than
the lock-in it gives up.

## The nuance

Generated SQL is not automatically good SQL. It can be verbose, and it can
miss an optimisation a human would spot.

That is fine, as long as you can see it and change it. The point is not that
generation is perfect. The point is that you remain able to intervene — and
that when someone asks what the pipeline does, the answer is a file rather
than a person.

---

*Headrace is a local-first ETL and analytics engine where every node compiles
to readable, editable SQL. Currently in development.*
