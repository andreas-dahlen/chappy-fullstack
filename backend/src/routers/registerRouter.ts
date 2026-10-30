import express, { type Router } from 'express'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../envGetters/getJwtSecret.ts'
import { registerSchema, type Credentials } from '@chappy/shared'
import type { JwtResponse } from '../types/response.types.ts'
import { createUser } from '../auth/createUser.ts'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import db, { tableName } from '../aws/aws.ts'
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'

const { sign } = jwt

const router: Router = express.Router()

router.post<{}, JwtResponse | void, Credentials>('/', express.json(), async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (parsed.error) {
    res.sendStatus(400)
    return
  }
  const input = parsed.data
  try {
    const user = await createUser(input)

    await db.send(new PutCommand({
      TableName: tableName,
      Item: {
        pk: 'USER',
        sk: `USER#${user.username}`,
        name: user.name,
        ownerId: user.ownerId,
        hashPassword: user.hashPassword
      },
      ConditionExpression: 'attribute_not_exists(pk)'
    }))

    const jwt = sign({ uuid: user.ownerId }, getJwtSecret(), { expiresIn: '1h' })

    res.status(201).send({ jwt, userId: user.ownerId, name: user.name })
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      res.sendStatus(409)
      return
    }

    res.sendStatus(500)
  }
})

export default router