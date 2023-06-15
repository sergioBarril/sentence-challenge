const API_URL = "/api/sentences";

let id;

function errorHandler(errorBody) {
  document.getElementById("sentence").style.display = "none";
  document.getElementById("error-card").style.display = "block";

  document.getElementById("status-code").innerText = errorBody.status;
  document.getElementById("error-message").innerText = errorBody.message;
}

async function detail() {
  const url = document.location.pathname;
  id = url.split("/").at(-2);

  const response = await fetch(`${API_URL}/${id}`);
  const sentence = await response.json();

  if (!response.ok) {
    return errorHandler(sentence);
  }

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
