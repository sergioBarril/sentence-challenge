import fs from "fs";
import readline from "readline";
import { createSentence } from "../server/services/sentences.service.js";
import * as url from "url";
import path from "path";

const DEFAULT_FILENAME = "50-sentences.jsonl.txt";

/**
 * Gets the category name that has a 1 in it. Returns null if that category is 'none'
 * @param {Object} categories Object of categories as given in the example dataset
 * @returns {string | null} Category
 */
function getCategory(categories) {
  const category = Object.entries(categories).find(([, v]) => v === 1);

  if (!category) return null;

  let key = category[0];
  if (key === "none") return null;
  return key;
}

async function bulkInsert(fileName) {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const fileStream = fs.createReadStream(path.join(__dirname, "datasets", fileName));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const batch = [];

  for await (const line of rl) {
    const sentence = JSON.parse(line);
    const category = getCategory(sentence.cats);

    batch.push(createSentence(sentence.text, category));
  }

  await Promise.all(batch);
}

let fileName = process.argv.slice(2).at(0) || DEFAULT_FILENAME;

await bulkInsert(fileName);
