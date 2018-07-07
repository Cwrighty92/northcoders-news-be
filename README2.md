NorthCoders News!
The project was to create a API using express and serve data through a seeded mongoDB database. The data is served from 4 different collections - Articles, and Comments which can be posted by Users and Topics which the Articles belong to.

Prerequisites
Ensure you have at least NodeJS v6.1.0 and MongoDB v4.0.0 installed on your machine.

Getting Started

1.  First of all Fork and Clone this repository to your machine
2.  In the terminal CD to the cloned directory and run the following command: npm install
3.  Create a config.js file within the root of the repository and copy the following code in

const config = {
dev: {
DB_URL: "mongodb://localhost:27017/NorthCoders_News"
},
test: {
DB_URL: "mongodb://localhost:27017/nc-news-test"
}
};

module.exports = config[process.env.NODE_ENV];

4.  Run mongod within the terminal

Seeding the database

You should have connected to mongod and now you are ready to create your local DataBase to test/dev on.

run the following command to seed the database:

npm run seed:dev

You should receive a Begining seed successfully done Console.log if the seed has completed

Testing

To run the test database ensure you are CD'd to the repo and run the following command:

npm test

Tests

The test file tests:

1.  That the endpoints of the API function as they should do gaining the right results with the test data used
2.  That errors are given for end points - 400 and 404

Using the API

The below are all available endpoints, you can use a browser preferably google chrome to connect to localhost:9090/api to get any GET requests. I recommend using PostMan for anything else - POST PUT DELETE etc

GET /api
Is the HomePage

GET /api/topics
Returns all Topics

GET /api/topics/:topic_id/articles
Using a valid topic_id gained from Get /api/topics Return all articles for that Topic

GET /api/articles
Returns all articles

GET/api/articles/:aritcle_id/comments
Using a valid article_id gained from Get api/articles Return all comments for that Article

POST /api/articles/:article_id/comments
Add a new comment to an article. This route requires a JSON body in the following format with the exact keys e.g: {"body" : "This is my comment", "created_by" : "5b3deafebc9b707a5c4d20c9", "belongs_to" : ":article_id"} psssttt the article_id is what was used in the url

PUT /api/articles/:article_id
Increment or Decrement the votes of an article by one. This route will require a vote query of "up" or "down" eg: api/articles/:article_id?vote=up

PUT /api/comments/:comment_id
Increment or Decrement the votes of a comment by one. This route will require a vote query of "up" or "down" eg: api/comments/:comment?vote=up

DELETE /api/comments/:comment_id
This will delete a valid comment with the given commment_id eg: api/users/5b3deafebc9b707a5c4d20ef

GET /api/users/:username
This will grab a specific user using their username eg: api/users/jessjelly

Hosted App deployed on Heroku

The following link is the main API page of the application:

https://wrichri-northcoders-news.herokuapp.com/api

MongoDB hosted on Mlabs

Built With

The app was built with:

node.js
Express - to create a restful api
mongoose - to integrate with the database

Authors
Christopher Wright - NorthCoders News

Acknowledgments
The tutors at NorthCoders for being awesome at what they do!
