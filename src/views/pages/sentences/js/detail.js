/* eslint-disable no-unused-vars */

const BASE_URL = "http://localhost:3000/api/sentences";

async function detail() {
  const url = document.location.pathname;
  const id = url.split("/").at(-1);

  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    return console.log("Error", response);
  }

  const sentence = await response.json();
  document.getElementById("sentence-text").innerHTML = sentence.text;
  document.getElementById("sentence-category").innerHTML = sentence.category;
}

detail();
