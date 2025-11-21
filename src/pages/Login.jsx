import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Css from "./css/Login.module.css";
import { Formulario } from "../coponentes/Formulario/Formulario";
import  Server  from "../api"; // ✔ tu instancia Axios
import Img from '../../public/imagenes/pinguino.png';


// Configuración del formulario
const data = {
  Titulo: 'Crear Usuario',
  Backendt: 'api/usuario/crear/',
  Input: [
    "url-Foto de Perfil-file",
    "nombre-Nombre-text",
    "apellido_p-Apellido Paterno-text",
    "apellido_m-Apellido Materno-text",
    "fecha_nacimiento-Fecha De Nacimiento-date",
  ],
  Recibir: [
    {
      Ruta: 'api/iglesias/',
      name: "iglesia",
      items: ["id", "nombre"]
    },
  ]
};

export function Login() {
  const [fecha, setFecha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    if (nombre) {
      navigate("/index");
      console.log("Existe:", nombre);
    } else {
      console.log("No existe usuario guardado");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
      alert("Formato de fecha inválido. Usa DD.MM.YYYY");
      return;
    }

    const [day, month, year] = fecha.split(".");
    const fechaFormateada = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    try {
      const response = await Server.post(
        "api/login/",
        { fecha_nacimiento: fechaFormateada },
        { withCredentials: true } // ✔ equivalente a credentials:"include"
      );

      const data = response.data;

      // Guardar en localStorage
      localStorage.setItem('nombre', data.usuario.nombre);
      localStorage.setItem('paterno', data.usuario.apellido_p);
      localStorage.setItem('materno', data.usuario.apellido_m);
      localStorage.setItem('rol', data.usuario.rol);
      localStorage.setItem('url', data.usuario.url || "");

      console.log("Inicio de sesión exitoso:", data);
      navigate("/index");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("No se pudo conectar con el servidor");
      }
    }
  };

  return (
    <div className={Css.Fondo}>
      <div className={Css.caja}>
        <h1>Armonia Juvenil</h1>
        <h2>"El Torno - Puerto Rico - Jorochito - Tiquipaya - La Angostua"</h2>
        <img src={Img} alt="Usuario" className={Css.imagen} />

        <form onSubmit={handleSubmit} className={Css.form}>
          <label>Fecha de Nacimiento</label>
          <input
            type="text"
            placeholder="20.12.2001"
            className={Css.input}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
          <button type="submit" className={Css.boton}>
            Ingresar
          </button>
        </form>

        <Formulario data={data} />
      </div>
    </div>
  );
}
