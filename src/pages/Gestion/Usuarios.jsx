import {Barra} from '../../coponentes/BarraMenu/Barra';
import {Titulo} from '../../coponentes/Cabesera/Titulo';
import {Tabla} from '../../coponentes/Table/Tabla';
import {Formulario} from '../../coponentes/Formulario/Formulario';

export function Usuarios(){
    const data1 = {
        ruta: "api/usuarios/",
        eliminar: "api/usuario/eliminar/",
        cabesera: ["Nombre", "Foto","Paterno", "Materno", "Nacimiento", "Iglesias",],
        valor: ["nombre-t", "url-f","apellido_p-t", "apellido_m-t", "fecha_nacimiento-t", "iglesia_nombre"]
      };
      const data = {
        Titulo: 'Crear Usuario',
        Backendt: 'api/usuario/crear/adm/',
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
      
      
    return(
        <Barra>
            <Titulo icon='person' titulo='Gestion de Usuario'/>
            <Formulario data={data}/>
            <Tabla data={data1}
        
            />
        </Barra>
    );
}