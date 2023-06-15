/* eslint-disable no-unused-vars */

const API_URL = "/api/sentences";

function errorHandler(errorBody) {
  document.getElementById("sentence").style.display = "none";
  document.getElementById("error-card").style.display = "block";

  document.getElementById("status-code").innerText = errorBody.status;
  document.getElementById("error-message").innerText = errorBody.message;
}

async function detail() {
  const url = document.location.pathname;
  const id = url.split("/").at(-1);

  const response = await fetch(`${API_URL}/${id}`);
  const sentence = await response.json();

  if (!response.ok) {
    return errorHandler(sentence);
  }

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
