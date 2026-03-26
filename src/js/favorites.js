const container = document.getElementById("favoritesContainer");

// Este método carga los favoritos desde localStorage
function loadFavorites() {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];

    if (saved.length === 0) {
        container.innerHTML = "<p>No hay elementos guardados</p>";
        return;
    }

    saved.forEach((id) => {
        fetch(`https://rickandmortyapi.com/api/character/${id}`)
            .then((res) => res.json())
            .then((char) => {
                container.innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="${char.image}">
                            <div class="card-body">
                                <h5>${char.name}</h5>
                                <p>${char.status} - ${char.species}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
    });
}

loadFavorites();
