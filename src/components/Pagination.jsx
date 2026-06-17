

const Pagination= ({ paginaActual, totalPaginas, onAnterior, onSiguiente }) => {
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

export default Pagination;