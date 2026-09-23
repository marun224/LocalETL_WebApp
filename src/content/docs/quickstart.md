---
title: Quickstart
description: Build and run your first pipeline — join two files, reject bad rows, aggregate, and read the SQL it ran.
section: Getting started
order: 20
updated: 2026-09-23
---

> **Pre-launch.** There is no release to install yet. Everything below works in
> the engine today: the pipeline, the commands and the output on this page were
> run against it on 2026-09-23, not written ahead of it.

The goal: join an orders file to a customers file, set aside orders with an
impossible amount, total revenue by customer segment, and write the result to
Parquet. No warehouse, no upload, no ticket.

The command is `etl`. A workspace is just a folder:

```
shop/
  data/orders.csv       order_id, customer_id, order_ts, amount, status
  data/customers.csv    customer_id, name, segment, country
  pipelines/
```

## 1. Describe the pipeline

A pipeline is a JSON file: nodes, and the edges between them. The desktop
canvas writes this file for you; here it is by hand, so every part is visible.

```json
{
  "formatVersion": 1,
  "name": "revenue_by_segment",
  "nodes": [
    { "id": "orders", "type": "source", "position": { "x": 0, "y": 0 },
      "data": { "label": "Orders", "componentId": "src.file.csv",
                "properties": { "path": "data/orders.csv" } } },
    { "id": "customers", "type": "source", "position": { "x": 0, "y": 180 },
      "data": { "label": "Customers", "componentId": "src.file.csv",
                "properties": { "path": "data/customers.csv" } } },
    { "id": "check_amount", "type": "transform", "position": { "x": 260, "y": 0 },
      "data": { "label": "Amount in range", "componentId": "qa.range",
                "properties": { "column": "amount", "min": 0, "max": 500 } } },
    { "id": "rejects", "type": "sink", "position": { "x": 520, "y": -120 },
      "data": { "label": "Rejected orders", "componentId": "snk.file.csv",
                "properties": { "path": "out/rejected_orders.csv" } } },
    { "id": "with_customer", "type": "transform", "position": { "x": 520, "y": 90 },
      "data": { "label": "Attach customer", "componentId": "xf.join",
                "properties": { "type": "inner", "keys": ["customer_id"] } } },
    { "id": "by_segment", "type": "transform", "position": { "x": 780, "y": 90 },
      "data": { "label": "Revenue by segment", "componentId": "xf.aggregate",
                "properties": { "group_by": ["segment"],
                                "aggregations": "sum(amount) AS revenue, count(*) AS orders" } } },
    { "id": "write", "type": "sink", "position": { "x": 1040, "y": 90 },
      "data": { "label": "Revenue by segment", "componentId": "snk.file.parquet",
                "properties": { "path": "out/revenue_by_segment.parquet" } } }
  ],
  "edges": [
    { "id": "e1", "source": "orders", "target": "check_amount", "sourceHandle": "main", "targetHandle": "in" },
    { "id": "e2", "source": "check_amount", "target": "rejects", "sourceHandle": "rejected", "targetHandle": "in" },
    { "id": "e3", "source": "check_amount", "target": "with_customer", "sourceHandle": "main", "targetHandle": "left" },
    { "id": "e4", "source": "customers", "target": "with_customer", "sourceHandle": "main", "targetHandle": "right" },
    { "id": "e5", "source": "with_customer", "target": "by_segment", "sourceHandle": "main", "targetHandle": "in" },
    { "id": "e6", "source": "by_segment", "target": "write", "sourceHandle": "main", "targetHandle": "in" }
  ]
}
```

Save it as `pipelines/revenue_by_segment.json`. Note edge `e2`: the range check
has two outputs, and the rows that fail it go to their own file rather than
disappearing.

## 2. Check it without running it

```bash
etl validate pipelines/revenue_by_segment.json
```

```
pipelines/revenue_by_segment.json is valid: 7 stage(s), 2 sink(s)
```

`validate` touches nothing: no file is read and no connection is opened.

## 3. Read the SQL before it runs

```bash
etl plan pipelines/revenue_by_segment.json
```

```
3. Amount in range [qa.range] Quality
     CREATE OR REPLACE TEMP VIEW "check_amount" AS (SELECT * FROM (SELECT * FROM "orders") WHERE coalesce("amount" >= 0 AND "amount" <= 500, false));
     CREATE OR REPLACE TEMP VIEW "check_amount__rejected" AS (SELECT * FROM (SELECT * FROM "orders") WHERE NOT coalesce("amount" >= 0 AND "amount" <= 500, false));
...
5. Attach customer [xf.join] Transform
     CREATE OR REPLACE TEMP VIEW "with_customer" AS (SELECT * FROM "check_amount" INNER JOIN "customers" USING ("customer_id"));

6. Revenue by segment [xf.aggregate] Transform
     CREATE OR REPLACE TEMP VIEW "by_segment" AS (SELECT "segment", sum(amount) AS revenue, count(*) AS orders FROM "with_customer" GROUP BY "segment");
```

This is the part worth pausing on. The pipeline did not become an opaque plan —
it became SQL you could have written, one view per node, and which you can
replace with your own if it guessed wrong about your data.

## 4. Run it

```bash
etl run pipelines/revenue_by_segment.json
```

```
  Orders                   12 rows  src.file.csv
  Customers                 5 rows  src.file.csv
  Amount in range          11 rows  qa.range  1 rejected
  Rejected orders           1 rows  snk.file.csv
  Attach customer          10 rows  xf.join
  Revenue by segment        3 rows  xf.aggregate
  Revenue by segment        3 rows  snk.file.parquet

Ran 7 stage(s) in 0.22s
```

Row counts at every stage, so if a number looks wrong you can see which step
made it wrong. Here, one order was over 500 and went to
`out/rejected_orders.csv`; one more had no matching customer, which is what an
inner join does.

## 5. Look back at it

```bash
etl runs list          # every run, newest first
etl lineage pipelines/revenue_by_segment.json
```

```
Reads:
  data/orders.csv  (src.file.csv)  via orders
  data/customers.csv  (src.file.csv)  via customers

Writes:
  out/rejected_orders.csv  (snk.file.csv)  via rejects
  out/revenue_by_segment.parquet  (snk.file.parquet)  via write
```

Run history is kept in the workspace's `.etl/` folder, on your disk.

## 6. Schedule it, or take it with you

Put a schedule in `.etl/schedules.json` and leave `etl schedule start`
running, or bake the pipeline into one file that runs on a machine with
nothing installed:

```bash
etl build pipelines/revenue_by_segment.json
./revenue_by_segment
```

Both are covered in [Deployment](/docs/deployment).

## Not built yet

Asking a question in plain English instead of building the pipeline, and
charting the result, are planned rather than built. See the
[roadmap](/roadmap).

## Next

- [Connecting a source](/docs/connecting-a-source) — databases, buckets, APIs and secrets
- [Building a pipeline](/docs/building-a-pipeline) — nodes in depth
- [Deployment](/docs/deployment) — schedules, the console and standalone binaries
