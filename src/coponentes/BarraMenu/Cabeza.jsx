import Css from './Css/Barra.module.css';

export function Cabeza() {
  return (
    <div className={Css.cabeza}>
      <ion-icon name="musical-notes-outline"></ion-icon>
      <h1>
        Armonia<br />Juvenil
      </h1>
      <ion-icon name="musical-notes-outline"></ion-icon>
    </div>
  );
}
