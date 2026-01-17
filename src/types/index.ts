// =========================================
// Type Definitions for Business Idea Generator
// =========================================

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_llm: LLMProvider;
  favorite_domains: Domain[];
  created_at: string;
}

// Domain & Problem Types
export type Domain = 
  | 'climate'
  | 'health'
  | 'ai_safety'
  | 'social_impact'
  | 'fintech'
  | 'edtech'
  | 'cybersecurity'
  | 'food_agriculture';

export type ProblemSource = 'xprize' | 'sdg' | 'wef' | 'yc_rfs' | 'gates';

export interface UnsolvedProblem {
  id: string;
  source: ProblemSource;
  domain: Domain;
  title: string;
  description: string;
  prize_amount?: string;
  deadline?: string;
  url?: string;
  tags: string[];
}

// Business Model Types
export type BusinessModel = 
  | 'b2b_saas'
  | 'b2c_subscription'
  | 'marketplace'
  | 'api_service'
  | 'consultancy'
  | 'edtech_platform'
  | 'hardware_software'
  | 'nonprofit_impact';

export type Technology = 
  | 'ai_ml'
  | 'blockchain'
  | 'iot'
  | 'mobile_app'
  | 'web_platform'
  | 'ar_vr'
  | 'biotech'
  | 'robotics';

// Idea Generation Types
export interface GeneratedIdea {
  id: string;
  user_id?: string;
  title: string;
  tagline: string;
  problem_source: ProblemSource;
  problem_title: string;
  problem_description: string;
  business_model: BusinessModel;
  technology: Technology;
  job_story: JobStory;
  solution_description: string;
  target_audience: string;
  revenue_model: string;
  key_features: string[];
  validation_data?: ValidationData;
  viability_score?: number;
  created_at: string;
}

export interface JobStory {
  situation: string;
  motivation: string;
  outcome: string;
}

export interface ValidationData {
  trend_score?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  competition_level?: 'low' | 'medium' | 'high';
  market_size?: string;
  risk_warnings: string[];
  opportunities: string[];
}

// Saved Idea (from database)
export interface SavedIdea {
  id: string;
  user_id: string;
  title: string;
  problem_title: string | null;
  problem_source: string | null;
  domain: Domain | null;
  job_story: string;
  business_model: string | null;
  technology: string | null;
  target_market: string | null;
  revenue_model: string | null;
  signal_score: number | null;
  validation_report: ValidationData | null;
  last_validated_at: string | null;
  created_at: string;
  updated_at: string;
}


// LLM Types
export type LLMProvider = 'gemini' | 'openai' | 'claude' | 'grok';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// API Types
export interface GenerateIdeaRequest {
  domain: Domain;
  problemId?: string;
  businessModel?: BusinessModel;
  technology?: Technology;
  customConstraints?: string;
}

export interface GenerateIdeaResponse {
  success: boolean;
  idea?: GeneratedIdea;
  error?: string;
}

// UI State Types
export interface GeneratorState {
  step: 'domain' | 'challenge' | 'generating' | 'result';
  selectedDomain?: Domain;
  selectedProblem?: UnsolvedProblem;
  generatedIdea?: GeneratedIdea;
  isLoading: boolean;
  error?: string;
}

// Domain Metadata
export interface DomainInfo {
  id: Domain;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const DOMAINS: DomainInfo[] = [
  {
    id: 'climate',
    name: 'Climate & Environment',
    icon: '🌍',
    description: 'Combat climate change and environmental degradation',
    color: '#00ff88'
  },
  {
    id: 'health',
    name: 'Health & Longevity',
    icon: '🏥',
    description: 'Improve healthcare access and human healthspan',
    color: '#ff6b6b'
  },
  {
    id: 'ai_safety',
    name: 'AI Safety & Ethics',
    icon: '🤖',
    description: 'Ensure responsible AI development and deployment',
    color: '#bf00ff'
  },
  {
    id: 'social_impact',
    name: 'Social Impact',
    icon: '🤝',
    description: 'Address social inequality and community challenges',
    color: '#ffd93d'
  },
  {
    id: 'fintech',
    name: 'FinTech & Payments',
    icon: '💳',
    description: 'Revolutionize financial services and accessibility',
    color: '#00d4ff'
  },
  {
    id: 'edtech',
    name: 'Education & Skills',
    icon: '📚',
    description: 'Transform learning and workforce development',
    color: '#ff9f43'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔐',
    description: 'Protect digital assets and combat cyber threats',
    color: '#5f27cd'
  },
  {
    id: 'food_agriculture',
    name: 'Food & Agriculture',
    icon: '🌾',
    description: 'Ensure food security and sustainable farming',
    color: '#10ac84'
  }
];

export const BUSINESS_MODELS: Record<BusinessModel, string> = {
  b2b_saas: 'B2B SaaS',
  b2c_subscription: 'B2C Subscription',
  marketplace: 'Marketplace',
  api_service: 'API Service',
  consultancy: 'Consultancy',
  edtech_platform: 'EdTech Platform',
  hardware_software: 'Hardware + Software',
  nonprofit_impact: 'Nonprofit / Impact'
};

export const TECHNOLOGIES: Record<Technology, string> = {
  ai_ml: 'AI / Machine Learning',
  blockchain: 'Blockchain',
  iot: 'IoT / Sensors',
  mobile_app: 'Mobile App',
  web_platform: 'Web Platform',
  ar_vr: 'AR / VR',
  biotech: 'Biotech',
  robotics: 'Robotics'
};
