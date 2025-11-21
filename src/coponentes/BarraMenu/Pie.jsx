import Css from './Css/Barra.module.css';
import { useNavigate } from "react-router-dom";

export function Pie(){
    const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.clear('nombre'); // o localStorage.removeItem("nombre") si quieres quitar solo algunos
    // Redirigir al login
    navigate("/");
  };
    return(
        <div className={Css.pie}>
            <div className={Css.datos}>
                <div className={Css.subdatosimg}>
                    <img src={localStorage.getItem('url')} alt="" />
                </div>
                <div className={Css.subdatos1}>
                    <span>{localStorage.getItem('nombre')}</span>
                    <p>{localStorage.getItem('paterno')} {localStorage.getItem('materno')}</p>
                    <a className={Css.cerrarSesion} onClick={handleLogout}>
                        Cerrar sesión
                    </a>
                </div>
                <div className={Css.subdatos2}>
                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                </div>
            </div>
        </div>
    );
}