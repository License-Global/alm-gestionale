import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Pagina non trovata</h1>
      <p>Sembra che la pagina che stai cercando non esista.</p>
      <Link to="/">Torna alla home</Link>
    </div>
  );
}

export default NotFound;
