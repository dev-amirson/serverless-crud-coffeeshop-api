const AWS = require("aws-sdk");
const { getDynamoClient } = require("../../utils/dynamoClient");

const dynamoDb = getDynamoClient();

module.exports.cancelOrder = async (event) => {
  const { orderId } = JSON.parse(event.body);

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing orderId" }),
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { orderId },
  };

  try {
    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order cancelled successfully",
        orderId,
      }),
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to cancel order" }),
    };
  }
};
