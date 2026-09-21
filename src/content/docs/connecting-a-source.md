---
title: Connecting a source
description: How connections work, where credentials are stored, and what is read from your systems.
section: Getting started
order: 30
updated: 2026-09-21
---

> **Pre-launch.** Describes intended behaviour.

A source is anything you can read rows from: a database, an object store, a
file, or an API. They behave the same once connected, which is what makes
joining across them possible.

## The connection is yours

Connections are opened **from your machine, to your system**. There is no
proxy, no broker and no relay. If your database is only reachable from inside
your VPN, then Headrace can reach it exactly when you can, and not otherwise.

This has a practical consequence worth stating: we cannot help you connect to
something your machine cannot reach, and we also cannot accidentally reach it
ourselves.

## Where credentials live

In order of preference:

1. **Your OS secret store** — Keychain, Credential Manager, or libsecret.
2. **Your own secrets manager** — reference Vault, AWS Secrets Manager or
   similar, so nothing is stored locally at all.
3. **Environment variables** — useful for CI, where the secret comes from
   whatever already manages CI secrets.

```yaml
sources:
  orders:
    type: postgres
    host: replica.internal
    database: shop
    user: analyst
    password: ${env:PG_PASSWORD}   # never inline the secret
```

Credentials are redacted from logs, error messages and compiled SQL previews.
A failing pipeline should be debuggable without pasting a password into a
support thread.

## What is actually read

When you connect, Headrace reads **metadata**: table names, column names,
types. It does not scan your data, sample your rows, or build a profile in the
background.

Data is read when a pipeline runs, and only the columns that pipeline asks for.

## Databases

Standard connection details. Read replicas are usually the right target for
analytical work.

```yaml
type: postgres          # mysql, sqlserver, oracle, sqlite, ...
host: replica.internal
port: 5432
```

## Object storage

Point at a prefix rather than a file, and partitioned layouts are read as
partitions:

```yaml
type: s3
path: s3://warehouse/events/year=*/month=*/*.parquet
```

Credentials come from your existing AWS profile, instance role or environment
by default. There is no separate credential to create.

## Files

Local files are sources. A CSV on your desktop can be joined to a production
database table without either of them moving.

```yaml
type: csv
path: ~/Desktop/finance-2026-09.csv
```

## APIs

REST and GraphQL endpoints are normalised into rows:

```yaml
type: rest
url: https://api.example.com/v2/orders
auth: bearer ${env:API_TOKEN}
paginate: cursor
```

## Schema drift

When a column appears, disappears or changes type upstream, the run surfaces it
as a decision rather than failing with a type error at 3am. You choose whether
to add it, ignore it, or fail loudly — and the choice is recorded in the
pipeline file, so the next person can see what was decided.

## Next

- [Building a pipeline](/docs/building-a-pipeline)
- [Security](/security) — the full data-handling breakdown
