import Css from './Css/Barra.module.css';
import { useState } from 'react';
import { MenuItem } from './MenuItem';
import { Item } from './Item';

export function Cuerpo() {
  const [menuActivo, setMenuActivo] = useState(null);

  const toggleSubmenu = (menu) => {
    setMenuActivo(menuActivo === menu ? null : menu);
  };

  return (
    <div className={Css.cuerpo}>
      <ul>

        {/* Mostrar solo si existe 'rol' en localStorage */}
        
          <MenuItem
            Icono="newspaper-outline"
            Titulo="Gestion"
            abierto={menuActivo === 'Gestion'}
            onClick={() => toggleSubmenu('Gestion')}
          >
            <Item icon='people' Titulo="Gestion de Usuarios" enlace="/Personal" />
            <Item icon='mail' Titulo="Gestion de Notificaciones" enlace="/notificacion" />
            <Item icon='cube' Titulo="Gestion de Crusos" enlace="/grado" />
            <Item icon='calendar' Titulo="Gestion de Gestion" enlace="/Gestion" />
            <Item icon='book' Titulo="Gestion de Materias" enlace="/Materia" />
          </MenuItem>
          <Item icon='calculator' Titulo="Reportes" enlace="/mos" />
          <Item icon='color-palette' Titulo="Stilos" enlace="/new" />
          <Item icon='person' Titulo="Perfil" enlace="/mos" />

      </ul>
    </div>
  );
}
