
import React, { useState } from 'react';
import { TeacherResource } from '../types';
import { Users, Search, Filter, Download, Heart, FileText, Video, PenTool } from 'lucide-react';
import Footer from '../components/Footer';

// Mock Data
const RESOURCES: TeacherResource[] = [
  {
    id: 'r1',
    author: 'Departamento Educativo MNAC',
    authorRole: 'MNAC Educator',
    title: 'Guía Didáctica: El Románico para Primaria',
    description: 'Un kit completo con fichas imprimibles, recortables y una presentación para introducir el arte medieval a niños de 6-10 años.',
    tags: ['Primaria', 'Historia', 'Material Manipulativo'],
    likes: 342,
    downloads: 1205,
    type: 'PDF',
    date: 'Hace 2 días'
  },
  {
    id: 'r2',
    author: 'Laura M.',
    authorRole: 'Docente Certificado',
    title: 'Mujeres Artistas: Una perspectiva de género',
    description: 'Propuesta de itinerario transversal para Bachillerato. Analizamos la representación femenina y las artistas olvidadas de la colección.',
    tags: ['Bachillerato', 'Igualdad', 'Debate'],
    likes: 89,
    downloads: 45,
    type: 'Activity',
    date: 'Hace 5 horas'
  },
  {
    id: 'r3',
    author: 'Carlos R.',
    authorRole: 'Docente',
    title: 'Taller de Fresco: Técnica y Práctica',
    description: 'Video tutorial de 15 minutos explicando cómo simular la técnica del fresco en el aula de plástica con materiales accesibles.',
    tags: ['ESO', 'Plástica', 'Taller'],
    likes: 156,
    downloads: 302,
    type: 'Video',
    date: 'Hace 1 semana'
  }
];

const TeacherNetworkPage: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState('Todos');

  return (
    <div className="bg-mnac-bg min-h-screen flex flex-col pt-24 text-mnac-textPrimary">
      
      {/* HEADER HERO */}
      <div className="bg-mnac-surface border-b border-white/10 py-16 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-mnac-accent rounded-full blur-[100px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="max-w-[1920px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
               <div className="flex items-center gap-3 mb-4 text-mnac-gold">
                  <Users size={24} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Comunidad Educativa</span>
               </div>
               <h1 className="font-serif italic text-5xl md:text-7xl mb-6 text-white">Red de Docentes</h1>
               <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl">
                  Un espacio colaborativo para compartir experiencias, descargar recursos exclusivos y conectar el museo con tu aula.
               </p>
            </div>
            
            <button className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-mnac-gold transition-colors shadow-lg flex items-center gap-3">
               <PenTool size={16} /> Publicar Recurso
            </button>
         </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow max-w-[1920px] mx-auto px-6 md:px-12 py-12 w-full flex flex-col lg:flex-row gap-12">
         
         {/* SIDEBAR FILTROS */}
         <div className="lg:w-1/4 space-y-8">
            <div className="bg-mnac-surface p-6 border border-white/10 rounded-sm">
               <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">Filtrar Recursos</h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nivel Educativo</label>
                     <select 
                       value={filterLevel}
                       onChange={(e) => setFilterLevel(e.target.value)}
                       className="w-full bg-black/40 border border-white/10 text-gray-300 p-3 text-sm focus:border-mnac-accent focus:outline-none"
                     >
                        <option>Todos los niveles</option>
                        <option>Infantil</option>
                        <option>Primaria</option>
                        <option>ESO</option>
                        <option>Bachillerato</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Tipo de Recurso</label>
                     <div className="space-y-2">
                        {['Guías PDF', 'Actividades', 'Videos', 'Presentaciones'].map(type => (
                           <label key={type} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="w-4 h-4 border-gray-600 rounded bg-transparent text-mnac-accent focus:ring-mnac-accent" />
                              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{type}</span>
                           </label>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-mnac-accent/10 p-6 border border-mnac-accent/20 rounded-sm">
               <h3 className="text-mnac-accent text-sm font-bold uppercase tracking-widest mb-2">¿Eres nuevo?</h3>
               <p className="text-sm text-gray-400 mb-4">Descubre cómo funciona el programa de certificación docente del MNAC.</p>
               <button className="text-xs font-bold uppercase tracking-widest text-mnac-accent underline hover:text-white transition-colors">Saber más</button>
            </div>
         </div>

         {/* FEED */}
         <div className="lg:w-3/4">
            
            {/* Buscador */}
            <div className="mb-8 flex gap-4">
               <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Buscar temas, autores, obras..." 
                    className="w-full bg-mnac-surface border border-white/10 text-white py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:border-mnac-accent placeholder-gray-500"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="hidden md:inline">Ordenar por:</span>
                  <select className="bg-transparent font-bold text-white focus:outline-none cursor-pointer">
                     <option>Más Populares</option>
                     <option>Más Recientes</option>
                  </select>
               </div>
            </div>

            {/* Lista de Cards */}
            <div className="space-y-6">
               {RESOURCES.map((resource) => (
                  <div key={resource.id} className="bg-mnac-surface p-6 md:p-8 border border-white/5 hover:border-white/20 transition-all animate-slide-up flex flex-col md:flex-row gap-6">
                     
                     {/* Icono Tipo */}
                     <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                           resource.type === 'PDF' ? 'bg-red-500/20 text-red-400' :
                           resource.type === 'Video' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                           {resource.type === 'PDF' && <FileText size={32} />}
                           {resource.type === 'Video' && <Video size={32} />}
                           {resource.type === 'Activity' && <PenTool size={32} />}
                        </div>
                     </div>

                     {/* Contenido */}
                     <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                              resource.authorRole === 'MNAC Educator' ? 'bg-white text-black' : 'bg-white/10 text-gray-400'
                           }`}>
                              {resource.authorRole}
                           </span>
                           <span className="text-xs font-bold text-gray-400">{resource.author}</span>
                           <span className="text-xs text-gray-600">• {resource.date}</span>
                        </div>

                        <h3 className="font-serif text-2xl text-white mb-3 hover:text-mnac-accent cursor-pointer transition-colors">
                           {resource.title}
                        </h3>
                        <p className="text-gray-400 mb-4 leading-relaxed font-light">
                           {resource.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                           {resource.tags.map(tag => (
                              <span key={tag} className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">#{tag}</span>
                           ))}
                        </div>

                        <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                           <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-mnac-accent transition-colors">
                              <Heart size={16} /> {resource.likes}
                           </button>
                           <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-mnac-accent transition-colors">
                              <Download size={16} /> {resource.downloads}
                           </button>
                           <div className="flex-1"></div>
                           <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-transparent hover:border-mnac-accent hover:text-mnac-accent transition-all">
                              Descargar {resource.type} <Download size={14} />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-12 text-center">
               <button className="bg-transparent border border-white/20 text-gray-400 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all">
                  Cargar más recursos
               </button>
            </div>
         </div>
      </div>

      <Footer role="teacher" />
    </div>
  );
};

export default TeacherNetworkPage;
