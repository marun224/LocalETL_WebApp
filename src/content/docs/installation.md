---
title: Installation
description: Install the desktop application or the headless runner on Windows, macOS or Linux.
section: Getting started
order: 10
updated: 2026-09-21
---

> **Pre-launch.** Nothing described here is downloadable yet. This page documents
> the intended install paths so the shape is clear before the first release.

Headrace ships in two forms that share one engine:

- **The desktop application** — canvas, query editor and dashboards.
- **The runner** — the same engine with no interface, for servers and CI.

A pipeline built in one runs unchanged in the other. That is the point of shipping
them together rather than as separate products.

## Desktop

| Platform | Package | Notes |
| --- | --- | --- |
| macOS | `.dmg` | Apple silicon and Intel, macOS 12+ |
| Windows | `.msi` | x64 and ARM64, Windows 10+ |
| Linux | `.deb`, `.rpm`, `.AppImage` | x64 and ARM64 |

No account is required, and no licence key is needed for the free core. The
application does not check in with anything on first run.

### Verifying a download

Every release publishes SHA-256 checksums alongside the binaries.

```bash
sha256sum -c headrace-1.0.0-SHA256SUMS
```

Verifying a download should not require trusting the page that served it, so
checksums are published to the repository rather than only to this site.

## Command line

```bash
pip install headrace
```

This installs the engine and the CLI. It does not require the desktop
application, and it does not require Python knowledge to use — `pip` is simply
a convenient distribution channel.

Check it worked:

```bash
headrace --version
```

## Container

```bash
docker run --rm -v $PWD:/work headrace/runner run pipeline.yaml
```

The container needs no outbound network access unless your pipeline reaches a
remote source. There is no control plane to register with.

## What gets written to your machine

| Path | Contents |
| --- | --- |
| Application directory | The binary and bundled engine |
| `~/.headrace/` | Local configuration and run history |
| OS secret store | Connection credentials, if you let it manage them |

Nothing is written outside these locations, and nothing is transmitted. See
[Security](/security) for the full data-handling detail.

## Next

- [Quickstart](/docs/quickstart) — a working pipeline in about five minutes
- [Connecting a source](/docs/connecting-a-source)
