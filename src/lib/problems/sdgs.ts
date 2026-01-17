import type { UnsolvedProblem } from '@/types';

/**
 * UN Sustainable Development Goals
 * Source: https://sdgs.un.org/goals
 * 17 Goals to transform our world by 2030
 */
export const SDG_CHALLENGES: UnsolvedProblem[] = [
  {
    id: 'sdg-1-poverty',
    source: 'sdg',
    domain: 'social_impact',
    title: 'SDG 1: No Poverty',
    description: 'End poverty in all its forms everywhere. Over 700 million people still live in extreme poverty. Create solutions for financial inclusion, job creation, and social protection.',
    url: 'https://sdgs.un.org/goals/goal1',
    tags: ['poverty', 'microfinance', 'financial inclusion', 'social protection', 'economic empowerment']
  },
  {
    id: 'sdg-2-hunger',
    source: 'sdg',
    domain: 'food_agriculture',
    title: 'SDG 2: Zero Hunger',
    description: 'End hunger, achieve food security and improved nutrition, promote sustainable agriculture. 828 million people face hunger globally.',
    url: 'https://sdgs.un.org/goals/goal2',
    tags: ['hunger', 'food security', 'sustainable agriculture', 'nutrition', 'farming technology']
  },
  {
    id: 'sdg-3-health',
    source: 'sdg',
    domain: 'health',
    title: 'SDG 3: Good Health and Well-being',
    description: 'Ensure healthy lives and promote well-being for all ages. Reduce maternal mortality, end epidemics, achieve universal health coverage.',
    url: 'https://sdgs.un.org/goals/goal3',
    tags: ['healthcare', 'telemedicine', 'maternal health', 'disease prevention', 'mental health']
  },
  {
    id: 'sdg-4-education',
    source: 'sdg',
    domain: 'edtech',
    title: 'SDG 4: Quality Education',
    description: 'Ensure inclusive and equitable quality education and promote lifelong learning. 244 million children and youth are still out of school.',
    url: 'https://sdgs.un.org/goals/goal4',
    tags: ['education', 'literacy', 'vocational training', 'digital learning', 'teacher training']
  },
  {
    id: 'sdg-6-water',
    source: 'sdg',
    domain: 'climate',
    title: 'SDG 6: Clean Water and Sanitation',
    description: 'Ensure availability and sustainable management of water and sanitation for all. 2 billion people lack safely managed drinking water.',
    url: 'https://sdgs.un.org/goals/goal6',
    tags: ['water access', 'sanitation', 'water treatment', 'hygiene', 'wastewater management']
  },
  {
    id: 'sdg-7-energy',
    source: 'sdg',
    domain: 'climate',
    title: 'SDG 7: Affordable and Clean Energy',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all. 675 million people still lack access to electricity.',
    url: 'https://sdgs.un.org/goals/goal7',
    tags: ['renewable energy', 'solar', 'energy access', 'efficiency', 'clean cooking']
  },
  {
    id: 'sdg-8-work',
    source: 'sdg',
    domain: 'fintech',
    title: 'SDG 8: Decent Work and Economic Growth',
    description: 'Promote sustained, inclusive economic growth, full employment and decent work. Address youth unemployment and informal economy challenges.',
    url: 'https://sdgs.un.org/goals/goal8',
    tags: ['employment', 'entrepreneurship', 'labor rights', 'economic growth', 'job creation']
  },
  {
    id: 'sdg-9-infrastructure',
    source: 'sdg',
    domain: 'fintech',
    title: 'SDG 9: Industry, Innovation, Infrastructure',
    description: 'Build resilient infrastructure, promote inclusive industrialization and foster innovation. Bridge the digital divide.',
    url: 'https://sdgs.un.org/goals/goal9',
    tags: ['infrastructure', 'manufacturing', 'innovation', 'internet access', 'industrialization']
  },
  {
    id: 'sdg-11-cities',
    source: 'sdg',
    domain: 'climate',
    title: 'SDG 11: Sustainable Cities',
    description: 'Make cities inclusive, safe, resilient and sustainable. Address urbanization challenges, housing, transport, and air quality.',
    url: 'https://sdgs.un.org/goals/goal11',
    tags: ['urban planning', 'smart cities', 'transport', 'housing', 'air quality']
  },
  {
    id: 'sdg-12-consumption',
    source: 'sdg',
    domain: 'climate',
    title: 'SDG 12: Responsible Consumption',
    description: 'Ensure sustainable consumption and production patterns. Reduce waste, promote recycling, and create circular economy solutions.',
    url: 'https://sdgs.un.org/goals/goal12',
    tags: ['circular economy', 'recycling', 'sustainable packaging', 'waste reduction', 'supply chain']
  },
  {
    id: 'sdg-13-climate',
    source: 'sdg',
    domain: 'climate',
    title: 'SDG 13: Climate Action',
    description: 'Take urgent action to combat climate change and its impacts. Strengthen resilience, integrate climate measures, improve education.',
    url: 'https://sdgs.un.org/goals/goal13',
    tags: ['climate change', 'emissions', 'adaptation', 'resilience', 'carbon footprint']
  },
  {
    id: 'sdg-16-peace',
    source: 'sdg',
    domain: 'social_impact',
    title: 'SDG 16: Peace, Justice, Strong Institutions',
    description: 'Promote peaceful societies, provide access to justice, and build accountable institutions. Combat corruption and organized crime.',
    url: 'https://sdgs.un.org/goals/goal16',
    tags: ['governance', 'transparency', 'anti-corruption', 'justice', 'civic tech']
  }
];

export function getSDGChallenges(domain?: string): UnsolvedProblem[] {
  if (!domain) return SDG_CHALLENGES;
  return SDG_CHALLENGES.filter(c => c.domain === domain);
}
