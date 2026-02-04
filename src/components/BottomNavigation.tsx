import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, ScanLine, Sparkles, User, LayoutGrid, Ticket } from 'lucide-react';
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

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleTabClick = () => {
    hapticService.light();
  };

  const handleActionClick = (action: () => void) => {
    hapticService.medium();
    action();
  };

  if (currentPath === '/welcome' || currentPath.includes('/play')) return null;

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

  return (
    <div className="fixed bottom-0 left-0 w-full z-[90] pb-safe pointer-events-none">
      <div className="relative flex justify-center items-end px-4 pb-6 md:pb-8 w-full">
        
        {/* --- NAVBAR DARK GLASS CAPSULE --- */}
        {/* Updated to #1F1F1F with opacity for Warm Charcoal Glass */}
        <nav 
          className="relative pointer-events-auto w-full max-w-lg h-20 rounded-[2.5rem] flex items-center justify-between px-2 shadow-2xl overflow-visible transition-all duration-300"
          style={{
            backgroundColor: 'rgba(31, 31, 31, 0.90)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px -5px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(209, 204, 191, 0.1)', // Subtle beige inset
            border: '1px solid rgba(209, 204, 191, 0.05)'
          }}
        >
          {/* Left Group */}
          <div className="flex-1 flex justify-evenly items-center z-10 pl-2">
            <NavItem 
              to="/" 
              icon={<Home size={24} />} 
              isActive={isActive('/')} 
              onClick={handleTabClick} 
            />
            <NavItem 
              to="/visit" 
              icon={<Map size={24} />} 
              isActive={isActive('/visit')} 
              onClick={handleTabClick} 
            />
          </div>

          {/* --- CENTRAL FLOATING FAB (ACCENT VERMILION) --- */}
          <div className="relative w-20 flex justify-center items-center z-20 -top-8">
             <button
                onClick={() => handleActionClick(onScan)}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group relative active:scale-95"
                style={{
                  backgroundColor: '#F14A32', // MNAC Accent
                  boxShadow: '0 10px 25px rgba(241, 74, 50, 0.4)',
                  border: '4px solid #1F1F1F' // Cutout effect matching bg
                }}
             >
                {/* Icon inside Red Button */}
                <ScanLine size={24} className="text-white" strokeWidth={2} />
                
                {/* Subtle Pulse Ring */}
                <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"></div>
             </button>
          </div>

          {/* Right Group */}
          <div className="flex-1 flex justify-evenly items-center z-10 pr-2">
            <NavAction 
              icon={<Sparkles size={24} />} 
              onClick={() => handleActionClick(onChat)} 
              isActive={false} 
            />
            <NavItem 
              to={getPersonalSpaceLink()} 
              icon={getPersonalSpaceIcon()} 
              isActive={isActive('/saved') || isActive('/collections') || (role === 'visitor' && isActive('/visit'))} 
              onClick={handleTabClick} 
            />
          </div>

        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, isActive, onClick }: { to: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="relative flex flex-col items-center justify-center w-12 h-12 group"
  >
    <div className={`transition-all duration-300 ${isActive ? 'text-mnac-secondary scale-105' : 'text-mnac-secondary/50 hover:text-mnac-secondary'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { 
        strokeWidth: isActive ? 2 : 1.5
      })}
    </div>
    
    {/* Dot Indicator (Accent) */}
    <div 
      className={`absolute -bottom-1 w-1 h-1 rounded-full bg-mnac-accent transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
    ></div>
  </Link>
);

const NavAction = ({ icon, onClick, isActive }: { icon: React.ReactNode, onClick: () => void, isActive: boolean }) => (
  <button 
    onClick={onClick}
    className="relative flex flex-col items-center justify-center w-12 h-12 group"
  >
    <div className={`transition-all duration-300 ${isActive ? 'text-mnac-secondary' : 'text-mnac-secondary/50 hover:text-mnac-secondary'}`}>
       {React.cloneElement(icon as React.ReactElement<any>, { 
        strokeWidth: isActive ? 2 : 1.5
      })}
    </div>
  </button>
);

export default BottomNavigation;