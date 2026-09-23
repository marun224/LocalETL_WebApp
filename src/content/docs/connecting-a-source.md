---
title: Connecting a source
description: Databases, lakehouse tables, buckets, files and REST APIs — how each is read, and where credentials live.
section: Getting started
order: 30
updated: 2026-09-23
---

> **Pre-launch.** Not downloadable yet. The sources on this page work in the
> engine today and are tested against real data or a real server; the
> [integrations page](/integrations) marks which. Anything not built is said to
> be.

A source is anything you can read rows from: a database, a lakehouse table, a
bucket, a file, or an API. They behave the same once in a pipeline, which is
what makes joining across them possible.

## The connection is yours

Connections are opened **from your machine, to your system**. There is no
proxy, no broker and no relay. If your database is only reachable from inside
your VPN, then Headrace can reach it exactly when you can, and not otherwise.

This has a practical consequence worth stating: we cannot help you connect to
something your machine cannot reach, and we also cannot accidentally reach it
ourselves.

## Where credentials live

Never in the pipeline file. Reference them instead:

1. **Workspace secrets** — encrypted in the workspace's `.etl/` folder and
   referenced as `${SECRET:name}`. The right default.
2. **Environment variables** — referenced as `${ENV:NAME}`. Useful in CI,
   where something else already manages the secret.

```bash
etl secret init                                  # once per workspace
etl secret set pg_password --stdin               # the value is read from stdin, not your shell history
etl secret list                                  # names only, never values
```

```json
"connection": "host=replica.internal dbname=shop user=analyst password=${SECRET:pg_password}"
```

A secret reaches the database and nowhere else. `etl plan` shows it as
`********`, and so do run reports and error messages:

```
Resolved:
  ${SECRET:pg_password} = ********
1. Orders table [src.db.postgres] Source
     ATTACH 'host=replica.internal dbname=shop user=analyst password=********' AS "orders_db" (TYPE postgres, READ_ONLY);
```

Environment values are **not** masked that way, so keep passwords in secrets.
Vault and cloud secret managers are planned, not built.

## What is read, and when

Data is read when a pipeline runs or you preview a node. There is no background
scan, no sampling and no profile built of your data. A database used as a
source is attached read-only.

## Databases

PostgreSQL, MySQL and SQLite, as sources and as sinks. The connection is a
connection string:

| Component | `connection` looks like |
| --- | --- |
| `src.db.postgres` | `host=replica.internal dbname=shop user=analyst password=${SECRET:pg_password}` |
| `src.db.mysql` | `host=localhost user=analyst database=shop password=${SECRET:mysql_password}` |
| `src.db.sqlite` | `data/analytics.db` |

Each also takes `table`, and optionally `schema`. Read replicas are usually the
right target for analytical work. SQL Server, Oracle and the rest of the
[catalogue](/integrations) are planned.

## Lakehouse tables

Delta Lake and Iceberg tables are read in place; writing to them is not
supported.

```json
{ "componentId": "src.lake.delta",   "properties": { "path": "lake/orders_delta" } }
{ "componentId": "src.lake.iceberg", "properties": { "path": "lake/orders_iceberg",
                                                     "version": "00002-4bd88499-6d18-4b24-97e7-54a794ce8675" } }
```

For Iceberg, `version` is a metadata file's name without `.metadata.json`, and
it also reads an earlier snapshot. For a table that was copied or moved from
where it was written, add `"allow_moved_paths": true`.

## Object storage

S3 and S3-compatible stores, read and written in place. Globs are allowed.

```json
{ "componentId": "src.cloud.s3",
  "properties": { "path": "s3://landing/events/*.parquet",
                  "key_id": "${SECRET:s3_key_id}", "secret": "${SECRET:s3_secret}",
                  "region": "eu-west-1" } }
```

For MinIO or another S3-compatible store, add `endpoint` (for example
`http://localhost:9000`) and `"url_style": "path"`. With no credentials set,
only public buckets are reachable. This has been tested against MinIO; testing
against AWS itself is still to do, and Google Cloud Storage and Azure Blob are
planned.

## Files

CSV, Parquet, JSON, JSON Lines, Excel and XML, read and written. A file on your
desktop can be joined to a production database table without either of them
moving.

```json
{ "componentId": "src.file.csv", "properties": { "path": "data/finance-*.csv" } }
{ "componentId": "src.file.xml", "properties": { "path": "data/orders.xml", "record": "order" } }
```

Relative paths resolve from the workspace. CSV detects its delimiter unless
you set one; XML needs `record`, the element that is one row.

## REST APIs

Any JSON API, read and written, with pagination, auth and retries configured
rather than coded:

```json
{ "componentId": "src.saas.rest",
  "properties": {
    "url": "https://api.example.com/v2/orders",
    "auth": "bearer", "token": "${SECRET:api_token}",
    "records": "/data",
    "pagination": "cursor", "cursor_path": "/next",
    "columns": { "order_id": "INTEGER", "amount": "DECIMAL(10,2)" }
  } }
```

`pagination` is one of `page`, `offset`, `cursor` or `link`; `auth` one of
`bearer`, `basic` or `header`. Rate limits (`429`) and server errors are
retried, honouring `Retry-After`. `max_pages` is a safety cap, and reaching it
fails the run rather than quietly loading part of the data.

GraphQL, and named connectors for SaaS apps such as Salesforce or Stripe, are
planned. Until then, the REST source can reach any of them that has a REST API.

## Schema drift

Planned, not built: a column appearing, disappearing or changing type upstream
surfacing as a decision rather than a failure.

## Next

- [Building a pipeline](/docs/building-a-pipeline)
- [Security](/security) — the full data-handling breakdown
