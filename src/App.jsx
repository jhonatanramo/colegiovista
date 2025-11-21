import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notification } from './pages/notificacion';
function App() {
  return (
    <BrowserRouter>
      {/* Contenedor de Toasts global */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        <Route path='/' element={<Notification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
/*
import {Buscar} from './pages/Buscar';
import { Login } from './pages/Login';

import { Calendario } from './pages/Calendario';
import { Index } from './pages/index';
import { Usuarios } from './pages/Gestion/Usuarios';
import { Prueba } from './Prueba';
import { Repertorio } from './pages/Gestion/Repetoria';
import { Eventos } from './pages/Gestion/Eventos';
import {Iglesias} from './pages/Gestion/Iglesias';


<Route path='/' element={<Login />} />
<Route path='/Calendario' element={<Calendario />} />
<Route path='/index' element={<Index />} />
<Route path='/Usuarios' element={<Usuarios />} />
<Route path='/new' element={<Prueba />} />
<Route path='/Rertorio' element={<Repertorio />} />
<Route path='/Eventos' element={<Eventos />} />
<Route path='/Iglesias' element={<Iglesias />} />
<Route path='/Buscar' element={<Buscar />} /> 
*/