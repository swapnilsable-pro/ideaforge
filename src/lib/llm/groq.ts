import Groq from 'groq-sdk/index.mjs';
import type { LLMResponse } from '@/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function generateWithGroq(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<LLMResponse> {
  const completion = await groq.chat.completions.create({
    model: options?.model || 'llama-3.3-70b-versatile', // Free, fast, capable
    messages: [{ role: 'user', content: prompt }],
    temperature: options?.temperature ?? 0.9,
    max_tokens: options?.maxTokens ?? 4096,
  });

  const content = completion.choices[0]?.message?.content || '';

  return {
    content,
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    },
  };
}

export async function generateWithGroqStream(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ReadableStream<Uint8Array>> {
  const stream = await groq.chat.completions.create({
    model: options?.model || 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: options?.temperature ?? 0.9,
    max_tokens: options?.maxTokens ?? 4096,
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });
}
