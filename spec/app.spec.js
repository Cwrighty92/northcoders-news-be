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
  describe("<<<<<<<NorthCoders News>>>>>>", () => {
    describe("<<<<<<<<<Topics>>>>>>>>>", () => {
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
              `${test} is in an incorrect format or does not exist Check the ReadMe`
            );
          });
      });
      it("Returns error status of 400 with invalid mongo Id", () => {
        const test = 2342;
        return request
          .get(`/api/topics/${test}/articles`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `${test} is in an incorrect format or does not exist Check the ReadMe`
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
      it("Test posting an article another incorrect format", () => {
        return request
          .post(`/api/topics/${topicDoc[0]._id}/articles`)
          .send({ anything: "Blah Blah Blah", anything2: 2324 })
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
    describe("<<<<<<<<<<Users>>>>>>>>>", () => {
      it("Returns all Topics with Status 200 with valid url", () => {
        return request
          .get(`/api/users`)
          .expect(200)
          .then(res => {
            expect(res.body.users.length).to.equal(2);
            expect(res.body.users[0].username).to.equal("butter_bridge");
            expect(res.body.users[0]).to.have.all.keys(
              "_id",
              "username",
              "name",
              "avatar_url",
              "__v"
            );
          });
      });
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
    describe("<<<<<<<<<<<Articles>>>>>>>>>>>", () => {
      it("Check can get all articles and also status 200", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(4);
            expect(res.body.articles[0]).to.have.all.keys(
              "votes",
              "_id",
              "title",
              "body",
              "commentCount",
              "created_at",
              "created_by",
              "belongs_to",
              "__v"
            );
          });
      });

      it("Test can get single article", () => {
        return request
          .get(`/api/articles/${articleDoc[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article).to.have.all.keys(
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

      it("Check can get all of one articles comments", () => {
        return request
          .get(`/api/articles/${articleDoc[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments.length).to.equal(2);
            expect(res.body.comments[0]).to.have.all.keys(
              "votes",
              "_id",
              "body",
              "belongs_to",
              "created_by",
              "created_at",
              "__v"
            );
          });
      });
      it("Check error occurs when an invalid aritcle has been entered", () => {
        return request
          .get("/api/articles/abc/comments")
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "abc is in an incorrect format or does not exist Check the ReadMe"
            );
          });
      });

      it("Check we can add a comment ot an article in test", () => {
        return request
          .post(`/api/articles/${articleDoc[0]._id}/comments`)
          .send({
            body: "Test Comment",
            created_by: `${userDoc[0]._id}`,
            belongs_to: `${articleDoc[0]._id}`
          })
          .expect(201)
          .then(res => {
            expect(res.body.comment).to.contain.all.keys(
              "votes",
              "_id",
              "created_by",
              "body",
              "belongs_to",
              "created_at",
              "__v"
            );
          });
      });

      it("Check we can not add a comment in the wrong format", () => {
        return request
          .post(`/api/articles/${articleDoc[0]._id}/comments`)
          .send({
            anything: "blah blah blah"
          })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "The object provided is not in the correct format please see the readMe for guidance"
            );
          });
      });
      it("Check we can not add a comment in another wrong format", () => {
        return request
          .post(`/api/articles/${articleDoc[0]._id}/comments`)
          .send({ anything: "blah blah blah", anythngAgain: 3232 })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "The object provided is not in the correct format please see the readMe for guidance"
            );
          });
      });

      it("Check voting system works when adding a vote on", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles[0].votes).to.equal(0);
          })
          .then(res => {
            return request
              .put(`/api/articles/${articleDoc[0]._id}?vote=up`)
              .expect(200)
              .then(res => {
                expect(res.body.article.n).to.equal(1);
              })
              .then(res => {
                return request
                  .get("/api/articles")
                  .expect(200)
                  .then(res => {
                    expect(res.body.articles[0].votes).to.equal(1);
                  });
              });
          });
      });
      it("Check voting system works when vote is 0 that it can't be reduced any further", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles[2].votes).to.equal(0);
          })
          .then(res => {
            return request
              .put(`/api/articles/${articleDoc[0]._id}?vote=down`)
              .expect(200)
              .then(res => {
                expect(res.body.article.n).to.equal(1);
              })
              .then(res => {
                return request
                  .get("/api/articles")
                  .expect(200)
                  .then(res => {
                    expect(res.body.articles[2].votes).to.equal(0);
                  });
              });
          });
      });
      it("Check invalid vote query", () => {
        return request
          .put(`/api/articles/${articleDoc[0]._id}?vote=wrong`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "Bad request: Only takes up or down query to make a vote"
            );
          });
      });
    });

    describe.only("<<<<<<<<<Comments>>>>>>>>>>>>", () => {
      it("Check can get all comments and also status 200", () => {
        return request
          .get("/api/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments.length).to.equal(8);
            expect(res.body.comments[0]).to.have.all.keys(
              "votes",
              "_id",
              "body",
              "belongs_to",
              "created_by",
              "created_at",
              "__v"
            );
          });
      });
      it("Check voting system works when adding a vote on", () => {
        return request
          .get("/api/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].votes).to.equal(7);
          })
          .then(res => {
            return request
              .put(`/api/comments/${commentDoc[0]._id}?vote=up`)
              .expect(200)
              .then(res => {
                expect(res.body.comment.n).to.equal(1);
              })
              .then(res => {
                return request
                  .get("/api/comments")
                  .expect(200)
                  .then(res => {
                    expect(res.body.comments[0].votes).to.equal(8);
                  });
              });
          });
      });
      it("Check voting system works when removing a vote", () => {
        return request
          .get("/api/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].votes).to.equal(7);
          })
          .then(res => {
            return request
              .put(`/api/comments/${commentDoc[0]._id}?vote=down`)
              .expect(200)
              .then(res => {
                expect(res.body.comment.n).to.equal(1);
              })
              .then(res => {
                return request
                  .get("/api/comments")
                  .expect(200)
                  .then(res => {
                    expect(res.body.comments[0].votes).to.equal(6);
                  });
              });
          });
      });
      it("Check invalid vote query", () => {
        return request
          .put(`/api/articles/${articleDoc[0]._id}?vote=wrong`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "Bad request: Only takes up or down query to make a vote"
            );
          });
      });
      it("DELETE returns status 204 and body is empty", () => {
        return request
          .delete(`/api/comments/${commentDoc[0]._id}`)
          .expect(204)
          .then(res => {
            expect(res.body).to.be.empty;
          });
      });
      it("DELETE returns status 204 and body is empty on a different comment", () => {
        return request
          .delete(`/api/comments/${commentDoc[1]._id}`)
          .expect(204)
          .then(res => {
            expect(res.body).to.be.empty;
          });
      });
      it("DELETE returns status 400 if id does not exist", () => {
        return request
          .delete(`/api/comments/asdasdasda`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.be.equal(
              "asdasdasda is in an incorrect format or does not exist Check the ReadMe"
            );
          });
      });
    });
  });
});
