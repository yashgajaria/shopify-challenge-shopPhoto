// import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  //Creates the user in the database
  const params = {
    TableName: process.env.tableNameUsers,
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
  //Returns all of the attributes for a specific user
  const params = {
    TableName: process.env.tableNameUsers,
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
