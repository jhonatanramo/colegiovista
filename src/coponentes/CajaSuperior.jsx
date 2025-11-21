import { useState } from 'react';
import Css from './../css/CajaSuperior.module.css';
import foto from './../../public/imagenes/hombre.png';
import { Links } from 'react-router-dom';
export function CajaSuperior() {
  const [visible, setVisible] = useState(true);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Aquí agregarías la lógica de cierre de sesión
    console.log('Cerrando sesión...');
  };

  const handleLinkClick = () => {
    setVisible(false); // Oculta el menú al hacer clic en cualquier enlace
  };

  return (
    <header className={`${Css.contenedor} ${!visible ? Css.oculto : ''}`}>
      <div className={Css.superior}>
        <div className={Css.usuario} onClick={toggleMenu}>
          <img
            src={foto}
            alt="Perfil"
            className={Css.imagenPerfil}
          />
          <div className={Css.datos}>
            <span className={Css.nombre}>Ramos Linares Jhonatan</span>
            <p className={Css.correo}>jhonatanleonrl777@mail.com</p>
          </div>
          <ion-icon
            name={visible ? "chevron-forward-outline" : "chevron-back-outline"}
            className={Css.menuIcon}
          ></ion-icon>
        </div>

        <a href="#" className={Css.cerrarSesion} onClick={handleLogout}>
          <ion-icon name="exit-outline"></ion-icon>
          <span>Cerrar sesión</span>
        </a>
      </div>
      
      <nav className={Css.links}>
        <a href="/index" >Inicio</a>
        <a href="/Bucar" >Repertorio</a>
        <a href="/Calendario">Calendario</a>
        <a href="/Repertorio">Gestion</a>
        
        
      </nav>
    </header>
  );
}