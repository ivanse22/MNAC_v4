
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

// Utilidad para hashear URLs y usarlas como nombres de archivo
const getFileNameFromUrl = (url: string) => {
  // Simple hash para el nombre del archivo
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `mnac_cache_${Math.abs(hash)}.jpg`;
};

export const offlineService = {
  // Verificar estado de la red
  async isConnected(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return navigator.onLine;
    const status = await Network.getStatus();
    return status.connected;
  },

  // Obtener URL de imagen (Local si existe, remota si no)
  async getCachedImage(url: string): Promise<string> {
    if (!Capacitor.isNativePlatform()) return url; // En web usamos caché del navegador normal

    const fileName = getFileNameFromUrl(url);

    try {
      // 1. Intentar leer del sistema de archivos
      const file = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Cache
      });
      
      // Si existe, devolver la data en base64 lista para src
      return `data:image/jpeg;base64,${file.data}`;
    } catch (e) {
      // 2. Si no existe, y tenemos internet, descargar y guardar
      try {
        const isOnline = await this.isConnected();
        if (isOnline) {
          const response = await fetch(url);
          const blob = await response.blob();
          
          // Convertir blob a base64 para guardar
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          
          return new Promise((resolve) => {
            reader.onloadend = async () => {
              const base64data = reader.result as string;
              // Guardar en disco (quitando el prefijo data:image...)
              const base64Content = base64data.split(',')[1];
              
              await Filesystem.writeFile({
                path: fileName,
                data: base64Content,
                directory: Directory.Cache
              });
              
              resolve(base64data);
            };
          });
        }
      } catch (err) {
        console.warn('Error caching image:', err);
      }
      
      // Fallback a la URL original si todo falla
      return url;
    }
  }
};
