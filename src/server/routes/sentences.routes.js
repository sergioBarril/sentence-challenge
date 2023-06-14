import express from "express";
import { getSentence, getSentenceList } from "../controllers/sentences.controller.js";

const router = express.Router();

router.get("/", getSentenceList);
router.get("/:id", getSentence);

export default router;
