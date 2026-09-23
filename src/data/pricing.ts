/**
 * Pricing.
 *
 * Amounts are NOT set yet (IMPLEMENTATION_PLAN.md §12, open question Q2).
 * Rather than invent numbers that would have to be walked back, the page
 * leads with the pricing *commitments* — which are real decisions already
 * made — and marks the amounts as not yet set.
 *
 * When the numbers exist, fill `price` and `priceNote` and drop
 * `priceUnset`. Nothing else needs to change.
 */

export interface Tier {
  id: string;
  name: string;
  tagline: string;
  price: string | null;
  priceUnset?: boolean;
  unit?: string;
  cta: { label: string; href: string };
  highlight?: boolean;
  features: string[];
  /** Stated plainly so nobody discovers it during a trial. */
  limits?: string[];
}

export const TIERS: Tier[] = [
  {
    id: 'core',
    name: 'Core',
    tagline: 'The whole engine. Free, including commercially.',
    price: '$0',
    unit: 'forever',
    cta: { label: 'Download', href: '/download' },
    features: [
      'Every connector',
      'Visual canvas (SQL editor planned)',
      'Unlimited local processing',
      'On-device AI assistant (planned)',
      'Scheduled and headless runs',
      'Pivots (charts and dashboards planned)',
      'No row, seat or connector metering',
    ],
    limits: ['Single user', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For an individual who does this all day.',
    price: null,
    priceUnset: true,
    unit: 'per user / month',
    cta: { label: 'Get notified', href: '/contact' },
    features: [
      'Everything in Core',
      'Shared connection profiles (planned)',
      'Pipeline version history',
      'Scheduled report delivery (planned)',
      'Priority email support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Flat for the whole team. Not per seat.',
    price: null,
    priceUnset: true,
    unit: 'per team / month',
    highlight: true,
    cta: { label: 'Get notified', href: '/contact' },
    features: [
      'Everything in Pro',
      'Unlimited seats on the plan',
      'Shared dashboards and workspaces (planned)',
      'Role-based access control',
      'Audit log (planned)',
      'Shared secrets management (planned)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For a security review that has opinions.',
    price: null,
    unit: 'talk to us',
    cta: { label: 'Contact us', href: '/contact' },
    features: [
      'Everything in Team',
      'SSO and SCIM provisioning',
      'On-premise and VPC deployment',
      'Air-gapped licensing',
      'Custom connector development',
      'Named support contact',
    ],
  },
];

/**
 * The commitments. These are decisions, not aspirations, and they are the
 * actual argument of the pricing page — the amounts are secondary.
 */
export const COMMITMENTS = [
  {
    icon: 'infinity',
    title: 'Never per row',
    body: 'Volume-based billing means your bill grows because your business did. The engine runs on hardware you already pay for, so there is no per-row meter to run.',
  },
  {
    icon: 'plug',
    title: 'Never per connector',
    body: 'Charging per source punishes you for joining things together, which is the entire point of the tool.',
  },
  {
    icon: 'users',
    title: 'Never per seat on the core',
    body: 'Per-seat pricing is why the person who needs the answer files a ticket with the person who has a licence. The Team tier is flat for that reason.',
  },
  {
    icon: 'eye-off',
    title: 'No usage metering at all',
    body: 'We could not meter your usage if we wanted to — nothing reports back. That is a consequence of the architecture, not a policy we could quietly reverse.',
  },
];
