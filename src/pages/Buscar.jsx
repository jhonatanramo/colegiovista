import React, { useState, useEffect, useCallback } from "react";
import { Barra } from "../coponentes/BarraMenu/Barra";
import { Titulo } from "../coponentes/Cabesera/Titulo";
import Css from "./css/Buscar.module.css";
import Server from "../api"; // ✔ instancia Axios

export function Buscar() {
  const [titulo, setTitulo] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [letraOficial, setLetraOficial] = useState([]); // Renombrado a letraOficial
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [indexActual, setIndexActual] = useState(0);
  const [cargandoLetra, setCargandoLetra] = useState(false); // Nuevo estado de carga

  // Mezclar los párrafos con el coro
  const mezclar = useCallback((parrafos, coro) => {
    // Genera la secuencia [parrafo1, coro, parrafo2, coro, ...]
    const resultado = parrafos.flatMap((p, index) => {
      // Si es el último, solo añade el párrafo (o no añade el coro final)
      if (index === parrafos.length - 1) {
        return [p.parrafo];
      }
      return [p.parrafo, coro];
    });

    // Añade el coro al final si hay más de un párrafo para asegurar que termine con el coro.
    if (parrafos.length > 0) {
      resultado.push(coro);
    }
    
    setLetraOficial(resultado);
    setIndexActual(0);
  }, []);

  // Obtener títulos del repertorio
  useEffect(() => {
    const GetTitulo = async () => {
      try {
        const response = await Server.get("api/repertorios/");
        setTitulo(response.data);
      } catch (error) {
        console.error("❌ Error al cargar títulos:", error);
      }
    };
    GetTitulo();
  }, []);

  // Filtrar títulos
  const titulosFiltrados = titulo.filter((item) => {
    const busqueda = filtro.toLowerCase();
    return (
      item.nombre.toLowerCase().includes(busqueda) ||
      item.id.toString().includes(busqueda)
    );
  });

  // Obtener párrafos de una canción
  const Parrafos = useCallback(async (nro, coro) => {
    setCargandoLetra(true);
    setLetraOficial([]);
    try {
      const response = await Server.get(`api/parrafos/${nro}/`);
      mezclar(response.data, coro);
    } catch (error) {
      console.error("❌ Error al obtener los párrafos:", error);
      // Opcional: mostrar un mensaje de error en el modal
      setLetraOficial(["Error al cargar la letra. Por favor, inténtalo de nuevo."]);
    } finally {
      setCargandoLetra(false);
    }
  }, [mezclar]);

  // Abrir modal
  const openModal = useCallback((item) => {
    setSelectedItem(item);
    setModalOpen(true);
    Parrafos(item.id, item.coro);
  }, [Parrafos]);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setModalOpen(false);
    setIndexActual(0);
    setLetraOficial([]);
  }, []);

  // Navegar siguiente
  const siguiente = () => {
    setIndexActual((prev) =>
      prev + 1 < letraOficial.length ? prev + 1 : prev
    );
  };

  // Navegar anterior
  const anterior = () => {
    setIndexActual((prev) =>
      prev - 1 >= 0 ? prev - 1 : prev
    );
  };
  
  // Manejador de eventos de teclado para la navegación
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        siguiente();
      } else if (event.key === 'ArrowLeft') {
        anterior();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen, letraOficial.length, siguiente, anterior, closeModal]);


  return (
    <Barra>
      <Titulo icon="book" titulo="Repertorio" />

      {/* Buscador */}
      <div className={Css.buscadorContainer}>
        <input
          type="text"
          placeholder="Buscar por Nro o Nombre"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={Css.inputFiltro}
        />
      </div>

      {/* Lista de tarjetas */}
      <div className={Css.contenedor}>
        {titulosFiltrados.length === 0 ? (
          <div className={Css.emptyState}>No se encontraron títulos.</div>
        ) : (
          titulosFiltrados.map((item) => (
            <div
              className={Css.tarjeta}
              key={item.id}
              onClick={() => openModal(item)}
            >
              <h1>Nro: {item.id}</h1>
              <h2>{item.nombre}</h2>
              <p>{item.coro}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div className={Css.modalOverlay} onClick={closeModal}>
          <div
            className={Css.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <div className={Css.modalHeader}>
              <h2>{selectedItem.nombre}</h2>
            </div>

            {/* Cuerpo */}
            <div className={Css.modalBody}>
              {cargandoLetra ? (
                <div className={Css.emptyState}>Cargando letra...</div>
              ) : letraOficial.length > 0 ? (
                <div className={Css.letraContainer}>
                  {/* Se usa pre-wrap para respetar los saltos de línea de la DB */}
                  <div className={Css.letraTexto}>{letraOficial[indexActual]}</div>
                </div>
              ) : (
                <div className={Css.emptyState}>No se pudo cargar la letra o está vacía.</div>
              )}
            </div>

            {/* Footer */}
            <div className={Css.modalFooter}>
              <div className={Css.controlesNavegacion}>
                <button onClick={closeModal} className={Css.modalCloseButton}>
                  Cerrar
                </button>
                
                {letraOficial.length > 0 && (
                  <div className={Css.contadorProgreso}>
                    {indexActual + 1} / {letraOficial.length}
                  </div>
                )}
                
                <div className={Css.botonesGrupo}>
                  <button
                    onClick={anterior}
                    className={`${Css.btn} ${Css.btnPrimary}`}
                    disabled={indexActual === 0}
                  >
                    ◀ Anterior
                  </button>

                  <button
                    onClick={siguiente}
                    className={`${Css.btn} ${Css.btnPrimary}`}
                    disabled={indexActual === letraOficial.length - 1}
                  >
                    Siguiente ▶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Barra>
  );
}