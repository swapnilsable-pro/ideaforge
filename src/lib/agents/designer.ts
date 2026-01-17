import { Agent, AgentContext, AgentReport } from './types';

/**
 * Product Design Agent
 * Specializes in: Feature prioritization, UX/UI, technical architecture, MVP scope
 */
export class DesignerAgent implements Agent {
  role = 'designer' as const;
  name = 'Product Designer';
  description = 'Critiques product design, prioritizes features, and suggests technical architecture';

  async execute(context: AgentContext): Promise<AgentReport> {
    const startTime = Date.now();

    try {
      const { idea, previousReports } = context;

      // Get market insights from researcher if available
      const marketContext = previousReports.find(r => r.agent_role === 'researcher');

      const prompt = this.buildPrompt(idea, marketContext);
      const analysis = await this.analyzeDesign(prompt);

      const executionTime = Date.now() - startTime;

      return {
        agent_role: this.role,
        summary: analysis.summary,
        key_insights: analysis.key_insights,
        recommendations: analysis.recommendations,
        concerns: analysis.concerns,
        confidence_score: analysis.confidence_score,
        execution_time_ms: executionTime,
        metadata: {
          mvp_features: analysis.mvp_features,
          tech_stack_suggestion: analysis.tech_stack,
        },
      };
    } catch (error) {
      console.error('Designer agent error:', error);
      throw new Error(`Product design analysis failed: ${error}`);
    }
  }

  private buildPrompt(idea: any, marketContext?: AgentReport): string {
    const marketInsights = marketContext 
      ? `\n**MARKET RESEARCH INSIGHTS:**\n${marketContext.key_insights.join('\n- ')}`
      : '';

    return `You are an expert product designer and UX strategist. Critique this startup idea's product design.

**IDEA:**
- Title: ${idea.title}
- Solution: ${idea.solution_description}
- Key Features: ${idea.key_features?.join(', ') || 'Not specified'}
- Technology: ${idea.technology}
${marketInsights}

**YOUR TASK:**
Analyze the product design and provide:

1. **Feature Prioritization**
   - Which features are essential for MVP? (top 3-5)
   - Which features can be delayed to v2?
   - Any missing critical features?

2. **UX/UI Considerations**
   - Key user flows to nail
   - Potential UX pitfalls to avoid
   - Design principles to follow

3. **Technical Architecture**
   - Suggested tech stack (be specific)
   - Scalability considerations
   - Technical risks to mitigate

4. **MVP Scope**
   - Recommended MVP timeline (weeks)
   - Core value proposition to prove
   - Success metrics to track

Respond in valid JSON:
{
  "summary": "2-3 sentence product design assessment",
  "mvp_features": ["feature 1", "feature 2", "feature 3"],
  "tech_stack": "Recommended stack description",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "concerns": ["concern 1", "concern 2"],
  "confidence_score": 80
}`;
  }

  private async analyzeDesign(prompt: string): Promise<any> {
    const { generateIdea } = await import('@/lib/llm');
    
    const response = await generateIdea(prompt, 'grok', {
      temperature: 0.4,
      maxTokens: 2048,
    });

    try {
      const cleaned = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return JSON.parse(cleaned);
    } catch (error) {
      return {
        summary: 'Product design analysis completed with parsing issues.',
        mvp_features: [],
        tech_stack: 'Unable to determine',
        key_insights: ['Design analysis data unavailable'],
        recommendations: ['Re-run analysis'],
        concerns: ['Unable to parse design data'],
        confidence_score: 30,
      };
    }
  }
}
