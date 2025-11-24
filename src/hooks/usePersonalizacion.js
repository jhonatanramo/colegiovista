// hooks/usePersonalizacion.js
import { useState, useEffect } from "react";
import { Colores, Size, StileText, aplicarVariablesCSS } from "../utils/stilos";

export function usePersonalizacion() {
  const [tema, setTema] = useState(localStorage.getItem("tema-activo") || "negro");
  const [tamano, setTamano] = useState(localStorage.getItem("tamano-activo") || "mediano");
  const [estiloTexto, setEstiloTexto] = useState(localStorage.getItem("estilo-texto-activo") || "normal");
  const [loading, setLoading] = useState(false);

  /// 🔵 Paletas
  const paletas = {
    negro: {
      "color-boton-principal": "#000000",
      "color-boton-secundario": "#333333",
      "color-fondo-principal": "#FFFFFF",
      "color-fondo-secundario": "#F8F8F8",
      "color-texto-principal": "#111111",
      "color-texto-secundario": "#444444",
      "color-borde": "#DDDDDD"
    },
    azul: {
      "color-boton-principal": "#2563EB",
      "color-boton-secundario": "#1D4ED8",
      "color-fondo-principal": "#FFFFFF",
      "color-fondo-secundario": "#EFF6FF",
      "color-texto-principal": "#1E3A8A",
      "color-texto-secundario": "#3B82F6",
      "color-borde": "#BFDBFE"
    }
  };

  /// 🔵 Tamaños
  const tamanos = {
    pequeño: "14px",
    mediano: "16px",
    grande: "18px",
    "extra-grande": "20px"
  };

  /// 🔵 Tipografías
  const estilosTexto = {
    normal: "'Inter', sans-serif",
    moderno: "'Poppins', sans-serif",
    elegante: "'Merriweather', serif",
    tecnico: "'JetBrains Mono', monospace"
  };

  /// 🔧 Aplicación global
  const aplicarTodo = async () => {
    setLoading(true);
    await Colores(tema);
    await Size(tamano);
    await StileText(estiloTexto);
    await aplicarVariablesCSS();
    document.documentElement.style.transition = "all .3s ease";
    setLoading(false);
  };

  /// Cambios individuales
  const cambiarTema = async (nuevo) => {
    setTema(nuevo);
    localStorage.setItem("tema-activo", nuevo);
    await Colores(nuevo);
    aplicarVariablesCSS();
  };

  const cambiarTamano = async (nuevo) => {
    setTamano(nuevo);
    localStorage.setItem("tamano-activo", nuevo);
    await Size(nuevo);
    aplicarVariablesCSS();
  };

  const cambiarFuente = async (nuevo) => {
    setEstiloTexto(nuevo);
    localStorage.setItem("estilo-texto-activo", nuevo);
    await StileText(nuevo);
    aplicarVariablesCSS();
  };

  /// Reset total
  const resetear = async () => {
    Object.keys(localStorage).forEach(k => {
      if (k.includes("activo")) localStorage.removeItem(k);
    });
    setTema("negro");
    setTamano("mediano");
    setEstiloTexto("normal");
    await aplicarTodo();
  };

  /// Primera carga
  useEffect(() => {
    aplicarTodo();
  }, []);

  return {
    tema, tamano, estiloTexto,
    paletas, tamanos, estilosTexto,
    cambiarTema, cambiarTamano, cambiarFuente,
    resetear, loading
  };
}
