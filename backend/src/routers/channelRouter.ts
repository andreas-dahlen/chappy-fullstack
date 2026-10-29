import express, { Router } from 'express'
import db, { tableName } from '../aws/aws.ts'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dbChannelArraySchema, type Channel, type DbChannel } from '@chappy/shared'

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


export default router