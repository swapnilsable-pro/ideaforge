import { SavedIdea, Technology, BusinessModel, Domain } from '@/types';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Risk {
  title: string;
  description: string;
  level: RiskLevel;
  category: 'skill' | 'market' | 'regulatory' | 'timeline';
  mitigation: string;
}

export interface RiskAnalysis {
  risks: Risk[];
  overallRisk: RiskLevel;
  estimatedMvpWeeks: number;
  researchedAt: string;
}

// Technology complexity ratings
const TECH_COMPLEXITY: Record<Technology, number> = {
  ai_ml: 8,
  blockchain: 9,
  iot: 7,
  mobile_app: 4,
  web_platform: 3,
  ar_vr: 8,
  biotech: 10,
  robotics: 9,
};

// Business model execution difficulty
const MODEL_DIFFICULTY: Record<BusinessModel, number> = {
  b2b_saas: 5,
  b2c_subscription: 6,
  marketplace: 8,
  api_service: 4,
  consultancy: 3,
  edtech_platform: 6,
  hardware_software: 9,
  nonprofit_impact: 7,
};

// Saturated market combinations
const SATURATED_MARKETS = [
  { domain: 'edtech', model: 'b2c_subscription' },
  { domain: 'fintech', model: 'b2b_saas' },
  { domain: 'social_impact', model: 'nonprofit_impact' },
];

// Regulated domains
const REGULATED_DOMAINS: Domain[] = ['health', 'fintech'];

export function analyzeRisks(idea: SavedIdea): RiskAnalysis {
  const risks: Risk[] = [];
  
  // 1. Skill Gap Analysis
  const techComplexity = TECH_COMPLEXITY[idea.technology || 'web_platform'];
  if (techComplexity >= 7) {
    risks.push({
      title: 'High Technical Complexity',
      description: `${idea.technology} requires specialized skills in machine learning, algorithms, and infrastructure.`,
      level: techComplexity >= 9 ? 'high' : 'medium',
      category: 'skill',
      mitigation: 'Consider partnering with technical co-founder or hiring specialized talent early.',
    });
  }

  if (idea.technology === 'blockchain' || idea.technology === 'biotech') {
    risks.push({
      title: 'Niche Technical Expertise Required',
      description: `${idea.technology} talent is scarce and expensive. Building in-house will be challenging.`,
      level: 'high',
      category: 'skill',
      mitigation: 'Look for advisors or consultants with domain expertise to validate your approach.',
    });
  }

  // 2. Market Saturation
  const isSaturated = SATURATED_MARKETS.some(
    m => m.domain === idea.domain && m.model === idea.business_model
  );

  if (isSaturated) {
    risks.push({
      title: 'Saturated Market',
      description: `${idea.domain} + ${idea.business_model} is highly competitive with many established players.`,
      level: 'high',
      category: 'market',
      mitigation: 'Focus on a specific niche or unique differentiation. Consider pivoting business model.',
    });
  }

  const modelDifficulty = MODEL_DIFFICULTY[idea.business_model || 'b2b_saas'];
  if (modelDifficulty >= 7) {
    risks.push({
      title: 'Complex Business Model',
      description: `${idea.business_model} requires managing multiple stakeholders and complex operations.`,
      level: modelDifficulty >= 8 ? 'high' : 'medium',
      category: 'market',
      mitigation: 'Start with a simplified version focusing on one side of the market first.',
    });
  }

  // 3. Regulatory Risks
  if (REGULATED_DOMAINS.includes(idea.domain!)) {
    risks.push({
      title: 'Regulatory Compliance Required',
      description: `${idea.domain} is heavily regulated. You'll need legal counsel and compliance infrastructure.`,
      level: 'high',
      category: 'regulatory',
      mitigation: 'Budget for legal expenses early. Consider starting in a less regulated adjacent market.',
    });
  }

  if (idea.domain === 'health' && idea.technology === 'ai_ml') {
    risks.push({
      title: 'FDA/Medical Device Regulations',
      description: 'AI in healthcare may require FDA approval, clinical trials, and extensive documentation.',
      level: 'high',
      category: 'regulatory',
      mitigation: 'Consult with regulatory experts before building. Consider non-diagnostic use cases first.',
    });
  }

  if (idea.technology === 'blockchain' && idea.domain === 'fintech') {
    risks.push({
      title: 'Cryptocurrency Regulations',
      description: 'Crypto regulations vary by country and are rapidly changing. High legal uncertainty.',
      level: 'high',
      category: 'regulatory',
      mitigation: 'Stay updated on regulatory changes. Consider non-crypto blockchain applications.',
    });
  }

  // 4. Timeline Estimation
  const baseWeeks = 12; // 3 months baseline
  const techMultiplier = techComplexity / 5;
  const modelMultiplier = modelDifficulty / 5;
  const estimatedMvpWeeks = Math.round(baseWeeks * techMultiplier * modelMultiplier);

  if (estimatedMvpWeeks > 24) {
    risks.push({
      title: 'Extended Development Timeline',
      description: `Estimated MVP timeline: ${estimatedMvpWeeks} weeks (~${Math.round(estimatedMvpWeeks / 4)} months).`,
      level: 'medium',
      category: 'timeline',
      mitigation: 'Break into smaller milestones. Launch a proof-of-concept first to validate core assumptions.',
    });
  }

  // Calculate overall risk
  const riskLevels = risks.map(r => r.level);
  const highRisks = riskLevels.filter(l => l === 'high').length;
  const mediumRisks = riskLevels.filter(l => l === 'medium').length;

  let overallRisk: RiskLevel = 'low';
  if (highRisks >= 2 || (highRisks === 1 && mediumRisks >= 2)) {
    overallRisk = 'high';
  } else if (highRisks === 1 || mediumRisks >= 2) {
    overallRisk = 'medium';
  }

  // Add a positive message if no risks
  if (risks.length === 0) {
    risks.push({
      title: 'Low Risk Profile',
      description: 'This idea has a relatively straightforward path to market with manageable challenges.',
      level: 'low',
      category: 'market',
      mitigation: 'Focus on execution and customer validation. Move fast!',
    });
  }

  return {
    risks,
    overallRisk,
    estimatedMvpWeeks,
    researchedAt: new Date().toISOString(),
  };
}
