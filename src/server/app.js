import express from "express";
import "dotenv/config.js";
import "express-async-errors";

import sentenceRoutes from "./routes/sentences.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Coding Challenge");
});

app.use("/api/sentences", sentenceRoutes);

app.use("/", errorMiddleware);

app.listen(PORT, () => {
  console.log(`Node server on http://localhost:${PORT}/`);
});
