
import React from 'react';
import { ArtWork, TeacherCollection } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { Download, Plus, Trash2, BookOpen, FileText, Share2, PenTool } from 'lucide-react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';

interface TeacherCollectionsPageProps {
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
}

// Mock Data
const PAST_COLLECTIONS: TeacherCollection[] = [
  {
    id: 'c1',
    title: 'El Románico y el Simbolismo',
    subject: 'Historia del Arte',
    level: '2º Bachillerato',
    artworkCount: 8,
    date: '12 Oct, 2023',
    coverImage: IMAGES.collections.romanicoSimbolismo
  },
  {
    id: 'c2',
    title: 'La figura de la mujer en el s.XIX',
    subject: 'Valores Éticos',
    level: '4º ESO',
    artworkCount: 5,
    date: '25 Nov, 2023',
    coverImage: IMAGES.collections.mujerXIX
  },
  {
    id: 'c3',
    title: 'Animales fantásticos',
    subject: 'Plástica',
    level: 'Primaria',
    artworkCount: 12,
    date: '10 Ene, 2024',
    coverImage: IMAGES.collections.animalesFantasticos
  }
];

const TeacherCollectionsPage: React.FC<TeacherCollectionsPageProps> = ({ savedArtIds, onToggleSave }) => {
  const currentWorks = ARTWORKS_DATA.filter(art => savedArtIds.includes(art.id));

  return (
    <div className="bg-mnac-bg min-h-screen flex flex-col pt-24 text-mnac-textPrimary">
      
      {/* HEADER SECCIÓN */}
      <div className="bg-mnac-surface border-b border-white/10 py-12 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-mnac-accent/20 rounded-lg">
                <PenTool size={20} className="text-mnac-accent" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Espacio Docente</span>
          </div>
          <h1 className="font-serif italic text-5xl md:text-7xl text-white mb-6">Mis Colecciones</h1>
          <p className="text-xl text-gray-400 font-light max-w-3xl">
            Gestiona tus listas de obras para preparar clases. Las obras que guardas mientras navegas aparecen en tu "Borrador Activo".
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-[1920px] mx-auto px-6 md:px-12 py-12 w-full">
        
        {/* SECCIÓN 1: BORRADOR ACTIVO (OBRAS GUARDADAS) */}
        <section className="mb-20 animate-slide-up">
           <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-4 gap-6">
              <div>
                  <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    Clase en Borrador
                    <span className="text-sm font-sans font-bold bg-white/10 px-2 py-1 rounded-md text-gray-300 not-italic ml-2">
                      {currentWorks.length} obras
                    </span>
                  </h2>
              </div>
              
              <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/30 text-white px-6 py-3 hover:bg-white hover:text-black transition-all">
                      <Download size={16} /> Exportar PDF
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-mnac-accent text-white px-6 py-3 hover:bg-white hover:text-mnac-accent transition-all shadow-lg">
                      <Plus size={16} /> Crear Guía Nueva
                  </button>
              </div>
           </div>

           {currentWorks.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentWorks.map((art) => (
                  <div key={art.id} className="bg-mnac-surface p-4 shadow-sm border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex gap-4 mb-4">
                          <img src={art.imageUrl} alt={art.title} className="w-20 h-20 object-cover rounded-sm opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-lg leading-tight truncate text-white">{art.title}</h4>
                              <p className="text-xs text-gray-400 uppercase mt-1">{art.artist}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{art.year}</p>
                          </div>
                          <button onClick={() => onToggleSave(art.id)} className="text-gray-500 hover:text-red-500 self-start transition-colors">
                             <Trash2 size={16} />
                          </button>
                      </div>
                      <div className="bg-black/40 p-3 rounded text-xs text-gray-400 italic border border-white/5">
                          <div className="flex items-center gap-2 text-mnac-gold mb-1 not-italic font-bold uppercase text-[9px]">
                              <FileText size={10} /> Notas privadas
                          </div>
                          Añadir nota pedagógica para esta obra...
                      </div>
                  </div>
                ))}
                
                {/* Add Card Placeholder */}
                <Link to="/collection" className="border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-gray-500 hover:border-mnac-accent hover:text-mnac-accent transition-colors bg-transparent">
                    <Plus size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Añadir más obras</span>
                </Link>
             </div>
           ) : (
             <div className="bg-mnac-surface border border-dashed border-white/10 p-12 text-center rounded-lg">
                <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="font-serif text-xl text-gray-300 mb-2">Tu borrador está vacío</h3>
                <p className="text-gray-500 mb-6 font-light">Navega por la colección y pulsa el icono de guardar para empezar a armar tu clase.</p>
                <Link to="/collection" className="text-mnac-accent font-bold uppercase tracking-widest text-xs border-b border-mnac-accent pb-1 hover:text-white hover:border-white transition-all">
                  Ir al Archivo
                </Link>
             </div>
           )}
        </section>

        {/* SECCIÓN 2: BIBLIOTECA (COLECCIONES PASADAS) */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
              <BookOpen size={24} className="text-mnac-gold" />
              Biblioteca de Clases
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {PAST_COLLECTIONS.map(collection => (
                 <div key={collection.id} className="group bg-mnac-surface border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer">
                    {/* Cover */}
                    <div className="h-48 overflow-hidden relative">
                        <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <span className="bg-mnac-accent px-2 py-1 text-[9px] font-bold uppercase tracking-widest mb-2 inline-block">
                              {collection.subject}
                            </span>
                            <h3 className="font-serif text-2xl leading-none">{collection.title}</h3>
                        </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nivel</span>
                                <span className="text-sm font-medium text-gray-300">{collection.level}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Obras</span>
                                <span className="text-sm font-medium text-gray-300">{collection.artworkCount} items</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fecha</span>
                                <span className="text-sm font-medium text-gray-300">{collection.date}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4 border-t border-white/10">
                             <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                <Share2 size={14} /> Compartir
                             </button>
                             <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-mnac-accent hover:bg-mnac-accent/10 transition-colors flex items-center justify-center gap-2">
                                <Download size={14} /> PDF
                             </button>
                        </div>
                    </div>
                 </div>
               ))}
            </div>
        </section>
      </div>

      <Footer role="teacher" />
    </div>
  );
};

export default TeacherCollectionsPage;
