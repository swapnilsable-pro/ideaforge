import type { LLMProvider, LLMResponse, LLMConfig } from '@/types';
import { generateWithGemini } from './gemini';
import { generateWithOpenAI } from './openai';
import { generateWithGroq } from './groq';

export interface ILLMProvider {
  generate(prompt: string, options?: Partial<LLMConfig>): Promise<LLMResponse>;
}

class GeminiProvider implements ILLMProvider {
  async generate(prompt: string, options?: Partial<LLMConfig>): Promise<LLMResponse> {
    return generateWithGemini(prompt, {
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });
  }
}

class OpenAIProvider implements ILLMProvider {
  async generate(prompt: string, options?: Partial<LLMConfig>): Promise<LLMResponse> {
    return generateWithOpenAI(prompt, {
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });
  }
}

class GroqProvider implements ILLMProvider {
  async generate(prompt: string, options?: Partial<LLMConfig>): Promise<LLMResponse> {
    return generateWithGroq(prompt, {
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });
  }
}

class ClaudeProvider implements ILLMProvider {
  async generate(prompt: string): Promise<LLMResponse> {
    // TODO: Implement Claude integration
    throw new Error('Claude provider not yet implemented. Prompt: ' + prompt.substring(0, 50));
  }
}

const providers: Record<LLMProvider, ILLMProvider> = {
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
  claude: new ClaudeProvider(),
  grok: new GroqProvider(), // Using Groq for 'grok' key (similar name, free!)
};

// Default provider is now Groq (FREE!)
const DEFAULT_PROVIDER: LLMProvider = 'grok';

export function getLLMProvider(name: LLMProvider = DEFAULT_PROVIDER): ILLMProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown LLM provider: ${name}`);
  }
  return provider;
}

export async function generateIdea(
  prompt: string,
  provider: LLMProvider = DEFAULT_PROVIDER,
  options?: Partial<LLMConfig>
): Promise<LLMResponse> {
  const llm = getLLMProvider(provider);
  return llm.generate(prompt, options);
}
