import { useEffect } from "react";

export function Titulo({ icon, titulo, subtitulo, children }) {
  const name = `${icon}-outline`; // Nombre del icono

  // Aplicar variables al cargarse el componente
  useEffect(() => {
    const root = document.documentElement;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("var-")) {
        const cssVar = key.replace("var-", "");
        const value = localStorage.getItem(key);
        root.style.setProperty(`--${cssVar}`, value);
      }
    });
  }, []);

  return (
    <header
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "var(--color-fondo-secundario)",
        color: "var(--color-texto-principal)",
        fontFamily: "var(--font-family, Inter, sans-serif)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "calc(var(--text-base, 16px) * 1.8)",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
            color: "var(--color-texto-principal)",
            fontFamily: "var(--font-family)",
          }}
        >
          <ion-icon
            name={name}
            style={{ fontSize: "1.2em", color: "var(--color-texto-secundario)" }}
          ></ion-icon>
          {titulo}
        </h1>

        {subtitulo && (
          <p
            style={{
              marginTop: "5px",
              fontSize: "calc(var(--text-base, 16px) * 1.1)",
              color: "var(--color-texto-secundario)",
              fontFamily: "var(--font-family)",
            }}
          >
            {subtitulo}
          </p>
        )}

        <div style={{ marginTop: "15px" }}>{children}</div>
      </div>
    </header>
  );
}
