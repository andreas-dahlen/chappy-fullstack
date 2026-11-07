export function getApiKey(): string {
  if (!process.env.GEMINI_API_KEY) {
    console.log('Could not resolve API_KEY from .env')
    process.exit(1)
  }
  return process.env.GEMINI_API_KEY
}