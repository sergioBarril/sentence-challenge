/* eslint-disable no-unused-vars */

const API_URL = "/api/sentences";
let id;

async function detail() {
  const url = document.location.pathname;
  console.log(document.location.hostname);
  id = url.split("/").at(-2);

  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    return console.log("Error", response);
  }

  const sentence = await response.json();
  document.getElementById("sentence-text").value = sentence.text;
  document.getElementById("sentence-category").value = sentence.category;
}

async function sendForm() {
  const form = document.getElementById("update-form");

  const formData = new FormData(form);

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  };

  const response = await fetch(`${API_URL}/${id}`, requestOptions);

  const content = await response.json();

  const detailUrl = `/sentences/${id}`;
  window.location.replace(detailUrl);
}

detail();
