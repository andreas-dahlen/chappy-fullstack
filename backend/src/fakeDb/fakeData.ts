export const users = [
  {
    userId: '64cf7cd9-839d-4fc3-9214-064c7c59346c',
    username: 'Lars',
    name: 'King Lars',
    hashPassword: 'unknown'
  },
  {
    userId: '7f969ebe-1353-446d-9fa6-602635c8289d',
    username: 'Olof',
    name: 'Olof all mighty',
    hashPassword: 'unknown'
  }
]

export const channels = [
  {
    channelId: '7f3a9c21-6d84-4b5e-9a12-c8e7f4d20361',
    channelName: 'King of the hill',
    ownerId: '64cf7cd9-839d-4fc3-9214-064c7c59346c',
    authRequired: true,
    createdAt: '2026-10-25T18:42:00Z'
  },
  {
    channelId: 'e2b8d641-3f97-4a0c-b526-8d1e7f9a430c',
    channelName: 'Festig fiesta',
    ownerId: '7f969ebe-1353-446d-9fa6-602635c8289d',
    authRequired: false,
    createdAt: '2026-10-23T18:39:00Z'
  }
]

export const channelMessages = [
  {
    channelId: '7f3a9c21-6d84-4b5e-9a12-c8e7f4d20361',
    timeStamp: '2026-10-27T18:42:00Z',
    messageId: 'a84e2f71-9c36-4d0b-b815-7f2a6e93c401',
    ownerId: '64cf7cd9-839d-4fc3-9214-064c7c59346c',
    message: 'Oh, hello there!'
  },
  {
    channelId: 'e2b8d641-3f97-4a0c-b526-8d1e7f9a430c',
    timeStamp: '2026-10-27T18:45:00Z',
    messageId: '3d7b9a52-e184-46c0-8f63-2a5d7e91b406',
    ownerId: '7f969ebe-1353-446d-9fa6-602635c8289d',
    message: 'Hi, you new here?'
  },
  {
    channelId: 'e2b8d641-3f97-4a0c-b526-8d1e7f9a430c',
    timeStamp: '2026-10-27T19:03:00Z',
    messageId: 'f1c6e830-5a27-4b94-a3d8-6e2f9c71b540',
    ownerId: '64cf7cd9-839d-4fc3-9214-064c7c59346c',
    message: 'No! I am king!'
  }
]

export const conversation = {
  participants: ['64cf7cd9-839d-4fc3-9214-064c7c59346c', '7f969ebe-1353-446d-9fa6-602635c8289d'],
  conversationId: 'c9f42a17-8e63-4b05-a1d7-5f2e9c8b3640',
  createdAt: '2026-10-25T19:03:00Z',
}

export const conversationMessages = [
  {
    conversationId: 'c9f42a17-8e63-4b05-a1d7-5f2e9c8b3640',
    ownerId: '64cf7cd9-839d-4fc3-9214-064c7c59346c',
    message: 'hello there!',
    timeStamp: '2026-10-26T19:03:00Z',
    messageId: ''
  },
  {
    conversationId: 'c9f42a17-8e63-4b05-a1d7-5f2e9c8b3640',
    ownerId: '7f969ebe-1353-446d-9fa6-602635c8289d',
    message: 'hello yourself!',
    timeStamp: '2026-10-26T21:03:00Z',
    messageId: ''
  }
]