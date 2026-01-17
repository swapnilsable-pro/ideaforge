// Agent role types
export type AgentRole = 'researcher' | 'designer' | 'validator' | 'gtm';

// Agent status during execution
export type AgentStatus = 'pending' | 'running' | 'complete' | 'error';

// Shared context passed between agents
export interface AgentContext {
  idea: {
    id: string;
    title: string;
    tagline: string;
    problem_description: string;
    solution_description: string;
    target_audience: string;
    revenue_model: string;
    business_model: string;
    technology: string;
    key_features: string[];
  };
  userProfile?: {
    skills: string[];
    experience: string[];
    expertise: string[];
    industries: string[];
    network: any;
    resources: any;
  };
  previousReports: AgentReport[];
}

// Structured report from each agent
export interface AgentReport {
  agent_role: AgentRole;
  summary: string;
  key_insights: string[];
  recommendations: string[];
  concerns: string[];
  confidence_score: number; // 0-100
  execution_time_ms: number;
  metadata?: Record<string, any>; // Agent-specific data
}

// Full multi-agent analysis result
export interface MultiAgentAnalysis {
  id: string;
  idea_id: string;
  researcher_report: AgentReport | null;
  designer_report: AgentReport | null;
  validator_report: AgentReport | null;
  gtm_report: AgentReport | null;
  synthesis: string; // Overall recommendation
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  created_at: string;
  completed_at?: string;
}

// Individual agent interface
export interface Agent {
  role: AgentRole;
  name: string;
  description: string;
  execute: (context: AgentContext) => Promise<AgentReport>;
}

// Coordinator state for tracking pipeline progress
export interface CoordinatorState {
  currentAgent: AgentRole | null;
  completedAgents: AgentRole[];
  reports: AgentReport[];
  status: 'idle' | 'running' | 'complete' | 'error';
  error?: string;
}

// Streaming progress update
export interface AgentProgress {
  agent_role: AgentRole;
  status: AgentStatus;
  message: string;
  report?: Partial<AgentReport>;
}
