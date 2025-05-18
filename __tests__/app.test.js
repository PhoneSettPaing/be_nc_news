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

describe("POST /api/topics", () => {
  test("201: Respond with the added topic", () => {
    const postObj = {
      slug: "New Topic",
      description: "New Description",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "New Topic",
          description: "New Description",
          img_url: null,
        });
      });
  });

  test("409: Respond with Topic/slug already exists! msg when trying to add topic with already existing slug in database", () => {
    const postObj = {
      slug: "mitch",
      description: "Already exist slug",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(409)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic/slug already exists!");
      });
  });

  test("400: Respond with Invalid data type or missing slug and/or description ! msg when trying to add topic with empty object in post object", () => {
    const postObj = {};

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid data type or missing slug and/or description !"
        );
      });
  });

  test("400: Respond with Invalid data type or missing slug and/or description ! msg when trying to add topic without slug property in post object", () => {
    const postObj = {
      description: "Greate Topic",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid data type or missing slug and/or description !"
        );
      });
  });

  test("400: Respond with Invalid data type or missing slug and/or description ! msg when trying to add topic without description property in post object", () => {
    const postObj = {
      slug: "New Topic",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid data type or missing slug and/or description !"
        );
      });
  });

  test("400: Respond with Invalid data type or missing slug and/or description ! msg when trying to add topic with wrong data type in post object", () => {
    const postObj = {
      slug: [1, 2, 3],
      description: "Not Good topic",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid data type or missing slug and/or description !"
        );
      });
  });

  test("400: Respond with Invalid data type or missing slug and/or description ! msg when trying to add topic with empty string values in post object", () => {
    const postObj = {
      slug: "",
      description: " ",
    };

    return request(app)
      .post("/api/topics")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid data type or missing slug and/or description !"
        );
      });
  });
});

describe("GET /api/articles", () => {
  describe("GET /api/articles (without any queries)", () => {
    test("200: Responds with an array of article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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

  describe("GET /api/articles (sorting queries)", () => {
    describe("Provide valid sort_by column name but nothing given to order", () => {
      test("200: Responds with an array of article objects sorted by article_id in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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

      test("200: Responds with an array of article objects sorted by comment_count name in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
    });

    describe("Provide valid order but nothing given to sort_by", () => {
      test("200: Responds with an array of article objects sorted by date in ascending order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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
      test("200: Responds with an array of article objects sorted by author in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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

      test("200: Responds with an array of article objects sorted by comment_count name in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count&order=asc")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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

    describe("Provide invalid sort_by and valid order or valid sort_by and invalid order or both invalid sort_by and order", () => {
      test("400: Responds with Invalid sort_by or order ! msg with invalid sort_by but valid order", () => {
        return request(app)
          .get("/api/articles?sort_by=NotValidSort&order=asc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });

      test("400: Responds with Invalid sort_by or order ! msg with valid sort_by but invalid order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=NotValidOrder")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });

      test("400: Responds with Invalid sort_by or order ! msg with both invalid sort_by and order", () => {
        return request(app)
          .get("/api/articles?sort_by=NotValidSort&order=NotValidOrder")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });
    });

    describe("Provide empty sort_by or empty order or both empty sort_by and order", () => {
      test("400: Responds with Invalid sort_by or order ! msg with empty sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });

      test("400: Responds with Invalid sort_by or order ! msg with empty order", () => {
        return request(app)
          .get("/api/articles?order=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });

      test("400: Responds with Invalid sort_by or order ! msg with empty order", () => {
        return request(app)
          .get("/api/articles?sort_by=&order=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by or order !");
          });
      });
    });

    describe("Provide invalid query", () => {
      test("200: Responds with an array of article objects sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles?NotValidQuery")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(10);
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
  });

  describe("GET /api/articles (topic query)", () => {
    test("200: Responds with an array of article objects filtered by the given topic and default sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(12);
          expect(articles.length).toBe(10);
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
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("200: Respond with an array of all article objects when filtered by empty topic and default sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles?topic=")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(12);
          expect(articles.length).toBe(10);
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
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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

    test("200: Respond with an empty array when given topic does not have any articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(0);
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

  describe("GET /api/articles (pagination)", () => {
    describe("Status 200 tests", () => {
      test("200: Respond with an object containing total_count and array of article objects limited the result by the provided limit", () => {
        return request(app)
          .get("/api/articles?limit=5&p=1")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(5);
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

      test("200: Respond with correct object for limit = 1 and p = 3", () => {
        return request(app)
          .get("/api/articles?limit=1&p=3")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles.length).toBe(1);
            articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                created_at: expect.any(String),
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: 0,
              });
            });
          });
      });

      test("200: Respond with total search result for total_count and empty array for article objects when p is beyond search results", () => {
        return request(app)
          .get("/api/articles?limit=15&p=6")
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(total_count).toBe(13);
            expect(articles).toEqual([]);
          });
      });
    });

    describe("Not a Number test", () => {
      test("400: Respond with Bad Request! msg When limit not a number but p is", () => {
        return request(app)
          .get("/api/articles?limit=NotNumber&p=2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });

      test("400: Respond with Bad Request! msg When p is a number but not limit", () => {
        return request(app)
          .get("/api/articles?limit=5&p=NotNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });

      test("400: Respond with Bad Request! msg When both limit and p are not number", () => {
        return request(app)
          .get("/api/articles?limit=NotNumber&p=NotNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });
    });

    describe("Zero Number test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is 0 but p is positive number", () => {
        return request(app)
          .get("/api/articles?limit=0&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive number but p is 0", () => {
        return request(app)
          .get("/api/articles?limit=20&p=0")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are 0", () => {
        return request(app)
          .get("/api/articles?limit=0&p=0")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
    });

    describe("Negative Number test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is negative number but p is positive", () => {
        return request(app)
          .get("/api/articles?limit=-20&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive number but p is negative", () => {
        return request(app)
          .get("/api/articles?limit=20&p=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are negative numbers", () => {
        return request(app)
          .get("/api/articles?limit=-10&p=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
    });

    describe("limit= and/or p= test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is empty but p is positive number", () => {
        return request(app)
          .get("/api/articles?limit=&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive number but p is empty", () => {
        return request(app)
          .get("/api/articles?limit=20&p=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are empty", () => {
        return request(app)
          .get("/api/articles?limit=&p=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
    });
  });
});

describe("POST /api/articles", () => {
  test("201: Respond with the added article", () => {
    const postObj = {
      author: "icellusedkars",
      title: "Test Title",
      body: "Test Body",
      topic: "mitch",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: "Test Title",
          topic: "mitch",
          author: "icellusedkars",
          body: "Test Body",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "Test Image Url",
          comment_count: 0,
        });
      });
  });

  test("201: Respond with the added article with default article_img_url when post object doesn't include it", () => {
    const postObj = {
      author: "rogersop",
      title: "Test Title",
      body: "Test Body",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: "Test Title",
          topic: "cats",
          author: "rogersop",
          body: "Test Body",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "http://www.gravatar.com/avatar/?d=mp",
          comment_count: 0,
        });
      });
  });

  test("404: Respond with author(username) Not Found! msg when trying to add an article with author(username) not included in database", () => {
    const postObj = {
      author: "NotIncludedAuthor",
      title: "Test Title",
      body: "Test Body",
      topic: "mitch",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("author(username) Not Found!");
      });
  });

  test("404: Respond with topic(slug) Not Found! msg when trying to add an article with topic(slug) not included in database", () => {
    const postObj = {
      author: "rogersop",
      title: "Test Title",
      body: "Test Body",
      topic: "NotIncludedTopic",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("topic(slug) Not Found!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object is empty", () => {
    const postObj = {};

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object doesn't include author", () => {
    const postObj = {
      title: "Test Title",
      body: "Test Body",
      topic: "NotIncludedTopic",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object doesn't include topic", () => {
    const postObj = {
      author: "rogersop",
      title: "Test Title",
      body: "Test Body",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object doesn't include title", () => {
    const postObj = {
      author: "rogersop",
      body: "Test Body",
      topic: "mitch",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object doesn't include body", () => {
    const postObj = {
      author: "rogersop",
      title: "Test Title",
      topic: "mitch",
      article_img_url: "Test Image Url",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object has invalid data type", () => {
    const postObj = {
      author: 123,
      title: "Test Title",
      body: true,
      topic: "mitch",
      article_img_url: [1234],
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });

  test("400: Respond with Invalid data type or missing fields! msg when post object has empty string for values", () => {
    const postObj = {
      author: "icellusedkars",
      title: "  ",
      body: "  ",
      topic: "mitch",
      article_img_url: "  ",
    };

    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing fields!");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  describe("GET /api/articles/:article_id (without queries)", () => {
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
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("404: Respond with article_id Not Found! msg when valid article_id provided but provided id not exist in database due to id being out of range", () => {
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

  describe("GET /api/articles/:article_id?comment_count", () => {
    test("200: Responds with object of article information including comment_count filtered by provide article_id", () => {
      return request(app)
        .get("/api/articles/4?comment_count")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: expect.any(Number),
          });
        });
    });

    test("200: Responds with object of article information filtered by provide article_id When unvaild query is given", () => {
      return request(app)
        .get("/api/articles/4?NotVaildQuery")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("404: Respond with article_id Not Found! msg when valid article_id provided but id being out of range", () => {
      return request(app)
        .get("/api/articles/10000?comment_count")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id Not Found!");
        });
    });

    test("400: Respond with Bad Request! msg when invalid article_id provided", () => {
      return request(app)
        .get("/api/articles/NotArticleId?comment_count")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Respond with an updated article object with updated votes for given article_id (given positive votes)", () => {
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
          created_at: expect.any(String),
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200: Respond with an updated article object with updated votes for given article_id (given negative votes)", () => {
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
          created_at: expect.any(String),
          votes: -15,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
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

  test("400: Respond with Bad Request! msg when trying to update article with valid votes but invalid article_id ", () => {
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

  test("400: Respond with Missing required field: inc_votes ! msg when trying to update article with empty patch object", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/articles/3")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field: inc_votes !");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: When article with given article_id is deleted successfully", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });

  test("404: Respond with article_id Not Found! msg When given article_id is valid but it is not in database and out of range", () => {
    return request(app)
      .delete("/api/articles/10000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when invalid article_id is given", () => {
    return request(app)
      .delete("/api/articles/NotArticleId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  describe("Tests (without any pagination)", () => {
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

  describe("Tests for paginations", () => {
    describe("Status 200 tests", () => {
      test("200 Responds with an array of comments for the given article_id sorted by date in descending order paginated by the default limit=10 and p=1", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(10);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                article_id: 1,
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
              });
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });

      test("200 Responds with an array of comments for the given article_id sorted by date in descending order paginated by the given limit=3 and p=1", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=3&p=1")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(3);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                article_id: 1,
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
              });
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });

      test("200 Responds with an array of comments for the given article_id sorted by date in descending order paginated by the given limit=5 and p=3", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5&p=3")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(1);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                article_id: 1,
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
              });
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });

      test("200: Respond with an empty array for comments when p is beyond search results", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=12&p=6")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(0);
            expect(comments).toEqual([]);
          });
      });
    });

    describe("Not a Number test", () => {
      test("400: Respond with Bad Request! msg When limit not a number but p is", () => {
        return request(app)
          .get("/api/articles/3/comments?limit=NotNumber&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });

      test("400: Respond with Bad Request! msg When p not a number but limit is", () => {
        return request(app)
          .get("/api/articles/5/comments?limit=5&p=NotNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });

      test("400: Respond with Bad Request! msg When both limit and p is not a number", () => {
        return request(app)
          .get("/api/articles/2/comments?limit=NotNumber&p=NotNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });
    });

    describe("Zero Number test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is 0 but p is positive number", () => {
        return request(app)
          .get("/api/articles/3/comments?limit=0&p=2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive a number but p is 0", () => {
        return request(app)
          .get("/api/articles/2/comments?limit=5&p=0")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are 0", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=0&p=0")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
    });

    describe("Negative Number test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is negative number but p is positive", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=-20&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive number but p is negative", () => {
        return request(app)
          .get("/api/articles/2/comments?limit=20&p=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are negative numbers", () => {
        return request(app)
          .get("/api/articles/4/comments?limit=-10&p=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
    });

    describe("limit= and/or p= test", () => {
      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is empty but p is positive number", () => {
        return request(app)
          .get("/api/articles/3/comments?limit=&p=4")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When limit is positive number but p is empty", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=20&p=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });

      test("400: Respond with limit and p must be greater than or equal to 1 ! msg When both limit and p are empty", () => {
        return request(app)
          .get("/api/articles/2/comments?limit=&p=")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "limit and p must be greater than or equal to 1 !"
            );
          });
      });
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

  test("404: Respond with article_id Not Found! msg when trying to add comment to valid article_id but not exist in database", () => {
    const postObj = {
      username: "lurker",
      body: "Perfect article",
    };

    return request(app)
      .post("/api/articles/5000/comments")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when trying to add comment to invalid article_id", () => {
    const postObj = {
      username: "lurker",
      body: "Nice",
    };

    return request(app)
      .post("/api/articles/NotAnArticleId/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Respond with Invalid data type or missing username and/or body! msg when trying to add comment with empty object in post object", () => {
    const postObj = {};

    return request(app)
      .post("/api/articles/5/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing username and/or body!");
      });
  });

  test("400: Respond with Invalid data type or missing username and/or body! msg when trying to add comment without username property in post object", () => {
    const postObj = {
      body: "Greate Article",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing username and/or body!");
      });
  });

  test("400: Respond with Invalid data type or missing username and/or body! msg when trying to add comment without body property in post object", () => {
    const postObj = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing username and/or body!");
      });
  });

  test("400: Respond with Invalid data type or missing username and/or body! msg when trying to add comment with wrong data type in post object", () => {
    const postObj = {
      username: "lurker",
      body: 23445,
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing username and/or body!");
      });
  });

  test("400: Respond with Invalid data type or missing username and/or body! msg when trying to add comment with empty string value in post object", () => {
    const postObj = {
      username: "lurker",
      body: "  ",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or missing username and/or body!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Respond with an updated comment object with updated votes for given comment_id (given positive votes)", () => {
    const patchObj = { inc_votes: 5 };

    return request(app)
      .patch("/api/comments/2")
      .send(patchObj)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 2,
          article_id: 1,
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 19,
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });

  test("200: Respond with an updated comment object with updated votes for given comment_id (given negative votes)", () => {
    const patchObj = { inc_votes: -3 };

    return request(app)
      .patch("/api/comments/1")
      .send(patchObj)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 13,
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });

  test("404: Respond with comment_id Not Found! msg when trying to update comment with a comment_id that's out of range", () => {
    const patchObj = { inc_votes: 4 };

    return request(app)
      .patch("/api/comments/3000")
      .send(patchObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! msg when trying to update comment with votes that is not a number", () => {
    const patchObj = { inc_votes: "Not A Number" };

    return request(app)
      .patch("/api/comments/3")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Respond with Bad Request! msg when trying to update comment with valid votes but unvalid comment_id", () => {
    const patchObj = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/NotCommentId")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Respond with Missing required field: inc_votes ! msg when trying to update comment with empty patch object", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/comments/6")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field: inc_votes !");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: When comment deleted successfully", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("400: Respond with Bad Request! When invalid comment_id is given", () => {
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

describe("GET /api/users/:username", () => {
  test("200: Respond with object of user information filtered by provided username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });

  test("404: Respond with username Not Found! when provided username not in database", () => {
    return request(app)
      .get("/api/users/NoUsername")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username Not Found!");
      });
  });
});
