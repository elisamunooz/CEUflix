const API_KEY = "7f5a7dd038579b195e6518f6c23385d7";
const BASE_URL = "https://api.themoviedb.org/3";

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initializeCollection();
  setupEventListeners();
});

// Inicializar la colección predeterminada
function initializeCollection() {
  const initialMovies = [
    { titulo: "Superlópez", director: "Javier Ruiz Caldera", miniatura: "files/superlopez.png" },
    { titulo: "Jurassic Park", director: "Steven Spielberg", miniatura: "files/jurassicpark.png" },
    { titulo: "Interstellar", director: "Christopher Nolan", miniatura: "files/interstellar.png" },
  ];

  if (!localStorage.getItem("mis_peliculas")) {
    localStorage.setItem("mis_peliculas", JSON.stringify(initialMovies));
  }

  displayCollection();
}

// Configurar los event listeners
function setupEventListeners() {
  document.getElementById("genreSearchButton").addEventListener("click", () => {
    const genre = document.getElementById("genreSearchBar").value;
    searchByGenre(genre);
  });

  document.getElementById("movieSearchButton").addEventListener("click", () => {
    const title = document.getElementById("movieSearchBar").value;
    searchByTitle(title);
  });

  document.getElementById("reset-collection-button").addEventListener("click", () => {
    localStorage.removeItem("mis_peliculas");
    initializeCollection();
    alert("Colección restablecida.");
  });

  document.getElementById("back-button").addEventListener("click", displayCollection);

  document.getElementById("view-collection-button").addEventListener("click", displayCollection);

}

// Mostrar la colección
function displayCollection() {
  const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
  const container = document.getElementById("movies-container");
  const detailsSection = document.getElementById("movie-details");
  const trendingSection = document.getElementById("trending");

  container.innerHTML = "";
  detailsSection.classList.add("hidden");
  trendingSection.classList.remove("hidden");

  movies.forEach((movie, i) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("swiper-slide");
    movieCard.innerHTML = `
      <div class="movie-card">
        <img src="${movie.miniatura}" alt="${movie.titulo}">
        <h3>${movie.titulo}</h3>
        <p>Director: ${movie.director}</p>
        <button onclick="showMovieDetails(${i}, 'collection')">Ver</button>
      </div>
    `;
    container.appendChild(movieCard);
  });

  // Inicializar Swiper después de cargar los elementos
  new Swiper(".swiper-container", {
    slidesPerView: 4,
    spaceBetween: 5,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 5,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 5,
      },
    },
  });
}

// Función para buscar películas por título
async function searchByTitle(title) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&language=es-ES`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      displaySearchResults(data.results);
    } else {
      alert("No se encontraron películas con ese título.");
    }
  } catch (error) {
    console.error("Error buscando por título:", error);
  }
}

// Mostrar resultados de búsqueda
function displaySearchResults(movies) {
  const container = document.getElementById("movies-container");
  const detailsSection = document.getElementById("movie-details");
  const trendingSection = document.getElementById("trending");

  container.innerHTML = "";
  detailsSection.classList.add("hidden");
  trendingSection.classList.remove("hidden");

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("swiper-slide");
    movieCard.innerHTML = `
      <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.release_date ? `Año: ${movie.release_date.split("-")[0]}` : ""}</p>
        <button onclick="showMovieDetails(${movie.id}, 'api')">Ver</button>
        <button onclick="addMovieToCollection('${movie.id}', '${movie.title}', '${movie.poster_path}')">Añadir</button>
      </div>
    `;
    container.appendChild(movieCard);
  });

// Inicializar Swiper
new Swiper(".swiper-container", {
  slidesPerView: 4, // Número de películas visibles al mismo tiempo
  spaceBetween: 5, // Reduce el espacio entre las películas a 10px (puedes ajustar el valor según prefieras)
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 4,
      spaceBetween: 5, // Espacio entre las películas para pantallas medianas
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 5, // Espacio entre las películas para pantallas pequeñas
    },
  },
});
}

// Añadir película a la colección
function addMovieToCollection(id, title, posterPath) {
  const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
  const newMovie = {
    titulo: title,
    director: "Desconocido",
    miniatura: `https://image.tmdb.org/t/p/w500${posterPath}`,
  };

  movies.push(newMovie);
  localStorage.setItem("mis_peliculas", JSON.stringify(movies));
  alert(`Película "${title}" añadida a la colección.`);
}

// Mostrar detalles de una película
async function showMovieDetails(id, source) {
  const detailsSection = document.getElementById("movie-details");
  const trendingSection = document.getElementById("trending");
  const detailsContainer = document.getElementById("movie-details-container");

  trendingSection.classList.add("hidden");
  detailsSection.classList.remove("hidden");

  if (source === "api") {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`
      );
      const movie = await response.json();

      detailsContainer.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2>${movie.title} (${movie.release_date.split("-")[0]})</h2>
        <p><strong>Director:</strong> Desconocido</p>
        <p>${movie.overview}</p>
      `;
    } catch (error) {
      console.error("Error obteniendo detalles:", error);
    }
  } else if (source === "collection") {
    const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
    const movie = movies[id];

    detailsContainer.innerHTML = `
      <img src="${movie.miniatura}" alt="${movie.titulo}">
      <h2>${movie.titulo}</h2>
      <p><strong>Director:</strong> ${movie.director}</p>
    `;
  }
}

function editMovie(index) {
  const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
  const movie = movies[index];

  // Mostrar sección de edición
  const detailsSection = document.getElementById("movie-details");
  const trendingSection = document.getElementById("trending");
  const detailsContainer = document.getElementById("movie-details-container");

  trendingSection.classList.add("hidden");
  detailsSection.classList.remove("hidden");

  // Crear formulario de edición
  detailsContainer.innerHTML = `
    <h2>Editar Película</h2>
    <form id="edit-form">
      <label for="edit-director">Director:</label>
      <input type="text" id="edit-director" value="${movie.director}" />
      <label for="edit-description">Descripción:</label>
      <textarea id="edit-description">${movie.descripcion || ""}</textarea>
      <button type="button" onclick="saveEdit(${index})">Guardar Cambios</button>
    </form>
    <button class="back-button" onclick="displayCollection()">Cancelar</button>
  `;
}

function saveEdit(index) {
  const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
  const movie = movies[index];

  // Obtener valores del formulario
  const newDirector = document.getElementById("edit-director").value;
  const newDescription = document.getElementById("edit-description").value;

  // Actualizar datos
  movie.director = newDirector;
  movie.descripcion = newDescription;

  // Guardar en localStorage
  localStorage.setItem("mis_peliculas", JSON.stringify(movies));

  alert("Cambios guardados correctamente.");
  displayCollection();
}

function deleteMovie(index) {
  if (confirm("¿Estás seguro de que quieres borrar esta película?")) {
    const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
    const deletedMovie = movies.splice(index, 1); // Eliminar película

    localStorage.setItem("mis_peliculas", JSON.stringify(movies));
    alert(`La película "${deletedMovie[0].titulo}" ha sido borrada correctamente.`);
    displayCollection();
  }
}

async function searchByGenre(genre) {
  try {
    // Obtener la lista de géneros desde la API de TMDb
    const genresResponse = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`
    );
    const genresData = await genresResponse.json();

    // Buscar el ID del género ingresado por el usuario
    const genreId = genresData.genres.find((g) =>
      g.name.toLowerCase() === genre.toLowerCase()
    )?.id;

    if (!genreId) {
      alert("Género no encontrado. Intenta con otro.");
      return;
    }

    // Buscar películas por el género encontrado
    const moviesResponse = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=es-ES`
    );
    const moviesData = await moviesResponse.json();

    if (moviesData.results.length > 0) {
      displaySearchResults(moviesData.results);
    } else {
      alert("No se encontraron películas para este género.");
    }
  } catch (error) {
    console.error("Error al buscar por género:", error);
    alert("Hubo un problema al buscar películas por género.");
  }
}
