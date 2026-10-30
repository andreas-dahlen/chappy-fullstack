import express, { type Router } from 'express'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../envGetters/getJwtSecret.ts'
import { dbSignInSchema, dbUserSchema, type Credentials } from '@chappy/shared'
import type { JwtResponse } from '../types/response.types.ts'
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import db, { tableName } from '../aws/aws.ts'
import { compare } from 'bcrypt'

const { sign } = jwt

const router: Router = express.Router()

router.post<{}, JwtResponse | void, Credentials>('/', express.json(), async (req, res) => {
  const parsed = dbSignInSchema.safeParse(req.body)
  if (parsed.error) {
    res.sendStatus(400)
    return
  }
  const input = parsed.data
  try {

    const data = await db.send(new GetCommand({
      TableName: tableName,
      Key: {
        pk: 'USER',
        sk: `USER#${input.username}`
      }
    }))

    if (!data.Item) {
      res.sendStatus(401)
      return
    }


    const check = dbUserSchema.safeParse(data.Item)

    if (!check.success) {
      res.sendStatus(500)
      return
    }

    const user = check.data

    const isPasswordValid = await compare(input.password, user.hashPassword)

    if (!isPasswordValid) {
      res.sendStatus(401)
      return
    }

    const token = sign({ uuid: user.ownerId }, getJwtSecret(), { expiresIn: '1h' })

    res.status(200).send({ token, userId: user.ownerId, name: user.name })
  } catch {
    res.sendStatus(500)
  }
})

export default router