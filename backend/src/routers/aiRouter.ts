import { dbAiArraySchema, dbAiMetaArraySchema, reqAiMetaSchema, reqSummarizeSchema, type AiMessages, type AiMetaData, type AiMetaInput, type DbAiMessages, type DbAiMeta, type SummarizeInput, type Summary } from '@chappy/shared'
import { sendRequest } from '../gemini/request.ts'
import express, { Router } from 'express'
import { authRequired } from '../middleware/express/authRequired.ts'
import db, { tableName } from '../aws/aws.ts'
import { GetCommand, PutCommand, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { AiIdParam } from '../types/db.types.ts'
import { aiIdParser } from '../middleware/express/aiIdParser.ts'
import { randomUUID } from 'node:crypto'

const router: Router = express.Router()

router.post<{}, Summary | void, SummarizeInput>('/summarize', express.json(), async (req, res) => {
  const result = reqSummarizeSchema.safeParse(req.body)

  if (!result.success) {
    res.sendStatus(400)
    return
  }

  const summary = await sendRequest(result.data.text)

  if (!summary) {
    res.sendStatus(502)
    return
  }

  res.status(200).send({ summary })
})

router.get<{}, AiMetaData[]>('/chat', authRequired, async (req, res) => {
  const ownerId = res.locals.authenticatedUserId

  try {
    const response = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${ownerId}`,
        ':sk': 'META#'
      },
    }))

    const dbResult: DbAiMeta[] = dbAiMetaArraySchema.parse(response.Items ?? [])

    const result = dbResult.map(db => {
      return {
        name: db.name,
        createdAt: db.timestamp,
        aiId: db.sk.replace('META#', '')
      }
    })

    res.status(200).send(result)

  } catch {
    res.sendStatus(500)
  }
})

router.post<{}, void, AiMetaInput>('/chat', authRequired, express.json(), async (req, res) => {

  const parsed = reqAiMetaSchema.safeParse(req.body)

  if (!parsed.success) {
    res.sendStatus(400)
    return
  }

  const ownerId = res.locals.authenticatedUserId

  const aiId = randomUUID()
  const now = new Date().toISOString()

  try {
    await db.send(new PutCommand({
      TableName: tableName,
      Item: {
        pk: `USER#${ownerId}`,
        sk: `META#${aiId}`,
        timestamp: now,
        name: parsed.data.name
      },
      ConditionExpression: 'attribute_not_exists(pk)'
    }))

    res.sendStatus(201)
  } catch {
    res.sendStatus(500)
  }
})

router.get<AiIdParam, AiMessages[]>('/chat/:aiId', aiIdParser, authRequired, async (req, res) => {
  const aiId = res.locals.aiId
  const ownerId = res.locals.authenticatedUserId
  try {

    const metaData = await db.send(new GetCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${ownerId}`,
        sk: `META#${aiId}`
      }
    }))

    if (!metaData.Item) {
      res.sendStatus(404) //or not authed? hmmm forbidden..
      return
    }

    const response = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${aiId}`,
        ':sk': 'AI#'
      },
      ScanIndexForward: false,
      Limit: 50
    }))

    const dbResult: DbAiMessages[] = dbAiArraySchema.parse(response.Items ?? [])

    const result: AiMessages[] = dbResult.reverse().map(db => {
      return {
        role: db.role,
        message: db.message,
        messageId: db.messageId,
        createdAt: db.timestamp
      } satisfies AiMessages
    })

    res.status(200).send(result)

  } catch {
    res.sendStatus(500)
  }
})

export default router



//     const response = await db.send(new QueryCommand({
//       TableName: tableName,
//       KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
//       ExpressionAttributeValues: {
//         ':pk': `USER#${ownerId}`,
//         'sk': 'META#'
//       },
//       ScanIndexForward: false,
//       Limit: 50
//     }))

//     const dbResult: DbAiMessages[] = dbAiArraySchema.parse(response.Items ?? [])

//     const result: AiMessages[] = dbResult.reverse().map(db => {
//       return {
//         role: db.role,
//         message: db.message,
//         messageId: db.messageId,
//         createdAt: db.timestamp
//       } satisfies AiMessages
//     })

//     res.status(200).send(result)

//   } catch {
//     res.sendStatus(500)
//   }
// })