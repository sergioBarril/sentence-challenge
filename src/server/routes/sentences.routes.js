import express from "express";
import { getSentenceList } from "../controllers/sentences.controller";

const router = express.Router();

router.get("/", getSentenceList);

export default router;
