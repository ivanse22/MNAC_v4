
import React from 'react';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import { Search } from 'lucide-react';
import { ARTWORKS_DATA } from '../data/artworks';

interface AuthorsPageProps {
  userRole: UserRole;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ userRole }) => {
  const uniqueAuthors = Array.from(new Set(ARTWORKS_DATA.map(a => a.artist))).sort();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen bg-mnac-bg pt-24 flex flex-col text-mnac-textPrimary">
       <div className="bg-mnac-surface border-b border-white/10 py-16 px-6 md:px-12 mb-12">
          <div className="max-w-[1920px] mx-auto">
             <h1 className="font-serif italic text-5xl md:text-6xl mb-6 text-white">
                 {userRole === 'teacher' ? 'Índice de Artistas' : 'Grandes Maestros'}
             </h1>
             <div className="relative max-w-xl">
                 <input 
                    type="text" 
                    placeholder="Buscar artista..." 
                    className="w-full bg-black/20 border border-white/10 p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-mnac-accent rounded-sm transition-colors"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
             </div>
          </div>
       </div>

       <div className="flex-grow max-w-[1920px] mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row gap-12 mb-20">
           
           {/* Alphabet Sidebar */}
           <div className="hidden md:flex flex-col gap-1 sticky top-32 h-fit">
               {alphabet.map(letter => (
                   <button key={letter} className="w-8 h-8 text-xs font-bold text-gray-500 hover:text-mnac-accent hover:bg-white/5 rounded transition-colors">
                       {letter}
                   </button>
               ))}
           </div>

           {/* Grid */}
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {uniqueAuthors.map(author => (
                   <div key={author} className="border border-white/10 bg-mnac-surface p-8 hover:border-mnac-accent/50 transition-all group cursor-pointer">
                       <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-mnac-accent transition-colors">{author}</h3>
                       <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                           {ARTWORKS_DATA.filter(a => a.artist === author).length} Obras en colección
                       </p>
                       <div className="flex gap-2">
                           {ARTWORKS_DATA.filter(a => a.artist === author).slice(0,3).map(art => (
                               <img key={art.id} src={art.imageUrl} className="w-12 h-12 object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all rounded-sm" alt=""/>
                           ))}
                       </div>
                   </div>
               ))}
           </div>
       </div>
       <Footer role={userRole} />
    </div>
  );
};

export default AuthorsPage;
