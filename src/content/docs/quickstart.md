---
title: Quickstart
description: Build and run your first pipeline — join a database table to a file and chart the result.
section: Getting started
order: 20
updated: 2026-09-21
---

> **Pre-launch.** This describes the intended first-run experience. Commands
> here do not work yet.

The goal: join a Postgres table to a CSV on your desktop, aggregate it, and
look at the result. No warehouse, no upload, no ticket.

## 1. Add a source

Open the application and add a connection. You need the same details you would
give any SQL client.

```
Host      localhost
Database  shop
User      analyst
```

Credentials go to your operating system's secret store, not to a config file
in plain text and not to us.

Headrace reads the **schema** — table and column names — and nothing else.
Designing a pipeline against a billion-row table costs the same as designing
one against an empty one.

## 2. Add a file

Drag a CSV onto the canvas. It is now a source like any other, and it can be
joined against the database table directly. There is no import step, because
nothing is being copied anywhere.

## 3. Join them

Drop a **join** node and connect both sources to it. Pick the key.

Open the node and read what it produced:

```sql
SELECT o.*, c.region, c.segment
FROM   shop.orders o
LEFT JOIN read_csv('~/Desktop/customers.csv') c
  ON c.customer_id = o.customer_id
```

This is the part worth pausing on. The canvas did not generate an opaque plan —
it generated SQL you could have written, and which you can now correct if it
guessed wrong about your data.

## 4. Aggregate

Add an **aggregate** node: group by `region`, sum `amount`.

## 5. Run it

Press run. You get row counts, timings and a preview at every node, so if the
number looks wrong you can see which step made it wrong.

## 6. Ask a question instead

Skip the canvas entirely:

> Which regions grew most this quarter?

You get SQL back before anything executes. Read it, then run it. The generated
query is the feature — an assistant you cannot check is an assistant you cannot
rely on for a number someone will ask you to defend.

## 7. Save it

Save the pipeline and give it a schedule. Next month is a refresh rather than a
reconstruction.

```bash
headrace run orders_by_region.yaml
```

The same file runs headless, so what you built interactively is what runs in
production.

## Next

- [Building a pipeline](/docs/building-a-pipeline) — nodes in depth
- [Querying your data](/docs/querying-your-data)
- [Deployment](/docs/deployment) — schedules and servers
