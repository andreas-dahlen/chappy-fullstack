import { dbAiArraySchema, dbAiMetaArraySchema, dbKeyArraySchema, reqAiMetaSchema, reqMessageSchema, reqSummarizeSchema, type AiMessage, type AiMetaData, type AiMetaInput, type AiResponse, type DbAiMessage, type DbAiMeta, type DbKey, type MessageInput, type SummarizeInput } from '@chappy/shared'
import { sendRequest } from '../gemini/request.ts'
import express, { Router } from 'express'
import { authRequired } from '../middleware/express/authRequired.ts'
import db, { tableName } from '../aws/aws.ts'
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import type { AiIdParam } from '../types/db.types.ts'
import { aiIdParser } from '../middleware/express/aiIdParser.ts'
import { randomUUID, type UUID } from 'node:crypto'
import type { Content } from '@google/genai'
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { summarizeInstruction } from '../gemini/config.ts'
import { batchWrite } from '../utils/batchWrite.ts'

const router: Router = express.Router()

router.post<{}, AiResponse | void, SummarizeInput>('/summarize', express.json(), async (req, res) => {
  const result = reqSummarizeSchema.safeParse(req.body)

  if (!result.success) {
    res.sendStatus(400)
    return
  }

  const summary = await sendRequest(result.data.text, { instruction: summarizeInstruction })

  if (!summary) {
    res.sendStatus(502)
    return
  }

  res.status(200).send(summary)
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
      }
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

router.post<{}, AiMetaData, AiMetaInput>('/chat', authRequired, express.json(), async (req, res) => {

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

    res.status(201).send({
      name: parsed.data.name,
      createdAt: now,
      aiId
    })
  } catch {
    res.sendStatus(500)
  }
})

router.delete<AiIdParam>('chat/:aiId', authRequired, aiIdParser, async (req, res) => {
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
      res.sendStatus(404)
      return
    }

    let ExclusiveStartKey: QueryCommandInput['ExclusiveStartKey']

    do {
      const response = await db.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${aiId}`,
          ':sk': 'AI#'
        },
        ProjectionExpression: 'pk, sk',
        ...(ExclusiveStartKey && { ExclusiveStartKey })
      }))

      const dbKeys: DbKey[] = dbKeyArraySchema.parse(response.Items ?? [])

      for (let i = 0; i < dbKeys.length; i += 25) {
        const batch = dbKeys.slice(i, i + 25).map(({ pk, sk }) => ({
          DeleteRequest: {
            Key: { pk, sk }
          }
        }))
        await batchWrite(batch)
      }
      ExclusiveStartKey = response.LastEvaluatedKey
    } while (ExclusiveStartKey)

    await db.send(new DeleteCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${ownerId}`,
        sk: `META#${aiId}`,
        ConditionExpression: 'attribute_exists(pk)'
      }
    }))

    res.sendStatus(204)

  } catch {
    res.sendStatus(500)
  }
})

router.get<AiIdParam, AiMessage[]>('/chat/:aiId/messages', authRequired, aiIdParser, async (req, res) => {
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
      res.sendStatus(404)
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

    const dbResult: DbAiMessage[] = dbAiArraySchema.parse(response.Items ?? [])

    const result: AiMessage[] = dbResult.reverse().map(db => {
      return {
        role: db.role,
        message: db.message,
        messageId: db.messageId,
        createdAt: db.timestamp,
        duration: db.duration
      } satisfies AiMessage
    })

    res.status(200).send(result)

  } catch {
    res.sendStatus(500)
  }
})

router.post<AiIdParam, AiMessage[], MessageInput>('/chat/:aiId/messages', authRequired, aiIdParser, express.json(), async (req, res) => {
  const aiId = res.locals.aiId
  const authId = res.locals.authenticatedUserId

  try {
    const parsedMsg = reqMessageSchema.safeParse(req.body)

    if (!parsedMsg.success) {
      res.sendStatus(400)
      return
    }

    const metaData = await db.send(new GetCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${authId}`,
        sk: `META#${aiId}`
      }
    }))

    if (!metaData.Item) {
      res.sendStatus(404)
      return
    }

    const timestamp = new Date().toISOString()
    const messageId: UUID = randomUUID()

    const dbHistory = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${aiId}`,
        ':sk': 'AI#'
      },
      ScanIndexForward: false,
      Limit: 50
    }))

    const dbResult: DbAiMessage[] = dbAiArraySchema.parse(dbHistory.Items ?? [])

    const formatted: Content[] = dbResult.reverse().map(db => {
      return {
        role: db.role,
        parts: [{ text: db.message }]
      }
    })
    const request: Content[] = [...formatted, { role: 'user', parts: [{ text: parsedMsg.data.message }] }]
    const response = await sendRequest(request)
    if (!response) {
      res.sendStatus(502)
      return
    }

    const responseTimestamp = new Date().toISOString()
    const responseMessageId: UUID = randomUUID()

    await db.send(new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: `USER#${aiId}`,
              sk: `AI#${timestamp}#${messageId}`,
              role: 'user',
              message: parsedMsg.data.message,
              messageId,
              timestamp
            } satisfies DbAiMessage
          }
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: `USER#${aiId}`,
              sk: `AI#${responseTimestamp}#${responseMessageId}`,
              role: 'model',
              message: response.message,
              duration: response.duration,
              messageId: responseMessageId,
              timestamp: responseTimestamp
            } satisfies DbAiMessage
          }
        }
      ]
    }))

    const userData: AiMessage = {
      role: 'user',
      message: parsedMsg.data.message,
      messageId,
      createdAt: timestamp
    }
    const aiData: AiMessage = {
      role: 'model',
      message: response.message,
      duration: response.duration,
      messageId: responseMessageId,
      createdAt: responseTimestamp
    }


    res.status(201).send([userData, aiData])

  } catch {
    res.sendStatus(500)
  }
})

export default router