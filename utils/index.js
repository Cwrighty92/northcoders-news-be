const editArticleData = (topicRef, userRef, articleData) => {
  return articleData.map(document => {
    return {
      ...document,
      belongs_to: topicRef[document.topic],
      created_by: userRef[document.created_by]
    };
  });
};

const editCommentData = (articleRef, userRef, commentData) => {
  return commentData.map(document => {
    return {
      ...document,
      belongs_to: articleRef[document.belongs_to],
      created_by: userRef[document.created_by]
    };
  });
};

//creates ref object for article, comments and topic references
const createRefObject = (mongoDbIdDocs, objRefKey) => {
  return mongoDbIdDocs.reduce((refObject, index) => {
    refObject[index[objRefKey]] = index._id;
    return refObject;
  }, {});
};

module.exports = {
  createRefObject,
  editArticleData,
  editCommentData
};
