
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notification } from './pages/notificacion';
import { Asistencia } from './pages/Gestion/Asistencia';
import {Gestion} from './pages/Gestion/Gestion';
import {Materias} from './pages/Gestion/Materia';
import {Grado} from './pages/Gestion/Grado';
import AIReportGenerator  from './coponentes/AIReportGenerator/AIReportGenerator.jsx';
import { Login } from './pages/Login';
import { Index } from './pages';
import { Usuario } from './pages/Gestion/Usuario';
import {Stilos} from './pages/Stilos.jsx';
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
        <Route path='/' element={<Login />} />
        <Route path='/index' element={<Index />} />
        <Route path='/login' element={<Login />} />

        <Route path='/notificacion' element={<Notification />} />        
        <Route path='/Asistencia' element={<Asistencia />} />
        <Route path='/Gestion' element={<Gestion />} />
        <Route path='/Materia' element={<Materias />} />
        <Route path='/grado' element={<Grado />} />
        <Route path='/mos' element={<AIReportGenerator />} />
        <Route path='/Personal' element={<Usuario />} />
        <Route path='/new' element={<Stilos />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
