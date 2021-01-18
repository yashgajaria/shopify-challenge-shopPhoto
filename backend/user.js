// import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  // const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableNameUsers,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      uploads: [],
      like: [],
      dislike: [],
      cart: [],
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});

export const get = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameUsers,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    }
  };

  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
