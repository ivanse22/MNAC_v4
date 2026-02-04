import React from 'react';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import { Ear, Eye, Accessibility, Brain, Info, Dog, Mail, Phone, HeartHandshake, Download } from 'lucide-react';
import { IMAGES } from '../data/images';
import OptimizedImage from '../components/OptimizedImage';

interface AccessibilityPageProps {
  userRole: UserRole;
}

const AccessibilityPage: React.FC<AccessibilityPageProps> = ({ userRole }) => {
  return (
    <div className="min-h-screen bg-mnac-bg text-mnac-textPrimary">
       
       {/* EDITORIAL HEADER */}
       <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1920px] mx-auto animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             <div className="lg:w-2/3">
                 <span className="text-mnac-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <HeartHandshake size={14} /> Compromiso Social
                 </span>
                 <h1 className="font-sans font-black text-5xl md:text-8xl text-white mb-6 leading-[1.1] tracking-tight">
                    Accesibilidad Universal
                 </h1>
                 <p className="text-gray-300 leading-relaxed mb-6 text-lg font-light max-w-2xl">
                    El MNAC trabaja día a día para eliminar barreras físicas, sensoriales y cognitivas. Porque el arte solo tiene sentido si es compartido por todos.
                 </p>
             </div>
             <div className="lg:w-1/3 flex justify-end">
                <button className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-mnac-accent hover:text-white transition-all shadow-lg flex items-center gap-3">
                   <Download size={16} /> Descargar Guía PDF
                </button>
             </div>
          </div>
       </div>

       {/* MAIN CONTENT - DARK SECTIONS */}
       <div className="bg-mnac-bg">
           <div className="max-w-[1920px] mx-auto px-0 md:px-12 py-0 md:py-20">
               
               {/* FEATURE 1: MOVILIDAD */}
               <div className="flex flex-col md:flex-row border-b border-white/10">
                   <div className="flex-1 p-10 md:p-20 bg-mnac-surface flex flex-col justify-center">
                       <div className="mb-8 text-white/20"><Accessibility size={64} strokeWidth={1} /></div>
                       <h2 className="font-sans font-bold text-4xl md:text-5xl text-white mb-6">Movilidad Reducida</h2>
                       <p className="text-gray-400 font-light text-lg mb-8 max-w-md">
                           Garantizamos el acceso autónomo a todos los espacios. Desde la llegada a Montjuïc hasta la última sala de la colección.
                       </p>
                       <ul className="space-y-4">
                           <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-gray-300 border-b border-white/5 pb-2">
                               <span className="text-mnac-accent">01</span> Acceso nivel cero
                           </li>
                           <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-gray-300 border-b border-white/5 pb-2">
                               <span className="text-mnac-accent">02</span> Préstamo de Sillas
                           </li>
                           <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-gray-300 border-b border-white/5 pb-2">
                               <span className="text-mnac-accent">03</span> Lavabos Adaptados
                           </li>
                       </ul>
                   </div>
                   <div className="flex-1 min-h-[400px] bg-black relative overflow-hidden group">
                       <OptimizedImage src={IMAGES.visit.hero} alt="Accesibilidad" className="grayscale opacity-50 group-hover:opacity-100 transition-all duration-1000" />
                   </div>
               </div>

               {/* FEATURE 2: VISUAL */}
               <div className="flex flex-col md:flex-row-reverse border-b border-white/10">
                   <div className="flex-1 p-10 md:p-20 bg-[#0a0a0a] text-white flex flex-col justify-center">
                       <div className="mb-8 text-white/20"><Eye size={64} strokeWidth={1} /></div>
                       <h2 className="font-sans font-bold text-4xl md:text-5xl text-white mb-6">Accesibilidad Visual</h2>
                       <p className="text-gray-400 font-light text-lg mb-8 max-w-md">
                           Ver con las manos. Escuchar el arte. Disponemos de recursos táctiles y auditivos para enriquecer la experiencia.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                               <Dog size={24} className="mb-2 text-mnac-gold" />
                               <span className="text-xs font-bold uppercase text-gray-300">Perros Guía</span>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                               <Info size={24} className="mb-2 text-mnac-gold" />
                               <span className="text-xs font-bold uppercase text-gray-300">Planos Táctiles</span>
                           </div>
                       </div>
                   </div>
                   <div className="flex-1 min-h-[400px] bg-black relative overflow-hidden group">
                       <OptimizedImage src={IMAGES.artworks.pantocrator} alt="Visual" className="opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                   </div>
               </div>

               {/* FEATURE 3: AUDITIVA & COGNITIVA */}
               <div className="grid grid-cols-1 md:grid-cols-2">
                   <div className="p-10 md:p-20 bg-mnac-surface border-r border-white/10">
                       <Ear size={48} strokeWidth={1} className="text-white/50 mb-6" />
                       <h3 className="font-sans font-bold text-3xl mb-4 text-white">Auditiva</h3>
                       <p className="text-gray-400 font-light mb-6">Bucles magnéticos en mostradores y videoguías en LSC.</p>
                       <a href="#" className="text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 hover:text-mnac-accent hover:border-mnac-accent transition-colors">Ver Videoguías</a>
                   </div>
                   <div className="p-10 md:p-20 bg-mnac-bg">
                       <Brain size={48} strokeWidth={1} className="text-white/50 mb-6" />
                       <h3 className="font-sans font-bold text-3xl mb-4 text-white">Cognitiva</h3>
                       <p className="text-gray-400 font-light mb-6">Lectura Fácil y espacios de calma señalizados.</p>
                       <a href="#" className="text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 hover:text-mnac-accent hover:border-mnac-accent transition-colors">Descargar Mapa Fácil</a>
                   </div>
               </div>

               {/* FEATURE HIGHLIGHT: MOCHILA SENSORIAL */}
               <div className="bg-mnac-accent text-white py-24 px-6 md:px-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: `url("${IMAGES.tours.stardustTexture}")`}}></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="bg-white text-mnac-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Nuevo Servicio Gratuito</span>
                        <h2 className="font-sans font-bold text-5xl md:text-7xl mb-6">La Mochila Sensorial</h2>
                        <p className="text-xl md:text-2xl font-light opacity-90 mb-10 leading-relaxed">
                            Un kit de préstamo diseñado para personas con hipersensibilidad sensorial o TEA. Incluye cascos canceladores, gafas de sol y materiales táctiles.
                        </p>
                        <button className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                            Solicitar en Taquillas
                        </button>
                    </div>
               </div>

               {/* CONTACT FOOTER */}
               <div className="py-24 px-6 md:px-20 bg-mnac-surface flex flex-col md:flex-row items-center justify-between gap-12 border-t border-white/10">
                   <div className="text-center md:text-left">
                       <h2 className="font-sans font-bold text-4xl text-white mb-2">¿Necesitas ayuda personalizada?</h2>
                       <p className="text-gray-400 font-light">Nuestro equipo de atención al visitante está a tu disposición.</p>
                   </div>
                   <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                       <a href="mailto:accessibilitat@mnac.cat" className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all min-w-[250px]">
                           <div className="bg-white/10 p-3 rounded-full text-white"><Mail size={20}/></div>
                           <div className="text-left">
                               <span className="block text-[10px] font-bold uppercase text-gray-500">Email</span>
                               <span className="font-sans font-bold text-lg text-white">accessibilitat@mnac.cat</span>
                           </div>
                       </a>
                       <a href="tel:+34936220360" className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all min-w-[250px]">
                           <div className="bg-white/10 p-3 rounded-full text-white"><Phone size={20}/></div>
                           <div className="text-left">
                               <span className="block text-[10px] font-bold uppercase text-gray-500">Teléfono</span>
                               <span className="font-sans font-bold text-lg text-white">+34 93 622 03 60</span>
                           </div>
                       </a>
                   </div>
               </div>
           </div>
       </div>

       <Footer role={userRole} />
    </div>
  );
};

export default AccessibilityPage;