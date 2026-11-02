import type { UUID } from '@chappy/shared'
import { v5 as uuidv5 } from 'uuid'
import { getConversationNamespace } from '../envGetters/getConversationNamespace.ts'

export function getConversationId(userA: UUID, userB: UUID): UUID {
  const participants = [userA, userB].sort()
  return uuidv5(participants.join(':'), getConversationNamespace()) as UUID
}