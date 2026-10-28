import express, { Router } from 'express'
import db, { tableName } from '../aws/aws.ts'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dbUserArraySchema, type DbUser, type User } from '@chappy/shared'

const router: Router = express.Router()

router.get<{}, User[]>('/', async (_, res) => {
  try {
    const result = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'USER'
      }
    }))

    const dbUsers: DbUser[] = dbUserArraySchema.parse(result.Items)

    const users: User[] = dbUsers.map(item => {
      const { name, ownerId } = item

      return {
        name,
        userId: ownerId
      }
    })
    res.status(200).send(users)
  } catch {
    res.sendStatus(500)
  }
})


export default router