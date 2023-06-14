import express from "express";
import {
  createSentence,
  deleteSentence,
  getSentence,
  getSentenceList,
  updateSentence,
} from "../controllers/sentences.controller.js";

const router = express.Router();

router.get("/", getSentenceList);
router.get("/:id", getSentence);
router.post("/", createSentence);
router.put("/:id", updateSentence);
router.delete("/:id", deleteSentence);

export default router;
