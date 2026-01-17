import { GeneratedIdea, UserProfile, IkigaiScore, IdeaFit, Technology, BusinessModel } from '@/types';

/**
 * Calculate Ikigai-based fit score (0-100)
 * Measures how well an idea aligns with:
 * 1. Love (Passions) - 25pts
 * 2. Good At (Skills) - 25pts
 * 3. World Needs (Market) - 25pts
 * 4. Paid For (Monetization) - 25pts
 */
export function calculateIkigaiScore(
  idea: GeneratedIdea,
  profile: UserProfile
): IkigaiScore {
  const loveScore = matchPassions(idea, profile.passions);
  const skillScore = matchSkills(idea.technology, profile.skills, profile.expertise);
  const needScore = matchMarketNeeds(idea, profile.pain_points, profile.market_needs);
  const moneyScore = matchMonetization(idea.business_model, profile.monetization_prefs);

  return {
    love: loveScore,
    good_at: skillScore,
    world_needs: needScore,
    paid_for: moneyScore,
    total: loveScore + skillScore + needScore + moneyScore,
  };
}

/**
 * Calculate comprehensive fit analysis
 */
export function calculateIdeaFit(
  idea: GeneratedIdea,
  profile: UserProfile
): IdeaFit {
  const ikigai = calculateIkigaiScore(idea, profile);
  
  // Skill gap analysis
  const requiredSkills = [idea.technology];
  const ownedSkills = profile.skills;
  const skillGap = requiredSkills.filter(s => !ownedSkills.includes(s));
  const skillMatchPercentage = ((ownedSkills.filter(s => requiredSkills.includes(s)).length / requiredSkills.length) * 100) || 0;

  // Network leverage
  const networkAdvantages = identifyNetworkLeverage(idea, profile.network, profile.expertise);
  
  // Resource feasibility
  const feasibility = assessResourceFeasibility(idea, profile.resources);

  return {
    overall_fit: ikigai.total,
    skill_match: {
      required: requiredSkills,
      owned: ownedSkills.filter(s => requiredSkills.includes(s)),
      gap: skillGap as Technology[],
      match_percentage: skillMatchPercentage,
    },
    network_leverage: networkAdvantages,
    resource_feasibility: feasibility,
    ikigai,
  };
}

// Helper: Match passions (keywords in idea title/description vs passion list)
function matchPassions(idea: GeneratedIdea, passions: string[]): number {
  if (passions.length === 0) return 12; // Neutral score if no passions set

  const ideaText = `${idea.title} ${idea.problem_description} ${idea.solution_description}`.toLowerCase();
  const matches = passions.filter(passion => 
    ideaText.includes(passion.toLowerCase())
  );

  // 25 points max, scaled by match percentage
  return Math.min(Math.round((matches.length / passions.length) * 25), 25);
}

// Helper: Match skills (tech + domain expertise)
function matchSkills(
  ideaTech: Technology | undefined,
  skills: Technology[],
  expertise: string[]
): number {
  if (skills.length === 0 && expertise.length === 0) return 12;

  let score = 0;

  // Tech skill match (15 points)
  if (ideaTech && skills.includes(ideaTech)) {
    score += 15;
  } else if (skills.length > 0) {
    score += 7; // Partial credit for having some skills
  }

  // Domain expertise match (10 points)
  // Check if idea domain aligns with expertise
  if (expertise.length > 0) {
    score += 10; // Simplified: give full if they have any expertise
  }

  return Math.min(score, 25);
}

// Helper: Match market needs
function matchMarketNeeds(
  idea: GeneratedIdea,
  painPoints: string[],
  marketNeeds: string[]
): number {
  if (painPoints.length === 0 && marketNeeds.length === 0) return 12;

  const ideaText = `${idea.problem_title} ${idea.problem_description}`.toLowerCase();
  
  const painMatches = painPoints.filter(pain => 
    ideaText.includes(pain.toLowerCase())
  );
  
  const needMatches = marketNeeds.filter(need =>
    ideaText.includes(need.toLowerCase())
  );

  const totalMatches = painMatches.length + needMatches.length;
  const totalItems = painPoints.length + marketNeeds.length;

  return Math.min(Math.round((totalMatches / totalItems) * 25), 25);
}

// Helper: Match monetization preference
function matchMonetization(
  ideaModel: BusinessModel | undefined,
  prefs: BusinessModel[]
): number {
  if (prefs.length === 0) return 12;

  // Perfect match: 25 points
  if (ideaModel && prefs.includes(ideaModel)) {
    return 25;
  }

  // Partial match for similar models
  const similarModels: Record<BusinessModel, BusinessModel[]> = {
    b2b_saas: ['api_service'],
    b2c_subscription: ['edtech_platform'],
    marketplace: [],
    api_service: ['b2b_saas'],
    consultancy: [],
    edtech_platform: ['b2c_subscription'],
    hardware_software: [],
    nonprofit_impact: [],
  };

  if (ideaModel && prefs.some(pref => similarModels[pref]?.includes(ideaModel))) {
    return 15;
  }

  return 5; // Minimum baseline
}

// Helper: Identify network leverage opportunities
function identifyNetworkLeverage(
  idea: GeneratedIdea,
  network: UserProfile['network'],
  expertise: string[]
): { useful: string[]; critical: string[] } {
  const useful: string[] = [];
  const critical: string[] = [];

  // B2B ideas benefit from enterprise contacts
  if (idea.business_model === 'b2b_saas' && network.enterprise_contacts) {
    useful.push('Enterprise contacts for customer discovery');
  }

  // Technical co-founders needed for complex tech
  if (['ai_ml', 'blockchain', 'biotech'].includes(idea.technology || '') && network.technical_cofounders) {
    useful.push('Technical co-founders available');
  }

  // Domain experts critical for regulated industries
  if (network.domain_experts && network.domain_experts.length > 0) {
    const ideaText = `${idea.title} ${idea.problem_description}`.toLowerCase();
    const relevantExperts = network.domain_experts.filter(expert =>
      ideaText.includes(expert.toLowerCase())
    );
    
    if (relevantExperts.length > 0) {
      critical.push(`${relevantExperts.join(', ')} network provides unique advantage`);
    }
  }

  // Investors useful for capital-intensive ideas
  if (idea.business_model === 'hardware_software' && network.investors) {
    useful.push('Investor network for fundraising');
  }

  return { useful, critical };
}

// Helper: Assess resource feasibility
function assessResourceFeasibility(
  idea: GeneratedIdea,
  resources: UserProfile['resources']
): { timeline_estimate: string; budget_fit: boolean } {
  // Complexity-based timeline
  const techComplexity: Record<Technology, number> = {
    ai_ml: 9,
    blockchain: 9,
    biotech: 10,
    robotics: 9,
    ar_vr: 8,
    iot: 7,
    mobile_app: 4,
    web_platform: 3,
  };

  const complexity = idea.technology ? techComplexity[idea.technology] || 5 : 5;
  const timeMultiplier = resources.time === 'full_time' ? 1 : 
                         resources.time === 'part_time' ? 1.5 : 2;

  const baseWeeks = complexity * 4; // 4 weeks per complexity point
  const estimatedWeeks = Math.round(baseWeeks * timeMultiplier);
  
  const timeline_estimate = resources.time === 'full_time'
    ? `${estimatedWeeks} weeks (full-time)`
    : `${estimatedWeeks} weeks (${resources.time})`;

  // Budget fit
  const capitalIntensive = ['hardware_software', 'marketplace', 'biotech'].includes(idea.business_model || '');
  const budget_fit = resources.budget === 'well_funded' || !capitalIntensive;

  return { timeline_estimate, budget_fit };
}
