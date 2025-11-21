import Css from './Css/Barra.module.css';
import { Link } from 'react-router-dom';

export function Item({ icon , Titulo, enlace }) {
  const data=icon+'-outline';
  return (
    <li className={Css.item}>
      <Link to={enlace}>
        <ion-icon name={data}></ion-icon>
        <span>{Titulo}</span>
      </Link>
    </li>
  );
}
