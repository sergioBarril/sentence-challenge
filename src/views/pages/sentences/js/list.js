/* eslint-disable no-unused-vars */

const BASE_URL = "http://localhost:3000/api/sentences";

async function search() {
  const page = document.getElementById("page-input").value;
  const perPage = document.getElementById("per-page-input").value;
  const category = document.getElementById("category-input").value?.trim();
  const sort = document.getElementById("desc-sort").checked ? "desc" : "asc";

  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page);
  if (perPage) queryParams.append("per_page", perPage);
  if (category) queryParams.append("category", category);
  if (sort) queryParams.append("sort", sort);

  const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);

  if (response.ok) {
    console.log(response);
    const json = await response.json();

    const rows = json.map(
      (sentence, i) =>
        `<tr id="row-${i}">
            <td class="sentence-id"><a href="/sentences/${
              sentence.id
            }"><i class="bi bi-search"></i></a></td>
            <td class="sentence-text">${sentence.text}</td>
            <td class="sentence-category">${sentence.category || "-"}</td>
            </tr>`
    );

    const bodyRows = document.getElementById("table-body");
    bodyRows.innerHTML = rows.join("\n");
  }
}
