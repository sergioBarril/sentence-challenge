/* eslint-disable no-undef */

import request from "supertest";
import mockConfig from "../__mocks__/database/config";
jest.mock("../../src/server/database/config.js", () => mockConfig);

import db from "../../src/server/database/db.js";
import app from "../../src/app.js";
import { StatusCodes } from "http-status-codes";

afterEach(async () => {
  const sentenceRef = db.collection("sentences");
  const sentences = await sentenceRef.get();

  const batch = sentences.docs.map((doc) => doc.delete());
  await Promise.all(batch);
});

describe("Test Sentence Routes End to End", () => {
  describe("GET all sentences", () => {
    it("Returns a 200 status code", async () => {
      const res = await request(app).get("/api/sentences");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(expect.any(Array));
    });
  });
});
