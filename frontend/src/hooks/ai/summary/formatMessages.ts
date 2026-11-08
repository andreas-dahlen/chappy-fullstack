import type { MessageData } from '@chappy/shared';
import { useUsersStore } from '../../../stores/usersStore.ts';

export function formatMessagesForAi(messages: MessageData[]): string {

  const users = useUsersStore.getState().users

  const formatted: string[] = []

  for (const msg of messages) {
    formatted.push(`[${msg.createdAt}] ${users.get(msg.createdBy)?.name ?? 'guest'}: ${msg.message}`)
  }

  return formatted.join('\n')
}