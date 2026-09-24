/**
 * The roadmap.
 *
 * Kept as data so /roadmap, /llms-full.txt and any future changelog read the
 * same source.
 *
 * Two rules for editing this file:
 *
 * 1. **No dates.** A pre-launch project that publishes dates publishes dates
 *    it will miss, and every missed date costs more credibility than the
 *    roadmap bought. Order is a commitment; timing is not.
 *
 * 2. **`notPlanned` is load-bearing.** Saying what will never be built is more
 *    useful to someone evaluating this than another list of intentions, and it
 *    is the section a competitor's roadmap never has.
 */

export type Stage = 'built' | 'building' | 'next' | 'later';

export interface RoadmapItem {
  title: string;
  body: string;
  stage: Stage;
}

export const STAGES: { id: Stage; label: string; blurb: string }[] = [
  {
    id: 'built',
    label: 'Built, not yet released',
    blurb: 'Working in the engine and tested. Not downloadable until the first release.',
  },
  {
    id: 'building',
    label: 'Building now',
    blurb: 'Active work. Not finished or usable yet.',
  },
  {
    id: 'next',
    label: 'Before the first release',
    blurb: 'Required for v1 to be worth downloading.',
  },
  {
    id: 'later',
    label: 'After v1',
    blurb: 'Wanted, ordered, not started. This ordering will change.',
  },
];

export const ROADMAP: RoadmapItem[] = [
  // --- built ---------------------------------------------------------------
  {
    stage: 'built',
    title: 'The execution engine',
    body: 'Columnar, vectorised, in-process. Everything else depends on this, so it came first.',
  },
  {
    stage: 'built',
    title: 'Pipeline compilation to SQL',
    body: 'The canvas-to-SQL layer, including the part that matters most: the compiled query being readable, and replaceable with your own SQL, rather than merely visible.',
  },
  {
    stage: 'built',
    title: 'The visual canvas',
    body: 'Drag, wire, inspect, in a desktop app. Each node shows what it compiles to.',
  },
  {
    stage: 'built',
    title: 'Headless runner and standalone binaries',
    body: 'The same engine without the interface, so a pipeline built on a laptop runs unchanged from cron, systemd or CI — or baked into one file that runs on a machine with no network.',
  },
  {
    stage: 'built',
    title: 'Scheduling and the web console',
    body: 'Cron, interval and file-watch schedules, and a console for a server with token sign-in and two roles.',
  },
  {
    stage: 'built',
    title: 'Run history and per-node previews',
    body: 'Row counts per stage, the compiled SQL for each node, and the data as it looked at each step. "Which step made the number wrong" is answerable by looking.',
  },
  {
    stage: 'built',
    title: 'The first connectors',
    body: 'Seventeen, each tested against real data or a real server: PostgreSQL, MySQL, SQLite, Delta Lake, Iceberg, S3-compatible storage, local files in six formats, REST and GraphQL APIs, Kafka, NATS JetStream and RabbitMQ.',
  },

  // --- building -----------------------------------------------------------
  {
    stage: 'building',
    title: 'More connectors',
    body: 'One family at a time, each verified before it is marked working. Databases and warehouses are next: MongoDB, Redis, Elasticsearch, BigQuery and Snowflake.',
  },

  // --- next ---------------------------------------------------------------
  {
    stage: 'next',
    title: 'Query editor and results',
    body: 'SQL with schema autocomplete across connected sources, streaming results, and cross-source joins.',
  },
  {
    stage: 'next',
    title: 'Remaining v1 connectors',
    body: 'SQL Server, Snowflake, BigQuery, GCS, Azure Blob and Amazon S3 verified against AWS itself. The catalogue on the integrations page is the target, not a promise of the first release.',
  },
  {
    stage: 'next',
    title: 'macOS',
    body: 'The engine is written to build there; it has not been built or tested there yet.',
  },

  // --- later --------------------------------------------------------------
  {
    stage: 'later',
    title: 'On-device AI assistant',
    body: 'Plain-English questions answered with SQL you read before it runs. Deliberately after the engine: an assistant on top of an unreliable engine is worse than no assistant.',
  },
  {
    stage: 'later',
    title: 'Charts and dashboards',
    body: 'The rest of the analysis half of the story (pivots already work). Pipelines have to be trustworthy before anything is built on top of them.',
  },
  {
    stage: 'later',
    title: 'Change data capture',
    body: 'Inserts, updates and delete propagation, rather than rebuilding a table every night.',
  },
  {
    stage: 'later',
    title: 'Column-level lineage',
    body: 'Trace any output column back through every node to the source columns it came from.',
  },
  {
    stage: 'later',
    title: 'Team features',
    body: 'Shared connections and an audit log, and roles beyond the console’s two. The first thing that will be paid for, and therefore not the first thing built.',
  },
  {
    stage: 'later',
    title: 'Enterprise deployment',
    body: 'SSO, SCIM, air-gapped licensing issued as files rather than validated by a call.',
  },
];

/**
 * Said plainly, because a roadmap that only lists intentions tells you nothing
 * about what the tool will refuse to be.
 */
export const NOT_PLANNED: { title: string; body: string }[] = [
  {
    title: 'A hosted cloud version',
    body: 'Running your pipelines on our infrastructure would contradict the only thing that makes this different. If you want managed ELT, Fivetran and Airbyte Cloud already do it well.',
  },
  {
    title: 'Usage-based pricing',
    body: 'There is no meter and there will not be one. Not as a pricing promise — as a consequence of nothing reporting back.',
  },
  {
    title: 'Telemetry, even anonymous',
    body: 'It would make the product better and the argument worse. We will ask you instead.',
  },
  {
    title: 'A distributed cluster mode',
    body: 'One machine is a real ceiling. Past it, a warehouse is the right tool and the honest move is to push the aggregate up to it rather than pretend otherwise.',
  },
  {
    title: 'Sub-second serving for applications',
    body: 'This is an analytical engine. Application lookups belong in your operational database.',
  },
  {
    title: 'A proprietary pipeline format',
    body: 'Pipelines stay text that compiles to SQL. Lock-in by file format is how the previous generation of visual ETL tools stranded their users.',
  },
];

export const BY_STAGE = (stage: Stage) => ROADMAP.filter((r) => r.stage === stage);
