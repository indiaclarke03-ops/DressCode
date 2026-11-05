import type { ProjectType } from '@/tokens/types';

/** Brand names and subjects for each project type. All fictional, all plausible. */
export const SCENE_NAMES: Partial<Record<ProjectType, { brand: string; topic: string }>> = {
  dashboard: { brand: 'Gridline', topic: 'Energy overview' },
  internal: { brand: 'Gridline Ops', topic: 'Network operations' },
  simulator: { brand: 'Climate Paths', topic: 'Carbon price scenario' },
  calculator: { brand: 'Homeheat', topic: 'Heat pump savings' },
  map: { brand: 'Atlas of Power', topic: 'Renewable electricity share' },
  app: { brand: 'Northwind', topic: 'Workspace settings' },
  mobile: { brand: 'Northwind', topic: 'Account settings' },
  form: { brand: 'Civic Pulse', topic: 'Transit rider survey' },
  chat: { brand: 'Routewise', topic: 'Supply chain assistant' },
  marketing: { brand: 'Halcyon Solar', topic: 'Solar for every rooftop' },
  event: { brand: 'Transit Futures 2027', topic: 'Three days on how cities move' },
  ecommerce: { brand: 'Fieldstone', topic: 'Tools for the home workshop' },
  presentation: { brand: 'State of the Grid', topic: 'Ten charts on energy in 2026' },
  game: { brand: 'Signal Rush', topic: 'Keep the city running' },
  editorial: { brand: 'The Ledger', topic: 'The long road to a battery' },
  datastory: { brand: 'Undercurrent', topic: 'Follow one lithium shipment' },
  report: { brand: 'Policy Brief 14', topic: 'Securing battery supply after 2030' },
  explainer: { brand: 'Heat Lab', topic: 'How a heat pump works' },
  docs: { brand: 'Transit Kit', topic: 'Quick start' },
  portfolio: { brand: 'Ines Okafor', topic: 'Selected work' },
  other: { brand: 'Northwind', topic: 'Your project' },
};

export interface MarketingCopy {
  lede: string;
  cta: string;
  hint: string;
  features: { title: string; text: string }[];
  plansTitle: string;
  plans: { name: string; price: string; detail: string }[];
  logosLabel: string;
  logos: string[];
}

const SOLAR: MarketingCopy = {
  lede: 'Panels, install and a 25-year warranty for one monthly price. No deposit, no surprises.',
  cta: 'Get a quote',
  hint: 'Takes two minutes',
  features: [
    { title: 'Priced before we visit', text: 'Send a photo of your roof and get a fixed quote within a day.' },
    { title: 'Fitted in a single day', text: 'Our own crews install, so there are no subcontractors to chase.' },
    { title: 'Watched for 25 years', text: 'We monitor output and fix faults before you notice them.' },
  ],
  plansTitle: 'Plans',
  plans: [
    { name: 'Starter', price: '£39', detail: '3 kW system, per month' },
    { name: 'Household', price: '£64', detail: '6 kW with battery, per month' },
    { name: 'Whole home', price: '£92', detail: '10 kW with charger, per month' },
  ],
  logosLabel: 'Trusted by',
  logos: ['Cedar Homes', 'Brightwater', 'Ostler & Co', 'Fennel Housing'],
};

export const MARKETING_COPY: Partial<Record<ProjectType, MarketingCopy>> = {
  event: {
    lede: 'Planners, operators and riders in one room. 14 to 16 April at Leeds Corn Exchange.',
    cta: 'Book your place',
    hint: 'Early rates end 31 January',
    features: [
      { title: 'Forty talks', text: 'From tram timetables to bus lane politics, all under thirty minutes.' },
      { title: 'Site visits', text: 'Ride the new depot tour and walk the Holbeck interchange build.' },
      { title: 'Open workshops', text: 'Bring a real network problem and leave with three ways forward.' },
    ],
    plansTitle: 'Tickets',
    plans: [
      { name: 'One day', price: '£120', detail: 'Any single day' },
      { name: 'Full pass', price: '£290', detail: 'All three days' },
      { name: 'Student', price: '£45', detail: 'All three days, with ID' },
    ],
    logosLabel: 'Partners',
    logos: ['West Yorkshire Transit', 'Rail Forum', 'City Lab', 'Mobility Trust'],
  },
  presentation: {
    lede: 'Demand, prices and outages in ten charts, from the annual review of the grid.',
    cta: 'Start the tour',
    hint: 'Ten slides, five minutes',
    features: [
      { title: 'Demand is back', text: 'Electric heating and vehicles reversed a decade of decline.' },
      { title: 'Prices have eased', text: 'Wholesale power fell for the third year running.' },
      { title: 'The grid is the limit', text: 'New connections now wait an average of five years.' },
    ],
    plansTitle: 'Chapters',
    plans: [
      { name: 'Demand', price: '01', detail: 'Charts 1 to 3' },
      { name: 'Prices', price: '02', detail: 'Charts 4 to 7' },
      { name: 'Networks', price: '03', detail: 'Charts 8 to 10' },
    ],
    logosLabel: 'Data from',
    logos: ['National Grid Open Data', 'Ember', 'Eurostat', 'Ofgem'],
  },
  game: {
    lede: 'Reroute power, trains and water as the storm hits. How long can you keep the lights on?',
    cta: 'Play now',
    hint: 'Free in your browser',
    features: [
      { title: 'Short rounds', text: 'Every game lasts about three minutes, and no two storms match.' },
      { title: 'Daily city', text: 'Everyone gets the same map each day, so scores are fair.' },
      { title: 'Plays anywhere', text: 'Works with a mouse, a keyboard or a thumb.' },
    ],
    plansTitle: 'Today',
    plans: [
      { name: 'Best score', price: '8,420', detail: 'Held for 6 minutes' },
      { name: 'Your rank', price: '#312', detail: 'Out of 12,804 players' },
      { name: 'Streak', price: '5', detail: 'Days in a row' },
    ],
    logosLabel: 'Featured on',
    logos: ['Playfield', 'Indie Weekly', 'Browser Arcade', 'Pocket Reviews'],
  },
  ecommerce: {
    ...SOLAR,
    lede: 'Hand tools made to last a lifetime, and sold by people who use them.',
    cta: 'Shop the range',
    plansTitle: 'Shop',
    features: [
      { title: 'Made to be sharpened', text: 'Hardened steel that holds an edge for years, not months.' },
      { title: 'Free returns', text: 'Use it for 60 days. If it is not right, send it back.' },
      { title: 'Repairs for life', text: 'Handles and fittings replaced at cost, for as long as we trade.' },
    ],
    logosLabel: 'As seen in',
    logos: ['Workshop Monthly', 'Fine Joinery', 'The Makers', 'Timber Press'],
  },
};

export function marketingCopy(projectType: ProjectType): MarketingCopy {
  return MARKETING_COPY[projectType] ?? SOLAR;
}

export function sceneName(projectType: ProjectType): { brand: string; topic: string } {
  return SCENE_NAMES[projectType] ?? { brand: 'Northwind', topic: 'Your project' };
}
