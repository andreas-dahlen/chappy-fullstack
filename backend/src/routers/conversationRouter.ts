import express, { Router } from 'express'
import { authRequired } from '../middleware/express/authRequired.ts'
import { participantIdParser } from '../middleware/express/participantIdParser.ts'
import { getConversationId } from '../auth/getConversationId.ts'
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import db, { tableName } from '../aws/aws.ts'
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { dbMetaConversationSchema, type Conversation, type DbMetaConversation, type UUID } from '@chappy/shared'

const router: Router = express.Router()

type ParticipantParam = {
  participantId: string
}

router.post<ParticipantParam, Conversation | void>('/:participantId', authRequired, participantIdParser, async (_req, res) => {
  const authId: UUID = res.locals.authenticatedUserId
  const participantId: UUID = res.locals.participantId

  if (authId === participantId) {
    res.sendStatus(400)
    return
  }

  const conversationId = getConversationId(authId, participantId)

  const metaKey = {
    pk: `CONVERSATION#${conversationId}`,
    sk: 'META'
  }

  try {
    const metaData = await db.send(new GetCommand({
      TableName: tableName,
      Key: metaKey
    }))

    if (!metaData.Item) {
      await db.send(new PutCommand({
        TableName: tableName,
        Item: {
          ...metaKey,
          participants: [authId, participantId]
        } satisfies DbMetaConversation,
        ConditionExpression: 'attribute_not_exists(pk)'
      }))

      res.status(201).send({ conversationId })
      return
    }
    //zod and we don't need safeparse... think we can throw completely...
    const result = dbMetaConversationSchema.parse(metaData.Item)

    const allowed = result.participants.includes(authId)

    const participantExists = result.participants.includes(participantId)

    if (!allowed) {
      res.sendStatus(403)
      return
    }

    if (!participantExists) {
      res.sendStatus(500)
      return
    }

    res.status(200).send({ conversationId })

  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      res.status(200).send({ conversationId })
      return
    }
    res.sendStatus(500)
  }
})


// router.get<{}, Conversation[]>('/', authRequired, async (req, res) => {
//   const authId = res.locals.authenticatedUserId

//   try {
//     // Get the authenticated user's conversation references
//     const convos = await db.send(new QueryCommand({
//       TableName: tableName,
//       KeyConditionExpression: 'pk = :pk',
//       ExpressionAttributeValues: {
//         ':pk': `USER#${authId}`
//       }
//     }))

//     const dbConvos: DbUserConversation =
//       dbUserConversationArraySchema.parse(convos.Items ?? [])

//     // Extract conversation IDs
//     const convoIds: UUID[] = dbConvos.map(convo =>
//       convo.sk.replace('CONVERSATION#', '') as UUID
//     )

//     const metadata: Record<string, unknown>[] = []

//     // BatchGet supports a maximum of 100 keys per request
//     for (let i = 0; i < convoIds.length; i += 100) {
//       let unprocessedKeys: NonNullable<
//         BatchGetCommandInput['RequestItems']
//       > = {
//         [tableName]: {
//           Keys: convoIds.slice(i, i + 100).map(conversationId => ({
//             pk: `CONVERSATION#${conversationId}`,
//             sk: 'META'
//           }))
//         }
//       }

//       let attempts = 0
//       const maxAttempts = 5

//       do {
//         const result = await db.send(new BatchGetCommand({
//           RequestItems: unprocessedKeys
//         }))

//         metadata.push(...(result.Responses?.[tableName] ?? []))

//         unprocessedKeys = result.UnprocessedKeys ?? {}
//         attempts++

//         if (Object.keys(unprocessedKeys).length > 0 &&
//           attempts < maxAttempts) {
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
//       } while (
//         Object.keys(unprocessedKeys).length > 0 &&
//         attempts < maxAttempts
//       )

//       if (Object.keys(unprocessedKeys).length > 0) {
//         throw new Error('Could not retrieve all conversation metadata')
//       }
//     }

//     // Validate retrieved metadata
//     const metaConversations: DbMetaConversation[] =
//       dbMetaConversationArraySchema.parse(metadata)

//     // Build the response
//     const returnData: Conversation[] = metaConversations.map(convo => {
//       const participantId = convo.participants.find(id => id !== authId)

//       if (!participantId) {
//         throw new Error('Could not find conversation participant')
//       }

//       return {
//         conversationId: convo.pk.replace('CONVERSATION#', ''),
//         participantId
//       }
//     })

//     res.status(200).send(returnData)
//   } catch (error) {
//     console.error('Failed to retrieve conversations:', error)
//     res.sendStatus(500)
//   }
// })

export default router