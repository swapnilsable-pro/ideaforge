import { Agent, AgentContext, AgentReport } from './types';

/**
 * Business Validator Agent
 * Specializes in: Revenue models, unit economics, scalability, resource requirements
 */
export class ValidatorAgent implements Agent {
  role = 'validator' as const;
  name = 'Business Validator';
  description = 'Assesses business viability, unit economics, and scalability potential';

  async execute(context: AgentContext): Promise<AgentReport> {
    const startTime = Date.now();

    try {
      const { idea, previousReports } = context;

      // Get previous context
      const marketContext = previousReports.find(r => r.agent_role === 'researcher');
      const designContext = previousReports.find(r => r.agent_role === 'designer');

      const prompt = this.buildPrompt(idea, marketContext, designContext);
      const analysis = await this.validateBusiness(prompt);

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
          revenue_model_viability: analysis.revenue_viability,
          breakeven_estimate: analysis.breakeven_estimate,
        },
      };
    } catch (error) {
      console.error('Validator agent error:', error);
      throw new Error(`Business validation failed: ${error}`);
    }
  }

  private buildPrompt(idea: any, marketContext?: AgentReport, designContext?: AgentReport): string {
    const context = [];
    
    if (marketContext) {
      context.push(`**MARKET SIZE:** ${marketContext.metadata?.tam_estimate}`);
    }
    if (designContext) {
      context.push(`**MVP FEATURES:** ${designContext.metadata?.mvp_features?.join(', ')}`);
    }

    return `You are an expert business analyst and financial strategist. Validate this startup's business model.

**IDEA:**
- Title: ${idea.title}
- Target Audience: ${idea.target_audience}
- Revenue Model: ${idea.revenue_model}
- Business Model: ${idea.business_model}

${context.join('\n')}

**YOUR TASK:**
Assess business viability covering:

1. **Revenue Model Analysis**
   - Is the revenue model realistic for this market?
   - What's the expected revenue per customer (ARPU)?
   - Are there multiple revenue streams possible?

2. **Unit Economics**
   - Estimated CAC (Customer Acquisition Cost)
   - Estimated LTV (Lifetime Value)
   - LTV:CAC ratio assessment
   - Gross margin potential

3. **Scalability Assessment**
   - Can this scale to $1M ARR? $10M?
   - What are the scaling bottlenecks?
   - Is this a local/regional/global opportunity?

4. **Resource Requirements**
   - Initial capital needed (rough estimate)
   - Team size for MVP and scale
   - Time to revenue estimate

Respond in valid JSON:
{
  "summary": "2-3 sentence business viability assessment",
  "revenue_viability": "High/Medium/Low with brief justification",
  "breakeven_estimate": "Time to breakeven estimate",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "concerns": ["concern 1", "concern 2"],
  "confidence_score": 70
}`;
  }

  private async validateBusiness(prompt: string): Promise<any> {
    const { generateIdea } = await import('@/lib/llm');
    
    const response = await generateIdea(prompt, 'grok', {
      temperature: 0.3, // Lower for more conservative financial analysis
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
        summary: 'Business validation completed with parsing issues.',
        revenue_viability: 'Unknown',
        breakeven_estimate: 'Unable to determine',
        key_insights: ['Validation data unavailable'],
        recommendations: ['Re-run analysis'],
        concerns: ['Unable to parse validation data'],
        confidence_score: 30,
      };
    }
  }
}
