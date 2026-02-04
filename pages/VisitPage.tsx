
import React, { useEffect } from 'react';
import { MapPin, Clock, Train, Bus, Info, Ticket, Coffee, Accessibility, Utensils, Camera, ArrowRight, ExternalLink, Users, Baby, Ear, Eye, Map as MapIcon, ZoomIn } from 'lucide-react';
import Footer from '../components/Footer';
import { UserRole } from '../types';
import { IMAGES } from '../data/images';
import { useLocation } from 'react-router-dom';

interface VisitPageProps {
  role: UserRole;
}

const VisitPage: React.FC<VisitPageProps> = ({ role }) => {
  const { hash } = useLocation();

  // Handle auto-scroll to section on load
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [hash]);

  const schedule = [
    { days: 'Martes a Sábado', hours: '10:00h – 18:00h' },
    { days: 'Domingos y Festivos', hours: '10:00h – 15:00h' },
    { days: 'Lunes (No festivos)', hours: 'Cerrado' },
  ];

  const prices = [
    { type: 'Entrada General', price: '12€', desc: 'Acceso a colección y exposiciones temporales.' },
    { type: 'Entrada Reducida', price: '8€', desc: 'Mayores de 65, estudiantes y familias numerosas.' },
    { type: 'Gratuita', price: '0€', desc: 'Sábados desde las 15h, primer domingo de mes y menores de 16 años.' },
  ];

  return (
    <div className="bg-mnac-bg min-h-screen pt-20 text-mnac-textPrimary">
      {/* Hero Visit */}
      <div className="relative h-[45vh] md:h-[65vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-16 shadow-2xl">
        <img 
          src={IMAGES.visit.hero}
          className="w-full h-full object-cover opacity-60" 
          alt="Museu Nacional d'Art de Catalunya Exterior" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/20 to-transparent"></div>
        <div className="absolute bottom-12 left-6 md:left-24 text-white z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-mnac-accent">Montjuïc, Barcelona</span>
          <h1 className="text-4xl md:text-8xl font-serif italic leading-none drop-shadow-lg">Planifica tu <br/> <span className="not-italic">Visita</span></h1>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20 mb-32">
          
          {/* Column 1: Schedule, Location & Map */}
          <div className="space-y-16">
            <section id="schedule" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="text-mnac-accent" size={24} />
                <h3 className="font-serif italic text-3xl text-white">Horarios</h3>
              </div>
              <div className="space-y-4">
                {schedule.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.days}</span>
                    <span className="text-sm font-medium text-white">{item.hours}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-gray-500 font-light italic">* El cierre de salas se inicia 15 minutos antes del horario oficial.</p>
            </section>

            <section id="location" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="text-mnac-accent" size={24} />
                <h3 className="font-serif italic text-3xl text-white">Ubicación</h3>
              </div>
              <div className="bg-mnac-surface p-6 rounded-sm border border-white/5">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Palau Nacional, Parc de Montjuïc, s/n,<br/>08038 Barcelona
                </p>
                <a 
                  href="https://www.google.com/maps/dir//Museu+Nacional+d'Art+de+Catalunya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-mnac-accent text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cómo llegar en Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </section>

             {/* NUEVA SECCIÓN: MAPA DEL MUSEO */}
            <section id="map" className="scroll-mt-32">
               <div className="flex items-center gap-3 mb-8">
                  <MapIcon className="text-mnac-accent" size={24} />
                  <h3 className="font-serif italic text-3xl text-white">Mapa del Museo</h3>
               </div>
               <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 text-white overflow-hidden relative group cursor-pointer hover:border-mnac-accent/50 transition-all">
                  <div className="aspect-video bg-mnac-surface relative overflow-hidden rounded-sm mb-4">
                     {/* Placeholder visual del mapa */}
                     <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Planol_MNAC.svg/1200px-Planol_MNAC.svg.png')] bg-cover bg-center opacity-30 invert grayscale group-hover:scale-105 transition-transform duration-700"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
                  <div className="flex justify-between items-center">
                     <div>
                        <h4 className="text-lg font-serif italic">Plano Interactivo</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Nivel 1 & 2</p>
                     </div>
                     <button onClick={() => window.location.href='/visit/map'} className="bg-white/10 text-white p-2 rounded-full hover:bg-mnac-accent transition-colors">
                        <ExternalLink size={16} />
                     </button>
                  </div>
               </div>
            </section>
          </div>

          {/* Column 2: Transport, Accessibility & Tours */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Train className="text-mnac-accent" size={24} />
                <h3 className="font-serif italic text-3xl text-white">Transporte</h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-mnac-surface text-white p-3 rounded-full h-fit border border-white/5"><Train size={18} /></div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-300">Metro & FGC</h5>
                    <p className="text-gray-500 text-sm font-light">L1, L3 (Espanya) y FGC (Pl. Espanya)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-mnac-surface text-white p-3 rounded-full h-fit border border-white/5"><Bus size={18} /></div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-300">Autobús</h5>
                    <p className="text-gray-500 text-sm font-light">Líneas 55, 150 y Bus Turístico</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-mnac-surface text-white p-3 rounded-full h-fit border border-white/5"><ArrowRight size={18} /></div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-300">Escaleras Mecánicas</h5>
                    <p className="text-gray-500 text-sm font-light">Acceso directo desde Av. Reina Maria Cristina.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="accessibility" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <Accessibility className="text-mnac-accent" size={24} />
                <h3 className="font-serif italic text-3xl text-white">Accesibilidad</h3>
              </div>
              <div className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  El MNAC está comprometido con garantizar el acceso universal a la cultura. Todas las instalaciones están adaptadas.
                </p>
                <ul className="space-y-4">
                   <li className="flex gap-3 text-sm text-gray-400 font-light items-start">
                      <div className="bg-white/10 p-1.5 rounded text-mnac-gold mt-0.5"><Accessibility size={14} /></div>
                      <span>Rampas y ascensores accesibles en todas las salas.</span>
                   </li>
                   <li className="flex gap-3 text-sm text-gray-400 font-light items-start">
                      <div className="bg-white/10 p-1.5 rounded text-mnac-gold mt-0.5"><Info size={14} /></div>
                      <span>Préstamo gratuito de sillas de ruedas.</span>
                   </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <Users className="text-mnac-accent" size={24} />
                <h3 className="font-serif italic text-3xl text-white">Visitas Guiadas</h3>
              </div>
              
              <div className="space-y-6">
                  <div className="border-l-2 border-mnac-accent pl-4 py-1">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-1">General (Highlights)</h4>
                      <p className="text-xs text-gray-500 mb-2 font-bold">Sábados 11:00h y 12:30h</p>
                      <p className="text-sm text-gray-400 font-light">Recorrido por las obras maestras.</p>
                  </div>

                  <div className="border-l-2 border-mnac-gold pl-4 py-1">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-1 flex items-center gap-2">Familias <Baby size={16}/></h4>
                      <p className="text-xs text-gray-500 mb-2 font-bold">Domingos 12:00h</p>
                      <p className="text-sm text-gray-400 font-light">"El Misterio del Museo" para niños.</p>
                  </div>
              </div>
            </section>

            <section className="pt-8 border-t border-white/10">
               <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Otros Servicios</h5>
               <div className="flex flex-wrap gap-x-8 gap-y-4 text-gray-400">
                  <div className="flex items-center gap-2 group"><Coffee size={16} className="text-mnac-gold group-hover:text-white transition-colors" /> <span className="text-xs font-bold uppercase tracking-wider">Cafetería</span></div>
                  <div className="flex items-center gap-2 group"><Utensils size={16} className="text-mnac-gold group-hover:text-white transition-colors" /> <span className="text-xs font-bold uppercase tracking-wider">Restaurante</span></div>
                  <div className="flex items-center gap-2 group"><Camera size={16} className="text-mnac-gold group-hover:text-white transition-colors" /> <span className="text-xs font-bold uppercase tracking-wider">Fotos OK</span></div>
               </div>
            </section>
          </div>

          {/* Column 3: Tickets & CTA */}
          <div className="relative">
            <div id="tickets" className="sticky top-32 bg-mnac-surface text-white p-10 md:p-12 border border-white/5 overflow-hidden scroll-mt-32">
               <div className="absolute top-0 right-0 w-32 h-32 bg-mnac-accent/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <Ticket className="text-mnac-gold" size={24} />
                    <h3 className="font-serif italic text-3xl">Tarifas</h3>
                 </div>

                 <div className="space-y-8 mb-12">
                   {prices.map((item, idx) => (
                     <div key={idx} className="group border-b border-white/10 pb-6 hover:border-mnac-gold transition-colors">
                        <div className="flex justify-between items-end mb-2">
                           <h6 className="text-xs font-bold uppercase tracking-[0.2em]">{item.type}</h6>
                           <span className="text-xl font-serif text-mnac-gold">{item.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed">{item.desc}</p>
                     </div>
                   ))}
                 </div>

                 <button className="w-full bg-mnac-accent hover:bg-white hover:text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group">
                    Comprar Entradas <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                 </button>
                 <p className="text-center text-[8px] text-gray-500 uppercase tracking-widest mt-6 font-bold italic">
                   * La entrada es válida para dos días durante un mes.
                 </p>
               </div>
            </div>
          </div>

        </div>
      </div>
      <Footer role={role} />
    </div>
  );
};

export default VisitPage;
