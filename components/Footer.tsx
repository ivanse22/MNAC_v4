
import React from 'react';
import { UserRole } from '../types';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Clock, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  role: UserRole;
}

const Footer: React.FC<FooterProps> = ({ role }) => {
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-8 snap-start">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* COLUMNA 1: IDENTIDAD */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <span className="font-sans font-black text-3xl tracking-tighter">MNAC</span>
            </Link>
            <div className="space-y-4 text-sm text-gray-400 font-light">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-mnac-red" />
                <p>Palau Nacional, Parc de Montjuïc<br/>08038 Barcelona</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 text-mnac-red" />
                <p>Mar - Sáb: 10h - 18h<br/>Dom y Festivos: 10h - 15h</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-mnac-red" />
                <a href="mailto:info@mnac.cat" className="hover:text-white transition-colors">info@mnac.cat</a>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: CONTENIDO ESPECÍFICO (ROL) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-mnac-gold mb-6">
              {role === 'teacher' ? 'Área Educativa' : 'Zona Joven'}
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 font-light">
              {role === 'teacher' ? (
                <>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Programa Escolar 2024</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Centro de Investigación</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Reservas para Grupos</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Maletas Pedagógicas</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Formación Docente</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Quiz de Selectividad</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Audioguía Interactiva</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Top 10 Obras Clave</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Descarga la App</Link></li>
                  <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Descuentos Carnet Jove</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* COLUMNA 3: EXPLORAR */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Museo</h4>
            <ul className="space-y-3 text-sm text-gray-300 font-light">
              <li><Link to="/collection" className="hover:text-white hover:pl-2 transition-all">La Colección</Link></li>
              <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Comprar Entradas</Link></li>
              <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Tienda Online</Link></li>
              <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Amics del Museu</Link></li>
              <li><Link to="#" className="hover:text-white hover:pl-2 transition-all">Accesibilidad</Link></li>
            </ul>
          </div>

          {/* COLUMNA 4: NEWSLETTER */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Mantente al día</h4>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Recibe las últimas noticias de exposiciones y actividades {role === 'teacher' ? 'educativas' : 'culturales'}.
            </p>
            <div className="flex border-b border-gray-700 pb-2 mb-8 group focus-within:border-mnac-gold transition-colors">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 text-sm"
              />
              <button className="text-gray-400 group-focus-within:text-white hover:text-mnac-red transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
                <Twitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
                <Facebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
                <Youtube size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400">Aviso Legal</a>
            <a href="#" className="hover:text-gray-400">Política de Privacidad</a>
            <a href="#" className="hover:text-gray-400">Cookies</a>
          </div>
          <p>© {new Date().getFullYear()} Museu Nacional d'Art de Catalunya</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
