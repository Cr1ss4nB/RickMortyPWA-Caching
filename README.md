# RickMortyPWA-Caching

Aplicación PWA que consume la API de Rick and Morty e implementa estrategias de caching.

---

## Fase 1: Setup del proyecto

Se realizó:

* Creación de la estructura de carpetas:

```id="v2g9sd"
src/
├── index.html
├── sw.js
├── css/style.css
├── js/app.js
├── js/favorites.js
├── pages/favorites.html
├── pages/offline.html
├── img/logo.png
```

* Creación de archivos web:

  * index.html (página principal)
  * favorites.html (página de guardados)
  * offline.html

* Creación de app.js:

  * consumo de la API
  * render de personajes
  * registro del Service Worker

* Creación de sw.js (inicialmente base, luego completado)

---

## Fase 2: Ciclo de vida – Instalación

Se implementó:

* Definición de constantes de caché:

  * static-vX
  * dynamic-vX
  * inmutable-v1

* Evento install del Service Worker:

  * creación del caché estático
  * almacenamiento del App Shell:

    * HTML
    * CSS
    * JS
    * imágenes
    * páginas internas

* Cache inmutable para recursos externos (Bootstrap CDN)

---

## Fase 3: Intercepción de eventos

Se implementó:

* Método fetch en el Service Worker

* Router de peticiones según tipo de recurso:

  * Imágenes → Stale While Revalidate

    * carga desde cache y actualiza en segundo plano

  * API → Network First

    * intenta red, si falla usa cache

  * App Shell → Cache First

    * carga desde cache para rapidez

---

## Fase 4: Información offline

Se implementó:

* Funcionalidad “Leer después”:

  * botón en cada personaje
  * guardado de IDs en localStorage (clave: favorites)

* Página de favoritos:

  * lectura de datos desde localStorage
  * render de personajes guardados mediante fetch

---

## Detalles importantes

Se implementaron modales para mostrar la información completa de los personajes tanto en la página principal como en favoritos, reutilizando la misma función. El Service Worker se registra con ruta absoluta para evitar errores al navegar entre páginas. Se implementó limpieza de caché en el evento activate para eliminar versiones antiguas automáticamente. Cada vez que se modifican archivos del App Shell es necesario actualizar la versión de los cachés (static y dynamic) para que los cambios se reflejen. El localStorage se usa para guardar los favoritos y no se ve afectado al limpiar el caché del Service Worker. El funcionamiento offline depende de los recursos que hayan sido previamente cargados y almacenados en caché.
