import { useEffect, useState, useCallback } from "react";

const API_KEY = "15053597-314839e8afc72ab12217cc7b9";
const PER_PAGE = 30;

const CATEGORIES = ["naturaleza", "tecnología", "arquitectura", "viaje", "comida", "animales", "deportes", "música"];

// ── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #e5e7eb",
        borderTopColor: "#6366f1", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Error Alert ──────────────────────────────────────────────────────────────
function ErrorAlert({ mensaje }) {
  return (
    <div style={{
      background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
      borderRadius: 10, padding: "12px 16px", fontSize: 14,
      display: "flex", alignItems: "center", gap: 8, marginTop: 8
    }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {mensaje}
    </div>
  );
}

// ── Tag Badge ────────────────────────────────────────────────────────────────
function TagBadge({ tag, onClick }) {
  return (
    <button
      onClick={() => onClick(tag)}
      style={{
        background: "#f3f4f6", border: "none", borderRadius: 20,
        padding: "3px 10px", fontSize: 12, color: "#374151",
        cursor: "pointer", transition: "background 0.15s",
        fontFamily: "inherit"
      }}
      onMouseOver={e => e.target.style.background = "#e0e7ff"}
      onMouseOut={e => e.target.style.background = "#f3f4f6"}
    >
      {tag}
    </button>
  );
}

// ── Image Card ───────────────────────────────────────────────────────────────
function ImageCard({ imagen, onTagClick }) {
  const { largeImageURL, likes, previewURL, tags, views, user, userImageURL } = imagen;
  const tagList = tags.split(",").map(t => t.trim()).slice(0, 3);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14, overflow: "hidden", background: "#fff",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.14)"
          : "0 2px 8px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex", flexDirection: "column"
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
        <img
          src={previewURL}
          alt={tags}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.4s",
            transform: hovered ? "scale(1.05)" : "scale(1)"
          }}
        />
        {/* Stats overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
          padding: "24px 12px 10px",
          display: "flex", gap: 12, opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s"
        }}>
          <Stat icon="♥" value={likes.toLocaleString()} />
          <Stat icon="👁" value={views.toLocaleString()} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {userImageURL
            ? <img src={userImageURL} alt={user} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
            : <div style={{
                width: 26, height: 26, borderRadius: "50%", background: "#6366f1",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 600
              }}>{user?.charAt(0).toUpperCase()}</div>
          }
          <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{user}</span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {tagList.map(tag => <TagBadge key={tag} tag={tag} onClick={onTagClick} />)}
        </div>

        {/* CTA */}
        <a
          href={largeImageURL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", textAlign: "center", background: "#6366f1",
            color: "#fff", borderRadius: 8, padding: "8px 0", fontSize: 13,
            fontWeight: 600, textDecoration: "none", marginTop: "auto",
            transition: "background 0.15s"
          }}
          onMouseOver={e => e.target.style.background = "#4f46e5"}
          onMouseOut={e => e.target.style.background = "#6366f1"}
        >
          Ver imagen completa ↗
        </a>
      </div>
    </div>
  );
}

function Stat({ icon, value }) {
  return (
    <span style={{ color: "#fff", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
      <span>{icon}</span> {value}
    </span>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ paginaActual, totalPaginas, onAnterior, onSiguiente }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, margin: "2.5rem 0" }}>
      <button
        onClick={onAnterior}
        disabled={paginaActual === 1}
        style={{
          padding: "9px 20px", borderRadius: 8,
          border: "1.5px solid #e5e7eb", background: "#fff",
          color: paginaActual === 1 ? "#d1d5db" : "#374151",
          cursor: paginaActual === 1 ? "not-allowed" : "pointer",
          fontWeight: 600, fontSize: 14, transition: "all 0.15s",
          fontFamily: "inherit"
        }}
      >
        ← Anterior
      </button>

      <span style={{
        fontSize: 14, color: "#6b7280",
        background: "#f9fafb", border: "1px solid #e5e7eb",
        borderRadius: 8, padding: "9px 16px"
      }}>
        {paginaActual} / {totalPaginas}
      </span>

      <button
        onClick={onSiguiente}
        disabled={paginaActual === totalPaginas}
        style={{
          padding: "9px 20px", borderRadius: 8,
          border: "1.5px solid #6366f1", background: "#6366f1",
          color: paginaActual === totalPaginas ? "#a5b4fc" : "#fff",
          cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
          fontWeight: 600, fontSize: 14, transition: "all 0.15s",
          fontFamily: "inherit",
          opacity: paginaActual === totalPaginas ? 0.6 : 1
        }}
      >
        Siguiente →
      </button>
    </div>
  );
}

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
            {error && <ErrorAlert mensaje="Escribe algo para buscar imágenes." />}
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
              <ImageCard key={img.id} imagen={img} onTagClick={handleTag} />
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
      <footer style={{ textAlign: "center", padding: "1.5rem", color: "#9ca3af", fontSize: 13, borderTop: "1px solid #e5e7eb" }}>
        Imágenes cortesía de{" "}
        <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>
          Pixabay
        </a>{" "}
        · Construido con React
      </footer>
    </div>
  );
}
