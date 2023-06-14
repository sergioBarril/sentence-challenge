import express from "express";
import {
  deleteSentence,
  getSentence,
  getSentenceList,
  newSentence,
  updateSentence,
} from "../controllers/sentences.controller.js";

const router = express.Router();

router.get("/new", newSentence);
router.get("/:id/delete", deleteSentence);
router.get("/:id/edit", updateSentence);
router.get("/:id", getSentence);
router.get("/", getSentenceList);

export default router;
