import { Barra } from "../../coponentes/BarraMenu/Barra";
import { Titulo } from "../../coponentes/Cabesera/Titulo";
import { Formulario } from "../../coponentes/Formulario/Formulario";
import {Tabla} from '../../coponentes/Table/Tabla';

export function Iglesias(){
    const data1 = {
        ruta: "api/iglesias/",
        eliminar: "api/iglesia/eliminar/", 
        cabesera: ["foto","Código"],
        valor: ["nombre-t","id-t"]
      };
      const data = {
        Titulo: "Crear Producto",            // Título del formulario
        Backendt: "api/iglesia/crear/", // Ruta para enviar los datos al backend
        Input: [
          "nombre-Nombre-text",              // formato: key-Label-type
        ],
      url:{
    
          },
        Recibir: [

        ],
      };
      
    
    return(
        <Barra>
            <Titulo titulo='Getion de Iglesias'/>
            <Formulario data={data}/>   <br /><br />       
            <Tabla data={data1}/>  
        </Barra>
    );
}