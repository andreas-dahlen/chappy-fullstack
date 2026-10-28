import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getAccessKeys } from './keys.ts';


const keys = getAccessKeys()

export const tableName: string = 'Chappy'

const client: DynamoDBClient = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretAccessKey,
  },
});

const db: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export default db