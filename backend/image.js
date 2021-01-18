import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  var imageId= uuid.v1();
  var price=0;
  if (data.price) price=parseFloat(data.price);
  const params = {
    TableName: process.env.tableNameImages,
    Item: {
      imageId: imageId,
      attachment: data.attachment,
      owner: event.requestContext.identity.cognitoIdentityId,
      like: [],
      dislike: [],
      caption: data.caption,
      link: "",
      price: price,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  // Update user table with imageId
  const userUpdate = {
    TableName: process.env.tableNameUsers,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    },
    UpdateExpression: "SET #im = list_append(#im, :vals)",
    ExpressionAttributeNames: {
        "#im": "uploads"
    },
    ExpressionAttributeValues: {
      ":vals":
          [imageId]
    },
    ReturnValues: "ALL_NEW"
  };
    await dynamoDb.update(userUpdate);

    return params.Item;
});

export const get = handler(async (event, context) => {
  //Scans the image table and returns all the images
    const params = {
      TableName: process.env.tableNameImages,
      ProjectionExpression: ["attachment", "caption", "imageId"]
    };
    const result = await dynamoDb.scan(params);
    return result.Items;
  });

  export const getSpecific = handler(async (event, context) => {
    //Given a specific image, this function returns only that specific image
    const params = {
      TableName: process.env.tableNameImages,
      Key: {
        imageId: event.pathParameters.id
      }
    };
    const result = await dynamoDb.get(params);
    if ( ! result.Item) {
      throw new Error("Item not found.");
    }
    //Return the retrieved item
    return result.Item;
});