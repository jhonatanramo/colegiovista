import React, { useState } from "react";
import { Link } from "react-router-dom";
import Css from "../../css/Template.module.css";

export function Template() {
  const [open, setOpen] = useState(false);

  return (
    <div className={Css.fabContainer}>
      

      <div className={`${Css.fabMenu} ${open ? Css.show : ""}`}>
       <Link to="https://wa.me/72630188?text=Hola%20quiero%20más%20información" target="_blank"className={Css.fabItem}>
          <ion-icon name="logo-whatsapp"></ion-icon>
        </Link>

        <Link to="/Repertorio" className={Css.fabItem}>
          <ion-icon name="construct-outline"></ion-icon>
        </Link>
        <Link to="/Calendario" className={Css.fabItem}>
        <ion-icon name="calendar-outline"></ion-icon>
        </Link>
        <Link to="/Bucar" className={Css.fabItem}>
          <ion-icon name="search-outline"></ion-icon>
        </Link>
        <Link to="/index" className={Css.fabItem}>
        <ion-icon name="home-outline"></ion-icon>
        </Link>
      </div>
      <button
        className={Css.fabButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ion-icon name={open ? "close-outline" : "menu-outline"}></ion-icon>
      </button>
    </div>
  );
}
