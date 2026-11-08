import { GoogleGenAI, type Content } from "@google/genai";
import { getApiKey } from '../envGetters/getApiKey.ts';
import { baseInstructions, defaultModelName, summarizeInstruction } from './config.ts';
import type { AiResponse } from '@chappy/shared';

// Get an API key at https://aistudio.google.com/
const googleAi = new GoogleGenAI({ apiKey: getApiKey() })

type RequestConfig = {
  model?: string
  instruction?: string
}

export async function sendRequest(
  prompt: string | Content[],
  config?: RequestConfig
): Promise<AiResponse | null> {
  try {
    const before = performance.now()

    const response = await googleAi.models.generateContent({
      model: config?.model ?? defaultModelName,
      contents: prompt,
      config: {
        systemInstruction: config?.instruction ?? baseInstructions
      }
    })

    const duration = Math.round(performance.now() - before)

    if (!response.text) {
      return null
    }

    return {
      message: response.text,
      duration
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Gemini request failed:', message)
    return null
  }
}