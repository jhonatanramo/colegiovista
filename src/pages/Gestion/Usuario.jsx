import {Barra} from '../../coponentes/BarraMenu/Barra';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
import { Tabla } from '../../coponentes/Table/Tabla';
import { Formulario } from '../../coponentes/Formulario/Formulario';
const dataf = {
    Titulo: "Crear Maestro",      // Título del Popover y formulario
    Backendt: "/api/usuario/crear/Docente/",  // URL del backend donde se enviará el POST
    Input: [
      "nombre-Nombre-text",
      "apellido_paterno-A. Paterno-text",
      "apellido_materno-A. Materno-text",
      "ci-ci-text",
      "correo-Correo-email",
      "clave- Clave-password",
    ],
    Recibir: [],
    url: { estado: false },           // Para inputs tipo URL (si aplica)
    carrito: []                       // Si hay un carrito de productos (opcional)
  };
const datat = {
    ruta: "/api/usuario/listar/",     // Ruta GET para cargar los datos
    eliminar: "/api/usuario/listar/", // Ruta DELETE para eliminar registros
    cabesera: ["ID", "Nombre", "Precio", "Imagen", "Código","rol"], // Columnas visibles
    valor: ["id", "nombre", "apellido_paterno", "apellido_materno", "correo","rol"] // Campos de cada columna
  };
export function Usuario(){
    return(
        <Barra>
            <Titulo icon='cube' titulo="Usuario" />
            <div className="container">
                <h2>Gestión de Usuario</h2>
                <p>Aquí puedes gestionar los usuarios del sistema.</p><br />
                <Formulario data={dataf} />
                <br /><br />
                <Tabla data={datat} />
            </div>
        </Barra>
    );
}