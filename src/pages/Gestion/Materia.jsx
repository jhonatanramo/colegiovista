import { Tabla } from '../../coponentes/Table/Tabla';
import {Barra} from '../../coponentes/BarraMenu/Barra';
import { Formulario } from '../../coponentes/Formulario/Formulario';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
export function Materias() {
    const dataf = {
        Titulo: "Crear Materias",      // Título del Popover y formulario
        Backendt: "/api/materia/crear/",  // URL del backend donde se enviará el POST
        Input: [
          "nombre-Nombre-text",
        ],
        Recibir: [],
        url: { estado: false },           // Para inputs tipo URL (si aplica)
        carrito: []                       // Si hay un carrito de productos (opcional)
      };
    const datat = {
        ruta: "/api/materia/listar/",     // Ruta GET para cargar los datos
        eliminar: "/api/materia/eliminar/", // Ruta DELETE para eliminar registros
        cabesera: ["ID", "Nombre",], // Columnas visibles
        valor: ["id", "nombre"] // Campos de cada columna
      };
        return(
            <Barra>
                <Titulo icon='cube' titulo="Materias" />
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