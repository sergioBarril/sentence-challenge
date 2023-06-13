import express from "express";
import { getSentenceList } from "../controllers/sentences.controller.js";

const router = express.Router();

router.get("/", getSentenceList);

export default router;
