import AWS from "aws-sdk";
import createError from "http-errors";

// lib
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const results = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = results.Item;

    if (!auction) {
      throw new createError.NotFound(`Auction with ${id} not found!`);
    }
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  
  let auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
