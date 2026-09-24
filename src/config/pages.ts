/**
 * Manifest of every hand-authored page.
 *
 * ONE SOURCE OF TRUTH. This feeds, in order of importance:
 *   1. each page's <title> and meta description
 *   2. /llms.txt and /llms-full.txt
 *   3. generated OG images
 *   4. breadcrumb JSON-LD
 *
 * The reason it exists: OrcaSheets hand-maintains a parallel text corpus in
 * llms-full.txt because their SPA is unreadable to crawlers. Any hand-kept
 * mirror drifts from the site it describes. Pages import their metadata from
 * here, so the mirror and the page cannot disagree — they are the same data.
 *
 * `summary` is written for a machine reader: what the page establishes, in
 * two or three sentences, without marketing rhythm.
 */

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  summary: string;
  /** Grouping in llms.txt. */
  group: 'Product' | 'Solutions' | 'Commercial' | 'Company' | 'Resources';
  /** Omit from llms.txt and OG generation (e.g. /styleguide). */
  hidden?: boolean;
}

export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'Local-first ETL and analytics',
    description:
      'Connect databases, files and APIs, build pipelines that compile to readable SQL, and run them on hardware you already own. Plain-English questions are on the roadmap.',
    summary:
      'Home page. Establishes the core claim: one engine covering ingest, transform and analyse, executing on the user’s own hardware with no data egress. Presents the trust boundary architecture, a connector overview, and three install paths. Contains no benchmark figures because the product is pre-launch and nothing has been measured.',
    group: 'Product',
  },
  {
    path: '/features',
    title: 'Features',
    description:
      'Ingest, transform, analyse and operate — the full capability set of a local-first ETL and analytics engine.',
    summary:
      'Capability list across five groups, each feature marked built or planned: ingest (direct connections, read-in-place, incremental loads; CDC and schema-drift handling planned), transform (compiles to readable SQL, swap in your own SQL, cross-system joins, validators with reject routing, node-level lineage; Python escape hatch planned), analyse (pivots, exports; plain-English queries, SQL editor and dashboards planned), run and operate (scheduling, headless runs and standalone binaries, run history, per-node previews), and control (no egress, air-gapped operation, console roles; on-device AI and team governance planned).',
    group: 'Product',
  },
  {
    path: '/how-it-works',
    title: 'How it works',
    description:
      'The execution model: where data sits, what compiles to SQL, what runs in-process, and what never crosses your network boundary.',
    summary:
      'Architecture detail. Five-step execution model from connecting a source to landing results. Draws the trust boundary explicitly: sources, engine and results all sit inside the user’s infrastructure, and the boundary is crossed only by the software download. Includes an explicit "what this is not good at" section naming four cases where another tool is the better choice.',
    group: 'Product',
  },
  {
    path: '/integrations',
    title: 'Integrations',
    description:
      'Databases, lakehouse tables, object stores, files and REST APIs — connected directly, with no data copied to a vendor cloud. Warehouses, streaming brokers and named SaaS apps are planned.',
    summary:
      'Connector catalogue: 50 connectors across 6 categories (databases, warehouses and lakehouses, files and formats, object storage, streaming, SaaS and APIs), filterable by search and category. 17 are marked working (built in the engine and tested against real data, not yet released) and 33 planned. States plainly that none is released, because the product is pre-launch.',
    group: 'Product',
  },
  {
    path: '/security',
    title: 'Security & data handling',
    description:
      'Exactly what data is transmitted, what is not, and how deployment works inside a restricted network. No certifications are claimed.',
    summary:
      'Data-handling reference. A feature-by-feature table of what leaves the machine: pipeline execution, schema browsing, query results, on-device AI (planned) and telemetry transmit nothing; hosted AI models, update checks and paid-tier licence validation are marked conditional and off by default. Covers credential storage (encrypted in the workspace), four deployment topologies including air-gapped, and states explicitly that no certifications (SOC 2, ISO 27001, HIPAA) are held because no audit has been performed.',
    group: 'Product',
  },
  {
    path: '/download',
    title: 'Download',
    description:
      'Desktop app, command-line runner, or let a coding agent set it up. No account, no licence key, no activation call.',
    summary:
      'Download page. States up front that there is nothing to download yet because the first release has not shipped, and points at the repository instead of collecting an email address. Documents platform coverage (Windows and Linux built, macOS planned), checksum verification, system requirements and headless deployment.',
    group: 'Product',
  },
  {
    path: '/solutions/data-engineers',
    title: 'For data engineers',
    description:
      'Pipelines that compile to readable SQL, review like code in a pull request, and run headless from tooling you already have.',
    summary:
      'Audience page for data engineers. Problem: visual tools generate unreadable output, analysts cannot contribute so they queue, and ad-hoc work inflates the warehouse bill. Answer: every node compiles to inspectable SQL, pipelines are text that diffs in review, headless execution fits existing orchestration. Concedes that dbt on an established warehouse is not something this replaces.',
    group: 'Solutions',
  },
  {
    path: '/solutions/analysts',
    title: 'For analysts',
    description:
      'Join across systems yourself, check the compiled SQL, and work on datasets a spreadsheet cannot open. Plain-English questions are planned.',
    summary:
      'Audience page for analysts. Problem: cross-system joins require an engineer, exports exceed spreadsheet limits, and new questions need new dashboards. Answer: direct cross-system joins, pivots over large datasets, plain-English questions with visible generated SQL (planned), and saving an analysis as a repeatable pipeline. Concedes that governed certified metrics belong in a semantic layer and a BI tool.',
    group: 'Solutions',
  },
  {
    path: '/solutions/enterprise',
    title: 'For enterprise',
    description:
      'Runs inside your perimeter by default, which makes on-premise, VPC and air-gapped deployment ordinary rather than exceptional.',
    summary:
      'Audience page for enterprise buyers. Problem: vendor review takes longer than the project, some data cannot leave under any exception, and per-seat licensing rations who may ask questions. Answer: no data processing agreement is needed because no data is processed by the vendor, air-gapped operation requires no network route out including for licensing, and team pricing is flat rather than per seat. Concedes that a large mature BI estate is not replaced by this.',
    group: 'Solutions',
  },
  {
    path: '/pricing',
    title: 'Pricing',
    description:
      'An open-source core that is free commercially, flat team pricing rather than per seat, and no per-row or per-connector billing.',
    summary:
      'Four tiers: Core (free, $0, the whole engine), Pro and Team (amounts not yet decided), Enterprise (custom). Leads with pricing commitments rather than amounts: never per row, never per connector, never per seat on the core, and no usage metering at all — the last being structural, since nothing reports back. Explains why a free tier is sustainable: execution happens on the user’s hardware, so a free user costs the vendor almost nothing.',
    group: 'Commercial',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'Why this exists: two categories of data tool that do not meet, and a bill that grows for reasons nobody can explain.',
    summary:
      'Mission and commitments. Argues that pipeline tools stop when data lands and analytics tools assume it has already landed, leaving a gap filled by spreadsheets and ticket queues. Lists four public commitments: never phone home, never hide generated queries, keep the core open source, never bill per row or per seat. States that the project is pre-launch with no benchmarks, customers, testimonials or certifications.',
    group: 'Company',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'Email about the product, enterprise deployment, or to report a security issue. No chatbot, no qualification form.',
    summary:
      'Three contact routes: general and product, teams and enterprise, and security disclosure. Includes a composer that opens the visitor’s own mail client via mailto; nothing is submitted to a server and no data is collected, because there is no backend.',
    group: 'Company',
  },
  {
    path: '/docs',
    title: 'Documentation',
    description:
      'Install it, connect a source, build a pipeline, query the result, and deploy it.',
    summary:
      'Documentation index across four sections: getting started, building pipelines, analysis, and operations. Every article is also published as plain Markdown at /docs/{slug}.md.',
    group: 'Resources',
  },
  {
    path: '/blog',
    title: 'Blog',
    description:
      'Writing about local-first data tooling, warehouse cost, pipeline design and migrations.',
    summary:
      'Index of long-form writing. Every post is also published as plain Markdown at /blog/{slug}.md, and the feed is at /rss.xml.',
    group: 'Resources',
  },
  {
    path: '/roadmap',
    title: 'Roadmap',
    description:
      'What is being built and in what order, with no dates — plus what will deliberately never be built.',
    summary:
      'Roadmap in four stages: built but not yet released (execution engine, compilation to SQL, visual canvas, headless runner and standalone binaries, scheduling and web console, run history and previews, 17 working connectors), building now (more connectors: databases and warehouses next), before the first release (query editor, remaining v1 connectors, macOS), and after v1 (on-device AI, charts and dashboards, CDC, column lineage, team features, enterprise deployment). Publishes no dates. Includes a "will not be built" section: no hosted cloud version, no usage-based pricing, no telemetry, no distributed cluster mode, no sub-second application serving, no proprietary pipeline format.',
    group: 'Company',
  },
  {
    path: '/changelog',
    title: 'Changelog',
    description: 'Releases and what changed in each. Nothing has shipped yet.',
    summary:
      'Release history. Currently empty because no version has shipped. The page exists and states that plainly rather than returning a 404 or showing an invented history.',
    group: 'Company',
  },
  {
    path: '/styleguide',
    title: 'Style guide',
    description: 'Internal reference for design tokens and primitives.',
    summary: 'Internal design-system reference. Not indexed.',
    group: 'Resources',
    hidden: true,
  },
];

export const PAGE_BY_PATH = new Map(PAGES.map((p) => [p.path, p]));

/** Throws rather than silently rendering an untitled page. */
export function page(path: string): PageMeta {
  const found = PAGE_BY_PATH.get(path);
  if (!found) {
    throw new Error(
      `No entry in src/config/pages.ts for "${path}". Add one — it drives the ` +
        `title, meta description, llms.txt entry and OG image.`
    );
  }
  return found;
}

export const PUBLIC_PAGES = PAGES.filter((p) => !p.hidden);
