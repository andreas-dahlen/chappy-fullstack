import { users, channels, channelMessages, conversation, conversationMessages } from './fakeData.ts';
export function generateSeedData() {

  const userData = users.map(d => ({
    pk: 'USER',
    sk: `USER#${d.username}`,
    name: d.name,
    ownerId: d.userId,
    hashPassword: d.hashPassword
  }))

  const channelData = channels.map(d => ({
    pk: 'CHANNEL',
    sk: `CHANNEL#${d.channelId}`,
    name: d.channelName,
    ownerId: d.ownerId,
    authRequired: d.authRequired,
    timestamp: d.createdAt
  }))

  const channelMessageData = channelMessages.map(d => ({
    pk: `CHANNEL#${d.channelId}`,
    sk: `MSG#${d.timeStamp}#${d.messageId}`,
    message: d.message,
    ownerId: d.ownerId,
    timestamp: d.timeStamp,
    messageId: d.messageId
  }))

  const participantLookupData = users.map(user => ({
    pk: `USER#${user.userId}`,
    sk: `CONVERSATION#${conversation.conversationId}`,
  }));

  const conversationMetaData = {
    pk: `CONVERSATION#${conversation.conversationId}`,
    sk: 'META',
    participants: conversation.participants,
    timestamp: conversation.createdAt
  }

  const conversationMessageData = conversationMessages.map(d => ({
    pk: `CONVERSATION#${d.conversationId}`,
    sk: `MSG#${d.timeStamp}#${d.messageId}`,
    ownerId: d.ownerId,
    message: d.message,
    timestamp: d.timeStamp,
    messageId: d.messageId
  }))

  return [
    ...userData,
    ...channelData,
    ...channelMessageData,
    ...conversationMessageData,
    ...participantLookupData,
    conversationMetaData
  ]
}