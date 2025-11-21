import {Barra} from '../../coponentes/BarraMenu/Barra';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
import { Formulario } from '../../coponentes/Formulario/Formulario';



export function Eventos() {
  const data = {
    Titulo: 'Crear Ensallo',
    Backendt:'api/venta/producto/crear/',
    Input: [
        "nombre-Nombre-text",
        "detall-Motivo:-text",
        "cantidad-fecha:-date",
    ],
    url:{
        estado:'',
        url:'',
    },
    Recibir: [
        {
            Ruta:'api/iglesias/', 
            name: "Iglesia",
            items: ["id", "nombre"]
        },
    ],
    maps: true // ⚡ Indicamos que habrá mapa
};
  const data1 = {
    Titulo: 'Crear Partisipacion',
    Backendt:'api/venta/producto/crear/',
    Input: [
        "nombre-Nombre-text",
        "detall-Motivo:-text",
        "cantidad-fecha:-date",
    ],
    url:{
        estado:'',
        url:'',
    },
    Recibir: [
        {
            Ruta:'api/iglesias/', 
            name: "Iglesia",
            items: ["id", "nombre"]
        },
        {
            Ruta:'api/repertorios/', 
            name: "Rpertorio-MasDeUno",
            items: ["id", "nombre"]
        },
    ],
    maps: true // ⚡ Indicamos que habrá mapa
};
  return (
    <div>
      <Barra>
        <Titulo 
          icon='map' 
          titulo='Gestión Eventos' 
          subtitulo='No es obligatorio señalar, se puede poner la URL de Google Maps en el formulario'
        />
        <Formulario data={data} /><br /><br />
        <Formulario data={data1} />
      </Barra>
    </div>
  );
}
