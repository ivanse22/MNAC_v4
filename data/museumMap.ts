import { MuseumPoint } from '../components/HairlineMuseumMap';

export interface ArtworkLocation {
  level: 0 | 1;
  wing: 'Centro' | 'Ala Oeste' | 'Ala Este';
  roomCode: string;
  x: number;
  y: number;
  walkTime: string;
  directions: string[];
}

export const LEVEL_INFO: Record<0 | 1, { short: string; title: string }> = {
  0: { short: 'P0 · Baja', title: 'Planta 0 · Vestíbulo & Medieval' },
  1: { short: 'P1 · Superior', title: 'Planta 1 · Moderno & Mirador' }
};

export const ARTWORK_LOCATIONS: Record<string, ArtworkLocation> = {
  'art-0': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Salas 01–06',
    x: -52,
    y: 12,
    walkTime: '2 min',
    directions: ['Desde el Vestíbulo, entra al Ala Oeste (izquierda)', 'Avanza hasta el ábside principal de Sant Climent de Taüll']
  },
  'art-1': {
    level: 1,
    wing: 'Ala Oeste',
    roomCode: 'P1 · Sala 15',
    x: -50,
    y: 10,
    walkTime: '3 min',
    directions: ['Sube a la Planta 1 por la escalera central o ascensor', 'Gira a la izquierda hacia el Ala Oeste (Modernismo)']
  },
  'art-2': {
    level: 1,
    wing: 'Ala Oeste',
    roomCode: 'P1 · Sala 16',
    x: -36,
    y: -4,
    walkTime: '3 min',
    directions: ['En Planta 1 Ala Oeste, continúa tras las salas de Ramon Casas']
  },
  'art-3': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Salas 18–26',
    x: -50,
    y: -18,
    walkTime: '3 min',
    directions: ['Desde el Románico en Planta 0 Ala Oeste, sigue recto hacia el Gótico', 'Salas 18 a 26 hasta el gran retablo de San Agustín']
  },
  'art-4': {
    level: 1,
    wing: 'Ala Este',
    roomCode: 'P1 · Sala 14',
    x: 50,
    y: 8,
    walkTime: '3 min',
    directions: ['Sube a Planta 1 y entra al Ala Este (derecha)', 'Primera galería dedicada a Marià Fortuny y el siglo XIX']
  },
  'art-5': {
    level: 0,
    wing: 'Ala Este',
    roomCode: 'P0 · Sala 48',
    x: 52,
    y: -16,
    walkTime: '3 min',
    directions: ['Desde la Sala Oval en Planta 0, toma el Ala Este (derecha)', 'Avanza hasta las salas del Barroco español']
  },
  'art-6': {
    level: 1,
    wing: 'Ala Este',
    roomCode: 'P1 · Sala 19',
    x: 42,
    y: -16,
    walkTime: '3 min',
    directions: ['En Planta 1 Ala Este, continúa hacia las salas de crónica urbana']
  },
  'art-7': {
    level: 1,
    wing: 'Ala Oeste',
    roomCode: 'P1 · Sala 15',
    x: -58,
    y: 2,
    walkTime: '3 min',
    directions: ['En Planta 1 Ala Oeste, galería central dedicada a Ramon Casas']
  },
  'art-8': {
    level: 0,
    wing: 'Ala Este',
    roomCode: 'P0 · Sala 38',
    x: 50,
    y: 14,
    walkTime: '2 min',
    directions: ['Desde el Vestíbulo o Sala Oval en Planta 0, gira al Ala Este (derecha)', 'Primeras galerías de Renacimiento (Colección Cambó)']
  },
  'art-9': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Sala 09',
    x: -36,
    y: 4,
    walkTime: '2 min',
    directions: ['En Planta 0 Ala Oeste, entre los ábsides románicos y las tallas de madera']
  },
  'art-10': {
    level: 1,
    wing: 'Ala Oeste',
    roomCode: 'P1 · Sala 18',
    x: -38,
    y: -20,
    walkTime: '3 min',
    directions: ['Al final del recorrido modernista en Planta 1 Ala Oeste']
  },
  'art-11': {
    level: 1,
    wing: 'Ala Oeste',
    roomCode: 'P1 · Sala 17',
    x: -48,
    y: -18,
    walkTime: '3 min',
    directions: ['En Planta 1 Ala Oeste, galería sur de escultura modernista']
  },
  'art-12': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Sala 28',
    x: -36,
    y: -24,
    walkTime: '3 min',
    directions: ['En Planta 0 Ala Oeste, salas finales del Gótico hispanoflamenco']
  },
  'art-13': {
    level: 0,
    wing: 'Ala Este',
    roomCode: 'P0 · Sala 50',
    x: 42,
    y: -4,
    walkTime: '3 min',
    directions: ['En Planta 0 Ala Este, galería de pintura religiosa del Siglo de Oro']
  },
  'art-14': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Sala 22',
    x: -58,
    y: -8,
    walkTime: '3 min',
    directions: ['En Planta 0 Ala Oeste, sección del Gótico Internacional']
  },
  'art-15': {
    level: 0,
    wing: 'Ala Oeste',
    roomCode: 'P0 · Sala 04',
    x: -44,
    y: 22,
    walkTime: '2 min',
    directions: ['En Planta 0 Ala Oeste, junto a los primeros murales románicos']
  }
};

export const MUSEUM_POINTS: MuseumPoint[] = [
  // PLANTA 0 · PLANTA BAJA (VESTÍBULO + MEDIEVAL + RENACIMIENTO Y BARROCO + SALA OVAL)
  {
    id: 'p0-entrance',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Acceso Norte',
    wing: 'Centro',
    title: 'Entrada / Salida Principal',
    subtitle: 'Fachada Plaça d’Espanya',
    desc: 'Acceso principal desde la escalinata y fuentes de Montjuïc. Conecta directo con taquillas, consigna y Sala Oval.',
    directions: ['Fachada Norte del Palau Nacional', 'Acceso directo hacia las escaleras mecánicas de bajada a Plaça d’Espanya'],
    walkTime: 'Acceso',
    x: 0,
    y: 40
  },
  {
    id: 'p0-tickets',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    wing: 'Centro',
    title: 'Taquillas e Información',
    subtitle: 'Venta y Audioguías',
    desc: 'Venta presencial de entradas, recogida de audioguías, planos en papel y atención al visitante.',
    directions: ['Nada más cruzar la Entrada Norte, gira a la derecha en el Vestíbulo'],
    walkTime: '1 min',
    x: 24,
    y: 28
  },
  {
    id: 'p0-cloakroom',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    wing: 'Centro',
    title: 'Consigna y Baños P0',
    subtitle: 'Servicio Gratuito',
    desc: 'Guarda mochilas, paraguas y maletas antes de entrar a las galerías. Aseos generales junto a consigna.',
    directions: ['En el Vestíbulo Principal, lado izquierdo (Ala Oeste)'],
    walkTime: '1 min',
    x: -24,
    y: 28
  },
  {
    id: 'p0-romanesque',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 01–17',
    wing: 'Ala Oeste',
    title: 'Arte Románico (Taüll)',
    subtitle: 'Pintura Mural s. XI–XIII',
    desc: 'La colección de frescos románicos más importante del mundo, presidida por el Pantocrátor de Sant Climent de Taüll.',
    directions: ARTWORK_LOCATIONS['art-0'].directions,
    walkTime: '2 min',
    x: ARTWORK_LOCATIONS['art-0'].x,
    y: ARTWORK_LOCATIONS['art-0'].y,
    artworkId: 'art-0',
    tourFilter: 'Románico',
    image: '/artworks/art-0.jpg'
  },
  {
    id: 'p0-gothic',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 18–34',
    wing: 'Ala Oeste',
    title: 'Arte Gótico y Retablos',
    subtitle: 'Huguet · Bermejo · Martorell',
    desc: 'Retablos monumentales de oro y temple de la Corona de Aragón y realismo hispanoflamenco.',
    directions: ARTWORK_LOCATIONS['art-3'].directions,
    walkTime: '3 min',
    x: ARTWORK_LOCATIONS['art-3'].x,
    y: ARTWORK_LOCATIONS['art-3'].y,
    artworkId: 'art-3',
    tourFilter: 'Gótico',
    image: '/artworks/art-3.jpg'
  },
  {
    id: 'p0-oval',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Centro',
    wing: 'Centro',
    title: 'Gran Sala Oval',
    subtitle: 'Eje Central del Palacio',
    desc: 'El gran espacio monumental bajo la cúpula central que articula las alas Oeste y Este y el acceso a exposiciones.',
    directions: ['Cruza el Vestíbulo Principal recto hacia el sur'],
    walkTime: '1 min',
    x: 0,
    y: 0
  },
  {
    id: 'p0-renaissance',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 35–45',
    wing: 'Ala Este',
    title: 'Renacimiento & El Greco',
    subtitle: 'Siglo XVI · Colección Cambó',
    desc: 'Diálogo entre el humanismo europeo, el retrato y la espiritualidad intensa de El Greco.',
    directions: ARTWORK_LOCATIONS['art-8'].directions,
    walkTime: '2 min',
    x: ARTWORK_LOCATIONS['art-8'].x,
    y: ARTWORK_LOCATIONS['art-8'].y,
    artworkId: 'art-8',
    tourFilter: 'Renacimiento',
    image: '/artworks/art-8.jpg'
  },
  {
    id: 'p0-baroque',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 46–55',
    wing: 'Ala Este',
    title: 'Barroco & Zurbarán',
    subtitle: 'Claroscuro s. XVII',
    desc: 'Tenebrismo español, bodegones místicos y grandes lienzos del Siglo de Oro.',
    directions: ARTWORK_LOCATIONS['art-5'].directions,
    walkTime: '3 min',
    x: ARTWORK_LOCATIONS['art-5'].x,
    y: ARTWORK_LOCATIONS['art-5'].y,
    artworkId: 'art-5',
    image: '/artworks/art-5.jpg'
  },
  {
    id: 'p0-shop',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Salida Este',
    wing: 'Ala Este',
    title: 'Tienda Laie & Cafetería P0',
    subtitle: 'Libros, Diseño y Café',
    desc: 'Catálogos de arte, láminas, objetos modernistas y zona de descanso junto al patio este.',
    directions: ['Junto a la salida del Ala Este y conexión con el vestíbulo'],
    walkTime: '2 min',
    x: 28,
    y: -18
  },
  {
    id: 'p0-access',
    level: 0,
    category: 'accessibility',
    roomCode: 'P0 · Accesibilidad',
    wing: 'Centro',
    title: 'Ascensor & Sillas de Ruedas',
    subtitle: 'Núcleo Central sin Barreras',
    desc: 'Ascensor panorámico directo a Planta 1, baños adaptados, cambiador y préstamo gratuito de sillas.',
    directions: ['Borde norte de la Sala Oval, junto al punto de información'],
    walkTime: '1 min',
    x: -14,
    y: 10
  },

  // PLANTA 1 · PRIMER PIS (ARTE MODERNO + CÚPULA + MIRADOR)
  {
    id: 'p1-modernism',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Oeste',
    wing: 'Ala Oeste',
    title: 'Modernismo & Ramon Casas',
    subtitle: 'Barcelona 1900 · Gaudí',
    desc: 'Casas, Rusiñol, Nonell y mobiliario de Gaudí. La explosión creativa de la Barcelona modernista.',
    directions: ARTWORK_LOCATIONS['art-1'].directions,
    walkTime: '3 min',
    x: ARTWORK_LOCATIONS['art-1'].x,
    y: ARTWORK_LOCATIONS['art-1'].y,
    artworkId: 'art-1',
    tourFilter: 'Modernismo',
    image: '/artworks/art-1.jpg'
  },
  {
    id: 'p1-sculpture',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Oeste',
    wing: 'Ala Oeste',
    title: 'Escultura Simbolista',
    subtitle: 'Josep Llimona · Desconsol',
    desc: 'Mármoles modernistas y expresividad íntima del cambio de siglo catalán.',
    directions: ARTWORK_LOCATIONS['art-11'].directions,
    walkTime: '3 min',
    x: ARTWORK_LOCATIONS['art-11'].x,
    y: ARTWORK_LOCATIONS['art-11'].y,
    artworkId: 'art-11',
    image: '/artworks/art-11.jpg'
  },
  {
    id: 'p1-cupula',
    level: 1,
    category: 'service',
    roomCode: 'P1 · Centro Norte',
    wing: 'Centro',
    title: 'Sala de la Cúpula & Òleum',
    subtitle: 'Salón del Trono y Restaurante',
    desc: 'Antiguo Salón del Trono con pinturas murales y vistas directas hacia Plaça d’Espanya y las fuentes.',
    directions: ['Al llegar a Planta 1 por la escalinata, avanza hacia la fachada norte'],
    walkTime: '2 min',
    x: 0,
    y: 26
  },
  {
    id: 'p1-realism',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Este',
    wing: 'Ala Este',
    title: 'Realismo & Vanguardias',
    subtitle: 'Fortuny · Picasso · Dalí',
    desc: 'Desde el preciosismo de La Vicaría y La Carga hasta el arte de entreguerras y vanguardias del XX.',
    directions: ARTWORK_LOCATIONS['art-4'].directions,
    walkTime: '3 min',
    x: ARTWORK_LOCATIONS['art-4'].x,
    y: ARTWORK_LOCATIONS['art-4'].y,
    artworkId: 'art-4',
    image: '/artworks/art-4.jpg'
  },
  {
    id: 'p1-terrace',
    level: 1,
    category: 'service',
    roomCode: 'P1 · Mirador Exterior',
    wing: 'Centro',
    title: 'Acceso Terrazas Mirador 360°',
    subtitle: 'Vistas Panorámicas a Barcelona',
    desc: 'Salida hacia las terrazas superiores con vistas de 360 grados sobre Montjuïc y toda la ciudad.',
    directions: ['Desde la Sala de la Cúpula (Norte), sigue la señalización exterior a Terrazas'],
    walkTime: '2 min',
    x: 0,
    y: -14
  },
  {
    id: 'p1-access',
    level: 1,
    category: 'accessibility',
    roomCode: 'P1 · Accesibilidad',
    wing: 'Centro',
    title: 'Ascensor, Rampas y Baños P1',
    subtitle: 'Ruta Sin Escaleras',
    desc: 'Conexión continua por rampa entre el Ala Oeste, Sala de la Cúpula, Ala Este y Terrazas.',
    directions: ['Núcleo central junto al hall de llegada del ascensor'],
    walkTime: '1 min',
    x: 16,
    y: 12
  }
];
