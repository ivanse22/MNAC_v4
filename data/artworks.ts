

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
    title: "Pared Verde",
    artist: "Santiago Rusiñol",
    period: "Modernismo",
    year: "1904",
    imageUrl: IMAGES.artworks.paredVerde,
    description: "Rusiñol era conocido como el 'jardinero del alma'. Sus jardines abandonados simbolizan la decadencia, el misterio y el paso del tiempo en una atmósfera silenciosa.",
    simpleDescription: "Un jardín verde y tranquilo con muchas plantas. Parece un lugar perfecto y secreto para sentarse a pensar.",
    teacherDescription: "Ejemplo del Simbolismo en el paisajismo de Rusiñol. Analizar el uso de la luz y la ausencia de figura humana como recurso expresivo de introspección.",
    tags: ["Paisaje", "Naturaleza", "Jardín", "Simbolismo", "Luz"]
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
    title: "Composición Abstracta",
    artist: "Joan Miró (Estilo)",
    period: "Vanguardia",
    year: "1935",
    imageUrl: IMAGES.artworks.composicionAbstracta,
    description: "El lenguaje de los sueños y el subconsciente. Formas orgánicas y colores primarios que flotan en un espacio indefinido, rompiendo con la representación tradicional.",
    simpleDescription: "Una pintura con formas extrañas y colores divertidos. No parece nada real, sino sacado de un sueño o de la imaginación.",
    teacherDescription: "Introducción al Surrealismo y la abstracción. Cómo el arte deja de imitar la realidad para expresar el mundo interior y las emociones puras.",
    tags: ["Abstracción", "Surrealismo", "Color", "Formas", "Onírico"]
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
    title: "Granadina",
    artist: "Hermen Anglada Camarasa",
    period: "Modernismo",
    year: "1914",
    imageUrl: IMAGES.artworks.granadina,
    description: "Anglada Camarasa usa el color como elemento decorativo principal. La figura se funde con el fondo en una explosión ornamental de luz y texturas.",
    simpleDescription: "Una mujer con un vestido muy colorido y brillante. Hay tantas formas y colores que casi marea mirarlo de lo bonito que es.",
    teacherDescription: "El Post-Impresionismo y el decorativismo. El folclore como pretexto para la experimentación cromática y lumínica extrema.",
    tags: ["Retrato", "Mujer", "Folclore", "Color", "Noche"]
  },
  {
    id: 'art-11',
    title: "Sueño Surrealista",
    artist: "Salvador Dalí (Estilo)",
    period: "Surrealismo",
    year: "1931",
    imageUrl: IMAGES.artworks.suenoSurrealista,
    description: "Un paisaje onírico donde la realidad se derrite. Objetos imposibles y una luz inquietante invitan a explorar el inconsciente y los sueños.",
    simpleDescription: "Un cuadro muy raro donde las cosas no tienen sentido lógico, como en un sueño extraño donde todo cambia de forma.",
    teacherDescription: "El método paranoico-crítico de Dalí. Simbolismo freudiano y la ruptura con la lógica racional en el arte del siglo XX.",
    tags: ["Surrealismo", "Sueño", "Paisaje", "Psicoanálisis", "Fantasía"]
  }
];