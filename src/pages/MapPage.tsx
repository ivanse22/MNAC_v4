
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ZoomIn, ZoomOut, MapPin, X, Layers, Navigation, ChevronRight, Info, Compass, LocateFixed } from 'lucide-react';
import { IMAGES } from '../data/images';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';

interface MapPageProps {
  userRole: UserRole;
}

// Datos de puntos de interés
const MAP_POINTS = [
  // NIVEL 1
  { id: 1, level: 1, cx: 350, cy: 300, title: 'Ábsides Románicos', type: 'Sala 01', image: IMAGES.artworks.pantocrator, desc: 'Pinturas murales originales.' },
  { id: 2, level: 1, cx: 650, cy: 300, title: 'Gótico', type: 'Sala 08', image: IMAGES.artworks.consagracionAgustin, desc: 'Retablos de la baja edad media.' },
  
  // NIVEL 2
  { id: 3, level: 2, cx: 500, cy: 250, title: 'Modernismo', type: 'Sala 15', image: IMAGES.artworks.jovenDecadente, desc: 'Casas, Gaudí y Rusiñol.' },
  { id: 4, level: 2, cx: 500, cy: 450, title: 'Renacimiento', type: 'Sala 12', image: IMAGES.artworks.sanPedroPablo, desc: 'El despertar del humanismo.' },
];

const MapPage: React.FC<MapPageProps> = ({ userRole }) => {
  const [activeLevel, setActiveLevel] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  
  // Center position simulation
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const selectedRoom = MAP_POINTS.find(p => p.id === selectedRoomId);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.8));

  return (
    <div className="h-[100dvh] w-full bg-[#F4F4F0] relative overflow-hidden flex flex-col font-sans text-mnac-dark">
       
       {/* --- MAP VIEWPORT --- */}
       <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#F4F4F0]">
            
            {/* Texture Background (Paper feel) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`}}></div>

            <div 
                className="relative transition-transform duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) touch-none"
                style={{ transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` }}
            >
                {/* SVG MAP CONTAINER - Architectural Style */}
                <div className="w-[800px] h-[600px] relative drop-shadow-xl">
                    
                    <svg viewBox="0 0 1000 700" className="w-full h-full">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E5E5" strokeWidth="1"/>
                            </pattern>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1"/>
                            </filter>
                        </defs>

                        {/* --- LEVEL 1 ARCHITECTURE (ROMÁNICO) --- */}
                        <g 
                            className={`transition-all duration-700 ease-in-out ${activeLevel === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            {/* Building Footprint */}
                            <path 
                                d="M100,200 L300,200 L300,100 L700,100 L700,200 L900,200 L900,500 L700,500 L700,600 L300,600 L300,500 L100,500 Z" 
                                fill="white" 
                                stroke="#333" 
                                strokeWidth="2"
                                filter="url(#shadow)"
                            />
                            
                            {/* Inner Walls / Rooms */}
                            <rect x="320" y="220" width="160" height="160" fill="#F0F0F0" stroke="#DDD" strokeWidth="1" /> {/* Absides */}
                            <rect x="520" y="220" width="160" height="160" fill="#F0F0F0" stroke="#DDD" strokeWidth="1" /> {/* Gótico */}
                            <rect x="320" y="400" width="360" height="80" fill="#E8E8E8" /> {/* Hall Central */}

                            {/* Labels */}
                            <text x="400" y="300" textAnchor="middle" fill="#999" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Románico</text>
                            <text x="600" y="300" textAnchor="middle" fill="#999" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Gótico</text>
                            <text x="500" y="445" textAnchor="middle" fill="#333" fontSize="12" fontWeight="bold" letterSpacing="1">GRAN VESTÍBULO</text>
                        </g>

                        {/* --- LEVEL 2 ARCHITECTURE (MODERNISMO) --- */}
                        <g 
                            className={`transition-all duration-700 ease-in-out ${activeLevel === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            {/* Base Structure */}
                            <path 
                                d="M200,150 L800,150 L800,550 L200,550 Z" 
                                fill="white" 
                                stroke="#333" 
                                strokeWidth="2"
                                filter="url(#shadow)"
                            />
                            
                            {/* Room Areas */}
                            <circle cx="500" cy="350" r="120" fill="#F5F5F5" stroke="#DDD" strokeDasharray="4 2"/> {/* Sala Oval */}
                            <rect x="250" y="200" width="150" height="300" fill="#F0F0F0" stroke="#DDD" />
                            <rect x="600" y="200" width="150" height="300" fill="#F0F0F0" stroke="#DDD" />

                             {/* Labels */}
                            <text x="500" y="355" textAnchor="middle" fill="#333" fontSize="14" fontWeight="bold" letterSpacing="2">SALA OVAL</text>
                            <text x="325" y="250" textAnchor="middle" fill="#999" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Modernismo</text>
                            <text x="675" y="250" textAnchor="middle" fill="#999" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Renacimiento</text>
                        </g>

                        {/* --- INTERACTIVE PINS --- */}
                        {MAP_POINTS.filter(p => p.level === activeLevel).map((point) => {
                            const isSelected = selectedRoomId === point.id;
                            return (
                                <g 
                                    key={point.id} 
                                    className="cursor-pointer group"
                                    onClick={() => setSelectedRoomId(point.id)}
                                >
                                    {/* Ripple */}
                                    <circle cx={point.cx} cy={point.cy} r={isSelected ? 30 : 0} fill="#A6192E" opacity="0.1">
                                        {isSelected && <animate attributeName="r" from="10" to="40" dur="1.5s" repeatCount="indefinite" />}
                                        {isSelected && <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />}
                                    </circle>

                                    {/* Pin Marker */}
                                    <circle 
                                        cx={point.cx} 
                                        cy={point.cy} 
                                        r={isSelected ? 12 : 8} 
                                        fill={isSelected ? "#A6192E" : "#333"} 
                                        stroke="white" 
                                        strokeWidth="2"
                                        className="transition-all duration-300 ease-out shadow-lg"
                                    />
                                    
                                    {/* Label visible only on desktop hover or selected */}
                                    <g className={`transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                        <rect x={point.cx - 50} y={point.cy - 45} width="100" height="24" rx="4" fill="white" stroke="#E5E5E5" />
                                        <text x={point.cx} y={point.cy - 29} textAnchor="middle" fill="#333" fontSize="10" fontWeight="bold">
                                            {point.type}
                                        </text>
                                        <path d={`M${point.cx},${point.cy-21} L${point.cx-4},${point.cy-21} L${point.cx},${point.cy-16} L${point.cx+4},${point.cy-21} Z`} fill="white" />
                                    </g>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
       </div>

       {/* --- TOP HEADER (CLEAN & MOBILE SAFE) --- */}
       <div className="absolute top-0 left-0 w-full p-6 z-20 bg-gradient-to-b from-white/95 via-white/80 to-transparent pt-safe pointer-events-none">
           <div className="max-w-[1920px] mx-auto flex justify-between items-start mt-8 md:mt-0 pointer-events-auto">
               <div>
                   <h1 className="font-sans font-black text-3xl md:text-4xl text-mnac-dark">
                       Mapa del Museo
                   </h1>
                   <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2 flex items-center gap-2">
                       <MapPin size={12} className="text-mnac-red"/> 
                       {activeLevel === 1 ? 'Planta Baja: Medieval' : 'Planta Primera: Moderno'}
                   </p>
               </div>
               
               {/* Quick Info Button */}
               <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-mnac-red">
                   <Info size={20} />
               </button>
           </div>
       </div>

       {/* --- BOTTOM CONTROLS BAR (MOBILE OPTIMIZED) --- */}
       {/* MOVIDO MÁS ARRIBA (bottom-32) para evitar el solapamiento con el dock principal */}
       <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 md:gap-6 bg-white shadow-2xl rounded-full px-6 py-3 border border-gray-100 pb-safe">
           
           {/* Level Switcher */}
           <div className="flex items-center bg-gray-100 rounded-full p-1 relative">
               <div 
                  className={`absolute top-1 bottom-1 w-8 bg-white rounded-full shadow-sm transition-transform duration-300 ${activeLevel === 1 ? 'left-1' : 'left-9'}`}
               ></div>
               <button 
                  onClick={() => setActiveLevel(1)} 
                  className={`relative w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-colors z-10 ${activeLevel === 1 ? 'text-mnac-dark' : 'text-gray-400'}`}
               >
                  L1
               </button>
               <button 
                  onClick={() => setActiveLevel(2)} 
                  className={`relative w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-colors z-10 ${activeLevel === 2 ? 'text-mnac-dark' : 'text-gray-400'}`}
               >
                  L2
               </button>
           </div>

           <div className="w-px h-8 bg-gray-200"></div>

           {/* Zoom Controls */}
           <div className="flex items-center gap-2">
               <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-transform">
                   <ZoomOut size={20} />
               </button>
               <span className="text-[10px] font-mono text-gray-400 w-8 text-center">{Math.round(scale * 100)}%</span>
               <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-transform">
                   <ZoomIn size={20} />
               </button>
           </div>
       </div>

       {/* --- ROOM DETAIL DRAWER (Clean White) --- */}
       <div 
            className={`
                fixed z-30 transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1)
                w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
                bottom-0 left-0 rounded-t-3xl border-t border-gray-100
                md:w-96 md:bottom-8 md:left-8 md:rounded-3xl md:border
                ${selectedRoom ? 'translate-y-0' : 'translate-y-[110%]'}
            `}
       >
           {selectedRoom && (
               <div className="relative p-6 pb-40 md:pb-6"> {/* Padding extra en móvil para salvar el dock */}
                   <button 
                       onClick={() => setSelectedRoomId(null)}
                       className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200"
                   >
                       <X size={16} />
                   </button>

                   <div className="flex gap-4">
                       <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                           <OptimizedImage src={selectedRoom.image} alt={selectedRoom.title} aspectRatio="aspect-square" />
                       </div>
                       <div>
                           <span className="text-mnac-red text-[10px] font-bold uppercase tracking-widest mb-1 block">
                               {selectedRoom.type}
                           </span>
                           <h3 className="font-sans font-bold text-xl text-mnac-dark leading-none mb-2">
                               {selectedRoom.title}
                           </h3>
                           <p className="text-gray-500 text-xs font-light line-clamp-2">
                               {selectedRoom.desc}
                           </p>
                       </div>
                   </div>

                   <div className="mt-6 flex gap-3">
                        <Link 
                            to="/collection"
                            className="flex-1 bg-mnac-dark text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-center hover:bg-mnac-red transition-colors"
                        >
                            Ver Obras
                        </Link>
                        <button className="px-4 py-3 border border-gray-200 rounded-lg hover:border-mnac-dark transition-colors">
                            <Navigation size={16} className="text-mnac-dark"/>
                        </button>
                   </div>
               </div>
           )}
       </div>

    </div>
  );
};

export default MapPage;
