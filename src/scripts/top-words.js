import fs from "fs";
import readline from "readline";
import * as url from "url";
import path from "path";

const DEFAULT_FILENAME = "sentences.jsonl.txt";

/**
 * Returns a collection of words and their absolute frequency
 *
 * @param {string} fileName File with the dataset to analyse
 * @returns {Promise<Map>} Map with the number of times each word is used
 */
async function topWords(fileName) {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const fileStream = fs.createReadStream(path.join(__dirname, "datasets", fileName));
  const rl = readline.createInterface({
    input: fileStream,
    encoding: "latin1",
    fd: null,
    crlfDelay: Infinity,
  });

  const ranking = new Map();

  for await (const line of rl) {
    const sentence = JSON.parse(line);
    let text = sentence.text;

    text = text.toLowerCase();

    const regex = /[^a-z ]/gmu;

    // Remove everything except letters and spaces
    const cleanText = text
      .replace(regex, " ")
      .split(" ")
      .filter((w) => w.trim() !== "");

    cleanText.forEach((word) => {
      const oldCount = ranking.get(word) || 0;
      ranking.set(word, oldCount + 1);
    });
  }

  return ranking;
}

/**
 * Prints on the console the ranking
 *
 * @param {Map} ranking Map with the number of times each word is used
 * @param {number} rankingSize The number of words to be printed
 */
function printResults(ranking, rankingSize) {
  let results = Array.from(ranking.entries());
  results.sort((w1, w2) => {
    return w2[1] - w1[1];
  });

  rankingSize = Math.min(results.length, rankingSize);

  for (let i = 0; i < rankingSize; i++) {
    console.log(`${i + 1}. ${results[i][0]} (${results[i][1]})`);
  }
}

let fileName = process.argv.slice(2).at(0) || DEFAULT_FILENAME;
let rankingSize = process.argv.slice(2).at(1) || 100;

const ranking = await topWords(fileName);
printResults(ranking, rankingSize);
