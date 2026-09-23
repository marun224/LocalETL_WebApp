---
title: Deployment
description: Headless runs, schedules, the web console, standalone binaries, CI, and operating inside an air-gapped network.
section: Operations
order: 10
updated: 2026-09-23
---

> **Pre-launch.** Not downloadable yet. Everything on this page works in the
> engine today and was run against it on 2026-09-23.

The runner is the same engine without the interface. Build on a laptop, commit
the pipeline, run it wherever you already run things.

## Running once

```bash
etl run pipelines/nightly.json
```

| Exit code | Meaning |
| --- | --- |
| `0` | Succeeded |
| `1` | Usage or I/O error |
| `2` | The pipeline is invalid; nothing ran |
| `3` | The run failed; the failing stage, its SQL and the engine's own error are reported |

That is all most orchestrators need. `--json` prints the run record as JSON,
the same shape kept in history, so what a script parses is what was recorded.

## Scheduling

Two options:

```bash
# 1. Your existing scheduler — usually the right answer
0 6 * * *  cd /srv/shop && etl run pipelines/nightly.json

# 2. The built-in scheduler, reading .etl/schedules.json
etl schedule check      # is every schedule valid and its pipeline runnable?
etl schedule list       # when each one next fires
etl schedule start      # run them as they come due, until stopped
```

```json
{
  "formatVersion": 1,
  "schedules": [
    { "name": "nightly", "pipeline": "pipelines/revenue_by_segment.json",
      "trigger": { "cron": "0 3 * * *" } },
    { "name": "every_15m", "pipeline": "pipelines/orders_incremental.json",
      "trigger": { "every": "15m" } },
    { "name": "inbox", "pipeline": "pipelines/csv_to_parquet.json",
      "trigger": { "watch": "data", "pollSeconds": 10 } }
  ]
}
```

Cron times are UTC. A watch trigger runs the pipeline when the folder changes.
Each schedule can also name a `context` and `params`. There is no separate
scheduling service and no agent that registers with a control plane.

## The web console

```bash
etl serve                 # http://127.0.0.1:8087
```

A browser console over the workspace: its pipelines and their lineage, run
history, schedules, and a button to run. It has two roles — a **viewer** reads, an **operator** reads and runs —
each with its own token, set in `ETL_CONSOLE_VIEWER_TOKEN` and
`ETL_CONSOLE_OPERATOR_TOKEN` or minted when it starts. It binds to loopback by
default and speaks no TLS, so `--bind` to anything else deserves a reverse
proxy in front of it.

## Standalone binaries

Bake a pipeline into one executable that needs nothing installed — no `etl`,
no workspace, no database engine:

```bash
etl build pipelines/revenue_by_segment.json
./revenue_by_segment               # runs it; --info says what is inside
```

```
Built revenue_by_segment.exe
  pipeline   revenue_by_segment
  stages     7
  size       43.7 MB
  engine     DuckDB v1.5.5 (windows_amd64)
```

`--target linux_amd64` builds for Linux from Windows. Parameters are resolved
when it is built. A pipeline that uses a secret is refused unless you pass
`--allow-secrets`, which writes that secret's plaintext into the file — so
think of the file as a credential if you do.

A Linux build runs in a bare `debian:12-slim` container with `--network none`.
There is no official container image yet; the binary is what goes in yours.

## CI

```yaml
- name: Check every pipeline
  run: for f in pipelines/*.json; do etl validate "$f" || exit 1; done

- name: Run the nightly load
  run: etl run pipelines/nightly.json
  env:
    PG_PASSWORD: ${{ secrets.PG_PASSWORD }}   # referenced as ${ENV:PG_PASSWORD}
```

`etl validate` checks a pipeline without reading data or opening a connection,
so a broken pipeline fails the pull request rather than the 6am run.

## Air-gapped operation

No step above requires a route to the internet. Air-gapped operation is not a
special deployment tier — it is the absence of a requirement, and a built
pipeline is tested that way.

Paid tiers, when they exist, will issue licences as files rather than
validating them with a call. A subscription that needs an activation request is
a poor fit for a network with no way out.

## Observing runs

```bash
etl runs list                 # newest first
etl runs show <run-id>        # everything recorded about one run
etl lineage pipelines/nightly.json
```

Every run records its outcome and total time, and for each stage the rows it
produced, the rows it rejected, and why it was skipped if it was. A stage's own
time is kept only where the stage did its own work; a view that runs later, at
the sink, would otherwise report a meaningless zero. `etl plan` shows each
stage's SQL, and the desktop app previews the data at each node. When something
is wrong, the question is usually "which step made it wrong", and that is
answerable by looking rather than by bisecting.

## Failure behaviour

| Setting | Effect |
| --- | --- |
| A check's `rejected` output wired to a sink | Bad rows routed aside, run continues |
| `ctl.fail` with `when`, or `qa.row_count` | The run fails when the condition holds |
| `"policy": { "retryAttempts": 2 }` | The stage is retried, with a doubling wait |
| `"policy": { "continueOnFailure": true }` | Independent stages carry on; the run still ends failed |

## Next

- [Security](/security)
- [Building a pipeline](/docs/building-a-pipeline)
