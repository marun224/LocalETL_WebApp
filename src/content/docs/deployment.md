---
title: Deployment
description: Schedules, headless runs, containers, CI, and operating inside an air-gapped network.
section: Operations
order: 10
updated: 2026-09-21
---

> **Pre-launch.** Describes intended behaviour.

The runner is the same engine without the interface. Build on a laptop, commit
the pipeline, run it wherever you already run things.

## Running once

```bash
headrace run pipeline.yaml
```

Exit code `0` on success, non-zero on failure, with the failing node and the
engine's own error message on stderr. That is all most orchestrators need.

## Scheduling

Three options, in increasing order of "we manage it":

```bash
# 1. Your existing scheduler — usually the right answer
0 6 * * *  headrace run /pipelines/daily.yaml

# 2. The built-in scheduler
headrace serve --schedule cron

# 3. Watch a directory and run on arrival
headrace serve --watch /incoming
```

There is no separate scheduling service to operate and no agent that registers
with a control plane. If cron works for you, use cron.

## Containers

```dockerfile
FROM headrace/runner:1
COPY pipelines/ /pipelines/
CMD ["run", "/pipelines/daily.yaml"]
```

No outbound egress rule is required unless your pipeline reaches a remote
source. The container does not call home.

## CI

```yaml
- name: Validate pipelines
  run: headrace check pipelines/

- name: Run nightly load
  run: headrace run pipelines/nightly.yaml
  env:
    PG_PASSWORD: ${{ secrets.PG_PASSWORD }}
```

`headrace check` compiles every pipeline without executing it, so a broken
pipeline fails the pull request rather than the 6am run.

## Air-gapped operation

No step above requires a route to the internet, including licensing. Air-gapped
operation is not a special deployment tier — it is the absence of a
requirement.

For paid tiers in an air-gapped environment, licences are issued as files
rather than validated by a call. A subscription that needs an activation
request is a poor fit for a network with no way out, and pretending otherwise
just produces an outage later.

## Observing runs

Every run records, per node:

- status, rows in, rows out
- wall-clock time
- the compiled SQL it executed
- a preview of the data at that step

When something is wrong, the question is usually "which step made it wrong",
and that is answerable by looking rather than by bisecting.

## Failure behaviour

| Setting | Effect |
| --- | --- |
| `on_fail: reject` | Bad rows routed aside, run continues |
| `on_fail: warn` | Recorded, run continues |
| `on_fail: fail` | Run stops at that node |
| `atomic: true` | Sink writes commit only if the whole run succeeds |

Use `atomic: true` where a partial load is worse than no load — which is most
places a dashboard reads from.

## Next

- [Security](/security)
- [Building a pipeline](/docs/building-a-pipeline)
