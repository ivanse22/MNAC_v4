

import { ArtWork } from '../types';
import { IMAGES } from './images';

export const ARTWORKS_DATA: ArtWork[] = [
  {
    id: 'art-0',
    title: "Cristo en Majestad",
    artist: "Maestro de Taüll",
    period: "Románico",
    year: "1123",
    imageUrl: IMAGES.artworks.pantocrator,
    description: "Una obra maestra que representa un momento crucial en la historia del arte catalán. El Pantocrátor destaca por su monumentalidad y la fuerza expresiva de su mirada, que combina la iconografía tradicional con una potente estilización.",
    simpleDescription: "Esta es la pintura más famosa del museo. Es un Cristo muy grande pintado originalmente en una iglesia antigua. Te mira fijamente con ojos grandes.",
    teacherDescription: "El Pantocrátor de Taüll es el paradigma de la pintura románica catalana. Analizar la simetría, la jerarquía de tamaños y la simbología teológica (Alfa y Omega) con los alumnos.",
    tags: ["Religión", "Pintura Mural", "Iconografía", "Edad Media", "Símbolo"]
  },
  {
    id: 'art-1',
    title: "Joven Decadente",
    artist: "Ramon Casas",
    period: "Modernismo",
    year: "1899",
    imageUrl: IMAGES.artworks.jovenDecadente,
    description: "Casas captura la melancolía de fin de siglo. La figura femenina, exhausta tras el baile, representa la modernidad y la libertad burguesa con una técnica suelta y audaz.",
    simpleDescription: "Una chica joven descansando en un sofá después de una fiesta. Lleva un vestido negro y un libro amarillo. Parece cansada pero elegante.",
    teacherDescription: "Obra clave para entender el Modernismo catalán y la representación de la mujer burguesa. Contrastar con la pintura académica tradicional y discutir el concepto de 'Decadentismo'.",
    tags: ["Retrato", "Mujer", "Burguesía", "Melancolía", "Interiores"]
  },
  {
    id: 'art-2',
    title: "Jardín de Montmartre",
    artist: "Santiago Rusiñol",
    period: "Modernismo",
    year: "1891",
    imageUrl: IMAGES.artworks.paredVerde,
    description: "Pintado durante su etapa bohemia en París, Rusiñol captura un jardín melancólico y silencioso de Montmartre, anticipando su célebre sensibilidad simbolista por los espacios intimistas.",
    simpleDescription: "Un jardín tranquilo de París pintado con tonos suaves. Transmite calma y silencio, como un rincón secreto.",
    teacherDescription: "Etapa parisina de Rusiñol en el Moulin de la Galette. Analizar la transición entre el naturalismo luminoso y el simbolismo de sus jardines posteriores.",
    tags: ["Paisaje", "Naturaleza", "Jardín", "Simbolismo", "París"]
  },
  {
    id: 'art-3',
    title: "Consagración de San Agustín",
    artist: "Jaume Huguet",
    period: "Gótico",
    year: "1463",
    imageUrl: IMAGES.artworks.consagracionAgustin,
    description: "El retablo gótico catalán en su máximo esplendor. Huguet utiliza pan de oro y relieves de estuco para crear una atmósfera divina y lujosa, típica del Gótico Internacional.",
    simpleDescription: "Una pintura muy antigua con mucho oro brillante. Muestra a un santo importante rodeado de gente con ropa muy detallada.",
    teacherDescription: "Estudio del Gótico Internacional y la técnica del estofado y dorado. Importancia de los gremios en los encargos artísticos del siglo XV.",
    tags: ["Religión", "Oro", "Retablo", "Ceremonia", "Lujo"]
  },
  {
    id: 'art-4',
    title: "La Vicaría",
    artist: "Marià Fortuny",
    period: "Realismo",
    year: "1870",
    imageUrl: IMAGES.artworks.laVicaria,
    description: "Fortuny fue el pintor español más famoso de su tiempo. Esta obra destaca por su virtuosismo técnico y el detallismo preciosista ('tableautin') que le dio fama mundial.",
    simpleDescription: "Una escena de boda en una iglesia antigua. Hay mucha gente con ropa elegante y muchísimos detalles pequeños para descubrir.",
    teacherDescription: "Análisis del Preciosismo y la pintura de género del siglo XIX. Observar la técnica de la pincelada suelta que anticipa tendencias posteriores.",
    tags: ["Costumbrismo", "Boda", "Detalle", "Siglo XIX", "Multitud"]
  },
  {
    id: 'art-5',
    title: "Agnus Dei",
    artist: "Zurbarán",
    period: "Barroco",
    year: "1635",
    imageUrl: IMAGES.artworks.agnusDei,
    description: "Un cordero atado, símbolo de sacrificio. Zurbarán logra un realismo táctil impresionante con una economía de medios absoluta, destacando la textura de la lana.",
    simpleDescription: "Un cordero (oveja joven) tumbado. Parece tan real que casi puedes tocar su lana suave, como si fuera una fotografía.",
    teacherDescription: "Obra maestra del Tenebrismo español. Discutir la iconografía religiosa y el tratamiento magistral de la textura y el volumen a través del claroscuro.",
    tags: ["Religión", "Animales", "Bodegón", "Simbolismo", "Tenebrismo"]
  },
  {
    id: 'art-6',
    title: "La Carga (Barcelona 1902)",
    artist: "Ramon Casas",
    period: "Realismo",
    year: "1903",
    imageUrl: IMAGES.artworks.laCarga,
    description: "Monumental escena de crónica social que retrata una carga de la Guardia Civil durante la huelga general de 1902 en Barcelona, destacando por su composición dinámica y fuerza narrativa.",
    simpleDescription: "Una pintura muy grande que muestra a unos guardias a caballo dispersando a una multitud en las calles de Barcelona.",
    teacherDescription: "Pintura de historia contemporánea y crónica social en la Cataluña industrial. Analizar el punto de vista elevado, el espacio vacío central y el movimiento.",
    tags: ["Historia", "Ciudad", "Multitud", "Siglo XX", "Crónica"]
  },
  {
    id: 'art-7',
    title: "Plein Air",
    artist: "Ramon Casas",
    period: "Modernismo",
    year: "1890",
    imageUrl: IMAGES.artworks.pleinAir,
    description: "Una mujer sentada en una terraza parisina. La composición asimétrica y el espacio vacío muestran la influencia de la fotografía y el arte japonés en la pintura moderna.",
    simpleDescription: "Una mujer tomando algo en una terraza al aire libre. Parece que está esperando a alguien o mirando pasar a la gente.",
    teacherDescription: "Influencia del Impresionismo y la fotografía en el encuadre. La modernidad urbana y la soledad en la pintura de Casas.",
    tags: ["Retrato", "Exterior", "Ciudad", "Mujer", "París"]
  },
  {
    id: 'art-8',
    title: "San Pedro y San Pablo",
    artist: "El Greco",
    period: "Renacimiento",
    year: "1590",
    imageUrl: IMAGES.artworks.sanPedroPablo,
    description: "Figuras alargadas y colores ácidos típicos del Manierismo del Greco. Representa el diálogo psicológico entre los dos apóstoles con una espiritualidad intensa.",
    simpleDescription: "Dos hombres con barba hablando. Llevan túnicas de colores brillantes (rojo y verde) y tienen las manos muy expresivas.",
    teacherDescription: "Características del Manierismo: alargamiento, color antinatural y espiritualidad. Comparación entre las dos figuras (el intelectual y el pasional).",
    tags: ["Religión", "Retrato", "Espiritualidad", "Color", "Manierismo"]
  },
  {
    id: 'art-9',
    title: "Frontal de Avià",
    artist: "Anónimo",
    period: "Románico",
    year: "1200",
    imageUrl: IMAGES.artworks.frontalAvia,
    description: "Una de las piezas más bellas del arte del mueble litúrgico románico. Destaca por su colorido vivo y la influencia bizantina en la elegancia de las figuras.",
    simpleDescription: "Una pintura sobre madera que se ponía delante del altar. Cuenta la vida de la Virgen María con colores muy bonitos, como un cómic antiguo.",
    teacherDescription: "El frontal de altar como soporte pedagógico medieval. Estilo 1200 o bizantinizante: mayor naturalismo y elegancia en los pliegues comparado con el románico temprano.",
    tags: ["Religión", "Madera", "Altar", "Edad Media", "Narrativa"]
  },
  {
    id: 'art-10',
    title: "Estudi (La Gitana)",
    artist: "Isidre Nonell",
    period: "Modernismo",
    year: "1908",
    imageUrl: IMAGES.artworks.estudiNonell,
    description: "Nonell retrata a mujeres marginadas con una pincelada gruesa, colores terrosos y una dignidad conmovedora que influyó profundamente en el joven Pablo Picasso.",
    simpleDescription: "El retrato de una mujer sentada mirando hacia abajo, pintado con colores oscuros y pinceladas muy marcadas.",
    teacherDescription: "Postmodernismo catalán y pintura social. Analizar la pincelada constructiva de Nonell y su influencia directa en la Época Azul de Picasso.",
    tags: ["Retrato", "Mujer", "Color", "Modernismo", "Expresión"]
  },
  {
    id: 'art-11',
    title: "Desconsol",
    artist: "Josep Llimona",
    period: "Modernismo",
    year: "1907",
    imageUrl: IMAGES.artworks.desconsol,
    description: "Obra cumbre de la escultura modernista y simbolista catalana. Tallada en mármol blanco, la figura femenina arrodillada expresa una melancolía íntima y serena.",
    simpleDescription: "Una escultura de mármol blanco que muestra a una mujer arrodillada con la cabeza escondida entre su pelo, expresando tristeza y calma.",
    teacherDescription: "Escultura simbolista catalana y paralelismos con Auguste Rodin. Observar el contraste entre el pulido del cuerpo y el bloque de mármol apenas desbastado.",
    tags: ["Escultura", "Mármol", "Mujer", "Simbolismo", "Modernismo"]
  },
  {
    id: 'art-12',
    title: "La Piedad Desplà",
    artist: "Bartolomé Bermejo",
    period: "Gótico",
    year: "1490",
    imageUrl: IMAGES.artworks.retabloPiedad,
    description: "Una de las cumbres de la pintura gótica hispanoflamenca. Destaca por el realismo minucioso de la flora, el paisaje crepuscular y la intensidad dramática del rostro de la Virgen.",
    simpleDescription: "Una escena triste pero muy detallada donde la Virgen sostiene a Jesús. Al fondo hay un paisaje con plantas y animales pintados con enorme precisión.",
    teacherDescription: "Transición del Gótico al Renacimiento. Influencia de la pintura flamenca (técnica al óleo, detalle botánico y retrato del donante Lluís Desplà).",
    tags: ["Religión", "Óleo", "Paisaje", "Gótico Tardío", "Realismo"]
  },
  {
    id: 'art-13',
    title: "Inmaculada Concepción",
    artist: "Francisco de Zurbarán",
    period: "Barroco",
    year: "1632",
    imageUrl: IMAGES.artworks.inmaculada,
    description: "Luz celestial y volúmenes escultóricos envuelven la figura juvenil. Zurbarán combina el recogimiento místico con una delicadeza cromática propia del Siglo de Oro.",
    simpleDescription: "Una figura vestida de blanco y azul rodeada de nubes doradas y pequeños ángeles, con una luz muy suave.",
    teacherDescription: "Iconografía contrarreformista en el Barroco español. Analizar la composición piramidal, la luz dorada y el tratamiento de los paños.",
    tags: ["Religión", "Barroco", "Luz", "Simbolismo", "Retrato"]
  },
  {
    id: 'art-14',
    title: "San Jorge matando al dragón",
    artist: "Bernat Martorell",
    period: "Gótico",
    year: "1434",
    imageUrl: IMAGES.artworks.santJordi,
    description: "Obra maestra del Gótico Internacional catalán. Martorell combina la narrativa caballeresca con un detallismo exquisito en la armadura, el paisaje y la figura de la princesa.",
    simpleDescription: "Un caballero montado en un caballo blanco luchando con su lanza contra un dragón para salvar a una princesa frente a un castillo.",
    teacherDescription: "El Gótico Internacional en Cataluña: sentido narrativo, riqueza ornamental en relieve de estuco y paisaje de transición hacia el naturalismo.",
    tags: ["Gótico", "Dragón", "Caballero", "Leyenda", "Oro"]
  },
  {
    id: 'art-15',
    title: "Majestat Batlló",
    artist: "Taller de Ripoll",
    period: "Románico",
    year: "1150",
    imageUrl: IMAGES.artworks.majestatBatllo,
    description: "Talla en madera policromada excepcional que muestra a Cristo triunfante sobre la muerte, vestido con túnica talar y los ojos abiertos en señal de victoria espiritual.",
    simpleDescription: "Una escultura antigua de madera pintada de colores vivos. Cristo aparece vestido como un rey, sin mostrar sufrimiento.",
    teacherDescription: "Iconografía del Christus Triumphans en la escultura románica catalana, en contraste con el Christus Patiens del Gótico.",
    tags: ["Religión", "Madera", "Escultura", "Edad Media", "Iconografía"]
  }
];