# Site ↔ product sync: audit and open questions

**Status:** ✅ Answered 2026-09-23, all as recommended. Plan: [PLAN_site_product_sync.md](PLAN_site_product_sync.md), awaiting approval. No site changes made yet.
**Audited:** 2026-09-23, first against `E:\workspace_09212026\ETL_Local_Tool` at `ad7fc51`
(Phase 9), then **re-audited the same day after Phases 10a–10c** (uncommitted there at the
time): 58 components, and Phase 4's connectors run against real systems.
**Next step:** approve the plan, then build.

---

## Questions

Answer each one under its "Answer:" line, or all at once in one reply.

**Q1. What does "available" mean before there is a public download?**
The site's `available` tells a reader they can use it today. Nobody can yet.
- (a) Keep everything `planned` until launch.
- (b) Add a third status, such as "working, not yet released".
- (c) Mark the verified connectors `available` now.

Recommended: **(b)**. Honest, and it doubles as a progress bar.
Answer (2026-09-23): **(b) a third status, "working, not yet released"**. As recommended.

**Q2. Change Delta Lake and Iceberg from read + write to read only on the site?**
The engine only reads them. Recommended: **yes**.
Answer (2026-09-23): **yes, read only**. As recommended.

**Q3. Amazon S3 was verified against MinIO, an S3-compatible server, not against AWS itself.**
- (a) Give Amazon S3 the same status as "MinIO / S3-compatible".
- (b) Give it to "MinIO / S3-compatible" only, and keep Amazon S3 `planned` until it has run
  against a real AWS bucket, which needs AWS credentials only you have.

Recommended: **(b)**. Same protocol, but the site's rule is no claim without a check.
Answer (2026-09-23): **(b) MinIO / S3-compatible only; Amazon S3 stays planned until run against AWS**. As recommended.

**Q4. Add what the engine has and the site does not list?**
XML (read and write) is built and tested, and not on the site. "REST / GraphQL" is half built:
REST is, GraphQL is not.
- (a) Add XML; split "REST / GraphQL" into "REST APIs" (built) and "GraphQL" (planned).
- (b) Leave the catalogue's entries as they are.

Recommended: **(a)**.
Answer (2026-09-23): **(a) add XML; split into "REST APIs" (built) and "GraphQL" (planned)**. As recommended.

**Q5. The feature claims that are partly true or not built: fix them in the same phase as the
connectors?**
- (a) Same phase: reword the partly true ones, and mark the unbuilt ones as planned.
- (b) Same phase, but remove the unbuilt ones from the features page instead of marking them.
- (c) A separate phase.

Recommended: **(a)**. Otherwise the connector list is accurate and the features page isn't.
Answer (2026-09-23): **(a) same phase: reword the partly true, mark the unbuilt as planned**. As recommended.

**Q6. The docs pages contradict the engine (see the last table). What should happen to them?**
- (a) Rewrite them to match the engine as it is: JSON pipelines, `etl` commands, secrets in
  the workspace.
- (b) Mark them "draft, will change before release" and rewrite at launch.

Recommended: **(a)**. The engine's own docs and samples are there to copy from.
Answer (2026-09-23): **(a) rewrite to match the engine as it is**. As recommended.

**Q7. Two catalogue entries are one cheap test away: TSV (the CSV reader with a tab
delimiter) and MariaDB (DuckDB's MySQL extension claims it).**
- (a) Leave them `planned` for now.
- (b) Verify both in the Tool repo first. About an hour: a TSV file, and a MariaDB container
  beside the MySQL one.

Recommended: **(a)**, with (b) as a follow-up. Neither blocks the rest.
Answer (2026-09-23): **(a) leave both planned; verifying them is a later follow-up**. As recommended.

**Q8. Where do the plan and audit live?**
Plan in `docs/PLAN_site_product_sync.md` (this repo), audit recorded in `docs/CLAIMS.md`.
Recommended: **yes**.
Answer (2026-09-23): **yes**. As recommended.

*Dropped from the first audit:* "verify the five unverified connectors first?" The Tool repo's
Phase 10c did exactly that on 2026-09-23. See below.

---

## Audit: connectors (46 on the site, 58 components in the engine)

How it was checked: `etl components`, the engine's tests, and Phase 10c's verification suite
(`crates/duckdb-engine/tests/verified.rs`): real tables for Delta and Iceberg, and PostgreSQL 16,
MySQL 8.4 and MinIO in Docker.

### Working and verified against real data or real systems (12 site entries)

| Site entry | Engine | Evidence |
| --- | --- | --- |
| CSV / TSV | `src/snk.file.csv` | round trips, samples. **TSV itself not tested** (Q7) |
| Parquet | `src/snk.file.parquet` | tests and samples |
| JSON / JSONL | `src/snk.file.json(l)` | round trips |
| Excel | `src/snk.file.excel` | round trip |
| Local filesystem | every file component | implied by all of the above |
| SQLite | `src/snk.db.sqlite` | round trip, both write modes |
| PostgreSQL | `src/snk.db.postgres` | **10c**: PostgreSQL 16, overwrite, append, append onto a new table |
| MySQL | `src/snk.db.mysql` | **10c**: MySQL 8.4. Reading was broken (DuckDB bug) and is fixed |
| Delta Lake | `src.lake.delta` | **10c**: a `deltalake`-written table. **Read only** (Q2) |
| Iceberg | `src.lake.iceberg` | **10c**: a `pyiceberg`-written, moved table. **Read only** (Q2). Was broken, fixed |
| MinIO / S3-compatible | `src/snk.cloud.s3` | **10c**: MinIO, Parquet and CSV both ways. Writing had never worked on Windows; fixed |
| REST (the REST half of "REST / GraphQL") | `src/snk.saas.rest` | 10b: a recording fixture for every behaviour, and one real HTTPS read of GitHub's API |

### Built, with a caveat (1)

| Site entry | Caveat |
| --- | --- |
| Amazon S3 | same component as MinIO; never run against AWS itself (Q3) |

### In the engine, not on the site (2)

| Engine | Note |
| --- | --- |
| `src.file.xml`, `snk.file.xml` | XML both ways, 10a. Not a site entry at all (Q4) |
| `src.cloud.http` | reads a CSV/Parquet/JSON file from a URL. Not an API connector |

### Not in the engine (33 site entries)

The rest of Databases (MariaDB untested, Q7; SQL Server, Oracle, MongoDB, Redis,
Cassandra, Neo4j, Elasticsearch, ClickHouse); all Warehouses but Delta and Iceberg (Snowflake,
BigQuery, Databricks, Redshift, DuckDB-as-a-connector); Arrow, Avro (extension vendored, no
component), Google Sheets; GCS, Azure Blob; all of Streaming (Kafka, RabbitMQ, Webhooks); every
named SaaS app (Salesforce to Zendesk: reachable today only by configuring `src.saas.rest` by
hand, which is not the same as a connector for them).

---

## Audit: feature claims (`/features`, `/how-it-works`)

**True today:** compiles to readable SQL · incremental loads · validators with reject routing ·
pipelines are text · pivots and aggregations · cron / interval / file-watch scheduling ·
headless runner (`etl build`) · run history with per-node rows and timings · failures show SQL
and engine error · per-node previews (desktop) · local encrypted secrets · air-gapped artifact
(tested in a bare container with no network) · REST APIs as sources and sinks.

**Partly true, needs rewording:**

| Claim | Reality |
| --- | --- |
| Column-level lineage | Node-level only |
| Editable at any node | Only by swapping in an `xf.sql` node |
| Branches fan out across cores | DuckDB parallelises within a query; no branch fan-out |
| Joins across systems | Postgres, MySQL, SQLite, files, lakes and REST: yes. Named SaaS apps: no |
| Write back into your warehouse | Postgres, MySQL and SQLite only; no warehouse |
| Team governance | Two roles and tokens in the web console. No audit trail, no shared connections |
| Windows, macOS, Linux | Windows and Linux. macOS is a named target, never built |

**Not built:** change data capture · schema-drift handling · Python escape hatch · plain-English
questions / on-device AI · SQL editor · charts and dashboards.

---

## Audit: docs that contradict the engine

| Page | Says | Actually |
| --- | --- | --- |
| Quickstart | Credentials go to the OS secret store | Encrypted in the workspace's `.etl/`, key alongside |
| Quickstart, Deployment | `pipeline.yaml` | Pipelines are JSON |
| Deployment | `serve --schedule cron`, `serve --watch` | Neither exists; scheduling is `etl schedule`, the console `etl serve` |
| Quickstart | "Chart the result" | No charts |
