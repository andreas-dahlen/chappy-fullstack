import { GoogleGenAI, type Content } from "@google/genai";
import { getApiKey } from '../envGetters/getApiKey.ts';
import { defaultModelName, summarizeInstruction } from './config.ts';

// Get an API key at https://aistudio.google.com/
const googleAi = new GoogleGenAI({ apiKey: getApiKey() })

type RequestConfig = {
  model?: string
  instruction?: string
}

export async function sendRequest(
  prompt: string | Content[],
  config?: RequestConfig
): Promise<string | null> {
  try {
    const response = await googleAi.models.generateContent({
      model: config?.model ?? defaultModelName,
      contents: prompt,
      config: {
        systemInstruction: config?.instruction ?? summarizeInstruction
      }
    })

    return response.text ?? null
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Gemini request failed:', message)
    return null
  }
}