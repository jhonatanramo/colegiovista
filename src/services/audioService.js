import { reportesService } from './reportesService';

export const audioService = {
  async transcribeAudio(audioBlob) {
    return await reportesService.procesarAudio(audioBlob);
  },

  async procesarTexto(texto) {
    return await reportesService.procesarPrompt(texto);
  }
};