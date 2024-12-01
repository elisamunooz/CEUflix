function displayCollection() {
  const movies = JSON.parse(localStorage.getItem("mis_peliculas")) || [];
  const container = document.getElementById("movies-container");
  const detailsSection = document.getElementById("movie-details");
  const trendingSection = document.getElementById("trending");

  // Limpiar el contenedor antes de agregar nuevas tarjetas
  container.innerHTML = "";
  detailsSection.classList.add("hidden");
  trendingSection.classList.remove("hidden");

  // Generar tarjetas dinámicamente
  movies.forEach((movie, i) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("swiper-slide");
    movieCard.innerHTML = `
      <div class="movie-card">
        <img src="${movie.miniatura}" alt="${movie.titulo}">
        <h3>${movie.titulo}</h3>
        <p>Director: ${movie.director}</p>
        <p>${movie.release_date ? `Año: ${movie.release_date.split("-")[0]}` : ""}</p>
        <button onclick="showMovieDetails(${i}, 'collection')">Ver</button>
        <button onclick="editMovie(${i})">Editar</button>
        <button onclick="deleteMovie(${i})">Borrar</button>
      </div>
    `;
    container.appendChild(movieCard);
  });

  new Swiper(".swiper-container", {
    slidesPerView: 3, // Número de películas visibles al mismo tiempo
    spaceBetween: 20, // Espaciado entre las películas
    loop: true, // Hacer que el carrusel sea infinito
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000, // Tiempo en milisegundos entre cada transición automática
      disableOnInteraction: false, // Continuar el autoplay incluso si el usuario interactúa
    },
    breakpoints: {
      768: {
        slidesPerView: 2, // Para pantallas medianas
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1, // Para pantallas pequeñas
        spaceBetween: 10,
      },
    },
  });
} 