process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const testData = require("../seed/testData/dataLinks");
const mongoose = require("mongoose");

describe("BeforeEachTest<<<<", () => {
  let commentDoc;
  let topicDoc;
  let userDoc;
  let articleDoc;

  beforeEach(() => {
    return seedDB(
      testData.topics,
      testData.users,
      testData.articles,
      testData.comments
    ).then(docs => {
      [commentDoc, topicDoc, userDoc, articleDoc] = docs;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("NorthCoders News<<<<<", () => {
    describe("Topics <<<<<<<<<", () => {
      console.log("connecting");
      it("Returns all Topics with Status 200 with valid url", () => {
        return request
          .get(`/api/topics`)
          .expect(200)
          .then(res => {
            expect(res.body.topics.length).to.equal(2);
            expect(res.body.topics[0].title).to.equal("Mitch");
            expect(res.body.topics[1].title).to.equal("Cats");
            expect(res.body.topics[0].slug).to.equal("mitch");
            expect(res.body.topics[1].slug).to.equal("cats");
            expect(res.body.topics[0]).to.have.all.keys(
              "_id",
              "title",
              "slug",
              "__v"
            );
          });
      });
      it("Returns all Articles for certain Topic with correct status 200", () => {
        return request
          .get(`/api/topics/${topicDoc[0]._id}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles[0].title).to.equal(
              "Living in the shadow of a great man"
            );
            expect(res.body.articles[1].title).to.equal(
              "7 inspirational thought leaders from Manchester UK"
            );
            expect(res.body.articles[0]).to.have.all.keys(
              "votes",
              "_id",
              "title",
              "created_by",
              "body",
              "created_at",
              "belongs_to",
              "__v"
            );
          });
      });
      it("Returns error status of 400 with invalid mongo Id", () => {
        const test = "asds";
        return request
          .get(`/api/topics/${test}/articles`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `${test} is in an incorrect format Check the ReadMe`
            );
          });
      });
      it("Returns error status of 404 with valid mongo Id but Id does not exist", () => {
        const test = "5b3deafebc9b707a5c4d20c1";
        return request
          .get(`/api/topics/${test}/articles`)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(`Page not found for given Id`);
          });
      });
      it("POST article returns status 201 and created article", () => {
        const title = "Code Memorys";
        const body = "Some Thoughts Here";
        return request
          .post(`/api/topics/${topicDoc[0]._id}/articles`)
          .send({
            title,
            body,
            created_by: userDoc[0]._id
          })
          .expect(201)
          .then(res => {
            expect(res.body.newArticle.created_by).to.eql(`${userDoc[0]._id}`);
            expect(res.body.newArticle.belongs_to).to.eql(`${topicDoc[0]._id}`);
            expect(res.body.newArticle.body).to.equal(body);
            expect(res.body.newArticle.title).to.equal(title);
            expect(res.body.message).to.equal("You have added a new Article");
          });
      });
      it("Test posting an article in an incorrect format", () => {
        return request
          .post(`/api/topics/${topicDoc[0]._id}/articles`)
          .send({ anything: "Blah Blah Blah" })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "The object provided is not in the correct format please see the readMe for guidance"
            );
          });
      });
      it("Test posting an article when the topic does not exsist", () => {
        const title = "Code Memorys";
        const body = "Some Thoughts Here";
        const test = "incorrectPath";
        return request
          .post(`/api/topics/${test}/articles`)
          .send({ title, body, created_by: userDoc[0]._id })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `The object provided is not in the correct format please see the readMe for guidance`
            );
          });
      });
    });
    describe.only("Users <<<<<<<", () => {
      it("Check we can grab the user by searching with the userID with a status of 200", () => {
        return request
          .get("/api/users/dedekind561")
          .expect(200)
          .then(res => {
            expect(res.body.user.username).to.equal("dedekind561");
            expect(res.body.user.name).to.equal("mitch");
            expect(res.body.user.avatar_url).to.equal(
              "https://carboncostume.com/wordpress/wp-content/uploads/2017/10/dale-chipanddalerescuerangers.jpg"
            );
            expect(res.body.user).to.have.all.keys(
              "_id",
              "username",
              "name",
              "avatar_url",
              "__v"
            );
          });
      });
      it("Check we can grab a different user by searching with the userID with a status of 200", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(res => {
            expect(res.body.user.username).to.equal("butter_bridge");
            expect(res.body.user.name).to.equal("jonny");
            expect(res.body.user.avatar_url).to.equal(
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            );
            expect(res.body.user).to.have.all.keys(
              "_id",
              "username",
              "name",
              "avatar_url",
              "__v"
            );
          });
      });
      it("Check error occurs when an invalid user has been entered", () => {
        return request
          .get("/api/users/theFaceless")
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(
              "Page not found with given userName, it does not exist"
            );
          });
      });
    });
  });
});
