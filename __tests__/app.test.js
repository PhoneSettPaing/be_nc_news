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
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("404: valid article_id provided but article with provided id not exist in database due to id being out of range", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found!");
      });
  });

  test("400: invalid article_id provided", () => {
    return request(app)
      .get("/api/articles/NotArticleId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});
