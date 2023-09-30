let page = 1;
const perPage = 10;
const serverUrl = `https://fine-jade-walrus-shoe.cyclic.cloud`;

const fetchData = async (page, perPage, title) => {
  let url = `${serverUrl}?page=${page}&perPage=${perPage}`;
  let hidePagination = false;

  if (title) {
    url += `&title=${encodeURIComponent(title)}`;
    hidePagination = true;
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const movies = await response.json();
      updateTable(movies);
      updatePagination(hidePagination);
    } else {
      throw new Error("Failed to fetch movies");
    }
  } catch (error) {
    console.error(error);
  }
};

const updateTable = (movies) => {
  const tbody = document.querySelector("#moviesTable tbody");
  tbody.innerHTML = "";

  movies.forEach((movie) => {
    const { _id, year, title, plot, rated, runtime } = movie;

    const hours = Math.floor(runtime / 60);
    const minutes = (runtime % 60).toString().padStart(2, "0");

    const plotText = plot || "N/A";
    const ratedText = rated || "N/A";

    const html = `
        <tr data-id="${_id}">
          <td>${year}</td>
          <td>${title}</td>
          <td>${plotText}</td>
          <td>${ratedText}</td>
          <td>${hours}:${minutes}</td>
        </tr>
      `;

    tbody.insertAdjacentHTML("beforeend", html);
  });
  updateCurrentPage(page);
  addClickEventToRows();
};

const updatePagination = (hidePagination) => {
  const paginationElement = document.querySelector(".pagination");
  if (paginationElement) {
    paginationElement.classList.toggle("d-none", hidePagination);
  }
};

const updateCurrentPage = (page) => {
  const currentPage = document.querySelector("#current-page a");
  currentPage.textContent = page;
};

const addClickEventToRows = () => {
  const rows = document.querySelectorAll("#moviesTable tbody tr");

  rows.forEach((row) => {
    row.addEventListener("click", async () => {
      const movieId = row.dataset.id;
      try {
        const response = await fetch(`${serverUrl}/${movieId}`);
        const movieData = await response.json();
        const { title, poster, directors, plot, cast, awards, imdb } =
          movieData;

        const modalTitle = document.querySelector("#detailsModal .modal-title");
        const modalBody = document.querySelector("#detailsModal .modal-body");

        modalTitle.textContent = title;

        const html = `
            ${
              poster
                ? `<img class="img-fluid w-100" src="${poster}"><br><br>`
                : ""
            }
            <strong>Directed By:</strong> ${directors.join(", ")}<br><br>
            <p>${plot}</p>
            <strong>Cast:</strong> ${
              cast.length > 0 ? cast.join(", ") : "N/A"
            }<br><br>
            <strong>Awards:</strong> ${awards.text}<br>
            <strong>IMDB Rating:</strong> ${imdb.rating} (${imdb.votes} votes)
          `;

        modalBody.innerHTML = html;

        const detailsModal = new bootstrap.Modal(
          document.querySelector("#detailsModal")
        );
        detailsModal.show();
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    });
  });
};

const loadMovieData = (title = null) => {
  fetchData(page, perPage, title);
};

document.addEventListener("DOMContentLoaded", () => {
  const previousPageButton = document.querySelector("#previous-page");
  const nextPageButton = document.querySelector("#next-page");
  const searchForm = document.querySelector("#searchForm");
  const clearFormButton = document.querySelector("#clearForm");

  previousPageButton.addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadMovieData();
    }
  });

  nextPageButton.addEventListener("click", () => {
    page++;
    loadMovieData();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    loadMovieData(title);
  });

  clearFormButton.addEventListener("click", () => {
    document.querySelector("#title").value = "";
    loadMovieData();
  });

  loadMovieData();
});
