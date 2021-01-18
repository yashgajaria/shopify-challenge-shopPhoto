const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "image-repo-yash"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://cpf9344pl4.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_EHB6W6kUP",
    APP_CLIENT_ID: "4tlfkj2gctg743s01eej7fa51s",
    IDENTITY_POOL_ID: "us-east-2:ed9889bc-8da7-49a9-be04-b6bb3c40a18e"
  }
};
const prod = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "image-repo-yash"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://cpf9344pl4.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_EHB6W6kUP",
    APP_CLIENT_ID: "4tlfkj2gctg743s01eej7fa51s",
    IDENTITY_POOL_ID: "us-east-2:ed9889bc-8da7-49a9-be04-b6bb3c40a18e"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};