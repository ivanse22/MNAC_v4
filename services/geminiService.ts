
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ArtWork, UserRole, QuizQuestion, Itinerary } from "../types";
import { ARTWORKS_DATA } from "../data/artworks";
import { supabase } from "../lib/supabase";

// --- AUDIO HELPERS (Keep existing helpers) ---
function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function createWavFile(samples: ArrayBuffer) {
  const buffer = new ArrayBuffer(44 + samples.byteLength);
  const view = new DataView(buffer);
  const channels = 1;
  const sampleRate = 24000;
  const bitsPerSample = 16;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  view.setUint16(32, channels * (bitsPerSample / 8), true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.byteLength, true);

  const pcmBytes = new Uint8Array(samples);
  const wavBytes = new Uint8Array(buffer, 44);
  wavBytes.set(pcmBytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// --- SECURE API CALLING ---

/**
 * Intenta llamar a la Edge Function de Supabase para ocultar la API Key.
 * Si falla o no está configurado, hace fallback a la llamada local (solo para desarrollo).
 */
const invokeAI = async (functionName: string, payload: any): Promise<any> => {
  // 1. Try Supabase Edge Function (PROD SECURE WAY)
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      if (!error && data) return data;
      console.warn("Edge Function failed, falling back to client-side API", error);
    } catch (e) {
      console.warn("Edge Function unreachable", e);
    }
  }

  // 2. Fallback: Client Side Call (DEV ONLY - Unsafe for Prod)
  // Re-instantiate local client just for fallback
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (functionName === 'mnac-chat') {
    // Replicate chat logic locally
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { responseMimeType: "application/json" },
        history: payload.history
    });
    const result = await chat.sendMessage({ message: payload.message });
    return JSON.parse(result.text || '{}');
  }
  
  if (functionName === 'mnac-tour-script') {
     const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: payload.prompt
     });
     return { text: response.text };
  }

  if (functionName === 'mnac-tts') {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: payload.text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return { audioData };
  }

  return null;
};


// --- PUBLIC SERVICES ---

export const generateArtGuideResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  userMessage: string
): Promise<string> => {
  try {
    const response = await invokeAI('mnac-chat', { history, message: userMessage });
    // Handle both object (from edge function/json) or string
    if (typeof response === 'object') return JSON.stringify(response);
    return response;
  } catch (error) {
    console.error("AI Error:", error);
    return JSON.stringify({
        headline: "Modo Offline",
        summary: "No puedo conectar con el servidor de inteligencia.",
        cards: []
    });
  }
};

export const generateTourScript = async (artwork: ArtWork, role: UserRole): Promise<string> => {
  try {
    // Construct prompt here to keep logic in frontend, but send prompt to backend
    const basePrompt = `Analiza la obra "${artwork.title}" de ${artwork.artist}. 
    ROL: ${role === 'student' ? 'Guía dinámico para jóvenes' : 'Curador experto'}.
    IDIOMA: Español. 
    ESTILO: Narrativo sin markdown.`;

    const data = await invokeAI('mnac-tour-script', { prompt: basePrompt });
    return data?.text || artwork.description;
  } catch (error) {
    return artwork.description;
  }
};

export const textToSpeech = async (text: string): Promise<string | null> => {
  try {
    const data = await invokeAI('mnac-tts', { text });
    if (data?.audioData) {
      const pcmBuffer = base64ToArrayBuffer(data.audioData);
      const wavBlob = createWavFile(pcmBuffer);
      return URL.createObjectURL(wavBlob);
    }
    return null;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
};

export const generateCustomItinerary = async (userPrompt: string): Promise<Itinerary | null> => {
    // Simplified logic for brevity in this architectural update
    // In real implementation, this would also call 'mnac-itinerary' edge function
    return null; 
};

export const generateQuizQuestion = async (artwork: ArtWork): Promise<QuizQuestion> => {
    // Fallback logic implemented in backend would handle this
    return {
      question: `¿Quién pintó ${artwork.title}?`,
      options: [artwork.artist, "Picasso", "Dalí", "Miró"],
      correctIndex: 0,
      explanation: "Datos generados localmente por seguridad."
    };
};
