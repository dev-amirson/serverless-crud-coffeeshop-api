const AWS = require("aws-sdk");
const { getDynamoClient } = require("../../utils/dynamoClient");
const uuid = require("uuid");

const dynamoDb = getDynamoClient();

const placeOrder = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, address, coffeeTypes } = body;

    if (!name || !address || !coffeeTypes || !Array.isArray(coffeeTypes)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message:
            "Invalid request. Name, address, and coffeeTypes (array) are required.",
        }),
      };
    }

    const orderId = uuid.v4();
    const createdAt = new Date().toISOString();

    const orderItem = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        orderId,
        name,
        address,
        coffeeTypes,
        createdAt,
      },
    };

    await dynamoDb.put(orderItem).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Order placed successfully",
        order: {
          orderId,
          name,
          address,
          coffeeTypes,
          createdAt,
        },
      }),
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Error placing order",
        error: error.message,
      }),
    };
  }
};

module.exports = {
  placeOrder,
};
