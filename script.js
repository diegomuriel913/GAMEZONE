
/* =====================================
   1. SELECCIONAR LOS ELEMENTOS DEL HTML
===================================== */

const searchInput = document.getElementById("game-search");
const categoryButtons = document.querySelectorAll(".category-button");
const gameCards = document.querySelectorAll(".game-card");
const gamesCount = document.getElementById("games-count");
const emptyMessage = document.getElementById("empty-message");
const favoritesCount = document.getElementById("favorites-count");

/* =====================================
   2. CONFIGURAR LOS FILTROS
===================================== */

let selectedCategory = "Todos";

function filterGames() {
    const searchText = searchInput.value.toLowerCase().trim();
    let visibleGames = 0;

    gameCards.forEach(function (card) {
        const gameName = card.querySelector("h3").textContent.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = gameName.includes(searchText);

        const matchesCategory =
            selectedCategory === "Todos" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.hidden = false;
            visibleGames++;
        } else {
            card.hidden = true;
        }
    });

    gamesCount.textContent =
        visibleGames + (visibleGames === 1 ? " juego" : " juegos");

    emptyMessage.hidden = visibleGames !== 0;
}

/* Buscar mientras escribimos */
searchInput.addEventListener("input", filterGames);

/* Filtrar al pulsar una categoría */
categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach(function (otherButton) {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");

        filterGames();
    });
});

/* =====================================
   3. GUARDAR Y MOSTRAR FAVORITOS
===================================== */

let favorites = [];

try {
    const savedFavorites = JSON.parse(
        localStorage.getItem("gamezone-favorites") || "[]"
    );

    if (Array.isArray(savedFavorites)) {
        favorites = savedFavorites.filter(function (name) {
            return typeof name === "string";
        });
    }
} catch (error) {
    favorites = [];
}

function updateFavorites() {
    gameCards.forEach(function (card) {
        const gameName = card.querySelector("h3").textContent;
        const button = card.querySelector(".favorite-button");
        const isFavorite = favorites.includes(gameName);

        button.classList.toggle("active", isFavorite);
        button.textContent = isFavorite ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isFavorite));
    });

    favoritesCount.textContent =
        "Tienes " + favorites.length +
        (favorites.length === 1
            ? " juego favorito."
            : " juegos favoritos.");

    localStorage.setItem(
        "gamezone-favorites",
        JSON.stringify(favorites)
    );
}

gameCards.forEach(function (card) {
    const button = card.querySelector(".favorite-button");

    button.addEventListener("click", function () {
        const gameName = card.querySelector("h3").textContent;

        if (favorites.includes(gameName)) {
            favorites = favorites.filter(function (name) {
                return name !== gameName;
            });
        } else {
            favorites.push(gameName);
        }

        updateFavorites();
    });
});

/* =====================================
   4. MOSTRAR LOS DETALLES DE UN JUEGO
===================================== */

gameCards.forEach(function (card) {
    const detailsButton = card.querySelector(".details-button");

    detailsButton.addEventListener("click", function () {
        const name = card.querySelector("h3").textContent;
        const description =
            card.querySelector(".game-info > p:not(.game-platform)")
                .textContent;
        const category = card.dataset.category;
        const platform =
            card.querySelector(".game-platform").textContent;

        alert(
            name + "\n\n" +
            description + "\n\n" +
            "Género: " + category + "\n" +
            "Plataformas: " + platform
        );
    });
});

/* =====================================
   5. INICIAR LA PÁGINA
===================================== */

updateFavorites();
filterGames();