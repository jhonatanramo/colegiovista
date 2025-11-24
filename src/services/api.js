import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Realizando request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response recibido: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Error de API:', error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      const message = error.response.data?.error || `Error ${error.response.status}: ${error.response.statusText}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La request fue hecha pero no se recibió respuesta
      return Promise.reject(new Error('No se pudo conectar con el servidor. Verifique su conexión.'));
    } else {
      // Algo pasó al configurar la request
      return Promise.reject(new Error('Error de configuración: ' + error.message));
    }
  }
);

export default api;