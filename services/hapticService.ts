
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

// Wrapper seguro para Web/Nativo
export const hapticService = {
  // Impacto ligero (clicks, toggles)
  light: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } catch (e) {
      console.warn('Haptics not supported');
    }
  },

  // Impacto medio (acciones importantes: guardar, abrir menú)
  medium: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (e) {
        console.warn('Haptics not supported');
    }
  },

  // Notificación de éxito (logros, completar tarea)
  success: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type: NotificationType.Success });
      }
    } catch (e) {
        console.warn('Haptics not supported');
    }
  },

  // Notificación de error
  error: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type: NotificationType.Error });
      } else {
        // Fallback web simple (vibración del navegador si soportada)
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
    } catch (e) {
        console.warn('Haptics not supported');
    }
  }
};
