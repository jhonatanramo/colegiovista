import { useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

export const useSpeechToText = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState(null);

  const transcribeAudio = useCallback(async (audioBlob) => {
    if (!audioBlob) {
      setError('No hay audio para transcribir');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    setTranscribedText('');
    
    try {
      const result = await audioService.transcribeAudio(audioBlob);
      
      if (result.success) {
        setTranscribedText(result.texto_transcrito || '');
        return result;
      } else {
        setError(result.error || 'Error al procesar el audio');
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al procesar audio';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscribedText('');
    setError(null);
  }, []);

  return {
    isProcessing,
    transcribedText,
    error,
    transcribeAudio,
    clearTranscription
  };
};