const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

type ConfirmedKeys = {
  accessKey: string
  secretAccessKey: string
}

export function getAccessKeys(): ConfirmedKeys {
  if (!accessKey || !secretAccessKey) {
    console.log('No AWS-keys found! Check your .env file.')
    process.exit(1)
  }
  return { accessKey, secretAccessKey }
}