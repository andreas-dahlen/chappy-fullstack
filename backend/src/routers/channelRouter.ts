import express, { Router } from 'express'
import db, { tableName } from '../aws/aws.ts'
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dbChannelArraySchema, dbChannelMsgArraySchema, dbChannelSchema, type Channel, type DbChannel, type DbMessageData, type MessageData } from '@chappy/shared'
import type { ChannelIdParam } from '../types/db.types.ts'
import { optionalAuth } from '../middleware/express/optionalAuth.ts'
import { channelIdParser } from '../middleware/express/channelIdParser.ts'

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

    if (dbChannel.authRequired && !res.locals.authenticatedUser) {
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


    const dbMessages: DbMessageData[] = dbChannelMsgArraySchema.parse(result.Items)

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


export default router