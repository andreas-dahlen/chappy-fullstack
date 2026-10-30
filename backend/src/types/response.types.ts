import type { UUID } from '@chappy/shared';

export type JwtResponse = {
  token: string
  userId: UUID
  name: string
}