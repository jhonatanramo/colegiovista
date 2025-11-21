import React, { useRef, useEffect } from "react";
import Css from "../css/Popover.module.css";

export function Popover({ titulo, children, Registrarse }) {
  const dialogRef = useRef(null);

  const abrirDialog = () => {
    dialogRef.current.showModal();
  };

  const cerrarDialog = () => {
    dialogRef.current.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleOutsideClick = (event) => {
      if (dialog.open) {
        const rect = dialog.getBoundingClientRect();
        const isOutside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (isOutside) dialog.close();
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className={Css.container}>
      <button className={Css.btnAbrir} onClick={abrirDialog}>
        {Registrarse}
      </button>

      <dialog ref={dialogRef} className={Css.dialog}>
        <h2 className={Css.titulo}>{titulo}</h2>
        <hr />
        <div className={Css.contenido}>{children}</div>
        <hr />
        <button className={Css.btnCerrar} onClick={cerrarDialog}>
          Cerrar
        </button>
      </dialog>
    </div>
  );
}
