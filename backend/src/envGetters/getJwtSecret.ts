export function getJwtSecret(): string {
  const secret: string | undefined = process.env.JWT_SECRET //TODO add zod validation instead.. although it is just a string... :o
  if (!secret) {
    console.log(`Couldn't resolve jwt secret from env file`)
    process.exit(1)
  }
  return secret
}