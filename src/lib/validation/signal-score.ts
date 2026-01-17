import { SavedIdea, Domain, ProblemSource, BusinessModel, Technology } from '@/types';

export interface SignalScoreBreakdown {
  marketSize: {
    score: number;
    maxScore: 25;
    reason: string;
  };
  competition: {
    score: number;
    maxScore: 25;
    reason: string;
  };
  trendMomentum: {
    score: number;
    maxScore: 25;
    reason: string;
  };
  feasibility: {
    score: number;
    maxScore: 25;
    reason: string;
  };
}

export interface SignalScore {
  total: number;
  breakdown: SignalScoreBreakdown;
  recommendations: string[];
}

// Market size estimates by domain (heuristic-based for MVP)
const MARKET_SIZE_SCORES: Record<Domain, number> = {
  climate: 23, // Trillion-dollar market
  health: 24, // Healthcare is massive
  ai_safety: 18, // Emerging but growing
  social_impact: 15, // Hard to monetize
  fintech: 22, // Large addressable market
  edtech: 20, // Growing market
  cybersecurity: 21, // Critical and growing
  food_agriculture: 19, // Essential but fragmented
};

// Competition density by problem source (inverse scoring)
const COMPETITION_SCORES: Record<ProblemSource, number> = {
  xprize: 22, // Grand challenges = less competition
  sdg: 20, // Global problems, moderate competition
  wef: 21, // Strategic risks, emerging space
  yc_rfs: 15, // YC attracts many startups
  gates: 23, // Specific, well-funded niches
};

// Trend momentum by technology
const TREND_SCORES: Record<Technology, number> = {
  ai_ml: 25, // Peak momentum
  blockchain: 15, // Cooling off
  iot: 18, // Steady growth
  mobile_app: 12, // Saturated
  web_platform: 14, // Mature
  ar_vr: 19, // Growing
  biotech: 22, // Strong momentum
  robotics: 20, // Increasing
};

// Technical feasibility by business model + technology combo
const FEASIBILITY_BASE: Record<BusinessModel, number> = {
  b2b_saas: 22, // Well-understood model
  b2c_subscription: 20, // Proven but competitive
  marketplace: 16, // Two-sided, complex
  api_service: 23, // Technically straightforward
  consultancy: 25, // Low technical barrier
  edtech_platform: 18, // Content + tech challenges
  hardware_software: 12, // Manufacturing complexity
  nonprofit_impact: 17, // Funding challenges
};

export function calculateSignalScore(idea: SavedIdea): SignalScore {
  const breakdown: SignalScoreBreakdown = {
    marketSize: calculateMarketSize(idea),
    competition: calculateCompetition(idea),
    trendMomentum: calculateTrendMomentum(idea),
    feasibility: calculateFeasibility(idea),
  };

  const total = 
    breakdown.marketSize.score +
    breakdown.competition.score +
    breakdown.trendMomentum.score +
    breakdown.feasibility.score;

  const recommendations = generateRecommendations(breakdown, total);

  return { total, breakdown, recommendations };
}

function calculateMarketSize(idea: SavedIdea): SignalScoreBreakdown['marketSize'] {
  const domain = idea.domain || 'social_impact';
  const baseScore = MARKET_SIZE_SCORES[domain] || 15;
  
  // Boost for global problems
  const isGlobalProblem = idea.problem_source === 'sdg' || idea.problem_source === 'wef';
  const score = isGlobalProblem ? Math.min(baseScore + 2, 25) : baseScore;

  const reasons: Record<string, string> = {
    climate: 'Climate tech has a multi-trillion dollar addressable market',
    health: 'Healthcare is one of the largest global markets',
    ai_safety: 'Emerging AI governance market with strong growth potential',
    social_impact: 'Impact markets are growing but monetization can be challenging',
    fintech: 'Financial services have massive market opportunity',
    edtech: 'Education technology shows consistent growth',
    cybersecurity: 'Critical infrastructure protection is a high-priority market',
    food_agriculture: 'Essential industry with fragmented opportunities',
  };

  return {
    score,
    maxScore: 25,
    reason: reasons[domain] || 'Market size varies by specific niche',
  };
}

function calculateCompetition(idea: SavedIdea): SignalScoreBreakdown['competition'] {
  const source = idea.problem_source || 'yc_rfs';
  const baseScore = COMPETITION_SCORES[source] || 18;

  // Penalty for saturated domains
  const saturatedDomains: Domain[] = ['fintech', 'edtech'];
  const score = saturatedDomains.includes(idea.domain!)
    ? Math.max(baseScore - 3, 10)
    : baseScore;

  const reasons: Record<string, string> = {
    xprize: 'Grand Challenges attract fewer competitors due to complexity',
    sdg: 'UN Sustainable Development Goals have moderate competition',
    wef: 'World Economic Forum risks are emerging opportunities',
    yc_rfs: 'Y Combinator Requests for Startups attract heavy competition',
    gates: 'Gates Foundation challenges are well-funded but specific',
  };

  return {
    score,
    maxScore: 25,
    reason: reasons[source] || 'Competition density depends on market maturity',
  };
}

function calculateTrendMomentum(idea: SavedIdea): SignalScoreBreakdown['trendMomentum'] {
  const tech = idea.technology || 'web_platform';
  const baseScore = TREND_SCORES[tech] || 15;

  // Boost for AI + climate/health combos
  const isHotCombo = 
    tech === 'ai_ml' && (idea.domain === 'climate' || idea.domain === 'health');
  const score = isHotCombo ? Math.min(baseScore + 2, 25) : baseScore;

  const reasons: Record<string, string> = {
    ai_ml: 'AI/ML is experiencing peak momentum with strong investor interest',
    blockchain: 'Blockchain has cooled from peak hype but remains viable',
    iot: 'IoT shows steady growth in industrial and consumer applications',
    mobile_app: 'Mobile app market is highly saturated',
    web_platform: 'Web platforms are mature with stable demand',
    ar_vr: 'AR/VR is gaining traction with improving hardware',
    biotech: 'Biotech has strong momentum driven by recent breakthroughs',
    robotics: 'Robotics adoption is increasing across industries',
  };

  return {
    score,
    maxScore: 25,
    reason: reasons[tech] || 'Technology trends vary by adoption cycle',
  };
}

function calculateFeasibility(idea: SavedIdea): SignalScoreBreakdown['feasibility'] {
  const model = idea.business_model || 'b2b_saas';
  const tech = idea.technology || 'web_platform';
  const baseScore = FEASIBILITY_BASE[model] || 18;

  // Penalty for hardware + complex models
  const isComplex = tech === 'hardware_software' || tech === 'biotech' || tech === 'robotics';
  const score = isComplex ? Math.max(baseScore - 3, 10) : baseScore;

  const reasons: Record<string, string> = {
    b2b_saas: 'B2B SaaS is a well-understood, capital-efficient model',
    b2c_subscription: 'B2C subscriptions are proven but require user acquisition scale',
    marketplace: 'Marketplaces face chicken-and-egg challenges',
    api_service: 'API businesses have straightforward technical paths',
    consultancy: 'Consultancy has low barriers but scaling challenges',
    edtech_platform: 'EdTech platforms balance content creation and technology',
    hardware_software: 'Hardware adds manufacturing complexity and capital requirements',
    nonprofit_impact: 'Nonprofits face unique funding and sustainability challenges',
  };

  return {
    score,
    maxScore: 25,
    reason: reasons[model] || 'Feasibility depends on execution complexity',
  };
}

function generateRecommendations(
  breakdown: SignalScoreBreakdown,
  total: number
): string[] {
  const recommendations: string[] = [];

  // Overall score recommendations
  if (total >= 80) {
    recommendations.push('🚀 Strong validation signals! This idea has high potential.');
  } else if (total >= 60) {
    recommendations.push('✅ Solid foundation. Focus on validating assumptions with customers.');
  } else if (total < 50) {
    recommendations.push('⚠️ Consider pivoting or refining the core value proposition.');
  }

  // Component-specific recommendations
  if (breakdown.marketSize.score < 15) {
    recommendations.push('💡 Explore adjacent markets to increase addressable opportunity.');
  }

  if (breakdown.competition.score < 15) {
    recommendations.push('🎯 Differentiation is critical - define your unique moat clearly.');
  }

  if (breakdown.trendMomentum.score < 15) {
    recommendations.push('📈 Consider leveraging emerging technologies to capture momentum.');
  }

  if (breakdown.feasibility.score < 15) {
    recommendations.push('🔧 Start with an MVP to validate before heavy technical investment.');
  }

  // Success patterns
  if (breakdown.marketSize.score >= 20 && breakdown.competition.score >= 20) {
    recommendations.push('🎁 Blue ocean opportunity detected - large market, low competition.');
  }

  return recommendations;
}
