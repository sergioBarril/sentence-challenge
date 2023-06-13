import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Coding Challenge");
});

app.listen(PORT, () => {
  console.log(`Node server on http://localhost:${PORT}/`);
});
