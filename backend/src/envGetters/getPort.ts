export function getPort(): number {
  const port: string | undefined = process.env.PORT //TODO add zod validation instead.. for example port number has to be a positive int
  if (!port) {
    console.log(`Couldn't resolve port from env file`)
    process.exit(1)
  }
  const portNumber: number = Number(port)
  if (isNaN(portNumber)) {
    console.log('Port number error. Got NaN')
    process.exit(2)
  }
  return portNumber
}