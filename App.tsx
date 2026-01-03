
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Booking, Service, VehicleSize, BookingStatus, Review, LoyaltyLevel } from './types';
import { SERVICES, TIME_SLOTS, WHATSAPP_NUMBER, CONFIG, LOYALTY_LEVELS, CATEGORIES } from './constants';
import { getCarCareAdvice, getQuizRecommendation, askSpecialist } from './geminiService';

// --- Icons ---
const CarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;
const PlusIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const ChatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ReviewsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;

const StarIcon = ({ filled, onClick, className = "w-5 h-5" }: { filled: boolean; onClick?: () => void; className?: string; key?: React.Key }) => (
  <svg 
    onClick={onClick}
    className={`${className} ${filled ? 'text-yellow-400' : 'text-slate-200'} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`} 
    fill={filled ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// --- Quiz Questions ---
const QUIZ_QUESTIONS = [
  { id: 'q1', text: 'Como está o brilho da pintura?', options: ['Brilhando como novo', 'Um pouco opaca', 'Sem brilho nenhum', 'Com riscos e manchas de chuva ácida'] },
  { id: 'q2', text: 'Qual o estado dos bancos internos?', options: ['Limpos e cheirosos', 'Apenas poeira superficial', 'Manchas visíveis de comida/suor', 'Couro ressecado ou tecido com encardido'] },
  { id: 'q3', text: 'Como está a limpeza sob o capô (Motor)?', options: ['Limpo e revisado', 'Poeira normal de uso', 'Muita sujeira, graxa ou óleo', 'Nunca realizei limpeza técnica'] },
  { id: 'q4', text: 'Como está a visibilidade nos vidros em dias de chuva?', options: ['Perfeita, a água escorre', 'A água acumula e atrapalha', 'Vidros com manchas esbranquiçadas', 'Embaça com muita facilidade'] },
  { id: 'q5', text: 'Qual o aspecto visual dos seus faróis?', options: ['Cristalinos e transparentes', 'Começando a amarelar nas bordas', 'Bem amarelados e feios', 'Totalmente foscos/opacos (perda de luz)'] },
  { id: 'q6', text: 'Como estão os plásticos pretos externos (parachoques/frisos)?', options: ['Pretos e hidratados', 'Um pouco cinzas/desbotados', 'Muito ressecados e brancos', 'Com manchas de cera ou polimento'] },
  { id: 'q7', text: 'Qual o cheiro predominante dentro do carro?', options: ['Neutro ou fragrância agradável', 'Cheiro de poeira acumulada', 'Odor de mofo ou umidade', 'Cheiro forte de cigarro ou pets'] },
];

interface ChatMessage {
  role: 'user' | 'specialist';
  text: string;
}

export default function App() {
  // --- State ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('duocar_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('duocar_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('duocar_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [view, setView] = useState<'home' | 'booking' | 'profile' | 'admin' | 'quiz' | 'history' | 'reviews'>('home');
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // --- Q&A Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Review State ---
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [isSelectingToReview, setIsSelectingToReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // --- Registration State ---
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPlate, setRegPlate] = useState("");
  const [regModel, setRegModel] = useState("");
  const [regSize, setRegSize] = useState<VehicleSize>("Médio");

  // --- Booking Selection State ---
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  // --- Auto-Scroll Chat ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- Health Decay Logic ---
  useEffect(() => {
    if (user && user.role === 'cliente') {
      const lastUpdate = localStorage.getItem('duocar_last_decay_check');
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      if (lastUpdate) {
        const diffDays = Math.floor((now - parseInt(lastUpdate)) / oneDay);
        if (diffDays > 0) {
          const decay = diffDays * 0.5; 
          const newScore = Math.max(0, user.healthScore - decay);
          const updatedUser = { ...user, healthScore: newScore };
          setUser(updatedUser);
          localStorage.setItem('duocar_user', JSON.stringify(updatedUser));
        }
      }
      localStorage.setItem('duocar_last_decay_check', now.toString());
    }
  }, [user?.id]);

  // --- Persistence ---
  useEffect(() => {
    if (user) localStorage.setItem('duocar_user', JSON.stringify(user));
    localStorage.setItem('duocar_bookings', JSON.stringify(bookings));
    localStorage.setItem('duocar_reviews', JSON.stringify(reviews));
  }, [user, bookings, reviews]);

  // --- Derived State ---
  const userLoyalty = useMemo(() => {
    if (!user) return LOYALTY_LEVELS[0];
    const completedCount = bookings.filter(b => b.userId === user.id && b.status === 'Concluído').length;
    return [...LOYALTY_LEVELS].reverse().find(l => completedCount >= l.required) || LOYALTY_LEVELS[0];
  }, [user, bookings]);

  const nextLoyaltyLevel = useMemo(() => {
    const currentIndex = LOYALTY_LEVELS.findIndex(l => l.name === userLoyalty.name);
    return LOYALTY_LEVELS[currentIndex + 1] || null;
  }, [userLoyalty]);

  const completedCount = bookings.filter(b => user && b.userId === user.id && b.status === 'Concluído').length;

  const unreviewedBookings = useMemo(() => {
    if (!user) return [];
    return bookings.filter(b => 
      b.userId === user.id && 
      b.status === 'Concluído' && 
      !reviews.some(r => r.bookingId === b.id)
    );
  }, [user, bookings, reviews]);

  // --- AI Logic ---
  const fetchAdvice = useCallback(async () => {
    if (user && !aiAdvice) {
      setLoading(true);
      const advice = await getCarCareAdvice(user);
      setAiAdvice(advice);
      setLoading(false);
    }
  }, [user, aiAdvice]);

  useEffect(() => {
    if (user && view === 'home') fetchAdvice();
  }, [user, view, fetchAdvice]);

  // --- Handlers ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const isSpecial = regPhone === '0000' || regName.toLowerCase() === 'admin';
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      phone: regPhone,
      vehiclePlate: regPlate,
      vehicleModel: regModel,
      vehicleSize: regSize,
      healthScore: 10, // Atualizado de 85 para 10 conforme pedido
      role: isSpecial ? 'admin' : 'cliente'
    };
    setUser(newUser);
    setView('home');
  };

  const handleBooking = () => {
    if (!user || !selectedService || !bookingDate || !bookingTime) return;

    let basePrice = selectedService.price[user.vehicleSize];
    let finalPrice = basePrice;
    if (userLoyalty.name === 'Diamante') {
      finalPrice = basePrice * 0.9;
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      vehiclePlate: user.vehiclePlate,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: bookingDate,
      time: bookingTime,
      status: 'Agendado',
      price: finalPrice,
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setView('history');
    
    const msg = `Olá Duocar! Agendei pelo app:\nServiço: ${newBooking.serviceName}\nData: ${newBooking.date} às ${newBooking.time}\nVeículo: ${user.vehicleModel}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        if (status === 'Concluído' && b.status !== 'Concluído') {
          const service = SERVICES.find(s => s.id === b.serviceId);
          if (user && user.id === b.userId) {
            const newScore = Math.min(100, user.healthScore + (service?.healthImpact || 0));
            setUser({ ...user, healthScore: newScore, lastServiceDate: new Date().toISOString() });
          }
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const bookThisService = (serviceName: string) => {
    const service = SERVICES.find(s => s.name === serviceName);
    if (service) {
      setSelectedCategory(service.category);
      setSelectedService(service);
      setView('booking');
    }
  };

  const handleQuizAnswer = (option: string) => {
    const currentQ = QUIZ_QUESTIONS[quizStep];
    const newAnswers = { ...quizAnswers, [currentQ.text]: option };
    setQuizAnswers(newAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      processQuiz(newAnswers);
    }
  };

  const processQuiz = async (answers: Record<string, string>) => {
    setLoading(true);
    const recommendation = await getQuizRecommendation(user!, answers);
    setQuizResult(recommendation);
    setLoading(false);
  };

  const handleAskSpecialist = async () => {
    if (!chatInput.trim() || !user) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const answer = await askSpecialist(user, userMsg);
    setChatMessages(prev => [...prev, { role: 'specialist', text: answer }]);
    setLoading(false);
  };

  const submitReview = () => {
    if (!reviewingBooking || !user) return;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      bookingId: reviewingBooking.id,
      userId: user.id,
      userName: user.name,
      serviceName: reviewingBooking.serviceName,
      rating,
      comment,
      date: new Date().toISOString()
    };
    setReviews([newReview, ...reviews]);
    setReviewingBooking(null);
    setRating(5);
    setComment("");
    setView('reviews');
  };

  const logout = () => {
    localStorage.removeItem('duocar_user');
    setUser(null);
    setView('home');
  };

  // --- Main Render Logic ---

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-emerald-100 rounded-2xl mb-4 animate-bounce-slow">
              <CarIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Duocar Estética</h1>
            <p className="text-slate-500 text-sm">Cuidando do seu patrimônio com IA.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input required placeholder="Nome Completo" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={regName} onChange={e => setRegName(e.target.value)} />
            <input required placeholder="WhatsApp" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Modelo" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={regModel} onChange={e => setRegModel(e.target.value)} />
              <input required placeholder="Placa" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={regPlate} onChange={e => setRegPlate(e.target.value)} />
            </div>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white" value={regSize} onChange={e => setRegSize(e.target.value as VehicleSize)}>
              <option value="Pequeno">Porte Pequeno</option>
              <option value="Médio">Porte Médio</option>
              <option value="Grande">Porte Grande / SUV</option>
            </select>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
              Entrar na Duocar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <h2 onClick={() => setView('home')} className="text-xl font-bold text-slate-900 flex items-center gap-2 cursor-pointer">
          <span className="text-emerald-500"><CarIcon /></span> Duocar
        </h2>
        <div className="flex items-center gap-3">
          {user.role === 'admin' && <button onClick={() => setView('admin')} className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider">Painel Admin</button>}
          <button onClick={() => setView('profile')} className="p-2 bg-slate-100 rounded-full hover:bg-emerald-50 transition-colors"><UserIcon /></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        
        {view === 'home' && (
          <div className="animate-fade-in space-y-6">
            {/* Health Score */}
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Saúde: {user.vehicleModel}</h3>
                  <p className="text-xs text-slate-400">Placa: {user.vehiclePlate}</p>
                </div>
                <span className={`text-4xl font-black ${user.healthScore > 70 ? 'text-emerald-500' : user.healthScore > 40 ? 'text-orange-400' : 'text-rose-500'}`}>
                  {Math.round(user.healthScore)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${user.healthScore > 70 ? 'bg-emerald-500' : user.healthScore > 40 ? 'bg-orange-400' : 'bg-rose-500'}`} style={{ width: `${user.healthScore}%` }}></div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setView('booking')} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-600 transition-all active:scale-95">Agendar Agora</button>
                <button onClick={() => { setQuizStep(0); setQuizResult(null); setView('quiz'); }} className="flex-1 border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50">Diagnóstico IA</button>
              </div>
            </div>

            {/* Loyalty */}
            <div className="bg-slate-900 text-white p-7 rounded-3xl shadow-xl">
              <div className="flex justify-between mb-6">
                <div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Programa Fidelidade</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{userLoyalty.icon}</span>
                    <span className={`text-xl font-bold ${userLoyalty.color}`}>{userLoyalty.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Concluídos</p>
                  <p className="text-3xl font-black">{completedCount}</p>
                </div>
              </div>
              {nextLoyaltyLevel && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Progresso para {nextLoyaltyLevel.name}</span>
                    <span>{completedCount} / {nextLoyaltyLevel.required}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(completedCount / nextLoyaltyLevel.required) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Specialist */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4 animate-fade-in">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><SparklesIcon /></div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-emerald-900">Especialista Duocar AI</h4>
                  <p className="text-emerald-800 text-sm italic">"{aiAdvice || "Avaliando as melhores opções para você..."}"</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(true)} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">
                <ChatIcon /> Tirar Dúvida com IA
              </button>
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Diagnóstico Inteligente</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              {quizResult ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-6 rounded-2xl text-emerald-900 text-sm italic leading-relaxed font-medium">"{quizResult}"</div>
                  <button onClick={() => setView('booking')} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold">Verificar Horários</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Pergunta {quizStep + 1} de {QUIZ_QUESTIONS.length}</span>
                    <span>{Math.round(((quizStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{QUIZ_QUESTIONS[quizStep].text}</h3>
                  <div className="grid gap-3">
                    {QUIZ_QUESTIONS[quizStep].options.map(option => (
                      <button key={option} onClick={() => handleQuizAnswer(option)} className="p-4 rounded-2xl bg-slate-50 text-left text-sm font-bold border-2 border-transparent hover:border-emerald-500 hover:bg-emerald-50 transition-all">{option}</button>
                    ))}
                  </div>
                </div>
              )}
              {loading && <p className="text-center mt-6 text-emerald-500 animate-pulse font-bold text-sm">IA analisando os dados...</p>}
            </div>
          </div>
        )}

        {view === 'booking' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Novo Agendamento</h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">1. Escolha a Categoria</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedService(null); }} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">2. Selecione o Serviço</label>
                <div className="grid gap-3">
                  {SERVICES.filter(s => s.category === selectedCategory).map(service => (
                    <button key={service.id} onClick={() => setSelectedService(service)} className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedService?.id === service.id ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-50' : 'border-slate-50 bg-slate-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{service.name}</span>
                        <span className="text-emerald-600 font-black">R$ {service.price[user.vehicleSize]}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Impacto na Saúde: +{service.healthImpact}%</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">3. Data</label>
                  <input type="date" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">4. Horário</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(time => (
                      <button key={time} onClick={() => setBookingTime(time)} className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${bookingTime === time ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-transparent text-slate-600'}`}>{time}</button>
                    ))}
                  </div>
                </div>
              </div>
              {selectedService && (
                <div className="bg-slate-900 text-white p-6 rounded-3xl mt-4 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Valor Total</p>
                      <span className="text-3xl font-black text-emerald-400">R$ {userLoyalty.name === 'Diamante' ? (selectedService.price[user.vehicleSize] * 0.9).toFixed(2) : selectedService.price[user.vehicleSize]}</span>
                    </div>
                    {userLoyalty.name === 'Diamante' && <span className="bg-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase">10% OFF Fidelidade</span>}
                  </div>
                  <button disabled={!bookingDate || !bookingTime} onClick={handleBooking} className="w-full bg-emerald-500 py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-600 disabled:opacity-50 transition-all active:scale-95">Finalizar Agendamento</button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Minha Jornada</h2>
            <div className="space-y-4">
              {bookings.filter(b => b.userId === user.id).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-sm">Nenhum serviço agendado ainda.</p>
                </div>
              ) : (
                bookings.filter(b => b.userId === user.id).map(booking => (
                  <div key={booking.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.date} • {booking.time}</p>
                        <h4 className="font-bold text-slate-900">{booking.serviceName}</h4>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${booking.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'Agendado' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.status === 'Concluído' && !reviews.find(r => r.bookingId === booking.id) && (
                      <button onClick={() => setReviewingBooking(booking)} className="w-full border-2 border-emerald-500 text-emerald-600 py-3 rounded-2xl text-xs font-bold hover:bg-emerald-50 transition-all">Avaliar este Serviço</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'reviews' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-4">
               <h2 className="text-2xl font-bold">Sua opinião vale ouro!</h2>
               <p className="text-slate-400 text-sm">Ajude a comunidade a cuidar melhor de seus veículos compartilhando sua experiência na Duocar.</p>
               <button 
                onClick={() => setIsSelectingToReview(true)}
                className="bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 transition-all active:scale-95"
              >
                Avaliar um Serviço
              </button>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <SparklesIcon />
              <h3 className="font-bold text-slate-800">O que os clientes estão dizendo</h3>
            </div>

            <div className="grid gap-6">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-sm">Ninguém avaliou ainda. Seja o primeiro!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 transition-all hover:shadow-md animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-black text-lg border border-slate-200">{review.userName.charAt(0)}</div>
                        <div>
                          <h4 className="font-bold text-slate-900">{review.userName}</h4>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= review.rating} className="w-3.5 h-3.5" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{new Date(review.date).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider">Serviço realizado: <span className="text-emerald-600">{review.serviceName}</span></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{review.comment}"</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 text-emerald-500">
                         <SparklesIcon />
                         <span className="text-[10px] font-black uppercase">Experiência Real</span>
                      </div>
                      <button 
                        onClick={() => bookThisService(review.serviceName)}
                        className="text-xs font-black text-slate-900 hover:text-emerald-600 flex items-center gap-1 transition-colors group"
                      >
                        QUERO ESSE SERVIÇO <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Painel de Controle</h2>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-center text-slate-400 py-10">Sem agendamentos no sistema.</p>
              ) : (
                bookings.map(booking => (
                  <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{booking.userName} - {booking.serviceName}</h4>
                        <p className="text-xs text-slate-500">Veículo: {booking.vehiclePlate} | Valor: R$ {booking.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-400">{booking.date} às {booking.time}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{booking.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => updateBookingStatus(booking.id, 'Em Execução')} className="bg-blue-50 text-blue-600 py-2.5 rounded-xl text-[10px] font-black uppercase">Iniciar</button>
                      <button onClick={() => updateBookingStatus(booking.id, 'Concluído')} className="bg-emerald-50 text-emerald-600 py-2.5 rounded-xl text-[10px] font-black uppercase">Concluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Meu Perfil</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg">{user.name.charAt(0)}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.vehicleModel} ({user.vehiclePlate})</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">{userLoyalty.name} Member</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-4 border-b border-slate-50">
                  <span className="text-slate-400">WhatsApp</span>
                  <span className="font-bold">{user.phone}</span>
                </div>
                <div className="flex justify-between text-sm py-4 border-b border-slate-50">
                  <span className="text-slate-400">Porte do Veículo</span>
                  <span className="font-bold">{user.vehicleSize}</span>
                </div>
              </div>
              <button onClick={logout} className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"><LogoutIcon /> Sair da Conta</button>
            </div>
          </div>
        )}

      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button onClick={() => setView('home')} className={`p-3 rounded-2xl transition-all ${view === 'home' ? 'text-emerald-500 bg-emerald-50 shadow-inner' : 'text-slate-300'}`}><CarIcon /></button>
        <button onClick={() => setView('booking')} className={`p-5 rounded-full -translate-y-8 transition-all active:scale-90 ${view === 'booking' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-110' : 'bg-slate-900 text-white shadow-xl shadow-slate-300'}`}><PlusIcon /></button>
        <button onClick={() => setView('reviews')} className={`p-3 rounded-2xl transition-all ${view === 'reviews' ? 'text-emerald-500 bg-emerald-50 shadow-inner' : 'text-slate-300'}`}><ReviewsIcon /></button>
        <button onClick={() => setView('history')} className={`p-3 rounded-2xl transition-all ${view === 'history' ? 'text-emerald-500 bg-emerald-50 shadow-inner' : 'text-slate-300'}`}><CalendarIcon /></button>
      </nav>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
            <div className="bg-emerald-500 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <SparklesIcon />
                <span className="font-bold text-sm uppercase tracking-widest">Especialista IA</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-emerald-600 rounded-full transition-colors font-bold">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-[350px]">
              {chatMessages.length === 0 && (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-500"><SparklesIcon /></div>
                  <p className="text-slate-400 text-sm italic">"Olá! Como posso ajudar você a deixar o seu {user.vehicleModel} impecável hoje?"</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-slate-100 border-none outline-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                placeholder="Dúvida técnica ou estética..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAskSpecialist()}
              />
              <button 
                onClick={handleAskSpecialist}
                disabled={loading || !chatInput.trim()}
                className="bg-emerald-500 text-white p-3.5 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-100"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Booking to Review Modal */}
      {isSelectingToReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-fade-in flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Qual serviço avaliar?</h3>
              <button onClick={() => setIsSelectingToReview(false)} className="text-slate-400 font-bold p-2">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              {unreviewedBookings.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-slate-500 text-sm">Nenhum serviço pendente de avaliação. Realize um agendamento para poder avaliar!</p>
                  <button onClick={() => { setView('booking'); setIsSelectingToReview(false); }} className="text-emerald-500 font-bold text-xs uppercase underline">Ver serviços</button>
                </div>
              ) : (
                unreviewedBookings.map(b => (
                  <button 
                    key={b.id} 
                    onClick={() => { setReviewingBooking(b); setIsSelectingToReview(false); }}
                    className="w-full text-left p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{b.date}</p>
                      <p className="font-bold text-sm text-slate-900">{b.serviceName}</p>
                    </div>
                    <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-center">Sua Avaliação</h3>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
               <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest mb-1">Feedback do serviço</p>
               <p className="text-sm font-bold text-slate-900">{reviewingBooking.serviceName}</p>
            </div>
            
            <div className="flex justify-center gap-3 py-2">
              {[1,2,3,4,5].map(s => (
                <StarIcon key={s} filled={s <= rating} onClick={() => setRating(s)} className="w-8 h-8" />
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seu Comentário</label>
              <textarea 
                className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm h-32 font-medium leading-relaxed" 
                placeholder="Diga aos outros clientes o que achou da lavagem e do atendimento..." 
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setReviewingBooking(null)} className="flex-1 py-4 text-slate-400 font-bold text-sm">Voltar</button>
              <button 
                onClick={submitReview} 
                disabled={!comment.trim()}
                className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
              >
                Publicar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
