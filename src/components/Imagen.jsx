import React from 'react';
import {useState } from "react";

// ── Image Card ───────────────────────────────────────────────────────────────
const Imagen =({ imagen, onTagClick }) => {
  const { largeImageURL, likes, previewURL, tags, views, user, userImageURL } = imagen;
  const tagList = tags.split(",").map(t => t.trim()).slice(0, 3);
  const [hovered, setHovered] = useState(false);


  function Stat({ icon, value }) {
        return (
            <span style={{ color: "#fff", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <span>{icon}</span> {value}
            </span>
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


export default Imagen;