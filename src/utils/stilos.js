
/* =============================
   PALETAS DE COLORES COMPLETAS
   ============================= */

   const Paletas = {
    negro: {
      "color-boton-principal": "#000000",
      "color-boton-secundario": "#444444",
      "color-fondo-principal": "#FFFFFF",
      "color-fondo-secundario": "#F4F4F4",
      "color-texto-principal": "#000000",
      "color-texto-secundario": "#333333",
    },
  
    azul: {
      "color-boton-principal": "#0A3D62",
      "color-boton-secundario": "#3C6382",
      "color-fondo-principal": "#F1F2F6",
      "color-fondo-secundario": "#DFF0FF",
      "color-texto-principal": "#1B262C",
      "color-texto-secundario": "#3D4F5C",
    },
  
    rojo: {
      "color-boton-principal": "#8B0000",
      "color-boton-secundario": "#B71C1C",
      "color-fondo-principal": "#FFF5F5",
      "color-fondo-secundario": "#FFDCDC",
      "color-texto-principal": "#2D0000",
      "color-texto-secundario": "#6A1B1B",
    },
  
    verde: {
      "color-boton-principal": "#2D6A4F",
      "color-boton-secundario": "#40916C",
      "color-fondo-principal": "#ECF8F4",
      "color-fondo-secundario": "#D6F4E6",
      "color-texto-principal": "#081C15",
      "color-texto-secundario": "#355B4B",
    },
  };
  
  /* =============================
     FUNCIÓN GENERAL PARA APLICAR VARIABLES
     ============================= */
  export function aplicarVariablesCSS() {
    const root = document.documentElement;
  
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("var-")) {
        const cssVar = key.replace("var-", "");
        const value = localStorage.getItem(key);
        root.style.setProperty(`--${cssVar}`, value);
      }
    });
  }
  
  /* =============================
     CAMBIAR PALETA COMPLETA
     ============================= */
  export function Colores(nro) {
    const paleta = Paletas[nro];
  
    if (!paleta) return;
  
    Object.entries(paleta).forEach(([nombre, valor]) => {
      localStorage.setItem(`var-${nombre}`, valor);
    });
  
    aplicarVariablesCSS(); // aplicar cambios visualmente
  }
  
  /* =============================
     Tamaños de texto
     ============================= */
  export function Size(nro) {
    let size = "16px";
  
    switch (nro) {
      case "pequeño":
        size = "14px";
        break;
      case "mediano":
        size = "18px";
        break;
      case "grande":
        size = "22px";
        break;
    }
  
    localStorage.setItem("var-text-base", size);
    aplicarVariablesCSS();
  }
  
  /* =============================
     Tipo de texto
     ============================= */
  export function StileText(nro) {
    let font = "Inter, sans-serif";
  
    switch (nro) {
      case "normal":
        font = "Inter, sans-serif";
        break;
      case "moderno":
        font = "Poppins, sans-serif";
        break;
      case "serif":
        font = "Merriweather, serif";
        break;
    }
  
    localStorage.setItem("var-font-family", font);
    aplicarVariablesCSS();
  }
  