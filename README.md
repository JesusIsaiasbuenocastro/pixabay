# Pixabay Explorer

Un buscador de imágenes libre de derechos construido con **React**, consumiendo la API pública de Pixabay. Proyecto de práctica para fortalecer habilidades de frontend como desarrollador backend.

---

## 📸 Demo rápida

| Feature | Estado |
|---|---|
| Búsqueda en tiempo real | ✅ |
| Categorías de acceso rápido | ✅ |
| Paginación dinámica | ✅ |
| Tarjetas con hover interactivo | ✅ |
| Clic en tags para búsqueda directa | ✅ |
| Diseño responsivo (mobile-first) | ✅ |

---


## 🖼️  Deploy en Netlify

`https://pixabay-explorer-aac49c.netlify.app/`

---

## 🏗️ Arquitectura del proyecto

```
pixabay/
├── public/
│   └── index.html          # Punto de entrada HTML
└── src/
    ├── index.js             # Montaje de la app React en el DOM
    ├── App.js               # Componente raíz — estado global y fetching
    └── components/
        ├── Formulario.js    # Input de búsqueda + validación
        ├── ListadoImagenes.js # Grid que itera y renderiza imágenes
        ├── Imagen.js        # Tarjeta individual de imagen
        └── Error.js         # Alerta de validación de formulario
```

### Diagrama de flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.js                                │
│                                                                 │
│  useState: busqueda, imagenes, paginaActual, totalPaginas       │
│                                                                 │
│  useEffect ──────────────────────────────► Pixabay API          │
│     triggers on: [busqueda, paginaActual]     │                 │
│                                               ▼                 │
│                                         resultado.hits[]        │
│                                         resultado.totalHits      │
│                ┌──────────────────────────────┘                 │
│                ▼                                                │
│  ┌─────────────┐    ┌──────────────────────────────────┐       │
│  │  Formulario │    │       ListadoImagenes             │       │
│  │             │    │                                   │       │
│  │  onChange ──┼──► │  imagenes.map() ──► <Imagen />   │       │
│  │  onSubmit ──┼──► │                                   │       │
│  │             │    │  largeImageURL                    │       │
│  │  <Error />  │    │  previewURL                       │       │
│  └─────────────┘    │  likes / views / tags             │       │
│                     └──────────────────────────────────┘       │
│                                                                 │
│  Botones de paginación: paginaAnterior() / paginaSiguiente()   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de una búsqueda

```
Usuario escribe término
        │
        ▼
Formulario.onSubmit()
        │
        ├── ¿Término vacío? ──► muestra <Error />
        │
        ▼
guardarBusqueda(termino)  [prop callback hacia App.js]
        │
        ▼
useEffect detecta cambio en `busqueda`
        │
        ▼
GET https://pixabay.com/api/?key=...&q={termino}&page={paginaActual}
        │
        ▼
guardarImagenes(resultado.hits)
guardarTotalPaginas(Math.ceil(totalHits / porPagina))
        │
        ▼
Re-render de ListadoImagenes con nuevas tarjetas
```

---

## 📦 Librerías utilizadas

### React `^17.0.1`
El core de la aplicación. Se usan los siguientes hooks de la librería estándar:

| Hook | Uso en este proyecto |
|---|---|
| `useState` | Controla `busqueda`, `imagenes`, `paginaActual`, `totalPaginas`, y el estado de error del formulario |
| `useEffect` | Dispara `consultarAPI()` cada vez que cambia `busqueda` o `paginaActual`. El array de dependencias `[busqueda, paginaActual]` evita llamadas innecesarias |

No se usan librerías de UI externas — todo el estilo es CSS-in-JS o clases de Bootstrap.

### React DOM `^17.0.1`
Monta la app en el nodo `#root` del HTML:
```js
// src/index.js
ReactDOM.render(<App />, document.getElementById('root'));
```

### React Scripts `^5.0.1` (Create React App)
Proporciona el toolchain completo sin configuración manual:
- Webpack (bundling)
- Babel (transpilación JSX/ES6+)
- ESLint (linting)
- Jest (testing)
- Dev server con HMR (Hot Module Replacement)

### Testing Library
- `@testing-library/react` — renderiza componentes para tests
- `@testing-library/jest-dom` — matchers adicionales para el DOM (p.ej. `toBeInTheDocument()`)
- `@testing-library/user-event` — simula interacciones de usuario reales

### Web Vitals `^0.2.4`
Mide métricas de rendimiento (LCP, FID, CLS) en producción:
```js
// src/reportWebVitals.js
reportWebVitals(console.log); // Imprime en consola durante desarrollo
```

### Bootstrap (via CDN o importación)
Clases utilitarias para grid y componentes: `container`, `jumbotron`, `btn`, `card`, `form-control`, `alert`, etc.

---

## 🚀 Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/JesusIsaiasbuenocastro/pixabay.git
cd pixabay

# 2. Instalar dependencias
npm install

# 3. Agregar tu API key de Pixabay
# Edita src/App.js y reemplaza el valor de `key`

# 4. Correr en desarrollo
npm start

# 5. Build de producción
npm run build

```

> ⚠️ **API Key**: Obtén la tuya gratis en [pixabay.com/api](https://pixabay.com/api/docs). — considera usar variables de entorno (`.env`).

---

## 💡 Ideas para mejorar el proyecto

### Mejoras técnicas
- **Variables de entorno**: mover la API key a `.env` (`REACT_APP_PIXABAY_KEY`)
- **Custom Hook**: extraer la lógica de fetching en `usePixabay(termino, pagina)` para separar responsabilidades
- **useReducer**: reemplazar múltiples `useState` por un reducer para el estado de la búsqueda
- **AbortController**: cancelar la petición anterior si el usuario escribe rápido (debounce + abort)
- **React.memo / useCallback**: optimizar re-renders en `<Imagen />` y `<ListadoImagenes />`

### Nuevas funcionalidades
- **Filtros**: tipo de imagen (foto/vector/ilustración), orientación (horizontal/vertical), color dominante
- **Lightbox**: modal para ver la imagen en alta resolución sin salir de la app
- **Favoritos**: guardar imágenes favoritas en `localStorage`
- **Búsqueda por voz**: usando la Web Speech API del navegador
- **Infinite scroll**: reemplazar la paginación por scroll infinito con `IntersectionObserver`
- **Modo oscuro**: toggle de tema claro/oscuro con CSS custom properties
- **Skeleton screens**: placeholders animados mientras cargan las imágenes
- **Descarga directa**: botón para descargar la imagen en alta resolución

## 🌐 API de Pixabay

Endpoint base:
```
https://pixabay.com/api/?key={API_KEY}&q={termino}&per_page=30&page={pagina}
```

Campos útiles de cada imagen (`resultado.hits[n]`):

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | ID único |
| `previewURL` | string | Thumbnail (150x150) |
| `largeImageURL` | string | Imagen grande (hasta 1920px) |
| `tags` | string | Tags separados por coma |
| `likes` | number | Likes totales |
| `views` | number | Vistas totales |
| `user` | string | Nombre del autor |
| `userImageURL` | string | Avatar del autor |
| `totalHits` | number | Total de resultados (en la respuesta raíz) |

---

## Configuración

1. Copia el archivo de ejemplo:
cp .env.example .env

2. Obtén tu API key gratis en:
https://pixabay.com/api/docs/

3. Reemplaza la variable en `.env`

---
