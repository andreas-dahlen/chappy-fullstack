import express, { Router } from 'express'
import db, { tableName } from '../aws/aws.ts'
import { BatchWriteCommand, DeleteCommand, GetCommand, PutCommand, QueryCommand, type BatchWriteCommandInput, type QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { dbChannelArraySchema, dbChannelSchema, dbKeyArraySchema, dbMsgArraySchema, messageStringSchema, type Channel, type DbChannel, type DbKey, type DbMessageData, type Message, type MessageData, type UUID } from '@chappy/shared'
import type { ChannelIdParam } from '../types/db.types.ts'
import { optionalAuth } from '../middleware/express/optionalAuth.ts'
import { channelIdParser } from '../middleware/express/channelIdParser.ts'
import { randomUUID } from 'node:crypto'
import { authRequired } from '../middleware/express/authRequired.ts'
import { DeleteRequest$ } from '@aws-sdk/client-dynamodb'
import { batchWrite } from '../utils/batchWrite.ts'

const router: Router = express.Router()

router.get<{}, Channel[]>('/', async (_, res) => {
  try {
    const result = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'CHANNEL'
      }
    }))

    const dbChannels: DbChannel[] = dbChannelArraySchema.parse(result.Items)

    const channels: Channel[] = dbChannels.map(item => {
      const { sk, name, ownerId, timestamp, authRequired } = item

      return {
        channelId: sk.replace('CHANNEL#', ''),
        channelName: name,
        createdBy: ownerId,
        createdAt: timestamp,
        authRequired

      }
    })
    res.status(200).send(channels)
  } catch {
    res.sendStatus(500)
  }
})

router.get<ChannelIdParam, MessageData[]>('/:channelId/messages', channelIdParser, optionalAuth, async (_, res) => {
  try {
    const data = await db.send(new GetCommand({
      TableName: tableName,
      Key: {
        pk: 'CHANNEL',
        sk: `CHANNEL#${res.locals.channelId}`
      }
    }))
    if (!data.Item) {
      res.sendStatus(404)
      return
    }

    const dbChannel: DbChannel = dbChannelSchema.parse(data.Item)

    if (dbChannel.authRequired && !res.locals.authenticatedUserId) {
      res.sendStatus(401)
      return
    }

    const result = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `CHANNEL#${res.locals.channelId}`
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

router.post<ChannelIdParam, MessageData, Message>('/:channelId/messages',
  channelIdParser, optionalAuth, express.json(), async (req, res) => {
    try {
      const parsedMsg = messageStringSchema.safeParse(req.body)

      if (!parsedMsg.success) {
        res.sendStatus(400)
        return
      }

      const data = await db.send(new GetCommand({
        TableName: tableName,
        Key: {
          pk: `CHANNEL`,
          sk: `CHANNEL#${res.locals.channelId}`
        }
      }))
      if (!data.Item) {
        res.sendStatus(404)
        return
      }

      const dbChannel: DbChannel = dbChannelSchema.parse(data.Item)

      if (dbChannel.authRequired && !res.locals.authenticatedUserId) {
        res.sendStatus(401)
        return
      }


      const ownerId = res.locals.authenticatedUserId ?? 'guest'
      const messageId: UUID = randomUUID()
      const timestamp = new Date().toISOString()

      await db.send(new PutCommand({
        TableName: tableName,
        Item: {
          pk: `CHANNEL#${res.locals.channelId}`,
          sk: `MSG#${timestamp}#${messageId}`,
          ownerId,
          message: parsedMsg.data.message,
          messageId,
          timestamp
        } satisfies DbMessageData
      }))

      const returnData: MessageData = {
        createdBy: ownerId,
        message: parsedMsg.data.message,
        messageId,
        createdAt: timestamp
      }

      res.status(201).send(returnData)
    } catch {
      res.sendStatus(500)
    }
  })

router.delete<ChannelIdParam>('/:channelId',
  authRequired, channelIdParser, async (req, res) => {
    const channelId = res.locals.channelId
    const authId = res.locals.authenticatedUserId

    const Key = {
      pk: 'CHANNEL',
      sk: `CHANNEL#${channelId}`
    }

    const data = await db.send(new GetCommand({
      TableName: tableName,
      Key
    }))

    if (!data.Item) {
      res.sendStatus(404)
      return
    }

    const dbChannel: DbChannel = dbChannelSchema.parse(data.Item)

    if (authId !== dbChannel.ownerId) {
      res.sendStatus(403)
      return
    }

    let ExclusiveStartKey: QueryCommandInput['ExclusiveStartKey']

    do {
      const msgs = await db.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `CHANNEL#${channelId}`
        },
        ProjectionExpression: 'pk, sk',
        ...(ExclusiveStartKey && { ExclusiveStartKey })
      }))

      const dbMessageKeys: DbKey[] = dbKeyArraySchema.parse(msgs.Items ?? [])

      for (let i = 0; i < dbMessageKeys.length; i += 25) {
        const batch = dbMessageKeys.slice(i, i + 25).map(({ pk, sk }) => ({
          DeleteRequest: {
            Key: { pk, sk }
          }
        }))

        await batchWrite(batch)
      }

      ExclusiveStartKey = msgs.LastEvaluatedKey
    } while (ExclusiveStartKey)

    await db.send(new DeleteCommand({
      TableName: tableName,
      Key,
      ConditionExpression: 'attribute_exists(pk)'
    }))

    res.sendStatus(204)
  })

//TODO create / delete
export default router