---
title: Installation
description: What the first release will contain, which platforms it builds on today, and what it writes to your machine.
section: Getting started
order: 10
updated: 2026-09-23
---

> **Pre-launch.** Nothing on this page is downloadable yet. It describes what
> the engine is today, so the shape of the first release is clear before it
> exists. Packaging and installers are not settled, and are not described here.

Headrace comes in forms that share one engine:

- **The desktop application** — the canvas, run history and per-node previews.
  The query editor and dashboards are planned.
- **The `etl` command** — the same engine with no interface, for servers, CI
  and scripts.
- **Standalone binaries** — any pipeline, baked by `etl build` into one
  executable that runs on a machine with nothing else installed.

A pipeline built in one runs unchanged in the others. That is the point of
shipping them together rather than as separate products.

## Platforms

| Platform | Today |
| --- | --- |
| Windows x64 | Builds, and the full test suite passes |
| Linux x64 | Builds, and the test suite passes; a built pipeline runs in a bare Debian container with no network |
| macOS | Planned. Not built or tested yet |

No account is required, and no licence key is needed for the free core. Nothing
checks in with anything on first run.

## Checking it works

Once there is a release:

```bash
etl --version
etl components        # every source, transform, check and sink it knows
```

The first release will publish SHA-256 checksums to the repository alongside
the binaries, so verifying a download does not depend on trusting the page that
served it.

## What gets written to your machine

Everything lives inside the **workspace** — the folder your pipelines are in —
under `.etl/`:

| Path | Contents |
| --- | --- |
| `.etl/runs/` | Run history: outcome, total time, and rows per stage |
| `.etl/state/` | Watermarks for incremental sources |
| `.etl/secrets.json` | Connection secrets, encrypted (AES-256-GCM) |
| `.etl/keys/workspace.key` | The key those secrets are encrypted with |
| `.etl/contexts.json`, `.etl/schedules.json` | Environments and schedules, if you use them |

Treat `.etl/keys/` the way you would an SSH private key: keep it out of version
control and back it up. `secrets.json` on its own is useless without it.

There is deliberately no OS keychain involved. A workspace is a folder you can
copy to a server or an air-gapped machine, and it keeps working there.

Nothing is transmitted. See [Security](/security) for the full data-handling
detail.

## Next

- [Quickstart](/docs/quickstart) — a working pipeline, with the real output
- [Connecting a source](/docs/connecting-a-source)
