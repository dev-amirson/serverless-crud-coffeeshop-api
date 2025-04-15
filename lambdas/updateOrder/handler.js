const AWS = require("aws-sdk");
const { getDynamoClient } = require("../../utils/dynamoClient");

const dynamoDb = getDynamoClient();

module.exports.updateOrder = async (event) => {
  const orderId = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const { name, address, coffeeTypes } = body;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { orderId },
    UpdateExpression: "set #n = :n, address = :a, coffeeTypes = :c",
    ExpressionAttributeNames: { "#n": "name" },
    ExpressionAttributeValues: {
      ":n": name,
      ":a": address,
      ":c": coffeeTypes,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order updated successfully", orderId }),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update order" }),
    };
  }
};
