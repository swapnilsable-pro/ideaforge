import { Agent, AgentContext, AgentReport } from './types';

/**
 * Go-to-Market Strategist Agent
 * Specializes in: Customer acquisition, pricing strategy, launch tactics, early traction
 */
export class GTMAgent implements Agent {
  role = 'gtm' as const;
  name = 'GTM Strategist';
  description = 'Creates go-to-market strategy with customer acquisition and pricing recommendations';

  async execute(context: AgentContext): Promise<AgentReport> {
    const startTime = Date.now();

    try {
      const { idea, userProfile, previousReports } = context;

      // Get all previous agents' insights
      const marketContext = previousReports.find(r => r.agent_role === 'researcher');
      const designContext = previousReports.find(r => r.agent_role === 'designer');
      const validatorContext = previousReports.find(r => r.agent_role === 'validator');

      const prompt = this.buildPrompt(idea, userProfile, marketContext, designContext, validatorContext);
      const analysis = await this.createGTMStrategy(prompt);

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
          primary_channel: analysis.primary_channel,
          pricing_model: analysis.pricing_model,
          launch_timeline: analysis.launch_timeline,
        },
      };
    } catch (error) {
      console.error('GTM agent error:', error);
      throw new Error(`GTM strategy creation failed: ${error}`);
    }
  }

  private buildPrompt(
    idea: any, 
    userProfile: any, 
    marketContext?: AgentReport,
    designContext?: AgentReport,
    validatorContext?: AgentReport
  ): string {
    const context = [];
    
    if (marketContext) {
      context.push(`**TARGET MARKET:** ${marketContext.summary}`);
    }
    if (designContext) {
      context.push(`**MVP SCOPE:** ${designContext.metadata?.mvp_features?.join(', ')}`);
    }
    if (validatorContext) {
      context.push(`**BUSINESS MODEL:** ${validatorContext.metadata?.revenue_viability}`);
    }
    if (userProfile?.network) {
      context.push(`**FOUNDER NETWORK:** ${JSON.stringify(userProfile.network)}`);
    }

    return `You are an expert go-to-market strategist. Create a launch strategy for this startup.

**IDEA:**
- Title: ${idea.title}
- Target Audience: ${idea.target_audience}
- Business Model: ${idea.business_model}

${context.join('\n')}

**YOUR TASK:**
Design a go-to-market strategy covering:

1. **Customer Acquisition Channels**
   - Top 3 channels to focus on (ranked)
   - Why these channels for this audience?
   - Estimated CAC per channel

2. **Pricing Strategy**
   - Recommended pricing model (freemium, tiered, usage-based, etc.)
   - Price point suggestion with justification
   - Competitive pricing analysis

3. **Launch Plan**
   - Pre-launch activities (weeks -4 to 0)
   - Launch week tactics
   - Post-launch growth strategy (weeks 1-12)
   - Suggested timeline to first 100 customers

4. **Early Traction Tactics**
   - How to get first 10 customers (specific tactics)
   - Beta testing strategy
   - Community building approach
   - Partnership opportunities

Respond in valid JSON:
{
  "summary": "2-3 sentence GTM strategy overview",
  "primary_channel": "Top recommended acquisition channel",
  "pricing_model": "Recommended pricing approach",
  "launch_timeline": "Estimated weeks to launch",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "concerns": ["concern 1", "concern 2"],
  "confidence_score": 75
}`;
  }

  private async createGTMStrategy(prompt: string): Promise<any> {
    const { generateIdea } = await import('@/lib/llm');
    
    const response = await generateIdea(prompt, 'grok', {
      temperature: 0.5, // Slightly higher for creative marketing ideas
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
        summary: 'GTM strategy created with parsing issues.',
        primary_channel: 'Unknown',
        pricing_model: 'Unable to determine',
        launch_timeline: 'Unable to estimate',
        key_insights: ['GTM data unavailable'],
        recommendations: ['Re-run analysis'],
        concerns: ['Unable to parse GTM data'],
        confidence_score: 30,
      };
    }
  }
}
