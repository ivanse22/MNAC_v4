import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
  Building2,
  CreditCard,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';
import { IMAGES } from '../data/images';
import { hapticService } from '../services/hapticService';

interface TicketsPageProps {
  userRole: UserRole;
}

interface VisitorTicket {
  id: string;
  type: string;
  price: number;
  date: string;
  timeSlot: string;
  quantity: number;
  holder: string;
  purchasedAt: string;
}

const TICKET_TIERS = [
  { id: 'general', name: 'Entrada General', price: 12, desc: 'Colección Permanente + Exposiciones + Mirador' },
  { id: 'reduced', name: 'Entrada Reducida', price: 6, desc: 'Estudiantes, Carnet Jove y grupos culturales' },
  { id: 'free', name: 'Entrada Gratuita', price: 0, desc: 'Menores de 16, mayores de 65 y primer domingo de mes' },
];

const TIME_SLOTS = ['10:00h', '12:00h', '14:00h', '16:00h'];
const STORAGE_KEY = 'mnac_visitor_tickets';

const TicketsPage: React.FC<TicketsPageProps> = ({ userRole }) => {
  const [tickets, setTickets] = useState<VisitorTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'online' | 'museum'>('online');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('general');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('12:00h');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // Ignore storage quota errors
    }
  }, [tickets]);

  const selectedTier = TICKET_TIERS.find((t) => t.id === selectedTierId) || TICKET_TIERS[0];

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    hapticService.success();
    const newTicket: VisitorTicket = {
      id: `MNAC-${Math.floor(100000 + Math.random() * 900000)}`,
      type: selectedTier.name,
      price: selectedTier.price * quantity,
      date: selectedDate,
      timeSlot: selectedTime,
      quantity,
      holder: 'Visitante MNAC',
      purchasedAt: new Date().toISOString()
    };
    setTickets((prev) => [newTicket, ...prev]);
    setShowPurchaseForm(false);
  };

  const handleRemoveTicket = (id: string) => {
    hapticService.light();
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const hasTickets = tickets.length > 0;
  const showAcquisitionMode = !hasTickets || showPurchaseForm;

  return (
    <div className="min-h-screen bg-mnac-bg text-mnac-textPrimary flex flex-col pb-24 md:pb-0">
      {/* MODE A: EDITORIAL HERO WITH IMAGERY (WHEN NO TICKETS YET) */}
      {!hasTickets && (
        <section className="relative w-full h-[42vh] md:h-[50vh] flex flex-col justify-end p-5 sm:p-6 md:p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={IMAGES.visit.hero}
              alt="Palau Nacional MNAC"
              priority={true}
              aspectRatio="h-full w-full"
              className="opacity-65 scale-105 animate-scale-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1920px] w-full mx-auto animate-slide-up">
            <div className="border-b border-mnac-divider pb-5 md:pb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-mnac-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary">
                  Acceso al Palau Nacional
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif italic leading-none text-white tracking-tight">
                Mis Tickets
              </h1>
            </div>
            <p className="pt-3.5 text-[11px] sm:text-xs font-medium text-mnac-textSecondary tracking-wide">
              Incluye Colección Permanente · Exposiciones Temporales · Mirador 360°
            </p>
          </div>
        </section>
      )}

      {/* MODE B: COMPACT TYPOGRAPHIC HEADER (WHEN ACTIVE TICKETS EXIST SO WALLET PASS SHINES) */}
      {hasTickets && (
        <section className="pt-24 md:pt-28 px-5 sm:px-6 md:px-12 pb-6 border-b border-white/10 max-w-[1920px] mx-auto w-full">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1.5">
                Wallet Digital · {tickets.length} {tickets.length === 1 ? 'entrada' : 'entradas'}
              </span>
              <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-white leading-none tracking-tight">
                Mis Tickets
              </h1>
            </div>

            <button
              onClick={() => {
                hapticService.light();
                setShowPurchaseForm(!showPurchaseForm);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-mnac-accent text-white text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform shrink-0"
            >
              {showPurchaseForm ? (
                <>
                  <X size={14} /> Cerrar
                </>
              ) : (
                <>
                  <Plus size={14} /> Añadir
                </>
              )}
            </button>
          </div>
        </section>
      )}

      <main className="flex-grow max-w-[1920px] mx-auto w-full px-5 sm:px-6 md:px-12 py-6 md:py-10 space-y-8">
        {/* WALLET DIGITAL PASSES (ONLY WHEN USER HAS TICKETS AND NOT ADDING MORE) */}
        {hasTickets && !showPurchaseForm && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-mnac-surface border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Top Artwork Watermark Header */}
                <div className="relative h-36 overflow-hidden">
                  <OptimizedImage
                    src="/artworks/art-0.jpg"
                    alt="Pase MNAC"
                    aspectRatio="h-full w-full"
                    className="opacity-55 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mnac-surface via-mnac-surface/50 to-black/40" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Válida
                    </span>
                    <button
                      onClick={() => handleRemoveTicket(t.id)}
                      aria-label="Eliminar ticket"
                      className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-mnac-accent active:scale-95 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-5 right-5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mnac-accent block">
                      Museu Nacional d'Art de Catalunya
                    </span>
                    <h2 className="font-serif italic text-2xl text-white leading-tight">
                      {t.type}
                    </h2>
                  </div>
                </div>

                {/* Middle Ticket Info */}
                <div className="px-5 py-4 grid grid-cols-3 gap-2 border-b border-dashed border-white/15 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-mnac-textSecondary block mb-0.5">
                      Fecha
                    </span>
                    <span className="font-semibold text-white">{t.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-mnac-textSecondary block mb-0.5">
                      Acceso
                    </span>
                    <span className="font-semibold text-white">{t.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-mnac-textSecondary block mb-0.5">
                      Visitantes
                    </span>
                    <span className="font-semibold text-white">
                      {t.quantity} · {t.price === 0 ? 'Gratis' : `${t.price}€`}
                    </span>
                  </div>
                </div>

                {/* Perforated QR Footer */}
                <div className="p-5 bg-white text-black flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/50 block mb-1">
                      Código de Acceso
                    </span>
                    <span className="font-mono text-sm font-bold tracking-wider block">
                      {t.id}
                    </span>
                    <span className="text-[11px] text-black/60 block mt-1">
                      Muestra este QR en el torno
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-black/10 shrink-0">
                    <QrCode size={76} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ACQUISITION FLOW WITH CLEAN SEGMENTED TABS */}
        {showAcquisitionMode && (
          <section className="max-w-2xl mx-auto w-full space-y-6 animate-fade-in">
            {/* Segmented Pill Tabs */}
            <div className="grid grid-cols-2 p-1.5 rounded-full bg-mnac-surface border border-white/10">
              <button
                type="button"
                onClick={() => {
                  hapticService.light();
                  setActiveTab('online');
                }}
                className={`py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'online'
                    ? 'bg-mnac-accent text-white shadow-lg'
                    : 'text-mnac-textSecondary hover:text-white'
                }`}
              >
                Comprar Online
              </button>
              <button
                type="button"
                onClick={() => {
                  hapticService.light();
                  setActiveTab('museum');
                }}
                className={`py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'museum'
                    ? 'bg-mnac-accent text-white shadow-lg'
                    : 'text-mnac-textSecondary hover:text-white'
                }`}
              >
                En Taquilla
              </button>
            </div>

            {/* TAB 1: BUY ONLINE */}
            {activeTab === 'online' && (
              <form
                onSubmit={handleConfirmPurchase}
                className="bg-mnac-surface border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6"
              >
                <div>
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
                    Entrada Digital Inmediata
                  </h2>
                  <p className="text-xs text-mnac-textSecondary mt-1">
                    Recibe tu código QR al instante para acceder directamente a las salas.
                  </p>
                </div>

                {/* Tier Selection */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
                    Tarifa
                  </label>
                  {TICKET_TIERS.map((tier) => {
                    const active = selectedTierId === tier.id;
                    return (
                      <button
                        type="button"
                        key={tier.id}
                        onClick={() => {
                          hapticService.light();
                          setSelectedTierId(tier.id);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.99] flex items-center justify-between gap-4 ${
                          active
                            ? 'bg-mnac-accent/15 border-mnac-accent text-white'
                            : 'bg-mnac-bg/60 border-white/10 text-mnac-textPrimary hover:border-white/25'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm text-white">{tier.name}</p>
                          <p className="text-[11px] text-mnac-textSecondary mt-0.5">{tier.desc}</p>
                        </div>
                        <span className="font-serif italic text-xl text-white shrink-0">
                          {tier.price === 0 ? 'Gratis' : `${tier.price}€`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Date & Persons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-mnac-bg border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-mnac-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary mb-2">
                      Personas
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => {
                            hapticService.light();
                            setQuantity(num);
                          }}
                          className={`flex-1 py-3 rounded-2xl text-xs font-bold border active:scale-95 transition-all ${
                            quantity === num
                              ? 'bg-mnac-accent border-mnac-accent text-white'
                              : 'bg-mnac-bg border-white/10 text-mnac-textSecondary hover:text-white'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary mb-2">
                    Franja Horaria
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          hapticService.light();
                          setSelectedTime(slot);
                        }}
                        className={`py-2.5 rounded-full text-xs font-bold border active:scale-95 transition-all ${
                          selectedTime === slot
                            ? 'bg-white text-black border-white'
                            : 'bg-mnac-bg border-white/10 text-mnac-textSecondary hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary block">
                      Total
                    </span>
                    <span className="font-serif italic text-3xl text-white">
                      {selectedTier.price * quantity === 0 ? 'Gratis' : `${selectedTier.price * quantity}€`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-4 rounded-full bg-mnac-accent text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-transform shadow-lg"
                  >
                    <CreditCard size={16} /> Obtener Ticket Digital
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: BUY AT THE MUSEUM */}
            {activeTab === 'museum' && (
              <div className="bg-mnac-surface border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
                    Taquillas del Museo
                  </h2>
                  <p className="text-xs sm:text-sm text-mnac-textSecondary mt-1.5 leading-relaxed">
                    También puedes adquirir tus entradas presencialmente al llegar al Palau Nacional (sujeto a disponibilidad de aforo).
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/10 text-xs sm:text-sm">
                  <div className="flex items-start gap-3.5">
                    <Building2 size={18} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Vestíbulo Principal · Planta 0</p>
                      <p className="text-mnac-textSecondary text-xs mt-0.5">Palau Nacional, Parc de Montjuïc, Barcelona</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock size={18} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Horario de Taquilla</p>
                      <p className="text-mnac-textSecondary text-xs mt-0.5">Martes a sábado: 10:00 – 17:30h · Domingos: 10:00 – 14:30h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <CreditCard size={18} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Métodos de Pago</p>
                      <p className="text-mnac-textSecondary text-xs mt-0.5">Tarjeta, Apple Pay / Google Pay y efectivo</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/visit/map"
                  onClick={() => hapticService.light()}
                  className="w-full py-4 px-5 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white/30 active:scale-95 transition-all"
                >
                  <MapPin size={16} className="text-mnac-accent" /> Ver Ubicación en Mapa
                </Link>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer role={userRole} />
    </div>
  );
};

export default TicketsPage;
