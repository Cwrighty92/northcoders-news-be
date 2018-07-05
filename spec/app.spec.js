process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const testData = require("../seed/testData/dataLinks");
const mongoose = require("mongoose");

describe("", () => {
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
  describe("NorthCoders News", () => {
    describe("topics", () => {
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
      it("Returns all Articles for certain Topic", () => {
        console.log(topicDoc[0]._id);
        return request
          .get(`/api/topics/${topicDoc[0]._id}/articles)`)
          .expect(200);
      });
    });
  });
});
