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
  document.getElementById("sentence-text").innerText = sentence.text;
  document.getElementById("sentence-category").innerText = sentence.category;
  document.getElementById("detail-link").setAttribute("href", `/sentences/${id}`);
}

// eslint-disable-next-line no-unused-vars
async function sendDelete() {
  const requestOptions = { method: "DELETE" };

  const response = await fetch(`${API_URL}/${id}`, requestOptions);

  if (response.status === 204) {
    const detailUrl = `/sentences`;
    window.location.replace(detailUrl);
  } else {
    alert(response.status);
  }
}

detail();
