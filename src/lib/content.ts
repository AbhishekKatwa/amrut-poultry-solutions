/* ============================================================
   Site copy and product facts in one place.
   Company = Amrut Poultry Solutions.  Product = Amrut Poultry Management.
   Nothing here invents history, customers, counts or capabilities.
   Figures inside product mockups are illustrative sample data.
   ============================================================ */

export const BRAND = {
  company: 'Amrut Poultry Solutions',
  product: 'Amrut Poultry Management',
  positioning: 'Technology for modern poultry businesses.',
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
  trial: '30-day full-access trial',
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
