// import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const add = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  //Add the imageId to the user's list of items in their cart
  const params = {
    TableName: process.env.tableNameUsers,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    },
    UpdateExpression: "SET #im = list_append(#im, :vals)",
    ExpressionAttributeNames: {
        "#im": "cart"
    },
    ExpressionAttributeValues: {
      ":vals":
          [data]
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);
  return { status: true };
});

export const get = handler(async (event, context) => {
  //Load the list of items in cart from the users table and then load the corresponding images from the ima  
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

    //Query Images Table to load items in cart
    let Keys = [];
    for (let i = 0; i < result.Item.cart.length; i++) {
      Keys.push({imageId: result.Item.cart[i]});
    }
    if (Keys.length ==0 )return "empty";
    const batchGetParams = {
        RequestItems: {
          [process.env.tableNameImages]: {
            Keys: Keys
          }
        }
      };

      const batchResult = await dynamoDb.batchGet(batchGetParams);
    // Return the retrieved item
    return batchResult.Responses.images;
  });

  export const remove = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    //Get the cart of the current user to see if the item they want to remove is in the cart
    const params = {
      TableName: process.env.tableNameUsers,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
      },
      AttributesToGet: ["cart"]
    };
    const result = await dynamoDb.get(params);
    if ( ! result.Item) {
      throw new Error("Item not found.");
    }
    //Find index of item to remove the retrieved item
    var res= result.Item.cart;

    var itemRemove=100;
    Object.entries(res).map(([index, info]) => {
      if (info == data) itemRemove= index;
    });
    //Deleting the specific item that the user wants deleted from their cart (stored as a list attribute on the user table)
    const deleteParams = {
      TableName: process.env.tableNameUsers,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
      },
      UpdateExpression: `REMOVE cart[${itemRemove}]`,
      ReturnValues: "ALL_NEW"
    };
    var res2= await dynamoDb.update(deleteParams);
    return {result, res2, itemRemove};
  });