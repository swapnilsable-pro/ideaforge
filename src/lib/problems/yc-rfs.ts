import type { UnsolvedProblem } from '@/types';

/**
 * Y Combinator Requests for Startups
 * Source: https://www.ycombinator.com/rfs
 * What investors actively want to fund - the investor's wishlist
 */
export const YC_RFS_CHALLENGES: UnsolvedProblem[] = [
  {
    id: 'yc-government-efficiency',
    source: 'yc_rfs',
    domain: 'fintech',
    title: 'Government Efficiency Software',
    description: 'Software to automate government administrative tasks. "TurboTax for Government Procurement." Reduce bureaucracy, improve citizen services, modernize legacy systems.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['govtech', 'automation', 'procurement', 'civic tech', 'bureaucracy']
  },
  {
    id: 'yc-stablecoins',
    source: 'yc_rfs',
    domain: 'fintech',
    title: 'Stablecoins 2.0 for B2B Payments',
    description: 'B2B cross-border payment platforms using stablecoins to bypass volatile local currencies. Reduce friction in international trade and remittances.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['stablecoins', 'cross-border payments', 'B2B', 'remittances', 'blockchain']
  },
  {
    id: 'yc-smb-security',
    source: 'yc_rfs',
    domain: 'cybersecurity',
    title: 'SMB Security via MSPs',
    description: 'Enterprise-grade security for Small and Medium Businesses, delivered via Managed Service Providers. Bundle security with existing IT services.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['SMB security', 'MSP', 'bundled services', 'endpoint protection', 'compliance']
  },
  {
    id: 'yc-blue-collar-training',
    source: 'yc_rfs',
    domain: 'edtech',
    title: 'Blue Collar Training Platforms',
    description: 'Modern vocational training for electricians, plumbers, welders, HVAC techs. AR/VR training, skills certification, job placement. Address the massive skilled trades gap.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['vocational training', 'skilled trades', 'AR training', 'certification', 'apprenticeship']
  },
  {
    id: 'yc-ai-agents-enterprise',
    source: 'yc_rfs',
    domain: 'ai_safety',
    title: 'AI Agents for Enterprise',
    description: 'Reliable AI agents that can complete complex multi-step tasks in enterprise environments. Focus on accuracy, auditability, and integration with existing workflows.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['AI agents', 'enterprise AI', 'workflow automation', 'reliability', 'orchestration']
  },
  {
    id: 'yc-defense-tech',
    source: 'yc_rfs',
    domain: 'cybersecurity',
    title: 'Defense Technology',
    description: 'Modern defense and national security technology. Autonomous systems, cybersecurity, space, advanced manufacturing for defense applications.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['defense tech', 'national security', 'autonomous systems', 'space', 'manufacturing']
  },
  {
    id: 'yc-climate-adaptation',
    source: 'yc_rfs',
    domain: 'climate',
    title: 'Climate Adaptation Infrastructure',
    description: 'Infrastructure and software for adapting to climate change. Flood management, heat resilience, drought response, insurance, and prediction systems.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['climate adaptation', 'resilience', 'infrastructure', 'prediction', 'insurance']
  },
  {
    id: 'yc-vertical-saas',
    source: 'yc_rfs',
    domain: 'fintech',
    title: 'Vertical SaaS for Underserved Industries',
    description: 'Purpose-built software for industries still using paper: construction, logistics, agriculture, manufacturing. Full-stack solutions with payments, lending, and operations.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['vertical SaaS', 'construction', 'logistics', 'agriculture', 'digitization']
  },
  {
    id: 'yc-healthcare-ai',
    source: 'yc_rfs',
    domain: 'health',
    title: 'AI in Healthcare Administration',
    description: 'AI to reduce healthcare administrative burden. Prior authorization automation, billing optimization, documentation, and patient communication.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['healthcare AI', 'prior auth', 'billing', 'documentation', 'administrative burden']
  },
  {
    id: 'yc-nuclear-energy',
    source: 'yc_rfs',
    domain: 'climate',
    title: 'Nuclear Energy Renaissance',
    description: 'Small modular reactors, advanced nuclear fuels, fusion, and nuclear supply chain. Address the growing energy demand from AI data centers.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['nuclear', 'SMR', 'fusion', 'clean energy', 'data centers']
  },
  {
    id: 'yc-developer-tools',
    source: 'yc_rfs',
    domain: 'ai_safety',
    title: 'AI Developer Tools',
    description: 'Tools for developers building with AI. Testing, monitoring, debugging, deployment, and observability for LLM applications.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['developer tools', 'LLMOps', 'testing', 'monitoring', 'observability']
  },
  {
    id: 'yc-robotics-warehouse',
    source: 'yc_rfs',
    domain: 'food_agriculture',
    title: 'Robotics for Warehouse and Agriculture',
    description: 'Autonomous robots for pick-and-pack, harvesting, and logistics. Address labor shortages in warehousing and farming with reliable, affordable automation.',
    url: 'https://www.ycombinator.com/rfs',
    tags: ['robotics', 'warehouse', 'agriculture', 'automation', 'labor shortage']
  }
];

export function getYCRFSChallenges(domain?: string): UnsolvedProblem[] {
  if (!domain) return YC_RFS_CHALLENGES;
  return YC_RFS_CHALLENGES.filter(c => c.domain === domain);
}
