import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export async function getSentenceList(req, res) {
  return res.sendFile(path.join(__dirname, "../pages/sentences/list.html"));
}

export async function getSentence(req, res) {
  return res.sendFile(path.join(__dirname, "../pages/sentences/detail.html"));
}

export async function updateSentence(req, res) {
  return res.sendFile(path.join(__dirname, "../pages/sentences/update.html"));
}

export async function newSentence(req, res) {
  return res.sendFile(path.join(__dirname, "../pages/sentences/create.html"));
}

export async function deleteSentence(req, res) {
  return res.sendFile(path.join(__dirname, "../pages/sentences/delete.html"));
}
