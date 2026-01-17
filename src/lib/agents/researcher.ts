import { Agent, AgentContext, AgentReport } from './types';

/**
 * Market Research Agent
 * Specializes in: TAM/SAM/SOM analysis, competitive landscape, market trends, customer segments
 */
export class ResearcherAgent implements Agent {
  role = 'researcher' as const;
  name = 'Market Researcher';
  description = 'Analyzes market size, competition, trends, and customer segments';

  async execute(context: AgentContext): Promise<AgentReport> {
    const startTime = Date.now();

    try {
      const { idea } = context;

      // Build specialized prompt for market research
      const prompt = this.buildPrompt(idea);

      // Call LLM for market analysis
      const analysis = await this.analyzeMarket(prompt);

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
          tam_estimate: analysis.tam_estimate,
          sam_estimate: analysis.sam_estimate,
          competitor_count: analysis.competitor_count,
        },
      };
    } catch (error) {
      console.error('Researcher agent error:', error);
      throw new Error(`Market research failed: ${error}`);
    }
  }

  private buildPrompt(idea: any): string {
    return `You are an expert market research analyst. Analyze this startup idea from a market perspective.

**IDEA:**
- Title: ${idea.title}
- Problem: ${idea.problem_description}
- Solution: ${idea.solution_description}
- Target Audience: ${idea.target_audience}
- Business Model: ${idea.business_model}

**YOUR TASK:**
Provide a comprehensive market analysis covering:

1. **Market Size Estimation**
   - TAM (Total Addressable Market): rough $ estimate
   - SAM (Serviceable Addressable Market): realistic subset
   - SOM (Serviceable Obtainable Market): first 2-3 years

2. **Competitive Landscape**
   - List 3-5 direct competitors (or closest alternatives)
   - Identify indirect competitors and substitutes
   - Analyze competitive advantages this idea could have

3. **Market Trends**
   - Current trends supporting this idea
   - Emerging opportunities in this space
   - Potential threats or headwinds

4. **Customer Segmentation**
   - Primary customer segment analysis
   - Secondary segments to consider
   - Early adopter characteristics

Respond in valid JSON format:
{
  "summary": "2-3 sentence overall market assessment",
  "tam_estimate": "TAM estimate string (e.g., '$50B global market')",
  "sam_estimate": "SAM estimate string",
  "competitor_count": "number of major competitors",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "concerns": ["concern 1", "concern 2"],
  "confidence_score": 75
}`;
  }

  private async analyzeMarket(prompt: string): Promise<any> {
    // Use existing LLM infrastructure (Groq)
    const { generateIdea } = await import('@/lib/llm');
    
    const response = await generateIdea(prompt, 'grok', {
      temperature: 0.3, // Lower for more factual analysis
      maxTokens: 2048,
    });

    // Parse JSON response
    try {
      const cleaned = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse researcher response:', response.content);
      
      // Fallback: extract what we can
      return {
        summary: 'Market analysis completed with parsing issues.',
        tam_estimate: 'Unable to determine',
        sam_estimate: 'Unable to determine',
        competitor_count: 'Unknown',
        key_insights: ['Market research data unavailable'],
        recommendations: ['Re-run analysis with better structured prompt'],
        concerns: ['Unable to parse market data'],
        confidence_score: 30,
      };
    }
  }
}
