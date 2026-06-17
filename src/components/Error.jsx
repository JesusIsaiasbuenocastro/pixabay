import React from 'react';

const Error = ({mensaje}) => {
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
 
export default Error;