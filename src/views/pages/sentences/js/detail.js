/* eslint-disable no-unused-vars */

const API_URL = "http://localhost:3000/api/sentences";

async function detail() {
  const url = document.location.pathname;
  const id = url.split("/").at(-1);

  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    return console.log("Error", response);
  }

  const sentence = await response.json();
  document.getElementById("sentence-text").innerText = sentence.text;
  document.getElementById("sentence-category").innerText = sentence.category || "none";
  document.getElementById("edit-link").setAttribute("href", `/sentences/${id}/edit`);
  document.getElementById("delete-link").setAttribute("href", `/sentences/${id}/delete`);
}

async function translate() {
  const url = document.location.pathname;
  const id = url.split("/").at(-1);

  const response = await fetch(`${API_URL}/${id}/translation`);
  const result = await response.json();

  document.getElementById("sentence-translated-text").innerHTML = result.text;
  document.getElementById("translate").style.display = "block";

  document.getElementById("btn-translate").disabled = "true";
}

detail();
document.getElementById("btn-translate").onclick = translate;
