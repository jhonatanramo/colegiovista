import { Tabla } from '../../coponentes/Table/Tabla';
import {Barra} from '../../coponentes/BarraMenu/Barra';
import { Formulario } from '../../coponentes/Formulario/Formulario';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
export function Gestion() {
    const dataf = {
        Titulo: "Crear Gestion",      // Título del Popover y formulario
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
        ruta: "/api/gestion/listar/",     // Ruta GET para cargar los datos
        eliminar: "/api/gestion/listar/", // Ruta DELETE para eliminar registros
        cabesera: ["ID", "Nombre"], // Columnas visibles
        valor: ["id", "nombre"] // Campos de cada columna
      };
        return(
            <Barra>
                <Titulo icon='cube' titulo="Gestion" />
                <div className="container">
                    <h2>Gestión de Usuario</h2>
                    <p>Aquí puedes gestionar los Grado del sistema.</p><br />
                    <Formulario data={dataf} />
                    <br /><br />
                    <Tabla data={datat} />
                </div>
            </Barra>
        );
}