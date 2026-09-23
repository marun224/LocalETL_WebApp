import { BRAND } from '../config/brand';

/**
 * FAQ content.
 *
 * These double as the site's SEO surface: each question is phrased the way
 * someone actually types it into a search box, and each answer stands alone
 * as a complete response. Duckle's 16-question FAQ is the clearest thing on
 * their site for exactly this reason.
 *
 * HONESTY: the product is pre-launch. No answer here may claim shipped
 * behaviour. Answers describe design intent, and `readiness` states the
 * position plainly rather than burying it.
 */

export interface FaqItem {
  q: string;
  /** Plain text. Rendered as-is; no markup. */
  a: string;
  /** Shown on the home page FAQ. Others live on their topic pages. */
  home?: boolean;
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is local-first ETL?',
    a: `Local-first ETL means the pipeline runs where your data already is — your laptop, your server, your VPC — instead of on a vendor's platform. You are not renting compute to move your own rows, and nothing has to be uploaded before you can use it. The opposite model is hosted ETL, where data is extracted to a vendor's cloud, transformed there, and billed per row or per connector.`,
    home: true,
  },
  {
    q: `Is ${BRAND.name} ready to use today?`,
    a: `Not yet. ${BRAND.name} is pre-launch and in active development, and this site describes what it is being built to do. Nothing here is a claim about shipped behaviour, and there are no benchmark numbers on this site that were not measured. If you want to know when it is usable, watch the repository — that is where the first release will appear.`,
    home: true,
  },
  {
    q: `Is ${BRAND.name} free and open source?`,
    a: `The core engine is open source and free to use, including commercially. Paid Team and Enterprise tiers add collaboration, governance, SSO and support. There is no per-row billing, no per-connector billing and no per-seat billing on the core. The exact licence is still being chosen and will be stated on the repository before the first release.`,
    home: true,
  },
  {
    q: 'Does my data ever leave my machine?',
    a: `No. Pipelines execute in-process on infrastructure you control, and results stay there. ${BRAND.name} makes no outbound calls of its own: no account, no telemetry, no phone-home. Where a pipeline reaches a remote system, it does so because you configured that system as a source or a destination — and only then.`,
    home: true,
  },
  {
    q: 'Do I need a data warehouse to use it?',
    a: `No. A warehouse is one possible source and one possible destination, not a prerequisite. You can join a Postgres table against a Parquet file in S3 and a CSV on your desktop without loading any of it into a warehouse first. Teams who do run a warehouse often use this to keep ad-hoc work off it, which is usually where the bill comes from.`,
    home: true,
  },
  {
    q: 'Can I run ETL pipelines without the cloud?',
    a: `Yes — that is the default. There is no vendor cloud in the execution path and no account to create. This also makes air-gapped and on-premise operation straightforward rather than a special deployment mode, which matters for regulated, defence and healthcare environments where data residency is not negotiable.`,
    home: true,
  },
  {
    q: 'Can I build pipelines without writing code?',
    a: `Yes. Pipelines are assembled on a visual canvas: drag sources, transforms and destinations, and wire them together. Every node compiles to SQL you can open and read, so the visual layer is a convenience rather than a wall — you can drop into SQL at any node, and analysts and engineers can work on the same pipeline without translating between two tools.`,
    home: true,
  },
  {
    q: 'What is the difference between this and dbt?',
    a: `dbt transforms data that is already in your warehouse. It does not extract or load, and it needs a warehouse to run against. ${BRAND.name} covers extract, transform and load in one engine that runs locally, so there is no warehouse in the loop unless you want one. They are not mutually exclusive: a common pattern is to land data with ${BRAND.name} and keep modelling in dbt.`,
    home: true,
  },
  {
    q: 'Is there an open-source alternative to Fivetran or Airbyte?',
    a: `${BRAND.name} covers similar ground to hosted ELT platforms, with two differences: it runs on your own infrastructure rather than a vendor's, and it does not bill per row or per connector. It is also meant to continue past the load step into querying and dashboards, where extraction-only tools hand you off to something else. Pivots and aggregations work today; the query editor and dashboards are planned.`,
    home: true,
  },
  {
    q: 'What replaced Talend Open Studio after it was discontinued?',
    a: `Talend Open Studio reached end of life on 31 January 2024 and its free downloads were withdrawn, leaving teams on an unsupported tool. ${BRAND.name} is being built as a visual-pipeline successor for exactly that situation, with one important difference: pipelines compile to readable SQL rather than generated Java, so what runs is something you can inspect and hand to a colleague.`,
  },
  {
    q: 'Can it replace Tableau or Power BI?',
    a: `For ad-hoc analysis, joins across systems and team dashboards, that is the intent — and without per-seat licensing. For large enterprise BI estates with years of published workbooks, row-level security models and embedded reporting, treat it as complementary rather than a drop-in replacement. The honest answer depends on how much of your BI spend is ad-hoc work that never needed a dashboard.`,
  },
  {
    q: 'How large a dataset can it handle?',
    a: `The engine is columnar and vectorised, and it works against data on disk rather than loading everything into memory, so the practical ceiling is closer to your disk and core count than to your RAM. We are not publishing throughput figures until they have been measured on hardware we can describe — a benchmark you cannot reproduce is marketing, not information.`,
  },
  {
    q: 'Does the AI assistant send my data anywhere?',
    a: `The assistant is planned, not built yet. It is designed to run on-device, with no API key and no vendor cloud, so prompts and data stay on your machine. If you would rather use a hosted model, that is an explicit opt-in and the site will say exactly what gets transmitted. The default is local.`,
    home: true,
  },
  {
    q: 'Which operating systems are supported?',
    a: `Windows and Linux today, with macOS planned, as a desktop application and as a headless runner for servers and CI. The same pipeline definition runs in both, so what you build on a laptop is what runs in production.`,
  },
  {
    q: 'Can I schedule pipelines and run them unattended?',
    a: `Yes. Pipelines can run on a schedule, on an interval, on a file-watch trigger, or headless from a command line — which means they fit into cron, systemd, CI or whatever orchestration you already run. There is no separate scheduling service to operate.`,
  },
  {
    q: 'What happens when a pipeline fails?',
    a: `A failed stage reports the compiled SQL it was running and the engine's own error message, rather than an opaque internal code. Every run records its outcome and the rows each stage produced or rejected, and the desktop app previews the data at each node, so the question "what actually happened" has an answer you can read.`,
  },
];

export const HOME_FAQ = FAQ.filter((f) => f.home);
