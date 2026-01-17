import { Agent, AgentContext, AgentReport, AgentRole, CoordinatorState } from './types';

export class MultiAgentCoordinator {
  private agents: Map<AgentRole, Agent>;
  private state: CoordinatorState;

  constructor(agents: Agent[]) {
    this.agents = new Map(agents.map(agent => [agent.role, agent]));
    this.state = {
      currentAgent: null,
      completedAgents: [],
      reports: [],
      status: 'idle',
    };
  }

  /**
   * Execute all agents sequentially: Researcher → Designer → Validator → GTM
   * Each agent receives context + all previous reports
   */
  async executeAll(
    context: AgentContext,
    onProgress?: (agent: AgentRole, status: string) => void
  ): Promise<AgentReport[]> {
    this.state.status = 'running';
    this.state.reports = [];
    this.state.completedAgents = [];

    const executionOrder: AgentRole[] = ['researcher', 'designer', 'validator', 'gtm'];

    for (const role of executionOrder) {
      const agent = this.agents.get(role);
      if (!agent) {
        console.warn(`Agent ${role} not found, skipping...`);
        continue;
      }

      try {
        this.state.currentAgent = role;
        onProgress?.(role, 'running');

        // Build context with previous reports
        const enrichedContext: AgentContext = {
          ...context,
          previousReports: this.state.reports,
        };

        // Execute agent
        const report = await agent.execute(enrichedContext);

        // Store result
        this.state.reports.push(report);
        this.state.completedAgents.push(role);
        onProgress?.(role, 'complete');
      } catch (error) {
        console.error(`Agent ${role} failed:`, error);
        this.state.status = 'error';
        this.state.error = `Agent ${role} execution failed: ${error}`;
        onProgress?.(role, 'error');
        
        // Continue with other agents even if one fails
        continue;
      }
    }

    this.state.status = 'complete';
    this.state.currentAgent = null;
    return this.state.reports;
  }

  /**
   * Generate synthesis from all agent reports
   */
  generateSynthesis(reports: AgentReport[]): string {
    if (reports.length === 0) {
      return 'No agent reports available for synthesis.';
    }

    const sections: string[] = [];

    // Overall assessment
    const avgConfidence = reports.reduce((sum, r) => sum + r.confidence_score, 0) / reports.length;
    sections.push(`**Overall Confidence:** ${avgConfidence.toFixed(0)}%`);

    // Key insights across all agents
    const allInsights = reports.flatMap(r => r.key_insights);
    if (allInsights.length > 0) {
      sections.push(`\n**Key Insights:**\n${allInsights.slice(0, 5).map(i => `- ${i}`).join('\n')}`);
    }

    // Critical concerns
    const allConcerns = reports.flatMap(r => r.concerns);
    if (allConcerns.length > 0) {
      sections.push(`\n**Critical Concerns:**\n${allConcerns.map(c => `- ${c}`).join('\n')}`);
    }

    // Top recommendations
    const allRecommendations = reports.flatMap(r => r.recommendations);
    if (allRecommendations.length > 0) {
      sections.push(`\n**Top Recommendations:**\n${allRecommendations.slice(0, 5).map(r => `- ${r}`).join('\n')}`);
    }

    // Final verdict
    let verdict = '';
    if (avgConfidence >= 70) {
      verdict = '✅ **Verdict:** Strong potential - proceed with validation and MVP development.';
    } else if (avgConfidence >= 50) {
      verdict = '⚠️ **Verdict:** Moderate potential - address concerns before investing heavily.';
    } else {
      verdict = '❌ **Verdict:** Significant challenges identified - consider pivoting or major refinements.';
    }
    sections.push(`\n${verdict}`);

    return sections.join('\n');
  }

  getState(): CoordinatorState {
    return { ...this.state };
  }
}
