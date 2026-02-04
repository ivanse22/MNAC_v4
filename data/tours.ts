
import { Itinerary } from '../types';
import { IMAGES } from './images';

export const TOURS_DATA: Itinerary[] = [
  {
    id: 'tour-highlights',
    title: 'Los Imprescindibles del MNAC',
    description: 'Un recorrido esencial por las obras maestras que definen la identidad del museo, desde el Pantocrátor de Taüll hasta el Modernismo.',
    duration: 45,
    difficulty: 'Baja',
    tags: ['General', 'Primera Visita', 'Highlights'],
    stops: ['art-0', 'art-3', 'art-8', 'art-1', 'art-2'],
    coverImage: IMAGES.tourCovers.highlights,
    type: 'Curated'
  },
  {
    id: 'tour-modernisme',
    title: 'Barcelona 1900: Fiebre de Oro',
    description: 'Sumérgete en la burguesía catalana, los cafés de París y la explosión creativa del Modernismo. Casas, Rusiñol y Gaudí.',
    duration: 60,
    difficulty: 'Media',
    tags: ['Modernismo', 'Siglo XIX', 'Historia'],
    stops: ['art-1', 'art-2', 'art-4', 'art-10'],
    coverImage: IMAGES.artworks.jovenDecadente,
    type: 'Curated'
  },
  {
    id: 'tour-misterio',
    title: 'Bestiario Medieval y Misticismo',
    description: 'Descubre el significado oculto de los símbolos románicos. Dragones, santos y miradas que te siguen por la sala.',
    duration: 30,
    difficulty: 'Baja',
    tags: ['Románico', 'Misterio', 'Familias'],
    stops: ['art-0', 'art-9', 'art-3'],
    coverImage: IMAGES.artworks.frontalAvia,
    type: 'Curated'
  }
];
