import express from "express";
import "dotenv/config.js";

import sentenceRoutes from "./routes/sentences.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Coding Challenge");
});

app.use("/api/sentences", sentenceRoutes);

app.listen(PORT, () => {
  console.log(`Node server on http://localhost:${PORT}/`);
});
