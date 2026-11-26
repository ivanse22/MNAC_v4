
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
    duration: 25,
    difficulty: 'Baja',
    tags: ['Románico', 'Misterio', 'Familias', 'Cortos'],
    stops: ['art-0', 'art-9', 'art-15'],
    coverImage: IMAGES.artworks.frontalAvia,
    type: 'Curated'
  },
  {
    id: 'tour-gotico',
    title: 'Esplendor Gótico: Oro y Retablos',
    description: 'Un viaje por la Corona de Aragón entre pan de oro, gremios medievales y el realismo flamenco de Bermejo y Huguet.',
    duration: 35,
    difficulty: 'Baja',
    tags: ['Gótico', 'Historia', 'Religión'],
    stops: ['art-3', 'art-12', 'art-9'],
    coverImage: IMAGES.tourCovers.gotico,
    type: 'Curated'
  },
  {
    id: 'tour-renacimiento',
    title: 'Luz y Claroscuro: Siglo de Oro',
    description: 'De la espiritualidad manierista de El Greco al tenebrismo silencioso de Zurbarán y el retrato veneciano.',
    duration: 40,
    difficulty: 'Media',
    tags: ['Renacimiento', 'Barroco', 'Highlights'],
    stops: ['art-8', 'art-14', 'art-5', 'art-13'],
    coverImage: IMAGES.tourCovers.renacimiento,
    type: 'Curated'
  },
  {
    id: 'tour-vanguardia',
    title: 'Sueños de Vanguardia Exprés',
    description: 'Recorrido breve de 20 minutos por la ruptura con la realidad: abstracción, surrealismo y formas oníricas.',
    duration: 20,
    difficulty: 'Baja',
    tags: ['Vanguardia', 'Surrealismo', 'Cortos'],
    stops: ['art-6', 'art-11', 'art-4'],
    coverImage: IMAGES.tourCovers.vanguardia,
    type: 'Curated'
  }
];
