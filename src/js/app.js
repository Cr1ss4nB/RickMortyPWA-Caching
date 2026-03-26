if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then((reg) => console.log("SW registrado", reg))
            .catch((err) => console.log("Error al registrar SW", err));
    });
}

const API_URL = "https://rickandmortyapi.com/api/character";

const container = document.getElementById("characters");

fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
        data.results.forEach((char) => {
            container.innerHTML += `
        <div class="col-md-4">
            <div class="card">
            <img src="${char.image}" class="card-img-top">
            <div class="card-body">
                <h5>${char.name}</h5>
                <p>${char.status} - ${char.species}</p>
            </div>
            </div>
        </div>
        `;
        });
    })
    .catch((err) => console.log(err));
