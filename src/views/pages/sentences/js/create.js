/* eslint-disable no-unused-vars */

const BASE_URL = "/api/sentences";

async function sendForm() {
  const form = document.getElementById("create-form");

  const formData = new FormData(form);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  };

  const response = await fetch(BASE_URL, requestOptions);
  const content = await response.json();

  const id = content.id;

  const detailUrl = `/sentences/${id}`;
  window.location.replace(detailUrl);
}
