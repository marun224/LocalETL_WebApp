---
title: Querying your data
description: Planned — the query editor, plain-English questions and dashboards. What works for analysis today, and where the rest is going.
section: Analysis
order: 10
updated: 2026-09-23
---

> **Planned: this page describes where the product is going.** The query
> editor, plain-English questions and dashboards below are not built yet. What
> already works for analysis is listed first, and is covered in
> [Building a pipeline](/docs/building-a-pipeline).

Most ETL tools stop once the data lands. The aim is for this one not to.

## What works today

- **Cross-system joins.** A Postgres table, a Parquet file and a REST API
  joined in one pipeline, without loading any of them into a warehouse first.
- **Your own SQL.** An `xf.sql` node takes any `SELECT`, with upstream nodes in
  scope by id.
- **Pivots and aggregations.** `xf.pivot`, `xf.unpivot`, `xf.aggregate` and
  `xf.window`, over datasets a spreadsheet cannot open.
- **Per-node previews** in the desktop app, and **exports** to Parquet, CSV,
  JSON, Excel or XML, a bucket, or back into Postgres, MySQL or SQLite.

## Planned: a SQL editor

A SQL editor with schema autocomplete across every connected source, and
results that stream as they arrive rather than making you wait for the full
set:

```sql
SELECT region, SUM(revenue) AS revenue
FROM   orders_by_region
WHERE  quarter = '2026-Q3'
GROUP BY region
ORDER BY revenue DESC;
```

Sources would be addressable by name, whatever they physically are — the
query that would otherwise have been a ticket.

## Planned: asking in plain English

```
Which regions grew revenue most this quarter, and how many orders was that?
```

The design: you get SQL back **before anything runs**. Read it. Run it, or fix
it first.

The generated query is deliberately not hidden. If someone asks where a number
came from — and for anything that matters, someone will — "the AI said so" is
not an answer. The SQL is.

The assistant is designed to run on your device, so your schema and your
prompts would not leave the machine. See [Security](/security).

## Planned: charts and dashboards

Build a view on a result, pin it to a dashboard, and refresh it with the
pipeline. Sharing dashboards with a team is planned for the paid tiers.

## Order

These come after the engine and the connectors on the [roadmap](/roadmap), on
purpose: an assistant or a dashboard on top of an unreliable pipeline is worse
than none.

## Next

- [Building a pipeline](/docs/building-a-pipeline) — what works today
- [Deployment](/docs/deployment)
