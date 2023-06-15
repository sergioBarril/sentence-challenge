import express from "express";
import cors from "cors";
import "dotenv/config.js";
import "express-async-errors";

import sentenceRoutes from "./server/routes/sentences.routes.js";
import sentenceViewRoutes from "./views/routes/sentences.routes.js";
import errorMiddleware from "./server/middleware/error.middleware.js";

import serveStatic from "serve-static";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(serveStatic("src/views/pages"));

app.get("/", (req, res) => {
  res.send("Coding Challenge");
});

app.use("/api/sentences", sentenceRoutes);
app.use("/sentences", sentenceViewRoutes);

app.use("/", errorMiddleware);

if (process.env["NODE_ENV"] !== "test")
  app.listen(PORT, () => {
    console.log(`Node server on http://localhost:${PORT}/`);
  });

export default app;
