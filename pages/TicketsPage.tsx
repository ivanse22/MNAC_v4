import React, { useState, useEffect } from 'react';
import {
  Ticket,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Building2,
  CreditCard,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import Footer from '../components/Footer';
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
  { id: 'general', name: 'Entrada General', price: 12, desc: 'Colección Permanente + Exposiciones Temporales + Mirador' },
  { id: 'reduced', name: 'Entrada Reducida', price: 6, desc: 'Estudiantes, Carnet Jove y grupos culturales' },
  { id: 'free', name: 'Entrada Gratuita', price: 0, desc: 'Menores de 16 años, mayores de 65 y primer domingo de mes' },
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

  const isBuying = tickets.length === 0 || showPurchaseForm;

  return (
    <div className="min-h-screen bg-mnac-bg text-mnac-textPrimary flex flex-col pt-20 pb-24 md:pb-0">
      {/* EDITORIAL HEADER */}
      <section className="px-5 sm:px-6 md:px-12 pt-8 pb-8 border-b border-white/10 max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-mnac-surface border border-white/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-mnac-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary">
                Acceso al Palau Nacional
              </span>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-6xl md:text-7xl text-white leading-none tracking-tight">
              Mis Tickets
            </h1>
            <p className="text-xs sm:text-sm text-mnac-textSecondary mt-2 max-w-xl font-light">
              Gestiona tus entradas digitales para acceder sin colas o consulta cómo adquirirlas en las taquillas del museo.
            </p>
          </div>

          {tickets.length > 0 && !showPurchaseForm && (
            <button
              onClick={() => {
                hapticService.light();
                setShowPurchaseForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-mnac-accent text-white text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform self-start md:self-auto"
            >
              <Plus size={16} /> Comprar otro ticket
            </button>
          )}
        </div>
      </section>

      <main className="flex-grow max-w-[1920px] mx-auto w-full px-5 sm:px-6 md:px-12 py-8 space-y-8">
        {/* ACTIVE TICKETS WALLET */}
        {tickets.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent">
                Entradas Activas ({tickets.length})
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-mnac-surface border border-white/15 rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row"
                >
                  {/* QR Pass Stub */}
                  <div className="sm:w-44 bg-white text-black p-5 flex flex-col items-center justify-center gap-2 shrink-0 border-b sm:border-b-0 sm:border-r border-dashed border-black/20">
                    <QrCode size={92} strokeWidth={1.5} />
                    <span className="font-mono text-[11px] font-bold tracking-wider">{t.id}</span>
                  </div>

                  {/* Ticket Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Válida
                        </span>
                        <button
                          onClick={() => handleRemoveTicket(t.id)}
                          aria-label="Eliminar ticket"
                          className="p-1.5 text-mnac-textSecondary hover:text-mnac-accent transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h3 className="font-serif italic text-2xl text-white">{t.type}</h3>
                      <p className="text-xs text-mnac-textSecondary mt-1">
                        {t.quantity} {t.quantity === 1 ? 'persona' : 'personas'} · {t.price === 0 ? 'Gratuita' : `${t.price}€`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                      <div className="flex items-center gap-2 text-mnac-textPrimary">
                        <Calendar size={14} className="text-mnac-accent shrink-0" />
                        <span>{t.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-mnac-textPrimary">
                        <Clock size={14} className="text-mnac-accent shrink-0" />
                        <span>{t.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE NOTICE WHEN NO TICKETS */}
        {tickets.length === 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-mnac-surface border border-white/10 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-mnac-accent/15 border border-mnac-accent/30 flex items-center justify-center text-mnac-accent shrink-0">
              <Ticket size={20} />
            </div>
            <div>
              <h2 className="font-serif italic text-xl sm:text-2xl text-white">
                Aún no tienes tickets guardados
              </h2>
              <p className="text-xs sm:text-sm text-mnac-textSecondary mt-1 leading-relaxed">
                Puedes comprar tu entrada digital ahora mismo para llevar el código QR en tu móvil, o adquirirla directamente en las taquillas al llegar al museo.
              </p>
            </div>
          </div>
        )}

        {/* TWO CLEAR OPTIONS: ONLINE PURCHASE vs. AT THE MUSEUM */}
        {isBuying && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* OPTION 1: BUY ONLINE */}
            <form
              onSubmit={handleConfirmPurchase}
              className="lg:col-span-7 bg-mnac-surface border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1">
                    Opción 1 · Digital
                  </span>
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
                    Comprar Entrada Online
                  </h2>
                </div>
                {tickets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPurchaseForm(false)}
                    className="text-xs text-mnac-textSecondary hover:text-white"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {/* Tier Selection */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
                  Tipo de Entrada
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
                      className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.99] flex items-center justify-between gap-4 ${
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

              {/* Date, Time & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary mb-2">
                    Fecha de Visita
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-mnac-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-mnac-accent"
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
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
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

              {/* Checkout CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary block">
                    Total a pagar
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

            {/* OPTION 2: BUY AT THE MUSEUM */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-mnac-surface border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1">
                    Opción 2 · Presencial
                  </span>
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
                    Comprar en el Museo
                  </h2>
                  <p className="text-xs sm:text-sm text-mnac-textSecondary mt-2 leading-relaxed">
                    Si prefieres adquirir tu entrada al llegar, puedes comprarla directamente en las taquillas del edificio sin reserva previa (sujeto a aforo).
                  </p>
                </div>

                <div className="space-y-3.5 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-3">
                    <Building2 size={16} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Taquillas del Vestíbulo Principal</p>
                      <p className="text-mnac-textSecondary">Planta 0 · Palau Nacional, Parc de Montjuïc</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Horario de Taquilla</p>
                      <p className="text-mnac-textSecondary">Martes a sábado: 10:00 – 17:30h · Domingos: 10:00 – 14:30h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard size={16} className="text-mnac-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Métodos de Pago</p>
                      <p className="text-mnac-textSecondary">Tarjeta, Apple Pay / Google Pay y efectivo</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/visit/map"
                  onClick={() => hapticService.light()}
                  className="w-full py-3.5 px-5 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white/30 active:scale-95 transition-all"
                >
                  <MapPin size={15} className="text-mnac-accent" /> Ver Ubicación en Mapa
                </Link>
              </div>

              {/* WHAT IS INCLUDED */}
              <div className="bg-mnac-surface border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
                  <Info size={14} className="text-mnac-accent" /> ¿Qué incluye tu entrada?
                </div>
                <ul className="space-y-2 text-xs text-mnac-textSecondary">
                  <li className="flex items-center gap-2">
                    <Sparkles size={12} className="text-mnac-accent shrink-0" /> Acceso a toda la Colección Permanente
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={12} className="text-mnac-accent shrink-0" /> Exposiciones temporales del día
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={12} className="text-mnac-accent shrink-0" /> Acceso a las terrazas del Mirador
                  </li>
                </ul>
                <Link
                  to="/visit"
                  onClick={() => hapticService.light()}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mnac-accent pt-1"
                >
                  Más información de la visita <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer role={userRole} />
    </div>
  );
};

export default TicketsPage;
