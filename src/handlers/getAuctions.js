import AWS from "aws-sdk";
import createError from "http-errors";

// lib
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const results = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    auctions = results.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
