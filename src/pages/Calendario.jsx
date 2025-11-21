import React, { useState, useEffect, useCallback } from "react";
import Css from './../css/calendario.module.css';
import { Titulo } from '../coponentes/Cabesera/Titulo';
import ICAL from "ical.js";
import { Barra } from "../coponentes/BarraMenu/Barra";
import Server from "../api"; // ✔ instancia Axios correcta

export function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Inicia con la fecha actual seleccionada
  const [cumpleanios, setCumpleanios] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL del calendario de feriados de Bolivia (usando la versión ICS para parseo)
  const urlFeriadosIcs = 
    "https://calendar.google.com/calendar/ical/es.bo%23holiday%40group.v.calendar.google.com/public/basic.ics";

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 👉 1. Cargar cumpleaños desde Django (Axios)
  useEffect(() => {
    const fetchCumpleanios = async () => {
      setLoading(true);
      try {
        const res = await Server.get("api/usuarios/");
        const data = res.data;

        // Mapear cumpleaños al año visible actualmente para marcarlos
        const eventos = data.map(u => {
          const fn = new Date(u.fecha_nacimiento);
          return {
            fecha: new Date(currentDate.getFullYear(), fn.getMonth(), fn.getDate()),
            titulo: `🎂 Cumpleaños de ${u.nombre} ${u.apellido_p}`,
            tipo: "cumple"
          };
        });

        setCumpleanios(eventos);
      } catch (error) {
        console.error("❌ Error al cargar cumpleaños:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCumpleanios();
  }, [currentDate]); // Dependencia en currentDate para recalcular al cambiar de año/mes

  // 👉 2. Cargar feriados desde Google Calendar ICS
  useEffect(() => {
    const cargarFeriados = async () => {
      try {
        // Usar fetch estándar para obtener el archivo ICS
        const res = await fetch(urlFeriadosIcs);
        const texto = await res.text();

        const jcalData = ICAL.parse(texto);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        // Convertir eventos ICAL a objetos JS
        const eventos = vevents.map(ev => {
          const event = new ICAL.Event(ev);
          const start = event.startDate.toJSDate();

          return {
            // Normalizar fecha a medianoche para evitar problemas de zona horaria
            fecha: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
            titulo: `📅 ${event.summary}`,
            tipo: "feriado"
          };
        }).filter(ev => ev.fecha instanceof Date && !isNaN(ev.fecha)); // Filtrar fechas inválidas

        setFeriados(eventos);
      } catch (error) {
        console.error("❌ Error cargando feriados:", error);
      }
    };

    cargarFeriados();
  }, []); // Se ejecuta una sola vez al montar

  // 👉 Lógica de navegación
  const mesAnterior = useCallback(() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)), []);
  const mesSiguiente = useCallback(() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)), []);
  const irAHoy = useCallback(() => { 
    const today = new Date();
    setCurrentDate(today); 
    setSelectedDate(today); 
  }, []);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();
  
  // Función auxiliar para comparar solo día/mes/año
  const esMismaFecha = (date1, date2) => 
    date1 && date2 && 
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const esHoy = (dia) =>
    dia === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();
    
  const esSeleccionado = (dia) =>
    selectedDate &&
    dia === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  const todosEventos = [...cumpleanios, ...feriados];

  const obtenerEventos = (dia) =>
    todosEventos.filter(ev =>
      ev.fecha.getDate() === dia &&
      ev.fecha.getMonth() === currentMonth &&
      ev.fecha.getFullYear() === currentYear
    );
    
  const tieneEventos = (dia) => obtenerEventos(dia).length > 0;

  const manejarClickFecha = (dia) => {
    if (dia !== null) setSelectedDate(new Date(currentYear, currentMonth, dia));
  };

  // 👉 Generación de días
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const fechas = [];
  for (let i = 0; i < firstDayOfMonth; i++) fechas.push(null);
  for (let i = 1; i <= daysInMonth; i++) fechas.push(i);

  // 👉 Renderizado
  return (
    <Barra>
      <Titulo icon="calendar-number" titulo="Calendario de Eventos" />

      <div className={Css.calendarioHeader}>
        <button className={Css.navButton} onClick={mesAnterior}>&lt;</button>
        <h1>{meses[currentMonth]} {currentYear}</h1>
        <button className={Css.navButton} onClick={mesSiguiente}>&gt;</button>
      </div>

      <div className={Css.controlContainer}>
        <button className={Css.hoyButton} onClick={irAHoy}>Ir a Hoy</button>
      </div>

      <hr />

      {loading ? <p className={Css.loadingState}>Cargando eventos...</p> : (
        <div className={Css.calendario}>
          {dias.map((d, i) => <div key={i} className={Css.dia}>{d}</div>)}

          {fechas.map((f, i) => {
            const isHoy = f !== null && esHoy(f);
            const isSeleccionado = f !== null && esSeleccionado(f);
            const isConEvento = f !== null && tieneEventos(f);

            const claseFecha = [
              Css.fecha,
              f === null ? Css.vacio : '',
              isHoy ? Css.hoy : '',
              isSeleccionado ? Css.seleccionado : '',
              isConEvento ? Css.conEvento : ''
            ].join(' ').trim();

            return (
              <div
                key={i}
                className={claseFecha}
                onClick={() => manejarClickFecha(f)}
              >
                {f}
                {isConEvento && (
                  <div className={Css.marcadorEvento}>
                    {obtenerEventos(f).some(ev => ev.tipo === "cumple") ? "🎂" : ""}
                    {obtenerEventos(f).some(ev => ev.tipo === "feriado") ? "📅" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <div className={Css.infoSeleccionada}>
          <h3>Fecha seleccionada:</h3>
          <p>{selectedDate.getDate()} de **{meses[selectedDate.getMonth()]}** de {selectedDate.getFullYear()}</p>

          <ListaEventosComponent 
            eventos={obtenerEventos(selectedDate.getDate())} 
            css={Css}
          />
        </div>
      )}

      <div className={Css.leyenda}>
        <div className={Css.itemLeyenda}>
          <span className={`${Css.marcadorLeyenda} ${Css.hoy}`}></span> Hoy
        </div>
        <div className={Css.itemLeyenda}>
          <span className={`${Css.marcadorLeyenda} ${Css.seleccionado}`}></span> Seleccionado
        </div>
        <div className={Css.itemLeyenda}>
          <span className={`${Css.marcadorLeyenda} ${Css.conEvento}`}></span> Con evento
        </div>
      </div>
    </Barra>
  );
}

// Componente para la lista de eventos (más limpio)
const ListaEventosComponent = ({ eventos, css }) => {
  if (eventos.length === 0) {
    return <p className={css.sinEventos}>No hay eventos en esta fecha</p>;
  }

  return (
    <div className={css.listaEventos}>
      <h4>Eventos:</h4>
      <ul>
        {eventos.map((evento, index) => (
          <li key={index}>
            {evento.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
};