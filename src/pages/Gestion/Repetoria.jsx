import {Barra} from '../../coponentes/BarraMenu/Barra';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
import {Tabla} from '../../coponentes/Table/Tabla';
import {Formulario} from '../../coponentes/Formulario/Formulario';
export function Repertorio(){
    const data = {
        Titulo: 'Crear Rerpertorio',
        Backendt:'api/repertorio/crear/',
        Input: [
            "nombre-titulo-text",
            "coro-Coro:-tt-coro del repertorio",
            "parrafo-parrafo:-tt-seprara los parrafos con 3 comas \n parrafo1\n ,,,\n parrafo2\n,,,\n parrafo3",
        ],
        Recibir: [
            
        ]
    };
    const data1 = {
        ruta: "api/repertorios/",
        eliminar: "api/repertorios/eliminar/",
        cabesera: ["Nro","Nombre","credo"],
        valor: ["id","nombre-t", "creado_en-t"]
      };
      
    return(
        <Barra>
            <Titulo icon='person' titulo='Gestion de Repertorio'/>
            <Formulario data={data}/><br />
            <Tabla data={data1}
            
            />
        </Barra>
    );
}