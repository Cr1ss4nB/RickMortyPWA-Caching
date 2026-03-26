if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado', reg))
            .catch(err => console.log('Error al registrar SW', err));
    });
}

const API_URL = 'https://rickandmortyapi.com/api/character';
const container = document.getElementById('characters');

// Este método obtiene personajes de la API y los muestra en pantalla
function loadCharacters() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = '';
            data.results.forEach(char => {
                container.innerHTML += `
            <div class="col-md-4">
            <div class="card">
                <img src="${char.image}">
                <div class="card-body">
                <h5>${char.name}</h5>

                <span class="badge badge-info">${char.status}</span>
                <span class="badge badge-secondary">${char.species}</span>

                <p>Origen: ${char.origin.name}</p>
                <p>Ubicación: ${char.location.name}</p>

                <button class="btn btn-sm btn-primary mt-2" onclick="saveCharacter(${char.id})">
                    Leer después
                </button>
                </div>
            </div>
            </div>
        `;
            });

        })
        .catch(err => console.log(err));
}

// Este método guarda personajes en el localStorage
function saveCharacter(id) {
    let saved = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!saved.includes(id)) {
        saved.push(id);
        localStorage.setItem('favorites', JSON.stringify(saved));
        console.log('Guardado');
    } else {
        console.log('Ya existe');
    }
}

loadCharacters();