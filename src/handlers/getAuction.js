import AWS from "aws-sdk";
import createError from "http-errors";

// lib
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;

  try {
    const results = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = results.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
