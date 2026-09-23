/**
 * Connector catalogue.
 *
 * `status` is the honesty mechanism, and it has three values:
 *
 * - 'planned'   — not built. The default.
 * - 'working'   — built in the engine and checked by a named engine test
 *                 (see docs/CLAIMS.md for which), but not released: nobody
 *                 can download the product yet. Mark an entry 'working' only
 *                 with that test behind it; a component existing is not
 *                 enough (three of Phase 4's did not work until checked).
 * - 'available' — released and downloadable. Nothing is, before launch.
 *
 * Counts, badges and copy update themselves from these values.
 *
 * Duckle's line is worth remembering: "These work today, not a
 * coming-soon list." We can only earn that sentence by being strict here.
 */

export type ConnectorStatus = 'available' | 'working' | 'planned';

export interface Connector {
  name: string;
  /** simple-icons slug, without the `simple:` prefix. Omit if none exists. */
  icon?: string;
  status: ConnectorStatus;
  /** Can it be read from, written to, or both? */
  io: 'source' | 'sink' | 'both';
}

export interface ConnectorCategory {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  connectors: Connector[];
}

export const CONNECTOR_CATEGORIES: ConnectorCategory[] = [
  {
    id: 'databases',
    label: 'Databases',
    blurb: 'Operational stores, read directly over their native protocol.',
    icon: 'database',
    connectors: [
      { name: 'PostgreSQL', icon: 'postgresql', status: 'working', io: 'both' },
      { name: 'MySQL', icon: 'mysql', status: 'working', io: 'both' },
      { name: 'MariaDB', icon: 'mariadb', status: 'planned', io: 'both' },
      { name: 'SQL Server', icon: 'microsoftsqlserver', status: 'planned', io: 'both' },
      { name: 'Oracle', icon: 'oracle', status: 'planned', io: 'source' },
      { name: 'SQLite', icon: 'sqlite', status: 'working', io: 'both' },
      { name: 'MongoDB', icon: 'mongodb', status: 'planned', io: 'source' },
      { name: 'Redis', icon: 'redis', status: 'planned', io: 'both' },
      { name: 'Cassandra', status: 'planned', io: 'source' },
      { name: 'Neo4j', icon: 'neo4j', status: 'planned', io: 'source' },
      { name: 'Elasticsearch', icon: 'elasticsearch', status: 'planned', io: 'both' },
      { name: 'ClickHouse', icon: 'clickhouse', status: 'planned', io: 'both' },
    ],
  },
  {
    id: 'warehouses',
    label: 'Warehouses & lakehouses',
    blurb: 'Push aggregates up, or pull history down for local work.',
    icon: 'warehouse',
    connectors: [
      { name: 'Snowflake', icon: 'snowflake', status: 'planned', io: 'both' },
      { name: 'BigQuery', icon: 'googlebigquery', status: 'planned', io: 'both' },
      { name: 'Databricks', icon: 'databricks', status: 'planned', io: 'both' },
      { name: 'Redshift', icon: 'amazonredshift', status: 'planned', io: 'both' },
      { name: 'DuckDB', icon: 'duckdb', status: 'planned', io: 'both' },
      { name: 'Iceberg', status: 'working', io: 'source' },
      { name: 'Delta Lake', icon: 'delta', status: 'working', io: 'source' },
    ],
  },
  {
    id: 'files',
    label: 'Files & formats',
    blurb: 'The formats analysts actually receive, read without conversion.',
    icon: 'file-text',
    connectors: [
      { name: 'Parquet', icon: 'apacheparquet', status: 'working', io: 'both' },
      { name: 'CSV', status: 'working', io: 'both' },
      { name: 'TSV', status: 'planned', io: 'both' },
      { name: 'Excel', icon: 'microsoftexcel', status: 'working', io: 'both' },
      { name: 'JSON / JSONL', status: 'working', io: 'both' },
      { name: 'XML', status: 'working', io: 'both' },
      { name: 'Arrow', status: 'planned', io: 'both' },
      { name: 'Avro', status: 'planned', io: 'source' },
      { name: 'Google Sheets', icon: 'googlesheets', status: 'planned', io: 'both' },
    ],
  },
  {
    id: 'storage',
    label: 'Object storage',
    blurb: 'Glob a prefix, read partitioned data in place.',
    icon: 'cloud',
    connectors: [
      { name: 'Amazon S3', icon: 'amazons3', status: 'planned', io: 'both' },
      { name: 'Google Cloud Storage', icon: 'googlecloud', status: 'planned', io: 'both' },
      { name: 'Azure Blob', icon: 'microsoftazure', status: 'planned', io: 'both' },
      { name: 'MinIO / S3-compatible', status: 'working', io: 'both' },
      { name: 'Local filesystem', status: 'working', io: 'both' },
    ],
  },
  {
    id: 'streaming',
    label: 'Streaming',
    blurb: 'Consume topics into batches you can join against.',
    icon: 'radio',
    connectors: [
      { name: 'Kafka', icon: 'apachekafka', status: 'planned', io: 'both' },
      { name: 'RabbitMQ', icon: 'rabbitmq', status: 'planned', io: 'both' },
      { name: 'Webhooks', status: 'planned', io: 'source' },
    ],
  },
  {
    id: 'saas',
    label: 'SaaS & APIs',
    blurb: 'Business systems, normalised into rows you can join.',
    icon: 'plug',
    connectors: [
      { name: 'Salesforce', icon: 'salesforce', status: 'planned', io: 'source' },
      { name: 'HubSpot', icon: 'hubspot', status: 'planned', io: 'source' },
      { name: 'Stripe', icon: 'stripe', status: 'planned', io: 'source' },
      { name: 'Shopify', icon: 'shopify', status: 'planned', io: 'source' },
      { name: 'GitHub', icon: 'github', status: 'planned', io: 'source' },
      { name: 'GitLab', icon: 'gitlab', status: 'planned', io: 'source' },
      { name: 'Jira', icon: 'jira', status: 'planned', io: 'source' },
      { name: 'Slack', icon: 'slack', status: 'planned', io: 'both' },
      { name: 'Notion', icon: 'notion', status: 'planned', io: 'source' },
      { name: 'Airtable', icon: 'airtable', status: 'planned', io: 'both' },
      { name: 'Zendesk', icon: 'zendesk', status: 'planned', io: 'source' },
      { name: 'REST APIs', status: 'working', io: 'both' },
      { name: 'GraphQL', status: 'planned', io: 'both' },
    ],
  },
];

export const ALL_CONNECTORS: Connector[] = CONNECTOR_CATEGORIES.flatMap((c) => c.connectors);

export const CONNECTOR_COUNTS = {
  total: ALL_CONNECTORS.length,
  available: ALL_CONNECTORS.filter((c) => c.status === 'available').length,
  working: ALL_CONNECTORS.filter((c) => c.status === 'working').length,
  planned: ALL_CONNECTORS.filter((c) => c.status === 'planned').length,
  categories: CONNECTOR_CATEGORIES.length,
};
