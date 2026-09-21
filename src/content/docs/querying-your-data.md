---
title: Querying your data
description: SQL, plain-English questions, cross-system joins, pivots and dashboards.
section: Analysis
order: 10
updated: 2026-09-21
---

> **Pre-launch.** Describes intended behaviour.

Most ETL tools stop once the data lands. This is the part that does not.

## SQL

A normal SQL editor with schema autocomplete across every connected source.
Results stream as they arrive rather than making you wait for the full set.

```sql
SELECT region, SUM(revenue) AS revenue
FROM   orders_by_region
WHERE  quarter = '2026-Q3'
GROUP BY region
ORDER BY revenue DESC;
```

## Cross-system joins

The useful part. Sources are addressable by name, whatever they physically are:

```sql
SELECT o.order_id, c.region, f.budget
FROM   postgres.orders o
JOIN   s3.customers c   USING (customer_id)
JOIN   csv.finance  f   USING (region)
```

A database table, a Parquet file in object storage and a spreadsheet from
finance, in one query, without loading any of them into a warehouse first.
This is usually the query that would otherwise have been a ticket.

## Asking in plain English

```
Which regions grew revenue most this quarter, and how many orders was that?
```

You get SQL back **before anything runs**:

```sql
SELECT region,
       SUM(revenue) AS revenue,
       COUNT(*)      AS orders
FROM   orders_by_region
WHERE  quarter = '2026-Q3'
GROUP BY region ORDER BY revenue DESC;
```

Read it. Run it, or fix it first.

The generated query is deliberately not hidden. If someone asks where a number
came from — and for anything that matters, someone will — "the AI said so" is
not an answer. The SQL is.

The assistant runs on your device. Your schema and your prompts do not leave
the machine. See [Security](/security).

## Pivots

Group, aggregate and cross-tabulate over datasets far past what a spreadsheet
will open, on the whole dataset rather than a sample of it.

## Charts and dashboards

Build a view, pin it to a dashboard, refresh it on a schedule. Dashboards can
be shared with your team on the paid tiers; on the free tier they are local to
your machine.

## Exports

| Format | Use |
| --- | --- |
| Parquet | Handing off to another system |
| CSV | Handing off to a person |
| Excel | Handing off to finance |
| Back to a table | Writing results into a warehouse or database |

## Next

- [Deployment](/docs/deployment)
- [Building a pipeline](/docs/building-a-pipeline)
