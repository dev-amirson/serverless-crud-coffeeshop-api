const AWS = require("aws-sdk");

const getDynamoClient = () => {
  if (process.env.STAGE === "local") {
    return new AWS.DynamoDB.DocumentClient({
      endpoint: "http://localhost:8000",
      region: "localhost",
      accessKeyId: "local",
      secretAccessKey: "local",
    });
  }

  return new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || "us-east-1",
  });
};

module.exports = { getDynamoClient };
