const AWS = require("aws-sdk");
const { getDynamoClient } = require("../../utils/dynamoClient");

const dynamoDb = getDynamoClient();

module.exports.getOrders = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Environment variables:", JSON.stringify(process.env, null, 2));

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    console.log("DynamoDB params:", JSON.stringify(params, null, 2));
    const result = await dynamoDb.scan(params).promise();
    console.log("DynamoDB result:", JSON.stringify(result, null, 2));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        orders: result.Items,
      }),
    };
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Failed to retrieve orders",
        error: error.message,
      }),
    };
  }
};
