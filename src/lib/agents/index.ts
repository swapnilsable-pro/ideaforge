// Export all agents
export * from './types';
export * from './coordinator';
export * from './researcher';
export * from './designer';
export * from './validator';
export * from './gtm';

// Factory function to create all agents
import { ResearcherAgent } from './researcher';
import { DesignerAgent } from './designer';
import { ValidatorAgent } from './validator';
import { GTMAgent } from './gtm';
import { Agent } from './types';

export function createAllAgents(): Agent[] {
  return [
    new ResearcherAgent(),
    new DesignerAgent(),
    new ValidatorAgent(),
    new GTMAgent(),
  ];
}
