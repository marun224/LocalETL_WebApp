---
title: Building a pipeline
description: Nodes, the compiled SQL, validators and reject routing, and why pipelines are text files.
section: Building pipelines
order: 10
updated: 2026-09-21
---

> **Pre-launch.** Describes intended behaviour; the file format is not final.

A pipeline is a graph of nodes. Each node takes rows in, produces rows out, and
compiles to a fragment of SQL. The whole graph compiles to one query, or a small
number of them.

## Node types

| Kind | Examples |
| --- | --- |
| **Source** | database table, file, object-store prefix, API |
| **Transform** | join, filter, aggregate, window, pivot, rename, cast |
| **Validator** | not-null, unique, range, referential, custom expression |
| **Sink** | table, file, object store, dashboard |

## The compiled SQL is the contract

Open any node and you see exactly what it will run:

```sql
SELECT
  c.region,
  COUNT(DISTINCT o.order_id) AS orders,
  SUM(s.amount) / 100.0      AS revenue
FROM postgres.orders o
JOIN read_parquet('s3://.../customers.parquet') c
  ON c.customer_id = o.customer_id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.region
```

If it is wrong, edit it. The canvas is a convenience layer, not a cage — a
hand-written node sits in the graph beside generated ones and behaves
identically.

This matters for three reasons that all follow from the same decision:

- **Reviewable** — a colleague reads the diff without opening the application.
- **Debuggable** — a failure reports the SQL it ran and the engine's own error.
- **Escapable** — the SQL runs elsewhere. If you outgrow this tool, your work
  comes with you.

## Validators and reject routing

A validator has two outputs: rows that passed, and rows that did not.

```yaml
- validate: orders_clean
  rules:
    - not_null: [order_id, customer_id]
    - range: { amount: [0, 1000000] }
  on_fail: reject        # reject | fail | warn
```

Routing bad rows somewhere you can look at them is the difference between
"the number is wrong" and "these 412 rows are why the number is wrong."

`fail` stops the run. `warn` records and continues. The default is `reject`,
because silently dropping rows is how a pipeline lies to you for six months.

## Incremental loads

Save a watermark and read only what is new:

```yaml
- source: orders
  incremental:
    column: updated_at
    strategy: watermark
```

The first run reads history. Later runs read only rows past the saved mark.

## Pipelines are text

```yaml
name: orders_by_region
sources: [postgres.orders, s3.customers]
steps:
  - join: { on: customer_id }
  - filter: "created_at >= '2026-01-01'"
  - aggregate: { by: [region], sum: [amount] }
sink: { type: table, target: analytics.revenue_by_region }
schedule: "0 6 * * *"
```

They diff in a pull request. They review like code, because they are code —
which is exactly what the previous generation of visual ETL tools could not
offer, and the reason their output became unmaintainable.

## Next

- [Querying your data](/docs/querying-your-data)
- [Deployment](/docs/deployment)
