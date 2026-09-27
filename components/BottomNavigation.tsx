
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, ScanLine, Sparkles, User, LayoutGrid, Ticket, Zap, X } from 'lucide-react';
import { hapticService } from '../services/hapticService';
import { UserRole } from '../types';

interface BottomNavigationProps {
  onScan: () => void;
  onChat: () => void;
  role: UserRole;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onScan, onChat, role }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // --- STATE ---
  const [isVisible, setIsVisible] = useState(true);
  const [showScannerMenu, setShowScannerMenu] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const lastScrollY = useRef(0);
  const pressTimer = useRef<any>(null);

  // --- HIDE ON SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at top or if content is short
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determine Direction
      if (currentScrollY > lastScrollY.current + 10) { 
        // Scrolling Down -> Hide
        setIsVisible(false);
        setShowScannerMenu(false); // Close menu on scroll
      } else if (currentScrollY < lastScrollY.current - 20) { 
        // Scrolling Up -> Show
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- ACTIONS ---
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleTabClick = () => {
    hapticService.light();
  };

  // --- LONG PRESS LOGIC FOR SCANNER ---
  const handleScannerPressStart = () => {
    setIsLongPress(false);
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowScannerMenu(true);
      hapticService.medium(); // Stronger feedback for menu open
    }, 600); // 600ms threshold
  };

  const handleScannerPressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    
    if (!isLongPress) {
      // Normal Click
      hapticService.medium();
      onScan();
    }
    // If long press occurred, menu is already open, do nothing else
  };

  // Profile Logic
  const getPersonalSpaceIcon = () => {
    if (role === 'teacher') return <LayoutGrid size={24} />;
    if (role === 'visitor') return <Ticket size={24} />;
    return <User size={24} />;
  };

  const getPersonalSpaceLink = () => {
    if (role === 'teacher') return '/collections';
    if (role === 'visitor') return '/visit#tickets';
    return '/saved';
  };

  if (currentPath === '/welcome' || currentPath.includes('/play')) return null;

  return (
    <>
      {/* --- QUICK ACTION MENU (CONTEXTUAL) --- */}
      <div 
        className={`fixed z-[95] bottom-28 left-1/2 -translate-x-1/2 flex gap-4 transition-all duration-300 ${
          showScannerMenu ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
        }`}
      >
         <button className="flex flex-col items-center gap-2 group" onClick={() => { setShowScannerMenu(false); }}>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl group-active:scale-95 transition-transform">
               <Zap size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">Flash</span>
         </button>
         <button className="flex flex-col items-center gap-2 group" onClick={() => { setShowScannerMenu(false); }}>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl group-active:scale-95 transition-transform">
               <LayoutGrid size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">Código</span>
         </button>
         <button className="flex flex-col items-center gap-2 group" onClick={() => setShowScannerMenu(false)}>
            <div className="w-12 h-12 rounded-full bg-mnac-accent text-white flex items-center justify-center shadow-xl group-active:scale-95 transition-transform">
               <X size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">Cerrar</span>
         </button>
      </div>

      {/* --- MAIN NAVIGATION CAPSULE --- */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-[90] pb-safe pointer-events-none transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isVisible ? 'translate-y-0' : 'translate-y-[120%]'
        }`}
      >
        <div className="relative flex justify-center items-end px-4 pb-6 w-full">
          
          <nav 
            className="relative pointer-events-auto w-full max-w-md h-20 rounded-[2.5rem] flex items-center justify-between px-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-2xl bg-[#121212]/85 overflow-visible"
          >
            
            {/* SVG Mask for the "Concave" Cutout effect in the center */}
            <div 
              className="absolute inset-0 rounded-[2.5rem] pointer-events-none border border-white/5"
              style={{
                // Radial gradient mask creates the "bite" for the button
                WebkitMaskImage: 'radial-gradient(circle at 50% -10px, transparent 38px, black 39px)',
                maskImage: 'radial-gradient(circle at 50% -10px, transparent 38px, black 39px)'
              }}
            >
               {/* Inner Gloss */}
               <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Left Group */}
            <div className="flex-1 flex justify-evenly items-center z-10 pl-2">
              <NavItem 
                to="/" 
                icon={<Home size={24} />} 
                isActive={isActive('/')} 
                onClick={handleTabClick} 
                label="Inicio"
              />
              <NavItem 
                to="/visit" 
                icon={<Map size={24} />} 
                isActive={isActive('/visit')} 
                onClick={handleTabClick} 
                label="Visita"
              />
            </div>

            {/* --- CENTRAL ORBITAL BUTTON --- */}
            <div className="relative w-20 flex justify-center items-center z-20 -top-6">
               {/* The Button */}
               <button
                  onMouseDown={handleScannerPressStart}
                  onMouseUp={handleScannerPressEnd}
                  onTouchStart={handleScannerPressStart}
                  onTouchEnd={handleScannerPressEnd}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group relative active:scale-90"
                  style={{
                    backgroundColor: '#F14A32', // MNAC Vermilion
                    boxShadow: '0 8px 25px rgba(241, 74, 50, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                  }}
                  aria-label="Escanear"
               >
                  <ScanLine size={26} className="text-white relative z-10" strokeWidth={2.5} />
                  
                  {/* Subtle Pulse Ring */}
                  <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20 pointer-events-none"></div>
                  
                  {/* Long Press Indicator Ring */}
                  <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="4" strokeDasharray="300" strokeDashoffset={showScannerMenu ? "0" : "300"} className="transition-all duration-500 ease-out opacity-50" />
                  </svg>
               </button>
            </div>

            {/* Right Group */}
            <div className="flex-1 flex justify-evenly items-center z-10 pr-2">
              <button 
                onClick={() => { hapticService.medium(); onChat(); }}
                className="relative flex flex-col items-center justify-center w-12 h-12 group"
              >
                <div className={`transition-all duration-300 text-mnac-secondary/60 hover:text-mnac-secondary group-active:scale-95`}>
                   <Sparkles size={24} strokeWidth={1.5} />
                </div>
                {/* Notification Dot */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-mnac-accent rounded-full border border-[#121212] hidden"></div>
              </button>

              <NavItem 
                to={getPersonalSpaceLink()} 
                icon={getPersonalSpaceIcon()} 
                isActive={isActive('/saved') || isActive('/collections') || (role === 'visitor' && isActive('/visit'))} 
                onClick={handleTabClick} 
                label="Perfil"
              />
            </div>

          </nav>
        </div>
      </div>
    </>
  );
};

// Sub-component for individual items with "Lava Lamp" glow
const NavItem = ({ to, icon, isActive, onClick, label }: { to: string, icon: React.ReactNode, isActive: boolean, onClick: () => void, label: string }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="relative flex flex-col items-center justify-center w-14 h-14 group"
  >
    {/* Active "Lava Lamp" Glow */}
    <div 
        className={`absolute inset-0 bg-mnac-secondary/10 rounded-2xl blur-md transition-all duration-500 ease-out ${
            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
    ></div>

    <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-mnac-secondary -translate-y-1' : 'text-mnac-secondary/50 group-hover:text-mnac-secondary'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { 
        strokeWidth: isActive ? 2.5 : 1.5
      })}
    </div>
    
    {/* Tiny Label on Active */}
    <span className={`absolute bottom-1 text-[9px] font-bold uppercase tracking-wider text-mnac-secondary transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {label}
    </span>
  </Link>
);

export default BottomNavigation;
