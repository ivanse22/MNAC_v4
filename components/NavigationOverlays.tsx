import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Ticket, ShoppingBag, Users, 
  Bookmark, LogOut, BrainCircuit, ChevronDown, 
  Accessibility, Calendar, User, Star, Map,
  Clock, Search, SlidersHorizontal, Sparkles, Type, Sun,
  LayoutGrid, ArrowRight, Instagram, Twitter, Facebook, ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';

interface NavigationProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onLogout: () => void;
  savedCount: number;
  easyReading?: boolean;
  setEasyReading?: (value: boolean) => void;
  highContrast?: boolean;
  setHighContrast?: (value: boolean) => void;
}

const NavigationOverlays: React.FC<NavigationProps> = ({ 
  side, isOpen, onClose, role, onLogout, savedCount,
  easyReading, setEasyReading, highContrast, setHighContrast
}) => {
  
  if (!isOpen) return null;

  if (side === 'left') {
    return <MainMenu isOpen={isOpen} onClose={onClose} />;
  }

  const getProfileInfo = () => {
    if (role === 'teacher') return { name: 'Laura Martínez', type: 'DOCENTE CERTIFICADO', icon: LayoutGrid };
    if (role === 'student') return { name: 'Carlos Ruíz', type: 'ESTUDIANTE', icon: BrainCircuit };
    return { name: 'Visitante', type: 'ENTRADA GENERAL', icon: Ticket };
  };
  
  const profile = getProfileInfo();
  const ProfileIcon = profile.icon;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full md:w-[400px] h-full bg-mnac-bg border-l border-mnac-secondary/10 flex flex-col text-mnac-secondary shadow-2xl animate-panel-slide-right overflow-hidden">
        
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 pt-safe px-8 pb-12 flex flex-col items-center border-b border-mnac-secondary/10">
           <div className="w-full flex justify-end mb-4">
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-mnac-secondary/10 transition-colors group"
              >
                <X size={20} className="text-mnac-secondary/50 group-hover:text-mnac-secondary" />
              </button>
           </div>

           <div className="w-24 h-24 rounded-full border border-mnac-secondary/20 flex items-center justify-center mb-6 bg-mnac-surface relative group">
              <div className="absolute inset-0 rounded-full border border-mnac-secondary/10 scale-110 group-hover:scale-125 transition-transform duration-700"></div>
              <ProfileIcon size={32} strokeWidth={1} className="text-mnac-secondary group-hover:text-mnac-accent transition-colors" />
           </div>

           <h2 className="font-sans text-3xl font-bold tracking-tight text-mnac-secondary mb-2 text-center">
              {profile.name}
           </h2>
           <span className="font-mono text-[10px] text-mnac-secondary/60 uppercase tracking-[0.2em]">
              {profile.type}
           </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
           
           <div className="px-8 py-8">
              <h3 className="font-mono text-[10px] text-mnac-secondary/40 uppercase tracking-[0.2em] mb-6 pl-1">
                 // MI ESPACIO
              </h3>
              
              <div className="flex flex-col">
                 {role === 'teacher' && (
                   <>
                     <MenuLink 
                        to="/collections" 
                        label="Mis Colecciones" 
                        onClose={onClose} 
                        icon={<LayoutGrid size={18} />} 
                     />
                     <MenuLink 
                        to="/network" 
                        label="Red Docente" 
                        onClose={onClose} 
                        icon={<Users size={18} />} 
                     />
                   </>
                 )}
                 
                 {role === 'student' && (
                   <>
                     <MenuLink 
                        to="/saved" 
                        label="Mis Favoritos" 
                        meta={`${savedCount}`} 
                        onClose={onClose} 
                        icon={<Bookmark size={18} />} 
                     />
                     <MenuLink 
                        to="/badges" 
                        label="Logros & XP" 
                        onClose={onClose} 
                        icon={<BrainCircuit size={18} />} 
                     />
                   </>
                 )}

                 {role === 'visitor' && (
                   <MenuLink 
                      to="/visit#tickets" 
                      label="Mis Entradas" 
                      onClose={onClose} 
                      icon={<Ticket size={18} />} 
                   />
                 )}
              </div>
           </div>

           <div className="px-8 pb-12">
              <h3 className="font-mono text-[10px] text-mnac-secondary/40 uppercase tracking-[0.2em] mb-6 pl-1 border-t border-mnac-secondary/10 pt-8">
                 // ACCESIBILIDAD
              </h3>
              
              <div className="space-y-0">
                  <div className="flex justify-between items-center py-5 border-b border-mnac-secondary/10 group cursor-pointer" onClick={() => setEasyReading && setEasyReading(!easyReading)}>
                     <div className="flex items-center gap-4">
                        <Type size={18} className="text-mnac-secondary/50 group-hover:text-mnac-secondary transition-colors" />
                        <span className="font-sans text-base text-mnac-secondary font-medium">Lectura Fácil</span>
                     </div>
                     <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${easyReading ? 'text-mnac-accent font-bold' : 'text-mnac-secondary/50'}`}>
                        {easyReading ? 'ON' : 'OFF'}
                     </span>
                  </div>

                  <div className="flex justify-between items-center py-5 border-b border-mnac-secondary/10 group cursor-pointer" onClick={() => setHighContrast && setHighContrast(!highContrast)}>
                     <div className="flex items-center gap-4">
                        <Sun size={18} className="text-mnac-secondary/50 group-hover:text-mnac-secondary transition-colors" />
                        <span className="font-sans text-base text-mnac-secondary font-medium">Alto Contraste</span>
                     </div>
                     <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${highContrast ? 'text-mnac-accent font-bold' : 'text-mnac-secondary/50'}`}>
                        {highContrast ? 'ON' : 'OFF'}
                     </span>
                  </div>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-mnac-secondary/10 bg-mnac-bg relative z-10 pb-safe">
           <button 
             onClick={onLogout} 
             className="w-full flex justify-between items-center group"
           >
              <span className="font-mono text-xs text-mnac-secondary/60 group-hover:text-mnac-accent uppercase tracking-[0.2em] transition-colors">
                 {role === 'visitor' ? 'Volver al Inicio' : 'Cerrar Sesión'}
              </span>
              <LogOut size={16} className="text-mnac-secondary/60 group-hover:text-mnac-accent transition-colors" />
           </button>
        </div>

      </div>
    </div>
  );
};

const MenuLink = ({ to, label, meta, onClose, icon }: { to: string, label: string, meta?: string, onClose: () => void, icon: React.ReactNode }) => (
  <Link 
    to={to} 
    onClick={onClose}
    className="flex justify-between items-center py-5 border-b border-mnac-secondary/10 group active:opacity-50 transition-all"
  >
     <div className="flex items-center gap-4">
        <div className="text-mnac-secondary/50 group-hover:text-mnac-secondary transition-colors">
           {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 1.5 })}
        </div>
        <span className="font-sans text-lg text-mnac-secondary font-medium group-hover:pl-2 transition-all duration-300">
           {label}
        </span>
     </div>
     
     <div className="flex items-center gap-3">
        {meta && (
           <span className="font-mono text-xs text-mnac-accent">
              [{meta}]
           </span>
        )}
        <ChevronRight size={16} className="text-mnac-secondary/30 group-hover:text-mnac-accent transition-colors" />
     </div>
  </Link>
);

export default NavigationOverlays;