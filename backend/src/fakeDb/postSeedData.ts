import db, { tableName } from '../aws/aws.ts'
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { generateSeedData } from './generateSeedData.ts'

export async function postSeedData() {
  const data = generateSeedData()

  try {
    for (let i = 0; i < data.length; i += 25) {
      let unprocessedItems: NonNullable<
        BatchWriteCommandInput['RequestItems']
      >[string] = data.slice(i, i + 25).map(Item => ({
        PutRequest: { Item }
      }))

      do {
        const result = await db.send(new BatchWriteCommand({
          RequestItems: {
            [tableName]: unprocessedItems
          }
        }))

        unprocessedItems = result.UnprocessedItems?.[tableName] ?? []

        if (unprocessedItems.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } while (unprocessedItems.length > 0) //TODO add max attempts
    }

    console.log('Seed data successfully written')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to seed data:', message)
    throw error
  }
}