/* ============================================================
   Site copy and product facts in one place.
   Company = Amrut Poultry Solutions.  Product = Amrut Poultry Management.
   Nothing here invents history, customers, counts or capabilities.
   Figures inside product mockups are illustrative sample data.
   ============================================================ */

export const BRAND = {
  company: 'Amrut Poultry Solutions',
  product: 'Amrut Poultry Management',
  positioning: 'A one-stop solution for poultry.',
  /** The owner's own second line — what the one-stop claim actually delivers. */
  strapline: 'Handy information at your fingertips.',
  promise: 'Run your poultry business with clarity.',
  summary:
    'Amrut Poultry Solutions builds practical technology that connects poultry operations, inventory, egg sales, traders and financial performance.',
  /** Contact for the product. The site links to this number, never to the app. */
  contact: {
    /** Digits without the country code — what the phone widget takes. */
    number: '9035526551',
    country: 'in',
    dialCode: '91',
    display: '+91 90355 26551',
    tel: '+919035526551',
  },
} as const;

export const NAV = [
  { label: 'Why', href: '#problem' },
  { label: 'When', href: '#when' },
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
] as const;

/** The chain the hero visualises: physical activity resolving into financial truth. */
export const PIPELINE = ['Farm', 'Operations', 'Inventory', 'Egg Sales', 'Traders', 'Finance', 'P&L'] as const;

/** Every number a farm produces, used by the disconnection section. */
export const DATA_POINTS = [
  'Eggs collected',
  'Eggs sold',
  'Feed consumed',
  'Birds',
  'Mortality',
  'Inventory',
  'Purchases',
  'Expenses',
  'Trader balances',
  'Payments',
  'Revenue',
  'Profit',
] as const;

/* ============================================================
   THE ARGUMENT — why, when, how. Stated against the way the farm is
   already run (diary, calculator, memory), never against the owner.
   No invented losses, no invented customers, no statistics.
   ============================================================ */

export const WHY = {
  headline: "You're already managing the farm.",
  lede: 'Of course you are. Almost every poultry business is run from a diary, a calculator and a very good memory — and that combination gets the birds fed, the eggs collected and the money collected. The question is not whether you can run it. The question is what a diary can never hand back.',
  /** What the manual record does hold, next to what it structurally cannot produce. */
  gaps: [
    {
      recorded: 'Trays that left the farm',
      never: 'What that load cost you',
      detail:
        'A register holds trays and rate. The feed, chick, medicine and labour behind those eggs sit in four different places, so the sale lands as income and the cost stays invisible.',
    },
    {
      recorded: 'Feed bags purchased',
      never: 'What each shed actually consumed',
      detail:
        'Purchases arrive in the godown; consumption happens shed by shed, day by day. Record one side and per-shed cost is an estimate you repeat, not a number you can check.',
    },
    {
      recorded: 'Payments traders handed you',
      never: 'Exactly who still owes you',
      detail:
        'The balance lives in your diary and in the trader’s book. When the two disagree, only one of them can be proved, and it is usually his.',
    },
    {
      recorded: 'Cash that came and went',
      never: 'Whether the month earned anything',
      detail:
        'Cash moved is not profit. A maize stock you paid for is still inventory, the birds are still growing, and next month’s feed is already spent in this month’s hand.',
    },
  ],
  closing: {
    line: 'None of this says you are managing badly.',
    accent: 'It says a diary cannot do arithmetic.',
  },
} as const;

export const WHEN = {
  headline: 'You do not need a system for one shed.',
  lede: 'A single shed, cash sales and your own handwriting is a manageable business. Signs the manual way starts costing you — usually the week one of them appears.',
  triggers: [
    {
      sign: 'A second shed, or two batches that overlap',
      cost: 'Costs begin to mix. Which flock ate that maize becomes a guess, and guesses average out.',
    },
    {
      sign: 'Eggs going out on credit',
      cost: 'Receivables turn into a second book you keep by hand, updated only when someone calls to pay.',
    },
    {
      sign: 'Somebody else records the day',
      cost: 'Then the record has to carry a date, a shed and a name — yours is not the only memory in the farm.',
    },
    {
      sign: 'Feed bought in bulk, drawn shed-wise',
      cost: 'Stock and consumption are two different questions, and a purchase diary can only answer the first.',
    },
    {
      sign: 'You want the number per batch',
      cost: 'Not whether the farm paid. Whether this flock paid, before the next one is placed on the strength of it.',
    },
    {
      sign: 'A bank, partner or audit asks to see it',
      cost: 'Memory is not a statement. The ask arrives on a date, and the reconstruction takes a week.',
    },
  ],
  notYet: {
    title: 'You may not need it yet',
    lines: [
      'One shed, one batch at a time, cash sales only.',
      'You make every entry yourself, on the day it happens.',
      'You can already state this month’s profit, shed by shed, without opening the diary.',
    ],
    note: 'Then a register is the right tool for now. Buy the system the week that stops being true — not the week a website tells you to.',
  },
} as const;

/** The mechanism, in the order it actually happens on the farm. */
export const HOW_STEPS = [
  {
    n: '01',
    title: 'Record the day, at the shed',
    body: 'Feed rounds, egg collections, mortality, purchases, sales, expenses, receipts. Every entry carries a date, a shed or batch, and whose entry it was. That is the entire input — a few minutes of typing by the people already doing the work.',
  },
  {
    n: '02',
    title: 'Both sides are kept, once',
    body: 'Feed bought into the godown is stock; feed drawn by shed is that shed’s expense. A load of eggs billed is income for the period and a balance on the trader’s account at the same moment. Nothing is typed twice, so nothing can drift apart.',
  },
  {
    n: '03',
    title: 'Then any question, any date',
    body: 'Egg stock and coverage, godown value, trader balances, expense breakdown, per-shed and per-batch P&L — computed from the entries that already exist, for the period you ask for. No month-end reconciliation, no waiting for someone to summarise.',
  },
] as const;

export type ScreenName =
  | 'dashboard'
  | 'batch'
  | 'egg-sales'
  | 'planner'
  | 'godown'
  | 'trader-ledger'
  | 'finance'
  | 'pnl';

export const SCREENS: { name: ScreenName; label: string; caption: string }[] = [
  { name: 'dashboard', label: 'Dashboard', caption: 'Today across every shed, in one glance' },
  { name: 'batch', label: 'Batch Details', caption: 'One flock: P&L, operations, health, trends' },
  { name: 'planner', label: 'Egg Planner', caption: 'Bookings measured against expected lay' },
  { name: 'egg-sales', label: 'Egg Sales', caption: 'Loads billed by grade, rate and trader' },
  { name: 'godown', label: 'Godown', caption: 'Ingredient stock, coverage and value' },
  { name: 'trader-ledger', label: 'Trader Ledger', caption: 'Sale, receipt, and the balance left' },
  { name: 'finance', label: 'Finance', caption: 'Income and expense on one ledger' },
  { name: 'pnl', label: 'Farm P&L', caption: 'Revenue against cost for the period' },
];

/**
 * Real captures of the running product (demo workspace), converted for web into
 * /public/screens. `aspect` is height ÷ width, which the panning stage needs to
 * know how far a screenshot can travel inside a frame.
 */
export const SHOTS: Record<ScreenName, { desktop: number; mobile: number }> = {
  dashboard: { desktop: 1.301, mobile: 9.677 },
  batch: { desktop: 0.791, mobile: 4.629 },
  planner: { desktop: 1.232, mobile: 7.071 },
  'egg-sales': { desktop: 0.82, mobile: 3.748 },
  godown: { desktop: 1.122, mobile: 4.869 },
  'trader-ledger': { desktop: 0.791, mobile: 2.948 },
  finance: { desktop: 2.37, mobile: 13.815 },
  pnl: { desktop: 1.018, mobile: 6.058 },
};

export const CAPTION = {
  capture: 'Captured in the product · demo workspace',
  illustrative: 'Illustrative figures',
};

export const PILLARS = [
  {
    index: '01',
    kicker: 'Egg Sales & Planning',
    headline: 'Know what you can sell.',
    href: 'egg-sales',
  },
  { index: '02', kicker: 'Trader Management', headline: 'Every sale has a balance behind it.', href: 'traders' },
  { index: '03', kicker: 'Inventory', headline: 'Know what your farm owns.', href: 'inventory' },
  { index: '04', kicker: 'Farm Finance', headline: 'Know where the money goes.', href: 'finance' },
  { index: '05', kicker: 'Real Farm P&L', headline: 'Know whether the farm is actually making money.', href: 'pnl' },
] as const;

/** Four questions an owner actually asks, and the screen that answers each. */
export const DECISIONS = [
  { question: 'How many eggs can I sell tomorrow?', screen: 'planner' as ScreenName, answer: 'Egg Planner' },
  { question: 'How much stock do I have?', screen: 'godown' as ScreenName, answer: 'Godown' },
  { question: 'Who owes me money?', screen: 'trader-ledger' as ScreenName, answer: 'Trader Ledger' },
  { question: 'Did my farm actually make money?', screen: 'pnl' as ScreenName, answer: 'Farm P&L' },
];

export const FIVE_NUMBERS = [
  { key: 'egg-stock', label: 'Egg Stock', question: 'What can I sell?' },
  { key: 'inventory-value', label: 'Inventory Value', question: 'What do I own?' },
  { key: 'trader-balance', label: 'Trader Balance', question: 'Who owes me?' },
  { key: 'farm-expense', label: 'Farm Expense', question: 'Where is money going?' },
  { key: 'net-pnl', label: 'Net P&L', question: 'Am I making money?' },
];

export const PLANS = [
  {
    name: 'Starter',
    monthly: 999,
    yearly: 9999,
    scope: 'Up to 25,000 birds',
    featured: false,
  },
  {
    name: 'Growth',
    monthly: 1999,
    yearly: 19999,
    scope: '25,001 – 75,000 birds',
    featured: true,
  },
  {
    name: 'Professional',
    monthly: 3999,
    yearly: 39999,
    scope: '75,001 – 1.5 lakh birds',
    featured: false,
  },
  {
    name: 'Enterprise',
    monthly: null,
    yearly: null,
    scope: '1.5 lakh+ birds / multiple farms',
    featured: false,
  },
];

export const PLAN_NOTE = {
  trial: 'First month free',
  trialNote: 'Every plan starts with a full month at no cost — all modules, no charge until it ends.',
  onboarding: 'Optional assisted onboarding',
  /** Never bundled into the monthly or yearly price. */
  onboardingNote: 'Charged separately from the subscription',
} as const;

/* ============================================================
   SAMPLE — one self-consistent set of illustrative figures, used by
   every mockup and visual so the site never shows two different truths.
   These are example numbers for a promotional page, not farm records.
   ============================================================ */

export const SAMPLE = {
  eggs: {
    collected: 18420,
    sold: 17100,
    stock: 6240,
    booked: 15800,
    projected: 18900,
    /** stock + projected lay − already booked */
    available: 9340,
  },
  /** Sale creates a receivable; payment settles it. Never the same row. */
  trader: {
    sale: 300000,
    received: 150000,
    balance: 150000,
    receivables: [
      { name: 'Shirur Traders', balance: 150000 },
      { name: 'Bhidu Egg Depot', balance: 82400 },
      { name: 'Kandwani Poultry', balance: 36900 },
      { name: 'Walk-in (Anonymous)', balance: 0 },
    ],
    receivableTotal: 269300,
  },
  /** qty_kg × avg cost = stock value, exactly. */
  godown: {
    items: [
      { name: 'Maize', qty: 12400, avg: 28.5, value: 353400, coverage: 21 },
      { name: 'Soybean', qty: 8200, avg: 47.2, value: 387040, coverage: 16 },
      { name: 'DDGS', qty: 3100, avg: 26, value: 80600, coverage: 28 },
      { name: 'Layer feed', qty: 14800, avg: 32.4, value: 479520, coverage: 12 },
      { name: 'Medicines & vaccines', qty: 0, avg: 0, value: 124000, coverage: 34 },
    ],
    stockValue: 1424560,
  },
  /** One month of the farm book. Income − expense = net, to the rupee. */
  pnl: {
    eggSales: 792000,
    otherIncome: 54000,
    income: 846000,
    feed: 486000,
    medicine: 62400,
    operations: 128000,
    otherExpense: 56400,
    expense: 732800,
    net: 113200,
  },
  cash: {
    in: 7_36_000,
    out: 6_89_500,
    pockets: [
      { name: 'Farm cash', amount: 184500 },
      { name: 'Bank', amount: 642300 },
    ],
  },
} as const;
