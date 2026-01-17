import type { UnsolvedProblem } from '@/types';

/**
 * XPrize Grand Challenges
 * Source: https://www.xprize.org/competitions
 * These are high-stakes, technology-focused challenges with significant prize pools
 */
export const XPRIZE_CHALLENGES: UnsolvedProblem[] = [
  {
    id: 'xprize-healthspan',
    source: 'xprize',
    domain: 'health',
    title: 'XPRIZE Healthspan',
    description: 'Reverse muscle, cognitive, and immune function decline in aging populations. The challenge focuses on restoring 10+ years of health function in adults aged 65-80.',
    prize_amount: '$101 Million',
    deadline: '2030',
    url: 'https://www.xprize.org/competitions/healthspan',
    tags: ['longevity', 'aging', 'biotech', 'healthcare', 'regenerative medicine']
  },
  {
    id: 'xprize-water-scarcity',
    source: 'xprize',
    domain: 'climate',
    title: 'XPRIZE Water Scarcity',
    description: 'Create solutions for widespread access to desalination and clean water. Focus on decentralized, energy-efficient water purification that can scale to serve billions.',
    prize_amount: '$119 Million',
    deadline: '2030',
    url: 'https://www.xprize.org/competitions',
    tags: ['water', 'desalination', 'sustainability', 'cleantech', 'infrastructure']
  },
  {
    id: 'xprize-quantum',
    source: 'xprize',
    domain: 'ai_safety',
    title: 'XPRIZE Quantum Applications',
    description: 'Develop real-world quantum computing applications for climate modeling, drug discovery, and optimization problems that classical computers cannot solve.',
    prize_amount: '$5 Million',
    deadline: '2027',
    url: 'https://www.xprize.org/competitions/qc-apps',
    tags: ['quantum computing', 'algorithms', 'optimization', 'drug discovery', 'climate modeling']
  },
  {
    id: 'xprize-carbon-removal',
    source: 'xprize',
    domain: 'climate',
    title: 'XPRIZE Carbon Removal',
    description: 'Build scalable solutions to remove CO2 from the atmosphere or oceans. Must demonstrate 1000+ tonnes per year removal with a viable path to gigatonne scale.',
    prize_amount: '$100 Million',
    deadline: '2025',
    url: 'https://www.xprize.org/competitions',
    tags: ['carbon capture', 'climate change', 'direct air capture', 'ocean sequestration']
  },
  {
    id: 'xprize-wildfire',
    source: 'xprize',
    domain: 'climate',
    title: 'XPRIZE Wildfire',
    description: 'Develop autonomous firefighting solutions that can detect, respond to, and suppress wildfires faster and more safely than current methods.',
    prize_amount: '$11 Million',
    deadline: '2025',
    url: 'https://www.xprize.org/competitions',
    tags: ['wildfire', 'autonomous systems', 'drones', 'detection', 'emergency response']
  },
  {
    id: 'xprize-feed-next-billion',
    source: 'xprize',
    domain: 'food_agriculture',
    title: 'XPRIZE Feed the Next Billion',
    description: 'Create alternative proteins (fish or chicken) that match or exceed conventional products in taste, texture, nutrition, and cost at scale.',
    prize_amount: '$15 Million',
    deadline: '2024',
    url: 'https://www.xprize.org/competitions',
    tags: ['alternative protein', 'food tech', 'sustainability', 'cellular agriculture']
  },
  {
    id: 'xprize-rainforest',
    source: 'xprize',
    domain: 'climate',
    title: 'XPRIZE Rainforest',
    description: 'Develop technology to rapidly survey rainforest biodiversity. Solutions should autonomously collect and analyze data on species diversity.',
    prize_amount: '$10 Million',
    deadline: '2024',
    url: 'https://www.xprize.org/competitions',
    tags: ['biodiversity', 'conservation', 'autonomous sensors', 'AI species identification']
  }
];

export function getXPrizeChallenges(domain?: string): UnsolvedProblem[] {
  if (!domain) return XPRIZE_CHALLENGES;
  return XPRIZE_CHALLENGES.filter(c => c.domain === domain);
}
