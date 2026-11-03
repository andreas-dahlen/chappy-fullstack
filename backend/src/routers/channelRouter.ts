import express, { Router } from 'express'
import db, { tableName } from '../aws/aws.ts'
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dbChannelArraySchema, dbChannelSchema, dbMsgArraySchema, messageStringSchema, type Channel, type DbChannel, type DbMessageData, type Message, type MessageData, type UUID } from '@chappy/shared'
import type { ChannelIdParam } from '../types/db.types.ts'
import { optionalAuth } from '../middleware/express/optionalAuth.ts'
import { channelIdParser } from '../middleware/express/channelIdParser.ts'
import { randomUUID } from 'node:crypto'

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


export default router