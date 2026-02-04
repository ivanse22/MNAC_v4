
import { HomeContentConfig } from "../types";
import { IMAGES } from "./images";

export const STUDENT_HOME_CONTENT: HomeContentConfig = {
  hero: {
    titleItalic: "Domina",
    titleNormal: "la Historia",
    ctaPrimary: "Iniciar Quiz",
    linkPrimary: "/quiz",
    ctaSecondary: "Explorar Obras",
    linkSecondary: "/collection",
    backgroundImage: IMAGES.home.heroStudent
  },
  romanesque: {
    tag: "IMPRESCINDIBLE SELECTIVIDAD",
    title: "El Pantocrátor",
    subtitle: "Te mira a ti",
    description: "¿Te has fijado? Gracias a la perspectiva inversa medieval, los ojos del Cristo de Taüll te siguen por toda la sala. Descubre el secreto técnico.",
    cta: "Ver Análisis Visual",
    image: IMAGES.home.romanesque
  },
  modernism: {
    tag: "BARCELONA BOHEMIA",
    title: "Modernismo",
    subtitle: "& 'Els Quatre Gats'",
    description: "La burguesía pagaba, pero los artistas vivían la vida loca. Descubre el lado rebelde de Rusiñol, Casas y Gaudí.",
    cta: "Ver Ruta Bohemia"
  },
  casas: {
    tag: "EL RETRATO PERFECTO",
    title: "Ramon",
    subtitle: "Casas",
    description: "Antes de Instagram, Casas ya capturaba el 'lifestyle' barcelonés. Bicicletas, coches y sombreros de copa.",
    cta: "Ver Obras Clave"
  },
  action: {
    tag: "TU ESPACIO",
    titleItalic: "Sube de",
    titleNormal: "Nivel",
    description: "Acumula insignias, guarda tus obras favoritas y prepárate para sacar un 10 en Historia del Arte.",
    buttonText: "Ver mis Logros",
    buttonLink: "/badges",
    quoteText: "\"El arte es la mentira que nos hace comprender la verdad.\""
  }
};

export const TEACHER_HOME_CONTENT: HomeContentConfig = {
  hero: {
    titleItalic: "Recursos",
    titleNormal: "Pedagógicos",
    ctaPrimary: "Buscar Material",
    linkPrimary: "/network",
    ctaSecondary: "Planificar Visita",
    linkSecondary: "/visit",
    backgroundImage: IMAGES.home.heroTeacher
  },
  romanesque: {
    tag: "CONTEXTO CURRICULAR: EDAD MEDIA",
    title: "El Poder",
    subtitle: "del Feudalismo",
    description: "Utiliza el Pantocrátor para explicar la jerarquía social y el teocentrismo medieval. Material descargable con actividades para ESO.",
    cta: "Descargar Guía Docente",
    image: IMAGES.home.romanesque
  },
  modernism: {
    tag: "S. XIX - XX: REVOLUCIÓN INDUSTRIAL",
    title: "Arte &",
    subtitle: "Sociedad",
    description: "Conecta el Modernismo con la literatura y la historia industrial de Cataluña. Ideal para trabajos transversales de Bachillerato.",
    cta: "Ver Itinerarios Educativos"
  },
  casas: {
    tag: "CRÓNICA SOCIAL",
    title: "Ramon",
    subtitle: "Casas",
    description: "Del cartelismo publicitario al retrato burgués. Analiza la evolución de la sociedad catalana a través de su pincelada.",
    cta: "Ver Ficha de Autor"
  },
  action: {
    tag: "HERRAMIENTAS DE GESTIÓN",
    titleItalic: "Organiza",
    titleNormal: "tu Clase",
    description: "Crea colecciones personalizadas de obras, añade notas privadas y comparte itinerarios con tus alumnos.",
    buttonText: "Mis Colecciones",
    buttonLink: "/collections",
    quoteText: "\"La educación es el arma más poderosa para cambiar el mundo.\""
  }
};
