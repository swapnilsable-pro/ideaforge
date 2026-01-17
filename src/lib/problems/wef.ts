import type { UnsolvedProblem } from '@/types';

/**
 * World Economic Forum Global Risks
 * Source: https://www.weforum.org/publications/global-risks-report-2025/
 * Annual report on top global risks for defensive entrepreneurship
 */
export const WEF_RISKS: UnsolvedProblem[] = [
  {
    id: 'wef-misinformation',
    source: 'wef',
    domain: 'ai_safety',
    title: 'Misinformation and Disinformation',
    description: 'Ranked #1 short-term global risk. AI-generated content floods social media, eroding trust in democratic institutions and corporate communications. Deepfakes threaten identity security.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['misinformation', 'deepfakes', 'content verification', 'trust', 'media literacy']
  },
  {
    id: 'wef-extreme-weather',
    source: 'wef',
    domain: 'climate',
    title: 'Extreme Weather Events',
    description: 'Ranked #2 global risk. Increasing frequency and severity of floods, droughts, heatwaves, and storms. Need for early warning systems, infrastructure resilience, and disaster response.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['extreme weather', 'disaster preparedness', 'climate adaptation', 'insurance', 'infrastructure']
  },
  {
    id: 'wef-cyber-insecurity',
    source: 'wef',
    domain: 'cybersecurity',
    title: 'Cyber Insecurity and AI Gap',
    description: '66% of executives see AI transforming security, but only 37% feel prepared. "Shadow AI"—employees using unauthorized AI tools—creates massive vulnerabilities. SMBs are particularly exposed.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['cybersecurity', 'shadow AI', 'enterprise security', 'vulnerability', 'AI governance']
  },
  {
    id: 'wef-societal-polarization',
    source: 'wef',
    domain: 'social_impact',
    title: 'Societal Polarization',
    description: 'Growing divisions within societies threaten social cohesion. Political polarization, economic inequality, and culture wars are fragmenting communities globally.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['polarization', 'social cohesion', 'community building', 'civic engagement', 'dialogue']
  },
  {
    id: 'wef-cost-of-living',
    source: 'wef',
    domain: 'fintech',
    title: 'Cost of Living Crisis',
    description: 'Inflation and rising costs strain households globally. Need for solutions in affordable housing, food security, and financial wellness tools.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['inflation', 'affordability', 'financial wellness', 'budgeting', 'cost optimization']
  },
  {
    id: 'wef-biodiversity-loss',
    source: 'wef',
    domain: 'climate',
    title: 'Biodiversity Loss and Ecosystem Collapse',
    description: 'Critical long-term risk. 1 million species at risk of extinction. Ecosystem services worth $44 trillion annually are under threat. Need for conservation, restoration, and sustainable practices.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['biodiversity', 'conservation', 'ecosystem restoration', 'sustainable land use', 'species protection']
  },
  {
    id: 'wef-labor-shortage',
    source: 'wef',
    domain: 'edtech',
    title: 'Green Transition Labor Shortage',
    description: 'AI data centers and green energy grids stall due to lack of skilled tradespeople. Major shortage of electricians, welders, HVAC techs, and specialized technicians.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['labor shortage', 'vocational training', 'green jobs', 'trades', 'workforce development']
  },
  {
    id: 'wef-critical-infrastructure',
    source: 'wef',
    domain: 'cybersecurity',
    title: 'Critical Infrastructure Attacks',
    description: 'Growing threats to power grids, water systems, hospitals, and transportation. State-sponsored attacks and ransomware target essential services.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['critical infrastructure', 'ransomware', 'OT security', 'resilience', 'backup systems']
  },
  {
    id: 'wef-mental-health',
    source: 'wef',
    domain: 'health',
    title: 'Mental Health Crisis',
    description: 'Global mental health deterioration, especially among youth. Social media, isolation, and economic stress drive anxiety and depression. Massive treatment gap.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['mental health', 'therapy', 'digital wellness', 'youth', 'workplace wellbeing']
  },
  {
    id: 'wef-ai-governance',
    source: 'wef',
    domain: 'ai_safety',
    title: 'AI Governance Gap',
    description: 'Rapid AI advancement outpaces regulatory frameworks. Need for responsible AI development, bias detection, transparency tools, and ethical guidelines.',
    url: 'https://www.weforum.org/publications/global-risks-report-2025/',
    tags: ['AI governance', 'ethics', 'bias', 'transparency', 'responsible AI', 'regulation']
  }
];

export function getWEFRisks(domain?: string): UnsolvedProblem[] {
  if (!domain) return WEF_RISKS;
  return WEF_RISKS.filter(c => c.domain === domain);
}
