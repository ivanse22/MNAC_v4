import React, { useState, useEffect } from 'react';
import { Menu, User, WifiOff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { hapticService } from '../services/hapticService';

interface HeaderProps {
  onOpenLeftMenu: () => void;
  onOpenRightMenu: () => void;
  role: UserRole;
  isVisible: boolean;
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenLeftMenu, 
  onOpenRightMenu, 
  role,
  isVisible,
  isScrolled 
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Updated Styles: Warm Charcoal Glass
  const headerClasses = !isHome || isScrolled
    ? "bg-[#1F1F1F]/85 backdrop-blur-xl border-b border-mnac-secondary/10 text-mnac-secondary shadow-lg" 
    : "bg-gradient-to-b from-[#1F1F1F]/90 to-transparent text-mnac-secondary border-b border-transparent";

  const handleLogoClick = () => {
    hapticService.light();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new Event('mnac-home-reset'));
  };

  const handleLeftMenu = () => {
    hapticService.medium();
    onOpenLeftMenu();
  };

  const handleRightMenu = () => {
    hapticService.medium();
    onOpenRightMenu();
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-mnac-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:font-bold">
        Saltar al contenido principal
      </a>

      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pt-safe ${headerClasses} ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {!isOnline && (
          <div className="absolute top-0 left-0 w-full bg-red-900/90 text-white text-[10px] font-bold uppercase tracking-widest text-center py-1 z-[60] animate-slide-up shadow-md flex items-center justify-center gap-2 border-b border-white/10" role="alert">
             <WifiOff size={12} />
             <span>Modo Offline Activado</span>
          </div>
        )}

        <div className={`max-w-[1920px] mx-auto px-6 pb-2 ${!isOnline ? 'mt-4' : ''} transition-all duration-300`}>
          <div className="flex justify-between items-center h-16 md:h-20 transition-colors duration-500">
            
            {/* Izquierda: Menú */}
            <button 
               onClick={handleLeftMenu}
               className="flex items-center gap-3 group active:scale-90 transition-transform p-2 -ml-2 hover:text-mnac-accent"
               aria-label="Abrir menú"
            >
               <div className="p-1 rounded-md">
                  <Menu size={28} strokeWidth={1.5} />
               </div>
               <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-mnac-secondary">Menú</span>
            </button>

            {/* Centro: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 mt-[env(safe-area-inset-top)]">
              <Link 
                to="/" 
                onClick={handleLogoClick}
                className="flex flex-col items-center leading-none active:opacity-70 transition-opacity focus:outline-none"
                aria-label="MNAC Inicio"
              >
                <span className="font-display font-extrabold text-2xl tracking-tighter text-mnac-secondary">MNAC</span>
              </Link>
            </div>

            {/* Derecha: Área Personal */}
            <button 
               onClick={handleRightMenu}
               className="flex items-center gap-3 group active:scale-90 transition-transform p-2 -mr-2 hover:text-mnac-accent"
               aria-label="Abrir perfil"
            >
               <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-right text-mnac-secondary">
                  {role === 'teacher' ? 'Área Docente' : 'Mi Espacio'}
               </span>
               <div className="p-1.5 rounded-full border border-mnac-secondary/30 group-hover:border-mnac-accent transition-colors">
                  <User size={20} strokeWidth={2} />
               </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;