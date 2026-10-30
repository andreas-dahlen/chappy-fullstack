import type { UUID } from '@chappy/shared';

export type JwtResponse = {
  jwt: string
  userId: UUID
  name: string
}