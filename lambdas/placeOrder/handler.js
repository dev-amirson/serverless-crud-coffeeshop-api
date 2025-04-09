const AWS = require("aws-sdk");
const uuid = require("uuid");

const isLocal = process.env.STAGE === 'local'; // Check if in local environment
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  ...(isLocal && {
    endpoint: "http://localhost:8000", // Local DynamoDB endpoint
    region: "localhost",
    accessKeyId: "local",
    secretAccessKey: "local",
  }),
});


module.exports.placeOrder = async (event) => {
  
  const body = JSON.parse(event.body);
  console.log("body : ", body)
  const { name, address, coffeeTypes } = body;

  // Generate a unique order ID
  const orderId = uuid.v4();

  // Prepare the order item
  const orderItem = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      orderId,
      name,
      address,
      coffeeTypes, // An array of coffee types and quantities
      createdAt: new Date().toISOString(),
    },
  };

  try {
    // Save the order to DynamoDB
    await dynamoDb.put(orderItem).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order placed successfully",
        order: {
          orderId,
          name,
          address,
          coffeeTypes,
          createdAt: orderItem.Item.createdAt,
        },
      }),
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to place order" }),
    };
  }
};
