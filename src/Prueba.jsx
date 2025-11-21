import React, { useState, useEffect } from "react";

export function Prueba() {
  const [feriados, setFeriados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFeriados = async () => {
      try {
        // Usar una API pública de feriados
        const res = await fetch('https://date.nager.at/api/v3/PublicHolidays/2025/BO');
        const data = await res.json();
        
        const eventos = data.map(feriado => ({
          fecha: feriado.date,
          titulo: feriado.localName
        }));
        
        setFeriados(eventos);
      } catch (error) {
        console.error("Error cargando feriados:", error);
        // Fallback a datos estáticos
        const feriadosEstaticos = [
          { fecha: "2024-01-01", titulo: "Año Nuevo" },
          { fecha: "2024-01-22", titulo: "Día del Estado Plurinacional" },
          { fecha: "2024-02-12", titulo: "Carnaval" },
          { fecha: "2024-02-13", titulo: "Carnaval" },
          { fecha: "2024-03-29", titulo: "Viernes Santo" },
          { fecha: "2024-05-01", titulo: "Día del Trabajo" },
          { fecha: "2024-05-30", titulo: "Corpus Christi" },
          { fecha: "2024-06-21", titulo: "Año Nuevo Aymara" },
          { fecha: "2024-08-06", titulo: "Día de la Independencia" },
          { fecha: "2024-11-02", titulo: "Día de los Difuntos" },
          { fecha: "2024-12-25", titulo: "Navidad" }
        ];
        setFeriados(feriadosEstaticos);
      } finally {
        setCargando(false);
      }
    };

    cargarFeriados();
  }, []);

  if (cargando) {
    return <div>Cargando feriados...</div>;
  }

  return (
    <div>
      <h2>Feriados en Bolivia 2024</h2>
      <ul>
        {feriados.map((f, index) => (
          <li key={index}>
            <strong>{f.fecha}:</strong> {f.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}