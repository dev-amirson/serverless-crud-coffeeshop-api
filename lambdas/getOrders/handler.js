const AWS = require("aws-sdk");

const isLocal = process.env.STAGE === 'local'; // Check if in local environment
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  ...(isLocal && {
    endpoint: "http://localhost:8000", // Local DynamoDB endpoint
    region: "localhost",
    accessKeyId: "local",
    secretAccessKey: "local",
  }),
});

module.exports.getOrders = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        orders: result.Items,
      }),
    };
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve orders" }),
    };
  }
};
