import Css from './Css/Barra.module.css';

export function Cabeza() {
  return (
    <div className={Css.cabeza}>
      <ion-icon name="book-outline"></ion-icon>
      <h1>
        Jesvaw<br />EduSoft
      </h1>
      <ion-icon name="calendar-outline"></ion-icon>
    </div>
  );
}
