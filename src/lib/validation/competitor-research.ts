import Groq from 'groq-sdk';
import { SavedIdea } from '@/types';

export interface Competitor {
  name: string;
  description: string;
  fundingStage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Public' | 'Unknown';
  differentiation: string;
  url?: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketGaps: string[];
  recommendedStrategy: string;
  researchedAt: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function researchCompetitors(idea: SavedIdea): Promise<CompetitorAnalysis> {
  const prompt = `You are a startup competitive intelligence analyst. Research competitors for this business idea:

**Idea Title:** ${idea.title}
**Problem:** ${idea.problem_title || 'Not specified'}
**Solution:** ${idea.solution_description || 'Not specified'}
**Business Model:** ${idea.business_model || 'Not specified'}
**Technology:** ${idea.technology || 'Not specified'}
**Domain:** ${idea.domain || 'Not specified'}

Identify 3-5 similar startups or companies working in this space. For each competitor, provide:
1. Company name
2. Brief description (1-2 sentences)
3. Estimated funding stage (Pre-seed, Seed, Series A, Series B+, Public, Unknown)
4. Key differentiation from our idea
5. 2-3 strengths
6. 2-3 weaknesses or vulnerabilities
7. Website URL (if known, otherwise leave blank)

Also identify:
- **Market gaps**: 2-3 opportunities or underserved niches
- **Recommended strategy**: A specific competitive positioning strategy

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "competitors": [
    {
      "name": "Company Name",
      "description": "What they do",
      "fundingStage": "Series A",
      "differentiation": "How they differ from our idea",
      "url": "https://example.com",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "marketGaps": ["Gap 1", "Gap 2"],
  "recommendedStrategy": "Your positioning strategy"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    // Clean up any markdown code fences if present
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis = JSON.parse(cleanedContent) as Omit<CompetitorAnalysis, 'researchedAt'>;

    return {
      ...analysis,
      researchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Competitor research failed:', error);
    
    // Fallback response if LLM fails
    return {
      competitors: [
        {
          name: 'Research Unavailable',
          description: 'Unable to fetch competitor data at this time.',
          fundingStage: 'Unknown',
          differentiation: 'N/A',
          strengths: ['N/A'],
          weaknesses: ['N/A'],
        },
      ],
      marketGaps: ['Manual research recommended'],
      recommendedStrategy: 'Conduct targeted market research to identify key competitors.',
      researchedAt: new Date().toISOString(),
    };
  }
}
