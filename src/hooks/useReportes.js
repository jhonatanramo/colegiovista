import { useState, useCallback } from 'react';
import { reportesService } from '../services/reportesService';

export const useReportes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState(null);
  const [historial, setHistorial] = useState([]);

  const procesarPrompt = useCallback(async (prompt, tipo = 'texto') => {
    setLoading(true);
    setError(null);
    setDatos(null);
    
    try {
      let resultado;
      
      if (tipo === 'voz') {
        // Para voz, ya viene procesado del backend
        resultado = await reportesService.procesarPrompt(prompt);
      } else {
        // Para texto, usar endpoint normal
        resultado = await reportesService.procesarPrompt(prompt);
      }
      
      if (resultado.success) {
        setDatos(resultado);
        
        // Agregar al historial
        setHistorial(prev => [{
          id: Date.now(),
          prompt: prompt,
          timestamp: new Date(),
          tipo: tipo,
          datos: resultado.data,
          textoTranscrito: resultado.texto_transcrito
        }, ...prev.slice(0, 9)]);
        
        return resultado;
      } else {
        setError(resultado.error || 'Error desconocido');
        return resultado;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al procesar la consulta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarDatos = useCallback(() => {
    setDatos(null);
    setError(null);
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    datos,
    loading,
    error,
    historial,
    procesarPrompt,
    limpiarDatos,
    limpiarError
  };
};