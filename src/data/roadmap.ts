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

export type Stage = 'building' | 'next' | 'later';

export interface RoadmapItem {
  title: string;
  body: string;
  stage: Stage;
}

export const STAGES: { id: Stage; label: string; blurb: string }[] = [
  {
    id: 'building',
    label: 'Building now',
    blurb: 'Active work. Nothing here is finished or usable yet.',
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
  // --- building -----------------------------------------------------------
  {
    stage: 'building',
    title: 'The execution engine',
    body: 'Columnar, vectorised, in-process. Everything else depends on this, so it is first and it is taking the longest.',
  },
  {
    stage: 'building',
    title: 'Pipeline compilation to SQL',
    body: 'The canvas-to-SQL layer, including the part that matters most: the compiled query being readable and editable rather than merely visible.',
  },
  {
    stage: 'building',
    title: 'The first connectors',
    body: 'PostgreSQL, Parquet, CSV and S3. Enough to build a genuinely useful pipeline, which is the bar for the first release rather than connector count.',
  },

  // --- next ---------------------------------------------------------------
  {
    stage: 'next',
    title: 'The visual canvas',
    body: 'Drag, wire, inspect. Usable without reading documentation first, and honest about what each node compiles to.',
  },
  {
    stage: 'next',
    title: 'Headless runner',
    body: 'The same engine without the interface, so a pipeline built on a laptop runs unchanged from cron, systemd or CI.',
  },
  {
    stage: 'next',
    title: 'Query editor and results',
    body: 'SQL with schema autocomplete across connected sources, streaming results, and cross-source joins.',
  },
  {
    stage: 'next',
    title: 'Remaining v1 connectors',
    body: 'MySQL, SQL Server, Snowflake, BigQuery, GCS, Azure Blob, Excel, JSON and generic REST. The catalogue on the integrations page is the target, not a promise of the first release.',
  },
  {
    stage: 'next',
    title: 'Run history and per-node previews',
    body: 'Row counts, timings, the compiled SQL and the data as it looked at each step. "Which step made the number wrong" should be answerable by looking.',
  },

  // --- later --------------------------------------------------------------
  {
    stage: 'later',
    title: 'On-device AI assistant',
    body: 'Plain-English questions answered with SQL you read before it runs. Deliberately after the engine: an assistant on top of an unreliable engine is worse than no assistant.',
  },
  {
    stage: 'later',
    title: 'Pivots, charts and dashboards',
    body: 'The analysis half of the story. Pipelines have to be trustworthy before anything is built on top of them.',
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
    body: 'Shared connections, role-based access, audit log. The first thing that will be paid for, and therefore not the first thing built.',
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
