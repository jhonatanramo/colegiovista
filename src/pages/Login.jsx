import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Css from "./css/Login.module.css";
import { Formulario } from "../coponentes/Formulario/Formulario";
import Server from "../api";
import Img from '../../public/imagenes/pinguino.png';

export function Login() {
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const data = {
    Titulo: "Registrarse",
    Backendt: "/api/usuario/usuarioNormal/",
    Input: [
      "nombre-nombre-text",
      "apellido_paterno-apellido_paterno-text",
      "apellido_materno-apellido_materno-text",
      "ci-ci-text",
      "correo-correo-text",
      "clave-clave-text",
    ],
    Recibir: [],
    url: { estado: false },
    carrito: []
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Server.post(
        "api/login/",
        { clave }, // enviar la clave directamente
        { withCredentials: true }
      );

      const data = response.data;
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
          <label>Clave</label>
          <input
            type="text"
            placeholder="Clave"
            className={Css.input}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
          <button type="submit" className={Css.boton}>
            Ingresar
          </button>
        </form>
        <Formulario data={data}/>
      </div>
    </div>
  );
}
