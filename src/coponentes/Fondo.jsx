import Css from './../css/Fondo.module.css';
import { Template } from './Sub/Template';
import { CajaSuperior } from './CajaSuperior';

export function Fondo({ children }) {
  return (
    <div className={Css.fondo}>
      {/* Barra superior */}
      <CajaSuperior />

      {/* Capa principal con fondo difuminado */}
      <div className={Css.overlay}>
        {/* Contenedor del contenido dinámico */}
        <main className={Css.sub}>
          {children}
        </main>
      </div>

      {/* Pie de página o contenido adicional */}
    </div>
  );
}
