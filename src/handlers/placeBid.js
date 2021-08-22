import AWS from "aws-sdk";
import createError from "http-errors";

// lib
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  let updatedAuction;
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeNames: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const results = await dynamoDB.update(params).promise();

    updatedAuction = results.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!updatedAuction) {
    throw new createError.NotFound(`Auction with ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid);
