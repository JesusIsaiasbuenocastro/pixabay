import { useEffect, useState, useCallback } from "react";
import Imagen from './components/Imagen';
import Footer from "./components/Footer";
import Error from "./components/Error";
import Pagination from "./components/Pagination";
import Spinner from "./components/Spinner";

const API_KEY = "15053597-314839e8afc72ab12217cc7b9";
const PER_PAGE = 30;

const CATEGORIES = ["naturaleza", "tecnología", "arquitectura", "viaje", "comida", "animales", "deportes", "música"];

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const consultarAPI = useCallback(async () => {
    if (!busqueda) return;
    setLoading(true);
    try {
      const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(busqueda)}&per_page=${PER_PAGE}&page=${paginaActual}&lang=es`;
      const res = await fetch(url);
      const data = await res.json();
      setImagenes(data.hits);
      setTotalPaginas(Math.ceil(data.totalHits / PER_PAGE));
      setTotalResultados(data.totalHits);
    } catch {
      console.error("Error al consultar la API");
    } finally {
      setLoading(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [busqueda, paginaActual]);

  useEffect(() => { consultarAPI(); }, [consultarAPI]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) { setError(true); return; }
    setError(false);
    setPaginaActual(1);
    setBusqueda(inputVal.trim());
  };

  const handleTag = (tag) => {
    setInputVal(tag);
    setError(false);
    setPaginaActual(1);
    setBusqueda(tag);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Hero Header ── */}
      <header style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        padding: "3rem 1.5rem 2.5rem"
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)"/>
              <path d="M8 22L14 10L20 18L24 14L28 22H8Z" fill="white" opacity="0.9"/>
              <circle cx="10" cy="12" r="2.5" fill="white"/>
            </svg>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>
              Pixabay Explorer
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: "1.75rem" }}>
            Millones de imágenes libres de derechos, a un clic de distancia
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit}>
            <div style={{
              display: "flex", gap: 10, background: "#fff",
              borderRadius: 14, padding: "6px 6px 6px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
            }}>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Busca imágenes: montañas, ciudad, café..."
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 15, background: "transparent",
                  color: "#111", fontFamily: "inherit"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#6366f1", color: "#fff", border: "none",
                  borderRadius: 10, padding: "10px 22px", fontWeight: 700,
                  fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.15s"
                }}
                onMouseOver={e => e.target.style.background = "#4f46e5"}
                onMouseOut={e => e.target.style.background = "#6366f1"}
              >
                Buscar
              </button>
            </div>
            {error && <Error mensaje="Escribe algo para buscar imágenes." />}
          </form>

          {/* Quick categories */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: "1.25rem" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleTag(cat)}
                style={{
                  background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)",
                  color: "#fff", borderRadius: 20, padding: "5px 14px",
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.15s", backdropFilter: "blur(4px)"
                }}
                onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.3)"}
                onMouseOut={e => e.target.style.background = "rgba(255,255,255,0.18)"}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Results ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.25rem" }}>

        {/* Results count */}
        {!loading && imagenes.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              <strong style={{ color: "#111" }}>{totalResultados.toLocaleString()}</strong> resultados para{" "}
              <strong style={{ color: "#6366f1" }}>"{busqueda}"</strong>
            </p>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              Página {paginaActual} de {totalPaginas}
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && imagenes.length === 0 && busqueda && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: 16 }}>No encontramos imágenes para <strong>"{busqueda}"</strong></p>
            <p style={{ fontSize: 14 }}>Intenta con otro término</p>
          </div>
        )}

        {/* Initial state */}
        {!loading && imagenes.length === 0 && !busqueda && (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 56, marginBottom: "1rem" }}>🖼️</div>
            <p style={{ fontSize: 17, color: "#374151", fontWeight: 500 }}>¿Qué quieres explorar hoy?</p>
            <p style={{ fontSize: 14 }}>Usa el buscador o elige una categoría de arriba</p>
          </div>
        )}

        {/* Spinner */}
        {loading && <Spinner />}

        {/* Grid */}
        {!loading && imagenes.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem"
          }}>
            {imagenes.map(img => (
              <Imagen key={img.id} imagen={img} onTagClick={handleTag} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && imagenes.length > 0 && (
          <Pagination
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onAnterior={() => setPaginaActual(p => Math.max(p - 1, 1))}
            onSiguiente={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
          />
        )}
      </main>
      {/* ── Footer ── */}
      <Footer/>
    </div>
  );
}
