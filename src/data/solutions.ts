export interface Solution {
  slug: string;
  audience: string;
  title: string;
  lede: string;
  /** The problem, in their words, not ours. */
  pain: { title: string; body: string }[];
  answers: { title: string; body: string }[];
  /** A day-in-the-life scenario that makes it concrete. */
  scenario: { title: string; steps: string[] };
  /** Said plainly, because every audience has a case where this is wrong. */
  notFor: string;
}

export const SOLUTIONS: Solution[] = [
  {
    slug: 'data-engineers',
    audience: 'Data engineers',
    title: 'Pipelines you can read, review and leave',
    lede: 'You already have an orchestrator, a warehouse and opinions. What you do not have is a visual tool whose output survives a code review.',
    pain: [
      {
        title: 'Visual tools generate unreadable output',
        body: 'The last generation of drag-and-drop ETL compiled to generated Java or a proprietary plan. Nobody could review it, so nobody did, and the pipeline became a thing only its author understood.',
      },
      {
        title: 'Analysts cannot help, so they queue',
        body: 'If the only interface is code in your repository, every question becomes your ticket. If the only interface is a GUI, you cannot review it. Most teams pick one and live with the cost.',
      },
      {
        title: 'Ad-hoc work runs up the warehouse bill',
        body: 'Exploratory queries are the least predictable and most expensive thing on the warehouse, and they are exactly the work that did not need to be there.',
      },
    ],
    answers: [
      {
        title: 'Every node compiles to SQL',
        body: 'Open any node and read the query. Pipelines are text files that diff in a pull request, so a visual pipeline reviews exactly like code — because it is.',
      },
      {
        title: 'Analysts build, you review',
        body: 'They work on the canvas, you read the compiled SQL in the diff. The handoff stops being a translation step.',
      },
      {
        title: 'Runs headless anywhere',
        body: 'The same pipeline runs from cron, systemd, a container or your existing orchestrator. There is no control plane to register with and no agent to install.',
      },
      {
        title: 'No lock-in worth the name',
        body: 'The compiled SQL runs elsewhere. If you outgrow this, your work leaves with you — which is the only honest version of "no lock-in".',
      },
    ],
    scenario: {
      title: 'Moving ad-hoc load off the warehouse',
      steps: [
        'Point at the Postgres replica and the Parquet exports already in S3.',
        'Build the join once on the canvas; read the compiled SQL and correct the bit it got wrong.',
        'Commit the pipeline file. A colleague reviews it as a normal diff.',
        'Schedule it headless. Only the aggregate goes up to the warehouse.',
        'Exploration happens locally against the result, where it costs nothing per query.',
      ],
    },
    notFor:
      'If your transformation layer is already dbt on a warehouse your company is committed to, this is not a replacement for that. It is more useful to you at the extract and load end, and for keeping ad-hoc work off the bill.',
  },
  {
    slug: 'analysts',
    audience: 'Analysts',
    title: 'Answer it yourself, today',
    lede: 'The data you need is in four systems, you can write SQL, and you are still waiting on someone else to join them for you.',
    pain: [
      {
        title: 'The join lives in a queue',
        body: 'Orders are in Postgres, spend is in a CSV finance emails you, product events are in the warehouse. Joining them needs a pipeline, and the pipeline needs an engineer who is busy.',
      },
      {
        title: 'The export is too big for a spreadsheet',
        body: 'The file opens, or it does not, and either way you are working on a sample and hoping it is representative.',
      },
      {
        title: 'Dashboards answer last quarter’s question',
        body: 'Every genuinely new question needs a new dashboard, which needs a ticket, which lands after the decision was made.',
      },
    ],
    answers: [
      {
        title: 'Join across systems yourself',
        body: 'A database table, a file on your desktop and a SaaS API in one query — without loading any of them into a warehouse first, and without asking anyone.',
      },
      {
        title: 'Ask in plain English, then check it',
        body: 'Describe what you want, read the SQL it wrote, fix it if it misunderstood. You stay responsible for the number, which is the part that matters when someone asks where it came from.',
      },
      {
        title: 'Datasets a spreadsheet cannot open',
        body: 'Pivot and aggregate tens of millions of rows on the machine you already have, on the whole dataset rather than a sample.',
      },
      {
        title: 'Save it as something repeatable',
        body: 'Turn the analysis into a pipeline that reruns on a schedule, so next month is a refresh rather than a reconstruction.',
      },
    ],
    scenario: {
      title: 'Month-end, without the ticket',
      steps: [
        'Connect the finance CSV, the orders database and the payments API.',
        'Ask for revenue by region and channel; read the generated SQL.',
        'Notice refunds are double-counted. Edit that node directly.',
        'Pivot, chart, and export the reconciliation.',
        'Save it. Next month it reruns against fresh data.',
      ],
    },
    notFor:
      'If your organisation needs governed, certified metrics that everyone reports against, a semantic layer and a governed BI tool exist for good reasons. Use this for the exploration, and take the settled definition there.',
  },
  {
    slug: 'enterprise',
    audience: 'Enterprise',
    title: 'The architecture your security review was hoping for',
    lede: 'Most analytics procurement is a negotiation about how much data you are willing to let leave. This one starts from none.',
    pain: [
      {
        title: 'Vendor review takes longer than the project',
        body: 'Every cloud tool means a data processing agreement, a sub-processor list, a penetration test report and a residency argument — before anyone has answered a question.',
      },
      {
        title: 'Some data cannot leave, full stop',
        body: 'Regulated, classified or contractually restricted data does not get a cloud exception. So it gets analysed in spreadsheets instead, which is worse in every respect.',
      },
      {
        title: 'Per-seat licensing decides who gets to think',
        body: 'When a licence costs real money per person, access gets rationed to people who report rather than people who ask — and the rationing is invisible in the budget.',
      },
    ],
    answers: [
      {
        title: 'No data processing agreement needed',
        body: 'We do not process your data, because it never reaches us. That removes an entire category of review rather than satisfying it.',
      },
      {
        title: 'Air-gapped is ordinary',
        body: 'No network route out is required at any point, including licensing. Air-gapped operation is the absence of a requirement, not a special deployment tier.',
      },
      {
        title: 'Deploy where you already deploy',
        body: 'On-premise, private VPC or workstation. SSO and SCIM for provisioning, role-based access, and an audit log for the people who will ask for one.',
      },
      {
        title: 'Flat pricing, so access is not rationed',
        body: 'The team tier does not charge per seat, which means the analyst who needs the answer can have the tool.',
      },
    ],
    scenario: {
      title: 'A deployment that does not need an exception',
      steps: [
        'Security reviews the architecture and finds no egress path to argue about.',
        'The runner is deployed inside the existing VPC, with no new outbound rule.',
        'SSO is wired to the existing identity provider; access follows existing groups.',
        'Analysts connect to sources they are already authorised to read.',
        'The audit log answers who ran what, using infrastructure you already own.',
      ],
    },
    notFor:
      'If you have a large, mature BI estate with thousands of published workbooks and embedded reporting, this does not replace it. It is most useful alongside it, for the work that currently cannot be done at all.',
  },
];
