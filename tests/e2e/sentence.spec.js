/* eslint-disable no-undef */
import request from "supertest";
import mockConfig from "../__mocks__/database/config";
jest.mock("../../src/server/database/config.js", () => mockConfig);
import { StatusCodes } from "http-status-codes";

import db from "../../src/server/database/db.js";
import app from "../../src/app.js";

afterEach(async () => {
  const sentenceRef = db.collection("sentences");
  const sentences = await sentenceRef.get();

  const batch = sentences.docs.map((doc) => doc.ref.delete());
  await Promise.all(batch);
});

const API_ENDPOINT = "/api/sentences";

describe("Test Sentence Routes End to End", () => {
  describe("GET all sentences", () => {
    it("Returns a 200 status code with an empty array if no sentences present", async () => {
      const res = await request(app).get(API_ENDPOINT);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body).toEqual([]);
    });

    it("Returns all sentences if no page parameter", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English`,
        category: "truth",
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toEqual(2);
    });

    it("Returns all sentences sorted by category ASC if explicit or no parameter", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English`,
        category: "truth",
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body[0]).toEqual({ id: expect.any(String), ...firstSentence });
      expect(res.body[1]).toEqual({ id: expect.any(String), ...secondSentence });
    });

    it("Returns all sentences sorted by category DESC if explicit", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English`,
        category: "truth",
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT + "?sort=desc");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body[1]).toEqual({ id: expect.any(String), ...firstSentence });
      expect(res.body[0]).toEqual({ id: expect.any(String), ...secondSentence });
    });

    it("Filters by category if the parameter is passed", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English`,
        category: "truth",
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT + "?category=truth");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toEqual({ id: expect.any(String), ...secondSentence });
    });

    it("Returns the sentences with category null if the param text is explicitly 'null' or 'none'", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English`,
        category: null,
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const resNull = await request(app).get(API_ENDPOINT + "?category=null");
      expect(resNull.status).toBe(StatusCodes.OK);
      expect(resNull.body).toEqual(expect.any(Array));
      expect(resNull.body.length).toBe(1);
      expect(resNull.body[0]).toEqual({ id: expect.any(String), ...secondSentence });

      const resNone = await request(app).get(API_ENDPOINT + "?category=none");
      expect(resNone.status).toBe(StatusCodes.OK);
      expect(resNone.body).toEqual(expect.any(Array));
      expect(resNone.body.length).toBe(1);
      expect(resNone.body[0]).toEqual({ id: expect.any(String), ...secondSentence });
    });

    it("Returns per_page sentences if specified with a page number", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen 1`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English 2`,
        category: null,
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);
      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT + "?page=1&per_page=3");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toEqual({ id: expect.any(String), ...secondSentence });
      expect(res.body[1]).toEqual({ id: expect.any(String), ...secondSentence });
      expect(res.body[2]).toEqual({ id: expect.any(String), ...firstSentence });
    });

    it("Returns per_page sentences of the next pages", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen 1`,
        category: "thought",
      };

      const secondSentence = {
        text: `This sentence is already in English 2`,
        category: null,
      };

      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);
      await request(app).post(API_ENDPOINT).send(firstSentence);
      await request(app).post(API_ENDPOINT).send(secondSentence);

      const res = await request(app).get(API_ENDPOINT + "?page=2&per_page=3");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toEqual({ id: expect.any(String), ...firstSentence });
    });
  });

  describe("POST a new sentence", () => {
    it("Returns a 201 status code and the new Sentence", async () => {
      const newSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };
      const res = await request(app).post(API_ENDPOINT).send(newSentence);

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({ id: expect.any(String), ...newSentence });
    });

    it("Returns a 400 error if the text is empty", async () => {
      const newSentence = {
        text: "",
        category: "not empty",
      };

      const res = await request(app).post(API_ENDPOINT).send(newSentence);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("Creates a new Sentence with category null if the field category is missing", async () => {
      const newSentence = {
        text: `Ich habe mein Deutsch und die Categorie vergessen`,
      };

      const res = await request(app).post(API_ENDPOINT).send(newSentence);

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({ id: expect.any(String), text: newSentence.text, category: null });
    });
    it("Creates a new Sentence with category null if its value is 'null' or 'none'", async () => {
      const newSentence = {
        text: `Ich habe mein Deutsch und die Categorie vergessen`,
        category: "null",
      };

      const res = await request(app).post(API_ENDPOINT).send(newSentence);

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        text: newSentence.text,
        category: null,
      });
    });

    it("Creates a new Sentence with category null if it is an empty string", async () => {
      const newSentence = {
        text: "Text exemple",
        category: " ",
      };

      const res = await request(app).post(API_ENDPOINT).send(newSentence);
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        text: newSentence.text,
        category: null,
      });
    });
  });

  describe("GET one sentence", () => {
    it("Returns a 200 status code if the sentence is present", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;
      const res = await request(app).get(API_ENDPOINT + "/" + id);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({ id, ...firstSentence });
    });

    it("Returns a 404 status code if the sentence is not present", async () => {
      const res = await request(app).get(API_ENDPOINT + "/INVALIDID3123");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe("UPDATE a sentence", () => {
    it("Returns a 200 and the updated sentence", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;

      const updatedSentence = { text: `Ich habe mein Englisch vergessen`, category: "soft" };
      const res = await request(app)
        .put(API_ENDPOINT + "/" + id)
        .send(updatedSentence);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        id,
        ...updatedSentence,
      });
    });

    it("Updates only the given field", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;

      const updatedSentence = { category: "soft" };
      const res = await request(app)
        .put(API_ENDPOINT + "/" + id)
        .send(updatedSentence);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        id,
        text: firstSentence.text,
        category: updatedSentence.category,
      });
    });

    it("Returns a 404 if the id is not found", async () => {
      const updatedSentence = { text: `Ich habe mein Englisch vergessen`, category: "soft" };
      const res = await request(app)
        .put(API_ENDPOINT + "/INVALIDID123123")
        .send(updatedSentence);

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("If given an empty string as text, ignore it", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;

      const updatedSentence = { text: "", category: "soft" };
      const res = await request(app)
        .put(API_ENDPOINT + "/" + id)
        .send(updatedSentence);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        id,
        text: firstSentence.text,
        category: updatedSentence.category,
      });
    });
  });

  describe("DELETE a sentence", () => {
    it("Returns 204 if the sentence has been deleted", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;
      const delRes = await request(app).delete(API_ENDPOINT + "/" + id);

      expect(delRes.status).toBe(StatusCodes.NO_CONTENT);

      const getRes = await request(app).get(API_ENDPOINT + "/" + id);
      expect(getRes.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("Returns 404 if the sentence isn't found", async () => {
      const delRes = await request(app).delete(API_ENDPOINT + "/INVALIDID123123");
      expect(delRes.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe("GETS a sentence TRANSLATION", () => {
    it("Returns a 200 status code if the sentence has been translated", async () => {
      const firstSentence = {
        text: `Ich habe mein Deutsch vergessen`,
        category: "thought",
      };

      const postRes = await request(app).post(API_ENDPOINT).send(firstSentence);
      const { id } = postRes.body;
      const res = await request(app).get(API_ENDPOINT + "/" + id + "/translation");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({ text: expect.any(String) });
      expect(res.body.text).not.toEqual(firstSentence.text);
    });

    it("Returns a 404 status code if the sentence is not found", async () => {
      const res = await request(app).get(API_ENDPOINT + "/INVALIDID123123/translation");

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
