import express, { Router } from 'express'
import { authRequired } from '../middleware/express/authRequired.ts'
import { participantIdParser } from '../middleware/express/participantIdParser.ts'
import { getConversationId } from '../auth/getConversationId.ts'
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import db, { tableName } from '../aws/aws.ts'
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { dbMetaConversationSchema, dbMsgArraySchema, messageStringSchema } from '@chappy/shared'
import type { Conversation, DbMessageData, DbMetaConversation, Message, MessageData, Participant, UUID } from '@chappy/shared'
import { conversationIdParser } from '../middleware/express/conversationIdParser.ts'
import type { ConversationIdParam, ParticipantParam } from '../types/db.types.ts'
import { randomUUID } from 'node:crypto'

const router: Router = express.Router()


router.get<ConversationIdParam, Participant | void>('/:conversationId',
  authRequired, conversationIdParser, async (_req, res) => {
    const authId: UUID = res.locals.authenticatedUserId
    const conversationId: UUID = res.locals.conversationId

    try {
      const metaData = await db.send(new GetCommand({
        TableName: tableName,
        Key: {
          pk: 'CONVERSATION',
          sk: `META#${conversationId}`
        }
      }))
      if (!metaData.Item) {
        res.sendStatus(404)
        return
      }
      const parsedMeta = dbMetaConversationSchema.parse(metaData.Item)
      const allowed = parsedMeta.participants.includes(authId)

      if (!allowed) {
        res.sendStatus(403)
        return
      }
      const participantId = parsedMeta.participants.find(id => id !== authId)

      if (!participantId) {
        res.sendStatus(500)
        return
      }

      res.status(200).send({ participantId })

    } catch {
      res.sendStatus(500)
    }
  })

router.post<ParticipantParam, Conversation | void>('/:participantId',
  authRequired, participantIdParser, async (_req, res) => {
    const authId: UUID = res.locals.authenticatedUserId
    const participantId: UUID = res.locals.participantId

    if (authId === participantId) {
      res.sendStatus(400)
      return
    }

    const conversationId = getConversationId(authId, participantId)

    const metaKey = {
      pk: 'CONVERSATION',
      sk: `META#${conversationId}`
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

router.get<ConversationIdParam, MessageData[]>('/:conversationId/messages',
  authRequired, conversationIdParser, async (_, res) => {
    const authId: UUID = res.locals.authenticatedUserId
    const conversationId: UUID = res.locals.conversationId
    try {
      const metaData = await db.send(new GetCommand({
        TableName: tableName,
        Key: {
          pk: 'CONVERSATION',
          sk: `META#${conversationId}`
        }
      }))
      if (!metaData.Item) {
        res.sendStatus(404)
        return
      }
      const parsedMeta = dbMetaConversationSchema.parse(metaData.Item)
      const allowed = parsedMeta.participants.includes(authId)

      if (!allowed) {
        res.sendStatus(403)
        return
      }

      const result = await db.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `CONVERSATION#${conversationId}`,
          ':sk': 'MSG#'
        }
      }))


      const dbMessages: DbMessageData[] = dbMsgArraySchema.parse(result.Items)

      const messages: MessageData[] = dbMessages.map(msg => {
        return {
          createdBy: msg.ownerId,
          message: msg.message,
          messageId: msg.messageId,
          createdAt: msg.timestamp
        }
      })
      res.status(200).send(messages)
    } catch {
      res.sendStatus(500)
    }
  })

router.post<ConversationIdParam, MessageData, Message>('/:conversationId/messages',
  authRequired, conversationIdParser, express.json(), async (req, res) => {
    const conversationId: UUID = res.locals.conversationId
    const authId: UUID = res.locals.authenticatedUserId

    try {
      const parsedMsg = messageStringSchema.safeParse(req.body)

      if (!parsedMsg.success) {
        res.sendStatus(400)
        return
      }

      const metaData = await db.send(new GetCommand({
        TableName: tableName,
        Key: {
          pk: 'CONVERSATION',
          sk: `META#${conversationId}`
        }
      }))

      if (!metaData.Item) {
        res.sendStatus(404)
        return
      }

      const parsedMeta = dbMetaConversationSchema.parse(metaData.Item)
      const allowed = parsedMeta.participants.includes(authId)

      if (!allowed) {
        res.sendStatus(403)
        return
      }

      const messageId: UUID = randomUUID()
      const timestamp = new Date().toISOString()

      await db.send(new PutCommand({
        TableName: tableName,
        Item: {
          pk: `CONVERSATION#${conversationId}`,
          sk: `MSG#${timestamp}#${messageId}`,
          ownerId: authId,
          message: parsedMsg.data.message,
          messageId,
          timestamp
        } satisfies DbMessageData
      }))

      const returnData: MessageData = {
        createdBy: authId,
        message: parsedMsg.data.message,
        messageId,
        createdAt: timestamp
      }

      res.status(201).send(returnData)
    } catch {
      res.sendStatus(500)
    }
  })

export default router