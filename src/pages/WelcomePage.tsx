import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Ticket, GraduationCap, Briefcase, ArrowRight, User, Lock, Loader2, ChevronLeft } from 'lucide-react';

interface WelcomePageProps {
  onSelectRole: (role: UserRole) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onSelectRole }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [loginMode, setLoginMode] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleVisitor = () => {
    setIsLoading(true);
    setTimeout(() => onSelectRole('visitor'), 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => onSelectRole(loginMode || 'student'), 1000);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-mnac-bg text-mnac-secondary overflow-hidden flex flex-col font-sans">
      
      {/* BACKGROUND - New Palette */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('https://www.museunacional.cat/sites/default/files/3142-008_0.jpg')] bg-cover bg-center opacity-30 grayscale"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-mnac-bg/50 via-mnac-bg/80 to-mnac-bg"></div>
      </div>

      {/* SPLASH SCREEN */}
      {showSplash && (
        <div className="absolute inset-0 z-50 bg-mnac-bg flex flex-col items-center justify-center animate-fade-in">
           <h1 className="font-display font-extrabold text-7xl md:text-9xl tracking-tighter text-mnac-secondary mb-4">
             MNAC
           </h1>
           <span className="text-xs font-bold uppercase tracking-[0.3em] text-mnac-accent">
             Museu Nacional
           </span>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* HEADER */}
        <div className={`text-center mb-12 transition-all duration-500 ${loginMode ? 'translate-y-[-20px] opacity-0 h-0 overflow-hidden' : 'translate-y-0'}`}>
            <span className="inline-block mb-6 px-3 py-1 border border-mnac-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-mnac-secondary/80">
              Barcelona
            </span>
            <h1 className="font-display font-semibold text-5xl md:text-6xl mb-4 tracking-tight leading-tight text-mnac-secondary">
              Bienvenido
            </h1>
            <p className="text-mnac-secondary/60 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              Explora mil años de arte. Selecciona tu perfil para comenzar la experiencia.
            </p>
        </div>

        {/* SELECCIÓN DE ROL */}
        {!loginMode ? (
          <div className="w-full space-y-3 animate-slide-up">
             
             {/* BOTÓN VISITANTE - Destacado en Acento */}
             <button 
               onClick={handleVisitor}
               className="w-full bg-mnac-accent text-white p-5 rounded-lg flex items-center justify-between group hover:bg-white hover:text-mnac-bg transition-colors shadow-lg"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-black/10 rounded-full"><Ticket size={20} /></div>
                   <div className="text-left">
                      <span className="block font-bold text-lg leading-none">Visitante</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Entrada General</span>
                   </div>
                </div>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
             </button>

             <div className="py-4 flex items-center gap-4">
                <div className="h-px bg-mnac-secondary/10 flex-1"></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-mnac-secondary/50">Acceso Educativo</span>
                <div className="h-px bg-mnac-secondary/10 flex-1"></div>
             </div>

             {/* BOTONES SECUNDARIOS */}
             <button 
               onClick={() => setLoginMode('student')}
               className="w-full bg-transparent border border-mnac-secondary/10 p-4 rounded-lg flex items-center gap-4 hover:bg-mnac-secondary/5 transition-colors text-left group"
             >
                <div className="text-mnac-secondary/50 group-hover:text-mnac-secondary"><GraduationCap size={20} /></div>
                <div>
                   <span className="block font-bold text-base text-mnac-secondary group-hover:text-white">Estudiante</span>
                </div>
             </button>

             <button 
               onClick={() => setLoginMode('teacher')}
               className="w-full bg-transparent border border-mnac-secondary/10 p-4 rounded-lg flex items-center gap-4 hover:bg-mnac-secondary/5 transition-colors text-left group"
             >
                <div className="text-mnac-secondary/50 group-hover:text-mnac-secondary"><Briefcase size={20} /></div>
                <div>
                   <span className="block font-bold text-base text-mnac-secondary group-hover:text-white">Docente</span>
                </div>
             </button>

          </div>
        ) : (
          /* LOGIN FORM */
          <div className="w-full animate-fade-in">
             <button 
               onClick={() => setLoginMode(null)}
               className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mnac-secondary/50 mb-8 hover:text-mnac-secondary transition-colors"
             >
                <ChevronLeft size={16} /> Volver
             </button>

             <div className="mb-8">
                <h2 className="font-display font-bold text-3xl mb-2 text-mnac-secondary">
                   {loginMode === 'teacher' ? 'Área Docente' : 'Zona Estudiante'}
                </h2>
                <p className="text-mnac-secondary/50 text-sm">Introduce tus credenciales de acceso.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-mnac-secondary/60 ml-1">Email</label>
                   <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-mnac-surface border border-mnac-secondary/10 rounded-lg p-4 pl-10 text-sm text-mnac-secondary focus:outline-none focus:border-mnac-secondary transition-colors placeholder-mnac-secondary/30"
                        placeholder="usuario@mnac.cat"
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mnac-secondary/50" />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-mnac-secondary/60 ml-1">Contraseña</label>
                   <div className="relative">
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-mnac-surface border border-mnac-secondary/10 rounded-lg p-4 pl-10 text-sm text-mnac-secondary focus:outline-none focus:border-mnac-secondary transition-colors placeholder-mnac-secondary/30"
                        placeholder="••••••••"
                      />
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mnac-secondary/50" />
                   </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-mnac-secondary text-mnac-bg font-bold uppercase tracking-widest text-xs py-4 rounded-lg mt-6 hover:bg-white transition-colors flex justify-center"
                >
                   {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Acceder'}
                </button>
             </form>
          </div>
        )}

      </div>
      
      <div className="p-6 text-center">
         <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-mnac-secondary/20">© MNAC 2024</p>
      </div>
    </div>
  );
};

export default WelcomePage;