---
title: Your warehouse bill is mostly ad-hoc queries
description: Scheduled transformation is predictable and budgeted. Exploration is neither, and it is usually where the money goes.
published: 2026-09-14
minutes: 6
tags: ['cost', 'warehouse']
---

Warehouse spend is usually discussed as one number, which makes it hard to
reason about. It is worth splitting into two, because they behave completely
differently.

**Scheduled work** — nightly loads, dbt runs, materialised models. Predictable,
repeatable, and something you can optimise once and benefit from forever.

**Ad-hoc work** — someone exploring. Unpredictable, frequently redundant, and
largely invisible until the invoice arrives.

Most cost-reduction effort goes into the first category, because it is
legible: you can see the models, profile them, and rewrite the expensive one.
Meanwhile the second category is a long tail of queries nobody reviews, and in
a lot of organisations it is the larger number.

## Why exploration is expensive out of proportion

It is not that analysts write bad SQL. It is that exploration has a shape that
is structurally hostile to how warehouses bill.

**Iteration is the method.** Nobody writes the right query first. You write
one, look, adjust, repeat. Fifteen queries to answer one question is a normal,
healthy ratio — and every one of them is billed.

**`SELECT *` is rational when you are exploring.** You do not yet know which
columns matter. On a columnar warehouse that is the most expensive possible
access pattern, and the person writing it has no feedback telling them so.

**Nobody sees the meter.** The analyst has no idea whether their query cost
two cents or forty dollars. There is no signal at the moment of the decision,
so there is no behaviour to change.

**The same question gets asked repeatedly.** Three people scan the same year of
order history in the same week, because there is no artefact left behind from
the first time.

## The structural problem

Warehouses are priced for the scheduled case: pay for what you scan, which is
fair when what you scan is known. Exploration is the opposite of known.

So the organisation does the thing that follows logically. It restricts access.
Fewer people get warehouse credentials; the rest file tickets. Now the cost is
controlled, and it has been converted into a queue — which does not appear on
any invoice, so it looks like a saving.

## What actually helps

**Move exploration off the warehouse.** Most exploration does not need
warehouse-scale compute. It needs a few hundred million rows and fast
iteration. That fits comfortably on a laptop with a columnar engine, and every
iteration after the first costs nothing.

The pattern that works: pull the relevant slice down once, explore it locally
as many times as you like, and push only the settled aggregate back up. The
expensive scan happens once instead of fifteen times.

**Measure the split before deciding anything.** Most warehouses can attribute
cost by user, warehouse or query tag. Before optimising anything, find out
what fraction of spend is scheduled versus ad-hoc. Teams are routinely
surprised, in both directions — and optimising the wrong half is a lot of
effort for nothing.

**Leave artefacts behind.** If the first person to compute revenue-by-region
saves a pipeline, the next three people refresh it instead of rebuilding it.

**Stop rationing by licence.** If a per-seat BI licence is what decides who can
ask a question, the queue in front of the licensed people is a real cost that
never shows up as one.

## The honest caveat

Some exploration genuinely needs the warehouse. Cross-database joins over
billions of rows, queries against data that physically cannot be moved,
anything needing a governed and certified metric definition. Moving that
locally is not a saving, it is a mistake.

The argument is not that warehouses are overpriced. It is that a large share of
what runs on them is work that never needed to be there — and that the usual
fix, restricting who gets to ask questions, is more expensive than the bill it
was meant to reduce.

---

*Headrace is a local-first ETL and analytics engine, currently in development.*
