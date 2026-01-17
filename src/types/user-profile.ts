// MVP3: User Inventory Types for Context-Aware Generation

export interface UserNetwork {
  investors?: boolean;
  technical_cofounders?: boolean;
  domain_experts?: string[];
  enterprise_contacts?: boolean;
}

export interface UserResources {
  budget?: 'bootstrap' | 'seed_funded' | 'well_funded';
  time?: 'nights_weekends' | 'part_time' | 'full_time';
  unique_access?: string[];
}

export interface UserProfile {
  id: string;
  user_id: string;
  
  // Who am I?
  skills: Technology[];
  experience: string[];
  expertise: Domain[];
  
  // What do I know?
  industries: string[];
  pain_points: string[];
  
  // Who do I know?
  network: UserNetwork;
  
  // What do I have?
  resources: UserResources;
  
  // Ikigai
  passions: string[];
  strengths: string[];
  market_needs: string[];
  monetization_prefs: BusinessModel[];
  
  // Metadata
  onboarding_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IkigaiScore {
  love: number;        // Passion alignment (0-25)
  good_at: number;     // Skill match (0-25)
  world_needs: number; // Problem relevance (0-25)
  paid_for: number;    // Monetization fit (0-25)
  total: number;       // Sum (0-100)
}

export interface IdeaFit {
  overall_fit: number;  // 0-100
  skill_match: {
    required: Technology[];
    owned: Technology[];
    gap: Technology[];
    match_percentage: number;
  };
  network_leverage: {
    useful: string[];
    critical: string[];
  };
  resource_feasibility: {
    timeline_estimate: string;
    budget_fit: boolean;
  };
  ikigai: IkigaiScore;
}
