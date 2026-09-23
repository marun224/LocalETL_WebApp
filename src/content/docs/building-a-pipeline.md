---
title: Building a pipeline
description: Nodes, the compiled SQL, your own SQL, validators and reject routing, incremental loads, parameters, and why pipelines are text files.
section: Building pipelines
order: 10
updated: 2026-09-23
---

> **Pre-launch.** Not downloadable yet. Everything on this page works in the
> engine today, and the examples were run against it. The file format is
> versioned (`formatVersion: 1`) but not yet frozen.

A pipeline is a graph of nodes. Each node takes rows in, produces rows out, and
compiles to a fragment of SQL — one view per node, run in order by an embedded
columnar engine (DuckDB).

## Node types

`etl components` lists all 58. They fall into five families:

| Family | Prefix | Examples |
| --- | --- | --- |
| **Source** | `src.` | `src.db.postgres`, `src.file.csv`, `src.lake.delta`, `src.cloud.s3`, `src.saas.rest` |
| **Transform** | `xf.` | `xf.join`, `xf.filter`, `xf.aggregate`, `xf.pivot`, `xf.window`, `xf.derive`, `xf.dedup`, `xf.sql` |
| **Check** | `qa.` | `qa.not_null`, `qa.unique`, `qa.range`, `qa.accepted_values`, `qa.regex`, `qa.referential`, `qa.row_count` |
| **Control** | `ctl.` | `ctl.branch`, `ctl.fail`, `ctl.log`, `ctl.wait` |
| **Sink** | `snk.` | `snk.db.postgres`, `snk.file.parquet`, `snk.cloud.s3`, `snk.saas.rest` |

## The compiled SQL is the contract

`etl plan` prints exactly what each node will run, before anything does. From
the [quickstart](/docs/quickstart):

```sql
CREATE OR REPLACE TEMP VIEW "with_customer" AS (
  SELECT * FROM "check_amount" INNER JOIN "customers" USING ("customer_id"));

CREATE OR REPLACE TEMP VIEW "by_segment" AS (
  SELECT "segment", sum(amount) AS revenue, count(*) AS orders
  FROM "with_customer" GROUP BY "segment");
```

In the desktop app, the same SQL is on each node's Plan tab.

This matters for three reasons that all follow from the same decision:

- **Reviewable** — a colleague reads the diff without opening the application.
- **Debuggable** — a failed stage reports the SQL it ran and the engine's own error.
- **Escapable** — the SQL runs elsewhere. If you outgrow this tool, your work
  comes with you.

## Your own SQL

If a generated step is wrong for your data, replace it with an `xf.sql` node.
Upstream nodes are in scope by their id:

```json
{ "id": "big_orders", "type": "transform",
  "data": { "label": "My own SQL", "componentId": "xf.sql",
            "properties": { "query": "SELECT order_id, amount FROM orders WHERE amount > 100 ORDER BY amount DESC" } } }
```

It sits in the graph beside generated nodes and behaves identically: row
counts, history, lineage. The canvas is a convenience layer, not a cage.

## Checks and reject routing

A check has two outputs: `main`, the rows that passed, and `rejected`, the rows
that did not. Wire `rejected` to a sink and the bad rows land somewhere you can
look at them:

```json
{ "id": "check_amount", "type": "transform",
  "data": { "componentId": "qa.range", "properties": { "column": "amount", "min": 0, "max": 500 } } }

{ "source": "check_amount", "sourceHandle": "rejected", "target": "rejects", "targetHandle": "in" }
```

```
  Amount in range          11 rows  qa.range  1 rejected
  Rejected orders           1 rows  snk.file.csv
```

Routing bad rows aside is the difference between "the number is wrong" and
"these 412 rows are why the number is wrong." Leave `rejected` unwired and they
are counted and dropped. Where a bad row should stop the run instead, use
`ctl.fail` with a `when` condition, or `qa.row_count` with bounds.

## When a stage fails

Each node can carry a policy:

```json
"policy": { "retryAttempts": 2, "retryBackoffMs": 100, "continueOnFailure": false }
```

`retryAttempts` runs a flaky stage again, with a doubling wait.
`continueOnFailure` lets independent parts of the run carry on; the run still
ends failed, and anything downstream of the failed stage is skipped.

## Incremental loads

Give a source a watermark column and it reads only rows past the last value
seen:

```json
"data": { "componentId": "src.file.csv", "properties": { "path": "data/orders.csv" },
          "incremental": { "column": "order_ts" } }
```

```
first run:   Orders   12 rows  ·  orders watermark now 2026-04-01 06:15:00
second run:  Orders    0 rows  ·  orders had nothing new
```

The column must only ever go up: a created-at timestamp or an increasing id.
`etl state list` shows each watermark, and `etl state forget` resets one.

## Parameters and contexts

The same pipeline, unedited, runs in dev and in prod:

```json
"parameters": { "floor": { "type": "number", "default": 100 },
                "out_dir": { "type": "string", "required": true } }
...
"properties": { "predicate": "amount >= ${floor}" }
"properties": { "path": "${out_dir}/large_orders.parquet" }
```

Values come from `--param floor=250`, from the active context in
`.etl/contexts.json`, or from the default, in that order. `${workspace}` and
`${date}` are built in, and `${SECRET:name}` is covered in
[Connecting a source](/docs/connecting-a-source).

## Previews and pivots

In the desktop app, any node can be previewed: the data as it looks at that
step, which is usually where the bug is. `xf.pivot` and `xf.unpivot`, with
`xf.aggregate` and `xf.window`, cover the reshaping analysts usually do in a
spreadsheet — over datasets a spreadsheet cannot open.

## Pipelines are text

The whole pipeline is one JSON file: nodes, edges, parameters. It diffs in a
pull request and reviews like code, because it is code — which is exactly what
the previous generation of visual ETL tools could not offer, and the reason
their output became unmaintainable.

```bash
for f in pipelines/*.json; do etl validate "$f" || exit 1; done   # check without running; touches nothing
```

## Next

- [Deployment](/docs/deployment)
- [Querying your data](/docs/querying-your-data) — what is planned for analysis
