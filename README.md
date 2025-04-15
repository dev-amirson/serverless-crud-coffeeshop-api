# Serverless Coffee Shop Order Management System

A modern, serverless application for managing coffee shop orders using AWS Lambda, API Gateway, and DynamoDB.

## Overview

This project implements a full-stack serverless application for managing coffee shop orders. It includes a web-based UI for placing and managing orders, backed by AWS serverless infrastructure.

## Features

- 🚀 Serverless architecture using AWS Lambda and API Gateway
- 📱 Responsive web interface for order management
- ☕ Support for multiple coffee types and quantities
- 🔄 Real-time order updates and management
- 🔒 Secure AWS IAM role-based access control
- 🌐 CORS-enabled API endpoints
- 🔄 CI/CD pipeline with GitHub Actions

## Architecture

The application follows a serverless architecture with the following components:

- **Frontend**: Static HTML/CSS/JS served through Lambda
- **Backend**: AWS Lambda functions for CRUD operations
- **Database**: DynamoDB for order storage
- **API**: API Gateway for REST endpoints
- **CI/CD**: GitHub Actions for automated deployment

## Tech Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- **Backend**:
  - Node.js 18.x
  - AWS Lambda
  - AWS API Gateway
  - AWS DynamoDB
- **DevOps**:
  - Serverless Framework
  - GitHub Actions
  - AWS IAM

## Prerequisites

- Node.js 18.x or higher
- AWS Account with appropriate permissions
- AWS CLI configured
- Docker (for local development)
- Serverless Framework (install globally):

```bash
npm install -g serverless
```

## Project Structure

```
serverless-crud-api/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── lambdas/
│   ├── serveUI/
│   │   ├── handler.js
│   │   ├── index.html
│   │   ├── script.js
│   │   └── styles.css
│   ├── placeOrder/
│   │   └── handler.js
│   ├── getOrders/
│   │   └── handler.js
│   ├── updateOrder/
│   │   └── handler.js
│   └── cancelOrder/
│       └── handler.js
├── utils/
│   └── dynamoClient.js
├── .env
├── package.json
├── serverless.yml
└── README.md
```

## Lambda Functions

- **serveUI**: Serves the static web interface (HTML, CSS, JS)
- **placeOrder**: Creates new coffee orders
- **getOrders**: Retrieves all existing orders
- **updateOrder**: Updates existing orders
- **cancelOrder**: Deletes orders

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dev-amirson/serverless-crud-coffeeshop-api.git
cd serverless-crud-coffeeshop-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:

```
STAGE=dev  # Change to 'local' for local development
AWS_ACCESS_KEY_ID=your_access_key  # Change to 'local' for local development
AWS_SECRET_ACCESS_KEY=your_secret_key  # Change to 'local' for local development
AWS_REGION=us-east-1  # Change to 'localhost' for local development
DYNAMODB_ENDPOINT=http://localhost:8000
```

## Local Development Setup

1. Start DynamoDB Local using Docker:

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local
```

2. Run the application locally:

```bash
npm start

npx serverless offline
```

## Deployment

The application can be deployed to different environments:

### Development Environment

```bash
serverless deploy --stage dev
```

Access the dev environment at: https://9fjlki43m7.execute-api.us-east-1.amazonaws.com/dev/{proxy+}

### Production Environment

```bash
serverless deploy --stage prod
```

Access the prod environment at: https://feif6huji9.execute-api.us-east-1.amazonaws.com/prod/{proxy+}

## API Endpoints

- `GET /{proxy+}` - Serve UI
- `POST /place-order` - Create new order
- `GET /get-orders` - Retrieve all orders
- `PUT /update-order/{id}` - Update existing order
- `DELETE /cancel-order` - Cancel an order

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- Automatic deployment to dev environment on push to `dev` branch
- Automatic deployment to prod environment on pull request to `main` branch
- Manual deployment trigger available through workflow_dispatch

## Dev environment CICD pipeline Screenshot

[![CI/CD Pipeline](/dev-CICD.png)](/dev-CICD.png)

## Dev environment Application Screenshot

[![Coffee Shop Order Management](/dev-application-ui.png)](/dev-application-ui.png)


## Prod environment CICD pipeline Screenshot

[![CI/CD Pipeline](/prod-CICD.png)](/prod-CICD.png)

## Prod environment Application Screenshot

[![Coffee Shop Order Management](/prod-application-ui.png)](/prod-application-ui.png)

## Security

- AWS IAM roles with least privilege principle
- Environment variables for sensitive data
- CORS configuration for API endpoints
- Input validation on all endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Serverless Framework
- AWS Serverless Application Model
- GitHub Actions
- DynamoDB Local

## Contact

Amir Sohail - [@dev-amirson](https://github.com/dev-amirson)

Project Link: [https://github.com/dev-amirson/serverless-crud-coffeeshop-api](https://github.com/dev-amirson/serverless-crud-coffeeshop-api)
