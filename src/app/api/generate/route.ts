import { NextResponse } from 'next/server';
import { generateIdea } from '@/lib/llm';
import { getProblemById, getRandomProblem } from '@/lib/problems';
import { createClient } from '@/lib/supabase/server';
import { calculateIdeaFit } from '@/lib/ikigai/fit-scorer';
import type { 
  GenerateIdeaRequest, 
  GeneratedIdea, 
  BusinessModel, 
  Technology,
  LLMProvider,
  UserProfile 
} from '@/types';

const BUSINESS_MODELS: BusinessModel[] = [
  'b2b_saas', 'b2c_subscription', 'marketplace', 'api_service', 
  'consultancy', 'edtech_platform', 'hardware_software', 'nonprofit_impact'
];

const TECHNOLOGIES: Technology[] = [
  'ai_ml', 'blockchain', 'iot', 'mobile_app', 
  'web_platform', 'ar_vr', 'biotech', 'robotics'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(request: Request) {
  try {
    const body: GenerateIdeaRequest & { llmProvider?: LLMProvider } = await request.json();
    const { domain, problemId, businessModel, technology, llmProvider } = body;

    // Fetch user profile for context-aware generation
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let userProfile: UserProfile | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      userProfile = profile;
    }

    // Get the problem - either specific or random
    const problem = problemId 
      ? getProblemById(problemId) 
      : getRandomProblem(domain);

    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Select business model and technology (random if not specified)
    const selectedModel = businessModel || getRandomElement(BUSINESS_MODELS);
    const selectedTech = technology || getRandomElement(TECHNOLOGIES);

    // Build the prompt for idea generation (context-aware if profile exists)
    const prompt = buildIdeaPrompt(problem, selectedModel, selectedTech, userProfile);

    // Generate the idea using the LLM (defaults to Groq)
    const response = await generateIdea(prompt, llmProvider, {
      temperature: 0.7, // Lower for more reliable JSON output
      maxTokens: 4096,
    });

    // Parse the LLM response
    const idea = parseIdeaResponse(response.content, problem, selectedModel, selectedTech);

    // Calculate fit score if user has profile
    let fitAnalysis = null;
    if (userProfile && userProfile.onboarding_completed) {
      fitAnalysis = calculateIdeaFit(idea, userProfile);
    }

    return NextResponse.json({ 
      success: true, 
      idea,
      fitAnalysis 
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate idea' },
      { status: 500 }
    );
  }
}

function buildIdeaPrompt(
  problem: ReturnType<typeof getProblemById>,
  businessModel: BusinessModel,
  technology: Technology,
  userProfile?: UserProfile | null
): string {
  const modelLabels: Record<BusinessModel, string> = {
    b2b_saas: 'B2B SaaS',
    b2c_subscription: 'B2C Subscription',
    marketplace: 'Marketplace',
    api_service: 'API Service',
    consultancy: 'Consultancy',
    edtech_platform: 'EdTech Platform',
    hardware_software: 'Hardware + Software',
    nonprofit_impact: 'Nonprofit / Impact',
  };

  const techLabels: Record<Technology, string> = {
    ai_ml: 'AI / Machine Learning',
    blockchain: 'Blockchain',
    iot: 'IoT / Sensors',
    mobile_app: 'Mobile App',
    web_platform: 'Web Platform',
    ar_vr: 'AR / VR',
    biotech: 'Biotech',
    robotics: 'Robotics',
  };

  // Build context-aware prompt if user profile exists
  if (userProfile && userProfile.onboarding_completed) {
    const profileContext = `
FOUNDER PROFILE (Effectuation: "Bird-in-Hand" Principle):
- Skills: ${userProfile.skills.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience.join(' | ') || 'Not specified'}
- Domain Expertise: ${userProfile.expertise.join(', ') || 'Not specified'}
- Network: ${JSON.stringify(userProfile.network)}
- Resources: Budget = ${userProfile.resources.budget}, Time = ${userProfile.resources.time}
- Passions (Ikigai): ${userProfile.passions.join(', ') || 'Not specified'}
- Market Needs (their POV): ${userProfile.market_needs.join(', ') || 'Not specified'}

CONSTRAINT: Generate an idea that MAXIMIZES leverage of the founder's existing assets.
- MUST align with at least 2 of their skills
- SHOULD tap into their network or domain expertise
- MUST be feasible given their resources (${userProfile.resources.budget}, ${userProfile.resources.time})
- SHOULD align with their passions for sustained motivation

Format the job_story as a PERSONALIZED narrative:
"WHEN I [founder's specific context], I WANT TO [leverage their skills/network], SO THAT [solve the problem]"
`;

    return `You are a startup advisor using Effectuation principles. Generate a personalized business idea.

${profileContext}

PROBLEM: ${problem!.title}
DETAILS: ${problem!.description}
BUSINESS MODEL: ${modelLabels[businessModel]}
TECHNOLOGY: ${techLabels[technology]}

Respond with ONLY valid JSON (no markdown, no explanation):

{
  "title": "Catchy startup name, 2-4 words",
  "tagline": "One-line value proposition under 15 words",
  "solution_description": "2-3 paragraphs explaining how THIS FOUNDER specifically can build this using their skills and network.",
  "target_audience": "Specific customer segment (consider founder's network)",
  "revenue_model": "How the business makes money (align with their monetization prefs)",
  "job_story": {
    "situation": "When I [founder's context from experience]",
    "motivation": "I want to leverage my [specific skills/network]",
    "outcome": "So I can [solve problem for target audience]"
  },
  "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "validation_data": {
    "risk_warnings": ["Risk 1 considering founder profile", "Risk 2"],
    "opportunities": ["Opportunity leveraging founder's advantages", "Opportunity 2"]
  },
  "viability_score": 75
}`;
  }

  // Generic prompt (no profile)
  return `You are an expert startup advisor. Generate a business idea as a JSON object.

PROBLEM: ${problem!.title}
DETAILS: ${problem!.description}
BUSINESS MODEL: ${modelLabels[businessModel]}
TECHNOLOGY: ${techLabels[technology]}

Respond with ONLY valid JSON (no markdown, no explanation, no text before or after):

{
  "title": "Catchy startup name, 2-4 words",
  "tagline": "One-line value proposition under 15 words",
  "solution_description": "2-3 paragraphs explaining the solution. Use plain text, no nested JSON.",
  "target_audience": "Specific customer segment description",
  "revenue_model": "How the business makes money",
  "job_story": {
    "situation": "When [users] face [situation]",
    "motivation": "They want to [goal]",
    "outcome": "So they can [benefit]"
  },
  "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "validation_data": {
    "risk_warnings": ["Risk 1", "Risk 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "viability_score": 75
}`;
}

function parseIdeaResponse(
  content: string,
  problem: ReturnType<typeof getProblemById>,
  businessModel: BusinessModel,
  technology: Technology
): GeneratedIdea {
  try {
    // Clean up the response
    let jsonStr = content.trim();
    
    // Remove markdown code blocks if present
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }
    
    // Find the first { and last } to extract the JSON object
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    
    // Clean up common issues
    jsonStr = jsonStr
      .replace(/[\x00-\x1F\x7F]/g, ' ') // Remove control characters
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' '); // Collapse multiple spaces

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, try to extract fields using regex
      console.log('JSON parsing failed, attempting field extraction...');
      
      const extractField = (field: string): string => {
        const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]*(?:\\\\"[^"]*)*)"`, 'i');
        const match = jsonStr.match(regex);
        return match ? match[1].replace(/\\"/g, '"') : '';
      };
      
      const extractArray = (field: string): string[] => {
        const regex = new RegExp(`"${field}"\\s*:\\s*\\[([^\\]]+)\\]`, 'i');
        const match = jsonStr.match(regex);
        if (match) {
          return match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
        }
        return [];
      };
      
      parsed = {
        title: extractField('title'),
        tagline: extractField('tagline'),
        solution_description: extractField('solution_description'),
        target_audience: extractField('target_audience'),
        revenue_model: extractField('revenue_model'),
        job_story: {
          situation: extractField('situation'),
          motivation: extractField('motivation'),
          outcome: extractField('outcome'),
        },
        key_features: extractArray('key_features'),
        validation_data: {
          risk_warnings: extractArray('risk_warnings'),
          opportunities: extractArray('opportunities'),
        },
        viability_score: parseInt(jsonStr.match(/"viability_score"\s*:\s*(\d+)/)?.[1] || '70'),
      };
    }

    return {
      id: crypto.randomUUID(),
      title: parsed.title || 'Untitled Idea',
      tagline: parsed.tagline || '',
      problem_source: problem!.source,
      problem_title: problem!.title,
      problem_description: problem!.description,
      business_model: businessModel,
      technology: technology,
      solution_description: parsed.solution_description || '',
      target_audience: parsed.target_audience || '',
      revenue_model: parsed.revenue_model || '',
      job_story: {
        situation: parsed.job_story?.situation || '',
        motivation: parsed.job_story?.motivation || '',
        outcome: parsed.job_story?.outcome || '',
      },
      key_features: parsed.key_features || [],
      validation_data: {
        risk_warnings: parsed.validation_data?.risk_warnings || [],
        opportunities: parsed.validation_data?.opportunities || [],
      },
      viability_score: parsed.viability_score || 70,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to parse LLM response:', error);
    
    // Return a fallback structure with the raw content
    return {
      id: crypto.randomUUID(),
      title: 'Generated Idea',
      tagline: 'An innovative solution to a global challenge',
      problem_source: problem!.source,
      problem_title: problem!.title,
      problem_description: problem!.description,
      business_model: businessModel,
      technology: technology,
      solution_description: content,
      target_audience: 'To be determined',
      revenue_model: 'To be determined',
      job_story: {
        situation: 'Users face this challenge',
        motivation: 'They want a solution',
        outcome: 'They can achieve their goals',
      },
      key_features: ['Feature 1', 'Feature 2', 'Feature 3'],
      validation_data: {
        risk_warnings: ['Parse error - review raw output'],
        opportunities: [],
      },
      viability_score: 50,
      created_at: new Date().toISOString(),
    };
  }
}
