import { useState, useEffect } from "react";
import { Barra } from "../coponentes/BarraMenu/Barra";
import { Colores, Size, StileText, aplicarVariablesCSS } from "../utils/stilos";

export function Stilos() {
  const [tema, setTema] = useState(localStorage.getItem("tema-activo") || "negro");
  const [tamano, setTamano] = useState(localStorage.getItem("tamano-activo") || "mediano");
  const [estiloTexto, setEstiloTexto] = useState(localStorage.getItem("estilo-texto-activo") || "normal");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Paletas de colores mejoradas con más opciones y mejor contraste
  const paletas = {
    "negro": {
      "color-boton-principal": "#000000",
      "color-boton-secundario": "#374151",
      "color-fondo-principal": "#FFFFFF",
      "color-fondo-secundario": "#F9FAFB",
      "color-texto-principal": "#111827",
      "color-texto-secundario": "#6B7280",
      "color-borde": "#E5E7EB",
      "color-hover": "#F3F4F6",
    },
    "azul": {
      "color-boton-principal": "#2563EB",
      "color-boton-secundario": "#1D4ED8",
      "color-fondo-principal": "#FFFFFF",
      "color-fondo-secundario": "#F0F9FF",
      "color-texto-principal": "#1E3A8A",
      "color-texto-secundario": "#3B82F6",
      "color-borde": "#BFDBFE",
      "color-hover": "#E0F2FE",
    },
    "rojo": {
      "color-boton-principal": "#DC2626",
      "color-boton-secundario": "#B91C1C",
      "color-fondo-principal": "#FEF2F2",
      "color-fondo-secundario": "#FECACA",
      "color-texto-principal": "#7F1D1D",
      "color-texto-secundario": "#B91C1C",
      "color-borde": "#FCA5A5",
      "color-hover": "#FEE2E2",
    },
    "verde": {
      "color-boton-principal": "#059669",
      "color-boton-secundario": "#047857",
      "color-fondo-principal": "#F0FDF4",
      "color-fondo-secundario": "#DCFCE7",
      "color-texto-principal": "#064E3B",
      "color-texto-secundario": "#059669",
      "color-borde": "#A7F3D0",
      "color-hover": "#D1FAE5",
    },
    "purpura": {
      "color-boton-principal": "#7C3AED",
      "color-boton-secundario": "#6D28D9",
      "color-fondo-principal": "#FAF5FF",
      "color-fondo-secundario": "#EDE9FE",
      "color-texto-principal": "#4C1D95",
      "color-texto-secundario": "#7C3AED",
      "color-borde": "#C4B5FD",
      "color-hover": "#EDE9FE",
    },
    "naranja": {
      "color-boton-principal": "#EA580C",
      "color-boton-secundario": "#C2410C",
      "color-fondo-principal": "#FFF7ED",
      "color-fondo-secundario": "#FFEDD5",
      "color-texto-principal": "#7C2D12",
      "color-texto-secundario": "#EA580C",
      "color-borde": "#FDBA74",
      "color-hover": "#FFEDD5",
    }
  };

  // Opciones de tamaño mejoradas
  const tamanos = {
    "pequeño": "14px",
    "mediano": "16px", 
    "grande": "18px",
    "extra-grande": "20px"
  };

  // Opciones de estilo de texto mejoradas
  const estilosTexto = {
    "normal": "'Inter', 'Segoe UI', system-ui, sans-serif",
    "moderno": "'Poppins', 'SF Pro Display', system-ui, sans-serif",
    "elegante": "'Merriweather', 'Georgia', serif",
    "tecnico": "'JetBrains Mono', 'Fira Code', monospace"
  };

  // Aplicar configuración completa con mejor manejo de errores
  const aplicarConfiguracionCompleta = async () => {
    setCargando(true);
    try {
      // Aplicar colores del tema
      await Colores(tema);
      
      // Aplicar tamaño
      await Size(tamano);
      
      // Aplicar estilo de texto
      await StileText(estiloTexto);
      
      // Forzar aplicación de variables CSS
      await aplicarVariablesCSS();
      
      // Agregar transición suave a todo el documento
      document.documentElement.style.transition = 'all 0.3s ease-in-out';
      
    } catch (error) {
      console.error('Error aplicando configuración:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cambiar tema de colores con animación
  const cambiarTema = async (nuevoTema) => {
    setCargando(true);
    setTema(nuevoTema);
    localStorage.setItem("tema-activo", nuevoTema);
    
    try {
      await Colores(nuevoTema);
      await aplicarVariablesCSS();
    } catch (error) {
      console.error('Error cambiando tema:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cambiar tamaño con animación
  const cambiarTamano = async (nuevoTamano) => {
    setCargando(true);
    setTamano(nuevoTamano);
    localStorage.setItem("tamano-activo", nuevoTamano);
    
    try {
      await Size(nuevoTamano);
      await aplicarVariablesCSS();
    } catch (error) {
      console.error('Error cambiando tamaño:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cambiar estilo de texto con animación
  const cambiarEstiloTexto = async (nuevoEstilo) => {
    setCargando(true);
    setEstiloTexto(nuevoEstilo);
    localStorage.setItem("estilo-texto-activo", nuevoEstilo);
    
    try {
      await StileText(nuevoEstilo);
      await aplicarVariablesCSS();
    } catch (error) {
      console.error('Error cambiando estilo de texto:', error);
    } finally {
      setCargando(false);
    }
  };

  // Resetear personalizaciones con confirmación
  const resetearPersonalizaciones = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarReset = async () => {
    setCargando(true);
    setMostrarConfirmacion(false);
    
    // Remover todas las variables personalizadas
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("var-") || key.endsWith("-activo")) {
        localStorage.removeItem(key);
      }
    });
    
    // Resetear estados
    setTema("negro");
    setTamano("mediano");
    setEstiloTexto("normal");
    
    // Aplicar configuración por defecto
    await aplicarConfiguracionCompleta();
    setCargando(false);
  };

  const cancelarReset = () => {
    setMostrarConfirmacion(false);
  };

  // Cargar fuentes externas
  useEffect(() => {
    // Precargar fuentes Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Merriweather:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Al cargar el componente
  useEffect(() => {
    aplicarConfiguracionCompleta();
  }, []);

  // Función para obtener nombre legible mejorada
  const obtenerNombreLegible = (key, tipo) => {
    const nombres = {
      tema: {
        "negro": "Clásico Negro ⚫",
        "azul": "Azul Profesional 🌊", 
        "rojo": "Rojo Energético 🔴",
        "verde": "Verde Natural 🌿",
        "purpura": "Púrpura Creativo 💜",
        "naranja": "Naranja Vibrante 🟠"
      },
      tamano: {
        "pequeño": "Compacto (14px)",
        "mediano": "Estándar (16px)",
        "grande": "Amplio (18px)",
        "extra-grande": "Grande (20px)"
      },
      estiloTexto: {
        "normal": "Inter - Universal",
        "moderno": "Poppins - Moderno", 
        "elegante": "Merriweather - Elegante",
        "tecnico": "JetBrains Mono - Técnico"
      }
    };
    
    return nombres[tipo]?.[key] || key;
  };

  // Función para obtener colores actuales
  const getCurrentColors = () => paletas[tema] || paletas.negro;

  return (
    <Barra>
      <div
        className="min-h-screen transition-all duration-300"
        style={{
          background: "var(--color-fondo-principal, #FFFFFF)",
          color: "var(--color-texto-principal, #000000)",
          fontFamily: "var(--font-family, Inter, sans-serif)",
          fontSize: "var(--text-base, 16px)",
        }}
      >
        {/* Overlay de carga */}
        {cargando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex items-center space-x-4 m-5">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Aplicando cambios...</span>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
            <div 
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
              style={{
                background: "var(--color-fondo-principal, #FFFFFF)",
                color: "var(--color-texto-principal, #000000)",
              }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">¿Restablecer personalizaciones?</h3>
              <p className="mb-8 text-lg text-center opacity-80 leading-relaxed">
                Esta acción eliminará todas tus personalizaciones y volverá a los valores predeterminados.
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={cancelarReset}
                  className="px-6 py-3 rounded-xl font-medium transition-all border-2 m-1"
                  style={{
                    background: "var(--color-fondo-secundario, #F4F4F4)",
                    color: "var(--color-texto-principal, #000000)",
                    borderColor: "var(--color-borde, #E5E7EB)",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarReset}
                  className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg m-1"
                  style={{
                    background: "var(--color-boton-principal, #000000)",
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
          {/* Header con mejor espaciado */}
          <div className="text-center mb-20 pt-12 px-5">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personalizador de Tema
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
              Personaliza completamente la apariencia de tu aplicación. Los cambios se aplican en tiempo real.
            </p>
          </div>

          {/* Indicador de configuración actual con mejor espaciado */}
          <div className="mb-20 p-8 rounded-3xl text-center m-5" style={{ 
            background: "var(--color-fondo-secundario, #F4F4F4)",
            border: "2px dashed var(--color-borde, #E5E7EB)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            <h3 className="text-xl font-semibold mb-8 opacity-80">Configuración Actual</h3>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center space-x-4 bg-white px-6 py-4 rounded-xl shadow-lg m-2">
                <div className="w-6 h-6 rounded-full shadow-inner border" style={{ background: getCurrentColors()["color-boton-principal"] }}></div>
                <span className="font-semibold text-base">{obtenerNombreLegible(tema, "tema")}</span>
              </div>
              <div className="flex items-center space-x-4 bg-white px-6 py-4 rounded-xl shadow-lg m-2">
                <span className="text-xl">📏</span>
                <span className="font-semibold text-base">{obtenerNombreLegible(tamano, "tamano")}</span>
              </div>
              <div className="flex items-center space-x-4 bg-white px-6 py-4 rounded-xl shadow-lg m-2">
                <span className="text-xl">🔤</span>
                <span className="font-semibold text-base">{obtenerNombreLegible(estiloTexto, "estiloTexto")}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE COLORES con mejor espaciado */}
          <div className="mb-24 px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">🎨 Paleta de Colores</h2>
              <p className="text-xl opacity-70 max-w-2xl mx-auto px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
                Elige una paleta de colores que se adapte a tu estilo
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 m-5">
              {Object.keys(paletas).map((paleta) => (
                <button
                  key={paleta}
                  onClick={() => cambiarTema(paleta)}
                  className={`p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-110 hover:shadow-2xl group m-2 ${
                    tema === paleta ? "ring-4 ring-offset-4 scale-110 shadow-2xl" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${paletas[paleta]["color-fondo-principal"]} 0%, ${paletas[paleta]["color-fondo-secundario"]} 100%)`,
                    color: paletas[paleta]["color-texto-principal"],
                    borderColor: tema === paleta ? paletas[paleta]["color-boton-principal"] : paletas[paleta]["color-borde"],
                  }}
                >
                  <div className="font-bold mb-4 text-base px-2">{obtenerNombreLegible(paleta, "tema").split(' ')[0]}</div>
                  <div className="flex gap-3 justify-center mb-4 px-2">
                    <div className="w-8 h-8 rounded-xl shadow-lg border-2" style={{ background: paletas[paleta]["color-boton-principal"] }}></div>
                    <div className="w-8 h-8 rounded-xl shadow-lg border-2" style={{ background: paletas[paleta]["color-boton-secundario"] }}></div>
                    <div className="w-8 h-8 rounded-xl shadow-lg border-2" style={{ 
                      background: paletas[paleta]["color-fondo-principal"],
                      borderColor: paletas[paleta]["color-borde"]
                    }}></div>
                  </div>
                  <div className={`text-sm font-semibold transition-all px-2 py-1 rounded-lg ${
                    tema === paleta ? "opacity-100 bg-white bg-opacity-20" : "opacity-70 group-hover:opacity-100"
                  }`}>
                    {tema === paleta ? "✓ Seleccionado" : "Seleccionar"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN DE TAMAÑO Y TIPOGRAFÍA EN GRID con mejor espaciado */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 mb-24 px-5">
            {/* TAMAÑO DE TEXTO */}
            <div className="bg-white rounded-3xl p-10 shadow-xl m-5" style={{
              border: "2px solid var(--color-borde, #E5E7EB)"
            }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">📏 Tamaño del Texto</h2>
                <p className="text-lg opacity-70 px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
                  Ajusta el tamaño de la tipografía para mejor legibilidad
                </p>
              </div>
              
              <div className="space-y-6">
                {Object.keys(tamanos).map((tamanoOp) => (
                  <button
                    key={tamanoOp}
                    onClick={() => cambiarTamano(tamanoOp)}
                    className={`w-full p-6 rounded-2xl border-3 transition-all duration-200 text-left flex items-center justify-between group m-2 ${
                      tamano === tamanoOp ? "ring-4 ring-offset-4 shadow-xl" : "hover:shadow-lg"
                    }`}
                    style={{
                      background: tamano === tamanoOp ? "var(--color-boton-principal, #000000)" : "var(--color-fondo-secundario, #F4F4F4)",
                      color: tamano === tamanoOp ? "white" : "var(--color-texto-principal, #000000)",
                      borderColor: tamano === tamanoOp ? "var(--color-boton-principal, #000000)" : "var(--color-borde, #E5E7EB)",
                      fontSize: tamanos[tamanoOp]
                    }}
                  >
                    <div className="px-2">
                      <div className="font-bold text-lg">{obtenerNombreLegible(tamanoOp, "tamano")}</div>
                      <div className="text-base opacity-70 mt-2" style={{
                        color: tamano === tamanoOp ? "rgba(255,255,255,0.8)" : "var(--color-texto-secundario, #333333)"
                      }}>
                        Texto de ejemplo con este tamaño
                      </div>
                    </div>
                    {tamano === tamanoOp && (
                      <span className="text-xl bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold m-2">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ESTILO DE TEXTO */}
            <div className="bg-white rounded-3xl p-10 shadow-xl m-5" style={{
              border: "2px solid var(--color-borde, #E5E7EB)"
            }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">🔤 Estilo de Tipografía</h2>
                <p className="text-lg opacity-70 px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
                  Elige una fuente que refleje tu personalidad
                </p>
              </div>
              
              <div className="space-y-6">
                {Object.keys(estilosTexto).map((estilo) => (
                  <button
                    key={estilo}
                    onClick={() => cambiarEstiloTexto(estilo)}
                    className={`w-full p-6 rounded-2xl border-3 transition-all duration-200 text-left group m-2 ${
                      estiloTexto === estilo ? "ring-4 ring-offset-4 shadow-xl" : "hover:shadow-lg"
                    }`}
                    style={{
                      background: estiloTexto === estilo ? "var(--color-boton-principal, #000000)" : "var(--color-fondo-secundario, #F4F4F4)",
                      color: estiloTexto === estilo ? "white" : "var(--color-texto-principal, #000000)",
                      borderColor: estiloTexto === estilo ? "var(--color-boton-principal, #000000)" : "var(--color-borde, #E5E7EB)",
                      fontFamily: estilosTexto[estilo]
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="font-bold text-lg">{obtenerNombreLegible(estilo, "estiloTexto")}</div>
                      {estiloTexto === estilo && (
                        <span className="text-xl bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</span>
                      )}
                    </div>
                    <div className="text-base opacity-70 leading-relaxed px-2" style={{ 
                      fontFamily: estilosTexto[estilo],
                      color: estiloTexto === estilo ? "rgba(255,255,255,0.8)" : "var(--color-texto-secundario, #333333)"
                    }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </div>
                    <div className="text-sm mt-3 opacity-60 px-2" style={{
                      color: estiloTexto === estilo ? "rgba(255,255,255,0.6)" : "var(--color-texto-secundario, #333333)"
                    }}>
                      abcdefghijklmnopqrstuvwxyz
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* VISTA PREVIA MEJORADA con mejor espaciado */}
          <div className="mb-24 p-10 rounded-3xl m-5" style={{ 
            background: "var(--color-fondo-secundario, #F4F4F4)",
            border: "3px solid var(--color-borde, #E5E7EB)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
          }}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">👁️ Vista Previa en Tiempo Real</h2>
              <p className="text-xl opacity-70 max-w-2xl mx-auto px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
                Así se verán los componentes con tu configuración actual
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="font-bold text-2xl mb-8 text-center px-5">Componentes Interactivos</h3>
                
                <div className="space-y-6 px-5">
                  <button 
                    className="w-full px-8 py-5 rounded-2xl font-bold transition-all hover:shadow-2xl transform hover:scale-105 m-2"
                    style={{
                      background: "var(--color-boton-principal, #000000)",
                      color: "white",
                    }}
                  >
                    Botón Principal
                  </button>
                  
                  <button 
                    className="w-full px-8 py-5 rounded-2xl font-bold border-3 transition-all hover:shadow-2xl transform hover:scale-105 m-2"
                    style={{
                      background: "var(--color-boton-secundario, #444444)",
                      color: "white",
                      borderColor: "var(--color-boton-secundario, #444444)"
                    }}
                  >
                    Botón Secundario
                  </button>
                  
                  <button 
                    className="w-full px-8 py-5 rounded-2xl font-bold border-3 transition-all hover:shadow-2xl transform hover:scale-105 m-2"
                    style={{
                      background: "transparent",
                      color: "var(--color-texto-principal, #000000)",
                      borderColor: "var(--color-borde, #E5E7EB)"
                    }}
                  >
                    Botón Outline
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8 px-5">
                  <div className="p-6 rounded-xl text-center m-2" style={{
                    background: "var(--color-fondo-principal, #FFFFFF)",
                    border: "2px solid var(--color-borde, #E5E7EB)"
                  }}>
                    <div className="text-3xl mb-3">📊</div>
                    <div className="text-base font-semibold">Métrica</div>
                  </div>
                  <div className="p-6 rounded-xl text-center m-2" style={{
                    background: "var(--color-fondo-principal, #FFFFFF)",
                    border: "2px solid var(--color-borde, #E5E7EB)"
                  }}>
                    <div className="text-3xl mb-3">⭐</div>
                    <div className="text-base font-semibold">Estadística</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-bold text-2xl mb-8 text-center px-5">Contenido de Ejemplo</h3>
                
                <div className="p-8 rounded-2xl space-y-6 m-2" style={{ 
                  background: "var(--color-fondo-principal, #FFFFFF)",
                  border: "2px solid var(--color-borde, #E5E7EB)"
                }}>
                  <h4 className="font-bold text-2xl">Tarjeta Informativa</h4>
                  <p className="leading-relaxed text-lg" style={{ color: "var(--color-texto-secundario, #333333)" }}>
                    Este es un ejemplo de texto secundario que demuestra el contraste y legibilidad de tu configuración actual. Observa cómo se adaptan los colores y el espaciado.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-6">
                    <span className="px-4 py-2 rounded-full text-base font-semibold m-1" style={{
                      background: "var(--color-boton-secundario, #444444)",
                      color: "white"
                    }}>Etiqueta Principal</span>
                    <span className="px-4 py-2 rounded-full text-base font-semibold border-2 m-1" style={{
                      background: "transparent",
                      color: "var(--color-texto-secundario, #333333)",
                      borderColor: "var(--color-borde, #E5E7EB)"
                    }}>Secundaria</span>
                    <span className="px-4 py-2 rounded-full text-base font-semibold m-1" style={{
                      background: "var(--color-boton-principal, #000000)",
                      color: "white"
                    }}>Importante</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl m-2" style={{
                  background: "var(--color-fondo-principal, #FFFFFF)",
                  border: "2px solid var(--color-borde, #E5E7EB)"
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg">Progreso de Ejemplo</span>
                    <span className="text-base opacity-70">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full" style={{
                      background: "var(--color-boton-principal, #000000)",
                      width: "75%"
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN RESET MEJORADO con mejor espaciado */}
          <div className="text-center py-12 px-5">
            <button
              onClick={resetearPersonalizaciones}
              className="px-10 py-5 rounded-2xl font-bold border-3 transition-all hover:shadow-2xl transform hover:scale-105 group inline-flex items-center m-5"
              style={{
                background: "var(--color-fondo-secundario, #F4F4F4)",
                color: "var(--color-texto-principal, #000000)",
                borderColor: "var(--color-boton-secundario, #444444)",
              }}
            >
              <span className="group-hover:scale-110 transition-transform mr-4 text-xl">🔄</span>
              <span className="text-lg">Restablecer a Valores Predeterminados</span>
            </button>
            <p className="mt-6 text-base opacity-70 max-w-md mx-auto px-5" style={{ color: "var(--color-texto-secundario, #333333)" }}>
              Los cambios se guardan automáticamente en tu navegador y persistirán en tu próxima visita
            </p>
          </div>
        </div>
      </div>
    </Barra>
  );
}