import { BatchWriteCommand, type BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import db, { tableName } from '../aws/aws.ts'

type BatchWriteItems = NonNullable<
  NonNullable<BatchWriteCommandInput['RequestItems']>[string]
>

export async function batchWrite(items: BatchWriteItems) {
  let unprocessedItems = items
  let attempts = 0

  while (unprocessedItems.length > 0 && attempts < 5) {
    const result = await db.send(new BatchWriteCommand({
      RequestItems: {
        [tableName]: unprocessedItems
      }
    }))

    unprocessedItems = result.UnprocessedItems?.[tableName] ?? []
    attempts++

    if (unprocessedItems.length > 0) {
      await new Promise(resolve =>
        setTimeout(resolve, 200 * 2 ** attempts)
      )
    }
  }

  if (unprocessedItems.length > 0) {
    throw new Error('DynamoDB batch write failed after maximum retries')
  }
}