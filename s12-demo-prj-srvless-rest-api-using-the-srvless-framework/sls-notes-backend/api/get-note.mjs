/**
 * Route: GET /note/n/{note_id}
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import _ from "underscore";
import * as util from "./util.mjs";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    const note_id = decodeURIComponent(event.pathParameters.note_id);

    const params = {
      TableName: tableName,
      IndexName: "note_id-index",
      KeyConditionExpression: "note_id = :note_id",
      ExpressionAttributeValues: {
        ":note_id": note_id,
      },
      Limit: 1,
    };

    const queryCmd = new QueryCommand(params);
    const data = await ddbDocClient.send(queryCmd);
    console.log(`QueryCommand response: ${JSON.stringify(data, null, 2)}`);

    if (!_.isEmpty(data.Items)) {
      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(data.Items[0]),
      };
    } else {
      return {
        statusCode: 404,
        headers: util.getResponseHeaders(),
      };
    }
  } catch (err) {
    console.log(`Error occured: ${err}`);

    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
