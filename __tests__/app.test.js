const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(data));

afterAll(() => db.end());

describe("Bad URL errors", () => {
  test("404: Responds with Invalid Url! msg", () => {
    return request(app)
      .get("/NotAValidUrl")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Url!");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with object of article information filtered by provide article_id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404: Respond with article_id Not Found! msg when valid article_id provided but article with provided id not exist in database due to id being out of range", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when invalid article_id provided", () => {
    return request(app)
      .get("/api/articles/NotArticleId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: 5,
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Resopnd with an empty array when given article_id does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("404: Respond with article_id Not Found! msg when valid article_id provided but provided id not exist in database due to id being out of range", () => {
    return request(app)
      .get("/api/articles/50000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when invalid article_id provided", () => {
    return request(app)
      .get("/api/articles/NotArticleId/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Respond with the added comment", () => {
    const postObj = {
      username: "lurker",
      body: "Nice article",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(postObj)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 6,
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("404: Respond with username Not Found! msg when trying to add comment with invalid username", () => {
    const postObj = {
      username: "NotAUsername",
      body: "Nice article",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when trying to add comment to invalid article_id", () => {
    const postObj = {
      username: "lurker",
      body: 12345,
    };

    return request(app)
      .post("/api/articles/NotAnArticleId/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Respond with article_id Not Found! msg when trying to add comment to valid article_id but not exist in database", () => {
    const postObj = {
      username: "lurker",
      body: 12345,
    };

    return request(app)
      .post("/api/articles/5000/comments")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request!! msg when trying to add comment without empty object in post object", () => {
    const postObj = {};

    return request(app)
      .post("/api/articles/5/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });

  test("400: Respond with Bad Request!! msg when trying to add comment without username object in post object", () => {
    const postObj = {
      body: "Greate Article",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });

  test("400: Respond with Bad Request!! msg when trying to add comment without body object in post object", () => {
    const postObj = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  describe("Positive votes", () => {
    test("200: Respond with an updated article object with updated votes for given article_id", () => {
      const patchObj = {
        inc_votes: 5,
      };

      return request(app)
        .patch("/api/articles/4")
        .send(patchObj)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 5,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });

  describe("Negative votes", () => {
    test("200: Respond with an updated article object with updated votes for given article_id", () => {
      const patchObj = {
        inc_votes: -15,
      };

      return request(app)
        .patch("/api/articles/6")
        .send(patchObj)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: -15,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });

  test("400: Respond with Bad Request! msg when trying to update article with votes that is not a number", () => {
    const patchObj = {
      inc_votes: "Not A Number",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Respond with Bad Request! msg when trying to update article with valid votes but unvalid article_id ", () => {
    const patchObj = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/NotArticleId")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Respond with article_id Not Found! msg when trying to update article with an article_id that's out of range", () => {
    const patchObj = {
      inc_votes: 2,
    };

    return request(app)
      .patch("/api/articles/1000")
      .send(patchObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request!! msg when trying to update article with empty patch object", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/articles/3")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: When comment deleted successfully", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("400: Respond with Bad Request! When unvalid comment_id is given", () => {
    return request(app)
      .delete("/api/comments/NotCommentId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Respond with comment_id Not Found! msg when given comment_id is valid but out of range", () => {
    return request(app)
      .delete("/api/comments/2000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment_id Not Found!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  describe("Provide valid sort_by column name but nothing given to order", () => {
    test("200: Responds with an array of article objects sorted by article_id in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by title in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by topic in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("topic", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by author in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by votes in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });

    test("200: Responds with an array of article objects sorted by article_img_url in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_img_url")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("article_img_url", {
            descending: true,
          });
        });
    });

    test("200: Responds with an array of article objects sorted by comment_count name in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("comment_count", { descending: true });
        });
    });
  });

  describe("Provide valid order but nothing given to sort_by", () => {
    test("200: Responds with an array of article objects sorted by date in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at");
        });
    });
  });

  describe("Provide valid sort_by column name and valid order", () => {
    test("200: Responds with an array of article objects sorted by article_id in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("article_id");
        });
    });

    test("200: Responds with an array of article objects sorted by title in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("title");
        });
    });

    test("200: Responds with an array of article objects sorted by topic in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("topic");
        });
    });

    test("200: Responds with an array of article objects sorted by author in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author");
        });
    });

    test("200: Responds with an array of article objects sorted by created_at in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at");
        });
    });

    test("200: Responds with an array of article objects sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("votes");
        });
    });

    test("200: Responds with an array of article objects sorted by article_img_url in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_img_url&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("article_img_url");
        });
    });

    test("200: Responds with an array of article objects sorted by comment_count name in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("comment_count");
        });
    });
  });

  describe("Provide unvalid sort_by and valid order or valid sort_by and unvalid order or both unvalid sort_by and order", () => {
    test("400: Responds with Bad Request! msg with unvalid sort_by but valid order", () => {
      return request(app)
        .get("/api/articles?sort_by=NotValidSort&order=asc")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });

    test("400: Responds with Bad Request! msg with valid sort_by but unvalid order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=NotValidOrder")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });

    test("400: Responds with Bad Request! msg with both unvalid sort_by and order", () => {
      return request(app)
        .get("/api/articles?sort_by=NotValidSort&order=NotValidOrder")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });
  });

  describe("Provide empty sort_by or empty order or both empty sort_by and order", () => {
    test("400: Responds with Bad Request! msg with empty sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });

    test("400: Responds with Bad Request! msg with empty order", () => {
      return request(app)
        .get("/api/articles?order=")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });

    test("400: Responds with Bad Request! msg with empty order", () => {
      return request(app)
        .get("/api/articles?sort_by=&order=")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });
  });

  describe("Provide unvalid query", () => {
    test("400: Responds with Bad Request! msg", () => {
      return request(app)
        .get("/api/articles?NotValidQuery")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Responds with an array of article objects filtered by the given topic and default sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((topic) => {
          expect(topic).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true })
      });
  });

  test("200: Respond with an array of all article objects when filtered by empty topic and default sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Respond with an array of article objects when filtered by mitch topic and sorted by author in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("author");
      });
  });

  test("200: Respond with an array of all article objects when filtered by empty topic and sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=&sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("title");
      });
  });

  test("200: Resopnd with an empty array when given topic does not have any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });

  test("404: Respond wiht topic Not found! msg when filtered by topic not in database", () => {
    return request(app)
      .get("/api/articles?topic=NotIncludedTopic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("topic Not Found!");
      });
  });
});
