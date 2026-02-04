
import { supabase } from '../lib/supabase';
import { ArtWork, Itinerary } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { TOURS_DATA } from '../data/tours';

// Este servicio actúa como repositorio.
// Si Supabase está conectado, intenta traer datos reales.
// Si no, usa los datos mock locales (ARTWORKS_DATA).

export const getArtworks = async (): Promise<ArtWork[]> => {
  if (!supabase) return ARTWORKS_DATA;

  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*');
    
    if (error || !data || data.length === 0) return ARTWORKS_DATA;
    
    return data as ArtWork[];
  } catch (e) {
    console.warn("DB Connection failed, using fallback data");
    return ARTWORKS_DATA;
  }
};

export const getArtworkById = async (id: string): Promise<ArtWork | undefined> => {
  if (!supabase) return ARTWORKS_DATA.find(a => a.id === id);

  try {
    const { data } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();
      
    return data || ARTWORKS_DATA.find(a => a.id === id);
  } catch {
    return ARTWORKS_DATA.find(a => a.id === id);
  }
};

export const getTours = async (): Promise<Itinerary[]> => {
  // Lógica similar para tours
  return TOURS_DATA;
};

// --- USER PROGRESS (Real Persistence) ---

export const saveUserProgress = async (userId: string, progress: any) => {
  if (!supabase) {
    // Local Storage Fallback (ya implementado en hooks/useGamification)
    return;
  }
  
  await supabase.from('profiles').upsert({ 
    id: userId, 
    gamification_data: progress,
    updated_at: new Date() 
  });
};
