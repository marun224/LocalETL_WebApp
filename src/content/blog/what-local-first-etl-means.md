---
title: What local-first ETL actually means
description: The phrase is doing a lot of work in a lot of marketing. Here is the version with a testable definition.
published: 2026-09-21
minutes: 7
tags: ['local-first', 'architecture']
---

"Local-first" has become a category label, which means it has started to lose
its edges. Several products now use it to describe an architecture where your
data still ends up on someone else's machine — just later in the pipeline, or
only some of it, or only the parts they consider metadata.

So here is a definition you can test a vendor against.

## The test

> **A tool is local-first if you can unplug it from the internet and it still
> does its job.**

That is the whole thing. Not "we encrypt in transit". Not "we never look at
your data". Not "your data is yours". Those are all promises about behaviour.
The test above is a question about architecture, and you can run it yourself
in about thirty seconds with the aeroplane-mode toggle.

## Why the distinction matters

A promise about behaviour depends on the promiser continuing to exist in its
current form. Companies get acquired. Privacy policies get revised with an
email you will not read. A free tier becomes a growth funnel and the
definition of "telemetry" quietly widens.

None of that can touch an architecture that has no code path to send your data
anywhere. Not because the vendor is more trustworthy, but because there is
nothing for a change of heart to act on.

This is the same reason end-to-end encryption is a stronger guarantee than a
privacy policy. Not "we will not read it" but "we are not able to."

## The three honest positions

Most tools are in one of these. It is worth knowing which.

**1. Cloud-native.** Your data goes to the vendor and is processed there.
This is most hosted ELT and most BI. It is a perfectly reasonable trade — you
get scale and no operations. It is simply not local-first, and a tool in this
category calling itself local-first is worth a second look at the rest of its
claims.

**2. Self-hosted.** The vendor's software runs on your infrastructure, but the
software is built around a service model: a control plane, a licence server, a
metrics endpoint. It usually works offline in a degraded way and needs a
network to be fully functional. Better, but it fails the unplug test.

**3. Local-first.** Execution happens on your hardware, and the software makes
no outbound calls of its own. Offline is not a mode; it is just what happens
when there is nothing to call.

## The questions that actually separate them

When evaluating something that calls itself local-first, these five are worth
asking. The answers are usually available, just not on the landing page.

1. **Can I complete a full workflow with the network disabled?** Not "does the
   app open" — can I connect, build, run and export?
2. **Does it require an account?** An account implies a server that knows
   about you, which implies a request.
3. **What happens when a licence cannot be validated?** If the answer is "it
   stops working", the tool needs the internet, whatever the marketing says.
4. **Where does the AI run?** This is where most local-first claims break. An
   assistant that reads your schema and sends it to a hosted model has moved
   your data off the machine, and your schema is not nothing — table and column
   names leak business structure.
5. **What exactly is in the telemetry?** "Anonymous usage data" covers a wide
   range. Ask for the field list.

## The part that is genuinely a trade-off

Local-first is not free. You are choosing to be limited by one machine instead
of an elastic cluster. Past a certain data volume that is a real ceiling, and
the honest answer is that a warehouse is the right tool — push the aggregate
up to it and do the exploration locally.

You are also taking on operations you would otherwise have outsourced. Nobody
is going to page themselves at 3am because your nightly load failed.

What has changed is where that ceiling sits. A current laptop has more cores
and faster storage than the servers that ran serious analytics a decade ago.
Columnar, vectorised engines made single-machine analytics fast enough that
"just send it to the cloud" stopped being the obvious default and became a
choice — one worth making deliberately rather than by habit.

---

*Headrace is a local-first ETL and analytics engine, currently in development.
It is pre-launch, so treat this as an argument rather than a product pitch —
there is nothing to sell you yet.*
