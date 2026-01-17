import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateWithGemini(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<LLMResponse> {
  const model = genAI.getGenerativeModel({ 
    model: options?.model || 'gemini-2.0-flash'
  });

  const generationConfig = {
    temperature: options?.temperature ?? 0.9,
    maxOutputTokens: options?.maxTokens ?? 4096,
  };

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  });

  const response = result.response;
  const text = response.text();

  return {
    content: text,
    usage: {
      promptTokens: 0, // Gemini doesn't return token counts in the same way
      completionTokens: 0,
      totalTokens: 0,
    },
  };
}

export async function generateWithGeminiStream(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({ 
    model: options?.model || 'gemini-2.0-flash'
  });

  const generationConfig = {
    temperature: options?.temperature ?? 0.9,
    maxOutputTokens: options?.maxTokens ?? 4096,
  };

  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
}
