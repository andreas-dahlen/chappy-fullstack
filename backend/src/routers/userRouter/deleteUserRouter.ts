import { authRequired } from '../../middleware/express/authRequired.ts'
import db, { tableName } from '../../aws/aws.ts'
import { DeleteCommand, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { dbKeyArraySchema, dbMetaConvoArraySchema, dbMsgArraySchema, dbUserArraySchema, type DbKey, type DbMessageData, type DbMetaConversation, type DbUser } from '@chappy/shared'
import { batchWrite } from '../../utils/batchWrite.ts'
import userRouter from './userRouter.ts'


userRouter.delete<{}>('/', authRequired, async (req, res) => {
  const authId = res.locals.authenticatedUserId
  try {
    const userResponse = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      FilterExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: {
        ':pk': 'USER',
        ':ownerId': authId
      }
    }))

    const dbUsers: DbUser[] = dbUserArraySchema.parse(userResponse.Items ?? [])

    if (dbUsers.length === 0) {
      res.sendStatus(404)
      return
    }

    if (dbUsers.length > 1) {
      res.sendStatus(500)
      return
    }

    const dbMetaConvos: DbMetaConversation[] = []

    let ExclusiveStartKey: QueryCommandInput['ExclusiveStartKey']
    do {
      const response = await db.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': 'CONVERSATION',
          ':sk': 'META#'
        },
        ...(ExclusiveStartKey && { ExclusiveStartKey })
      }))

      dbMetaConvos.push(
        ...dbMetaConvoArraySchema.parse(response.Items ?? [])
      )

      ExclusiveStartKey = response.LastEvaluatedKey
    } while (ExclusiveStartKey)

    const convoMetaKeys: DbKey[] = []
    for (const convo of dbMetaConvos) {
      if (convo.participants.includes(authId)) {
        convoMetaKeys.push({ pk: convo.pk, sk: convo.sk })
      }
    }

    //conversation message deletetion
    for (const metaKey of convoMetaKeys) {
      let ExclusiveStartKeyConvMsg: QueryCommandInput['ExclusiveStartKey']
      do {
        const conversationMsgResponse = await db.send(new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
          ExpressionAttributeValues: {
            ':pk': `CONVERSATION#${metaKey.sk.replace('META#', '')}`,
            ':sk': 'MSG#'
          },
          ProjectionExpression: 'pk, sk',
          ...(ExclusiveStartKeyConvMsg && { ExclusiveStartKey: ExclusiveStartKeyConvMsg })
        }))

        const dbMessageKeys: DbKey[] = dbKeyArraySchema.parse(conversationMsgResponse.Items ?? [])

        for (let i = 0; i < dbMessageKeys.length; i += 25) {
          const batch = dbMessageKeys.slice(i, i + 25).map(({ pk, sk }) => ({
            DeleteRequest: {
              Key: { pk, sk }
            }
          }))

          await batchWrite(batch)
        }

        ExclusiveStartKeyConvMsg = conversationMsgResponse.LastEvaluatedKey
      } while (ExclusiveStartKeyConvMsg)
    }

    //conversation META deletetion
    for (let i = 0; i < convoMetaKeys.length; i += 25) {
      const metaBatch = convoMetaKeys.slice(i, i + 25).map(({ pk, sk }) => ({
        DeleteRequest: {
          Key: { pk, sk }
        }
      }))
      await batchWrite(metaBatch)
    }

    const channelMetaKeysResponse = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      FilterExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: {
        ':pk': 'CHANNEL',
        ':ownerId': authId
      },
      ProjectionExpression: 'pk, sk',
    }))

    const ownedChannelKeys: DbKey[] = dbKeyArraySchema.parse(channelMetaKeysResponse.Items ?? [])

    //channel message deletion
    for (const ownedChannelKey of ownedChannelKeys) {
      let ExclusiveStartKeyChannelMsg: QueryCommandInput['ExclusiveStartKey']
      do {
        const channelMsgResponse = await db.send(new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
          ExpressionAttributeValues: {
            ':pk': ownedChannelKey.sk,
            ':sk': 'MSG#'
          },
          ProjectionExpression: 'pk, sk',
          ...(ExclusiveStartKeyChannelMsg && { ExclusiveStartKey: ExclusiveStartKeyChannelMsg })
        }))
        const dbMessageKeys: DbKey[] = dbKeyArraySchema.parse(channelMsgResponse.Items ?? [])

        for (let i = 0; i < dbMessageKeys.length; i += 25) {
          const batch = dbMessageKeys.slice(i, i + 25).map(({ pk, sk }) => ({
            DeleteRequest: {
              Key: { pk, sk }
            }
          }))
          await batchWrite(batch)
        }

        ExclusiveStartKeyChannelMsg = channelMsgResponse.LastEvaluatedKey
      } while (ExclusiveStartKeyChannelMsg)
    }

    //channel deletion
    for (let i = 0; i < ownedChannelKeys.length; i += 25) {
      const channelBatch = ownedChannelKeys.slice(i, i + 25).map(({ pk, sk }) => ({
        DeleteRequest: {
          Key: { pk, sk }
        }
      }))
      await batchWrite(channelBatch)
    }

    //update message owners in remaining channels
    const allChannelKeys = await db.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'CHANNEL'
      },
      ProjectionExpression: 'pk, sk'
    }))

    const parsedChannelKeys: DbKey[] = dbKeyArraySchema.parse(allChannelKeys.Items ?? [])

    for (const parsedChannelKey of parsedChannelKeys) {
      let ExclusiveStartKeyChannelEntry: QueryCommandInput['ExclusiveStartKey']
      do {
        const channelMsgResponse = await db.send(new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
          FilterExpression: 'ownerId = :ownerId',
          ExpressionAttributeValues: {
            ':pk': parsedChannelKey.sk,
            ':sk': 'MSG#',
            ':ownerId': authId
          },
          ...(ExclusiveStartKeyChannelEntry && { ExclusiveStartKey: ExclusiveStartKeyChannelEntry })
        }))
        const dbMessageEntries: DbMessageData[] = dbMsgArraySchema.parse(channelMsgResponse.Items ?? [])

        for (let i = 0; i < dbMessageEntries.length; i += 25) {
          const batch = dbMessageEntries.slice(i, i + 25).map(item => ({
            PutRequest: {
              Item: { ...item, ownerId: 'guest' }
            }
          }))
          await batchWrite(batch)
        }

        ExclusiveStartKeyChannelEntry = channelMsgResponse.LastEvaluatedKey
      } while (ExclusiveStartKeyChannelEntry)
    }

    const user = dbUsers[0]!
    //delete user
    await db.send(new DeleteCommand({
      TableName: tableName,
      Key: {
        pk: 'USER',
        sk: `${user.sk}`
      }
    }))

    res.sendStatus(204)
  } catch {
    res.sendStatus(500)
  }
})