export function getConversationNamespace(): string {
  const secret: string | undefined = process.env.CONVERSATION_NAMESPACE //TODO add zod validation instead.. although it is just a string... :o
  if (!secret) {
    console.log(`Couldn't resolve conversation namespace from env file`)
    process.exit(1)
  }
  return secret
}