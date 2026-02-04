
import React, { useState, useEffect } from 'react';
import { Badge, UserProgress, LeaderboardEntry, Challenge } from '../types';
import { Award, Lock, Sparkles, MapPin, BookOpen, Star, Crown, Shield, Trophy, X, Share2, Zap, Compass, User, Flame, Hourglass, Feather, Moon, BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';
import { IMAGES } from '../data/images';

interface BadgesPageProps {
  badges?: Badge[];
  progress?: UserProgress;
  leaderboard?: LeaderboardEntry[];
  challenges?: Challenge[];
  setAvatar?: (id: string) => void;
  onShare?: () => void;
}

// Icon Mapping
const getIcon = (name: string, size: number = 24, className: string = "") => {
  const props = { size, className };
  switch (name) {
    case 'MapPin': return <MapPin {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Crown': return <Crown {...props} />;
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Trophy': return <Trophy {...props} />;
    case 'User': return <User {...props} />;
    case 'Flame': return <Flame {...props} />;
    case 'Hourglass': return <Hourglass {...props} />;
    case 'Map': return <MapPin {...props} />; // Map icon
    case 'Feather': return <Feather {...props} />;
    case 'Moon': return <Moon {...props} />;
    case 'BrainCircuit': return <BrainCircuit {...props} />;
    case 'MessageSquare': return <Sparkles {...props} />;
    case 'Search': return <Compass {...props} />;
    // Avatars
    case 'Smile': return <span className="text-xl">😃</span>;
    case 'Heart': return <span className="text-xl">❤️</span>;
    case 'Ghost': return <span className="text-xl">👻</span>;
    case 'Alien': return <span className="text-xl">👽</span>;
    case 'Robot': return <span className="text-xl">🤖</span>;
    default: return <Award {...props} />;
  }
};

const PremiumBadgeVisual = ({ iconName, level, locked, size = 'md' }: { iconName: string, level: string, locked?: boolean, size?: 'sm'|'md'|'lg' }) => {
  const iconSize = size === 'lg' ? 48 : size === 'md' ? 24 : 16;
  const containerSize = size === 'lg' ? 'w-48 h-56' : size === 'md' ? 'w-24 h-28' : 'w-12 h-14';
  
  const getMetalGradient = () => {
    if (locked) return 'bg-gray-800 border-gray-700';
    switch(level) {
      case 'platinum': return 'bg-gradient-to-b from-[#e0e7ff] via-[#6366f1] to-[#312e81] shadow-[0_0_25px_rgba(99,102,241,0.5)]';
      case 'gold': return 'bg-gradient-to-b from-[#F9DF86] via-[#D4AF37] to-[#8a6e18] shadow-[0_0_25px_rgba(212,175,55,0.4)]';
      case 'silver': return 'bg-gradient-to-b from-[#ffffff] via-[#d1d5db] to-[#9ca3af] shadow-[0_0_25px_rgba(255,255,255,0.25)]';
      case 'bronze': return 'bg-gradient-to-b from-[#ffedd5] via-[#fdba74] to-[#c2410c] shadow-[0_0_25px_rgba(234,88,12,0.4)]';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className={`relative ${containerSize} flex items-center justify-center transition-all duration-500`}>
      {/* Base Rim */}
      <div className={`absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] ${getMetalGradient()} p-[3px] md:p-[5px]`}>
          {/* Inner Enamel */}
          <div className={`w-full h-full rounded-[1.8rem] md:rounded-[2.2rem] ${locked ? 'bg-black/80' : 'bg-gradient-to-br from-[#1a1a1a] to-black'} flex flex-col items-center justify-center relative overflow-hidden`}>
              {/* Gloss */}
              <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              {/* God Ray */}
              {!locked && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b ${
                    level === 'gold' ? 'from-yellow-400/20' : level === 'silver' ? 'from-white/10' : level === 'platinum' ? 'from-indigo-500/20' : 'from-orange-500/10'
                } to-transparent blur-xl`}></div>
              )}
              <div className={`relative z-10 ${locked ? '' : 'animate-float'}`}>
                 {getIcon(iconName, iconSize, locked ? 'text-gray-600' : 'text-white drop-shadow-md')}
              </div>
              {locked && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>}
          </div>
      </div>
      {locked && (
          <div className="absolute bottom-[-5px] right-[-5px] bg-[#1a1a1a] rounded-full p-1.5 border border-gray-600 shadow-lg z-20">
             <Lock size={10} className="text-gray-400" />
          </div>
      )}
    </div>
  );
};

const BadgesPage: React.FC<BadgesPageProps> = ({ badges = [], progress, leaderboard = [], challenges = [], setAvatar, onShare }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard' | 'challenges'>('badges');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateProgress(true), 300);
  }, []);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const progressPercent = badges.length > 0 ? (unlockedCount / badges.length) * 100 : 0;
  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  
  // Calculate Streak Fire Intensity
  const streak = progress?.streak || 0;
  const fireOpacity = Math.min(streak * 0.2, 1);

  const handleShare = async () => {
    if (onShare) onShare();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MNAC Experience',
          text: `¡Estoy explorando el MNAC! Nivel ${level} con ${xp} XP y ${unlockedCount} logros desbloqueados.`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-mnac-gold/30 flex flex-col relative overflow-x-hidden">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
          <img src={IMAGES.badges.background} alt="Atmosphere" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <div className="relative z-10 flex-grow flex flex-col">
        
        {/* HEADER AREA */}
        <div className="pt-32 pb-8 px-6 flex flex-col items-center justify-center min-h-[45vh]">
           
           {/* AVATAR SYSTEM */}
           <div className="mb-6 relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <div className="absolute inset-0 bg-mnac-gold/20 rounded-full blur-xl group-hover:bg-mnac-gold/40 transition-all duration-500"></div>
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#2a2a2a] to-black border-2 border-mnac-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center bg-[#111] overflow-hidden">
                    {getIcon(progress?.avatarId || 'User', 48, 'text-mnac-gold')}
                 </div>
                 <div className="absolute -bottom-2 bg-mnac-gold text-[#050505] text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider">
                    Lvl {level}
                 </div>
                 {/* Streak Badge */}
                 {streak > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#050505] shadow-lg animate-pulse" title={`${streak} días de racha`}>
                       <span className="text-[10px] font-bold">{streak}</span>
                       <Flame size={10} className="absolute -top-1 -right-1 text-orange-300" fill="currentColor" />
                    </div>
                 )}
                 <div className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Feather size={12} />
                 </div>
              </div>
           </div>

           <h1 className="font-serif text-5xl md:text-7xl text-white mb-2 text-center drop-shadow-2xl tracking-tight">
             Sala de Tesoros
           </h1>
           
           {/* Progress HUD */}
           <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up">
              <div className="flex justify-between items-end mb-3">
                 <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Rango Actual</span>
                    <span className="text-lg font-serif italic text-white">
                        {level === 1 ? 'Explorador Novato' : level < 5 ? 'Guía del Museo' : 'Curador Maestro'}
                    </span>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-bold text-mnac-gold">{xp}</span>
                    <span className="text-sm text-gray-500 font-medium"> XP Total</span>
                 </div>
              </div>
              <div className="h-4 w-full bg-black/50 rounded-full p-0.5 shadow-inner border border-white/5">
                 <div 
                   className={`h-full bg-gradient-to-r from-mnac-red via-red-400 to-mnac-gold rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-[2000ms] cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden ${animateProgress ? 'w-full' : 'w-0'}`}
                   style={{ width: animateProgress ? `${progressPercent}%` : '0%' }}
                 >
                    <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
                 </div>
              </div>
           </div>

           {/* NAVIGATION TABS */}
           <div className="flex gap-4 mt-8 bg-white/5 p-1 rounded-xl backdrop-blur-md">
              {[
                { id: 'badges', label: 'Logros', icon: Award },
                { id: 'leaderboard', label: 'Ranking', icon: Trophy },
                { id: 'challenges', label: 'Desafíos', icon: Target }
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                      activeTab === tab.id 
                      ? 'bg-mnac-gold text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                   }`}
                 >
                    <tab.icon size={14} /> {tab.label}
                 </button>
              ))}
           </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="flex-grow bg-gradient-to-t from-[#050505] to-transparent pt-8 pb-24 min-h-[40vh]">
           <div className="max-w-4xl mx-auto px-6">
              
              {/* TAB: BADGES */}
              {activeTab === 'badges' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 animate-fade-in">
                     {badges.map((badge, idx) => (
                       <div 
                         key={badge.id} 
                         className="group flex flex-col items-center"
                         style={{ animationDelay: `${idx * 50}ms` }}
                       >
                          <button 
                            onClick={() => setSelectedBadge(badge)}
                            className="relative transition-all duration-300 group-hover:-translate-y-4 group-hover:scale-110 z-10"
                          >
                             <PremiumBadgeVisual 
                                iconName={badge.iconName} 
                                level={badge.level} 
                                locked={!badge.isUnlocked} 
                                size="md"
                             />
                          </button>
                          
                          <div className="mt-6 text-center opacity-80 group-hover:opacity-100 transition-opacity">
                             <h3 className={`font-serif text-lg leading-none mb-2 ${badge.isUnlocked ? 'text-gray-100' : 'text-gray-600'}`}>
                                {badge.title}
                             </h3>
                             {badge.isUnlocked ? (
                                <span className="inline-block px-2 py-0.5 rounded border border-mnac-gold/30 bg-mnac-gold/10 text-[9px] font-bold uppercase tracking-widest text-mnac-gold">
                                   {badge.level}
                                </span>
                             ) : (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700 flex items-center justify-center gap-1">
                                   <Lock size={8} /> Bloqueado
                                </span>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
              )}

              {/* TAB: LEADERBOARD */}
              {activeTab === 'leaderboard' && (
                  <div className="space-y-4 animate-slide-up">
                     <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                           <span>Estudiante</span>
                           <span>XP Total</span>
                        </div>
                        {leaderboard.map((entry) => (
                           <div 
                              key={entry.id} 
                              className={`flex items-center justify-between p-4 border-b border-white/5 last:border-0 transition-colors ${entry.isCurrentUser ? 'bg-mnac-gold/10' : 'hover:bg-white/5'}`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-8 h-8 flex items-center justify-center rounded-full font-serif font-bold italic ${
                                    entry.rank === 1 ? 'bg-yellow-500 text-black' :
                                    entry.rank === 2 ? 'bg-gray-400 text-black' :
                                    entry.rank === 3 ? 'bg-orange-700 text-white' :
                                    'bg-white/10 text-gray-500'
                                 }`}>
                                    {entry.rank}
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                       {getIcon(entry.avatarId, 20, 'text-gray-300')}
                                    </div>
                                    <div>
                                       <span className={`block font-bold ${entry.isCurrentUser ? 'text-mnac-gold' : 'text-gray-200'}`}>
                                          {entry.name} {entry.isCurrentUser && '(Tú)'}
                                       </span>
                                       <span className="text-[10px] text-gray-500 uppercase tracking-wider">Nivel {entry.level}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="font-mono text-mnac-gold font-bold">{entry.xp}</div>
                           </div>
                        ))}
                     </div>
                  </div>
              )}

              {/* TAB: CHALLENGES */}
              {activeTab === 'challenges' && (
                  <div className="space-y-4 animate-slide-up">
                     {challenges.map((challenge) => (
                        <div key={challenge.id} className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10 flex gap-5 items-center group hover:border-mnac-gold/30 transition-colors">
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${challenge.completed ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                              {challenge.completed ? <CheckCircle2 size={24} /> : getIcon(challenge.iconName, 24)}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                 <h4 className={`font-bold ${challenge.completed ? 'text-green-500 line-through' : 'text-white'}`}>{challenge.title}</h4>
                                 <span className="text-mnac-gold text-xs font-mono font-bold">+{challenge.rewardXP} XP</span>
                              </div>
                              <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                              
                              {/* Progress Bar */}
                              <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${challenge.completed ? 'bg-green-500' : 'bg-mnac-gold'}`}
                                    style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                                 ></div>
                              </div>
                              <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                                 <span>Progreso</span>
                                 <span>{challenge.current} / {challenge.target}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
              )}

           </div>
        </div>

        <Footer role="student" />
      </div>

      {/* --- AVATAR MODAL --- */}
      {isAvatarModalOpen && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setIsAvatarModalOpen(false)}>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full animate-pop-in" onClick={e => e.stopPropagation()}>
               <h3 className="text-2xl font-serif text-white mb-6 text-center">Elige tu Avatar</h3>
               <div className="grid grid-cols-4 gap-4 mb-8">
                  {['User', 'Smile', 'Heart', 'Ghost', 'Alien', 'Robot', 'Star', 'Zap'].map(icon => (
                     <button 
                        key={icon}
                        onClick={() => { setAvatar && setAvatar(icon); setIsAvatarModalOpen(false); }}
                        className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${progress?.avatarId === icon ? 'bg-mnac-gold text-black scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/20'}`}
                     >
                        {getIcon(icon, 24)}
                     </button>
                  ))}
               </div>
               <button onClick={() => setIsAvatarModalOpen(false)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-widest">
                  Cancelar
               </button>
            </div>
         </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedBadge(null)}></div>

           <div className="relative w-full max-w-[380px] bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-pop-in flex flex-col items-center">
              
              <div className={`absolute top-0 w-full h-[300px] bg-gradient-to-b ${
                 selectedBadge.level === 'gold' ? 'from-yellow-600/20' : 
                 selectedBadge.level === 'silver' ? 'from-gray-400/20' : 
                 selectedBadge.level === 'platinum' ? 'from-indigo-600/20' : 'from-orange-700/20'
              } to-transparent blur-3xl opacity-50 pointer-events-none`}></div>

              <button onClick={() => setSelectedBadge(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-colors z-20">
                 <X size={24} />
              </button>

              <div className="pt-16 pb-8 relative z-10 scale-150 drop-shadow-2xl">
                 <PremiumBadgeVisual iconName={selectedBadge.iconName} level={selectedBadge.level} locked={!selectedBadge.isUnlocked} size="lg" />
              </div>

              <div className="px-8 pb-10 text-center w-full relative z-10">
                 <h2 className="font-serif italic text-3xl md:text-4xl text-white mb-2 leading-none">{selectedBadge.title}</h2>
                 <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">{selectedBadge.description}</p>

                 {selectedBadge.isUnlocked ? (
                    <div className="space-y-3">
                       <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Recompensa</span>
                          <span className="text-xs text-white font-mono">+{selectedBadge.xpReward} XP</span>
                       </div>
                       <button onClick={handleShare} className="w-full py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-mnac-gold transition-colors flex items-center justify-center gap-2 shadow-lg">
                          <Share2 size={16} /> Compartir Logro
                       </button>
                    </div>
                 ) : (
                    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
                       <p className="text-[10px] text-gray-500 mt-3 font-medium">Continúa explorando para desbloquear.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
