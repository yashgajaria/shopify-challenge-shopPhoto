# shopPhoto- Buy and Sell Images
shopPhoto is a simple app that lets registered users upload/sell images and purchase other people's uploaded images. This project started as a result of the Summer 2021 Shopify Intern Challenge of building an Image Repository.   

Live Deployment: https://shop-photo.netlify.app/ 
## Screenshots
[insert images here]

## Technology used
 - **React** Bootstrap for the frontend (bootstrapped with  [Create React App](https://github.com/facebook/create-react-app))
 - **Node.js** for the backend
 - Frontend is deployed on Netlify 
 - Backend is deployed on **AWS**
	 - DynamoDB is used as the database
	 - S3 Buckets are used to store Images
	 - Cognito is used to handle user signup/login 

## Features
* Create an account to upload and view images
* Upload an image as jpeg, png, or gif and set a description and price for the image
* Browse marketplace of images
* Add images to your personalized cart
* Cart persists state, add items to cart, leave and login somewhere else and cart will remain the same
* Ability to remove items from your cart and view the final total
* Visual feedback on image page once you add image to cart, which can redirect you to the cart
* Frontend validation on price and file upload fields
* Authentication model, that restricts API requests to registered users only

## Installation
* Clone the repository and navigate to the frontend folder
* From the frontend folder run **npm install** and then **npm start**, this will run the frontend in development mode, which can be viewed at http://localhost:3000 in the browser
* To deploy the backend to your own AWS account, the services would have to manually be configured on the console first and using the serverless framework, the **serverless deploy** command could be used from the backend folder to deploy the backend to your own AWS account

## Testing
While setting up and developing the backend I created a mocks folder, which includes some test events that can be invoked through serverless to test some of the API's in command line. On the frontend I performed manual sanity and regressions tests as I was developing features to ensure everything was performing as expected.

## Next Steps
 To improve the functionality of this project, the cart needs the ability to be able to checkout and handle any promotional codes, billing details, and payment processing. Also, I want to add a personal profile page where users will be able to see all their own uploads as well as update their account email/password. 
