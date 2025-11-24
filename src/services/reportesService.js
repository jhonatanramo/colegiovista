import api from './api';

export const reportesService = {
  async procesarPrompt(prompt) {
    const response = await api.post('/reportes/procesar-prompt/', {
      prompt: prompt
    });
    return response.data;
  },

  async procesarAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    const response = await api.post('/reportes/procesar-audio-prompt/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000, // 45 segundos para procesamiento de audio
    });

    return response.data;
  },

  async obtenerCategorias() {
    const response = await api.get('/reportes/categorias/');
    return response.data;
  },

  async obtenerDatosMaestros() {
    const response = await api.get('/reportes/datos-maestros/');
    return response.data;
  },

  async verificarSalud() {
    const response = await api.get('/reportes/salud/');
    return response.data;
  }
};