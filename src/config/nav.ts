export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  items?: NavItem[];
}

/** Primary header navigation. */
export const MAIN_NAV: NavGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Features', href: '/features', description: 'Everything it does, end to end' },
      { label: 'How it works', href: '/how-it-works', description: 'The architecture, in detail' },
      { label: 'Integrations', href: '/integrations', description: 'Sources it connects to' },
      { label: 'Security', href: '/security', description: 'Where your data goes — and doesn’t' },
      { label: 'Roadmap', href: '/roadmap', description: 'What is being built, in what order' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      {
        label: 'Data engineers',
        href: '/solutions/data-engineers',
        description: 'Pipelines you can read',
      },
      { label: 'Analysts', href: '/solutions/analysts', description: 'Answers without a ticket' },
      {
        label: 'Enterprise',
        href: '/solutions/enterprise',
        description: 'On-prem, VPC, air-gapped',
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

/** Footer columns. */
export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Product',
    items: [
      { label: 'Features', href: '/features' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Download', href: '/download' },
    ],
  },
  {
    heading: 'Solutions',
    items: [
      { label: 'Data engineers', href: '/solutions/data-engineers' },
      { label: 'Analysts', href: '/solutions/analysts' },
      { label: 'Enterprise', href: '/solutions/enterprise' },
    ],
  },
  {
    heading: 'Compare',
    items: [
      { label: 'vs Fivetran', href: '/compare/fivetran' },
      { label: 'vs Airbyte', href: '/compare/airbyte' },
      { label: 'vs Tableau & Power BI', href: '/compare/tableau-power-bi' },
      { label: 'Leaving Talend', href: '/compare/talend' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
