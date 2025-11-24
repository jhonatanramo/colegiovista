import {Formulario} from '../coponentes/Formulario/Formulario';
import { Barra } from '../coponentes/BarraMenu/Barra';
import {Tabla} from '../coponentes/Table/Tabla';
export function Notification(){
    const data ={
        Titulo: "Crea Usuario",      // Título del Popover y formulario
        Backendt: "/api/usuario/crear/Docente/",
        Input: [
            "titulo-Título-text-Título de la notificación",
            "mensaje-Mensaje-tt-Escribe el mensaje aquí"
          ],
        Recibir:[]
    }
    const tabla={
        ruta:"/api/notificacion/listar/",
        eliminar:"/api/notificacion/eliminar/",
        cabesera:["ID","Título","Mensaje","Fecha de Creación","Hora de Creación"],
        valor:["id","titulo","mensaje","fechaCreada","horaCreada"],
    }
    return(
        <Barra>
        <br />
        <br />
            <center><Formulario data={data}/></center>
            <br /><br />
            <Tabla data={tabla}/>
        </Barra>
    );
}