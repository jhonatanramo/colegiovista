import Css from "../css/Index.module.css";
import { Barra } from '../coponentes/BarraMenu/Barra';

export function Index() {
  
  

  return (
    <Barra id=''>
      <div className={Css.contenido}>
        <h1>Bienvenido </h1>
        <p>Esta es la página de inicio.</p>

      </div>
    </Barra>
  );
}
