
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Booking, Service, VehicleSize, BookingStatus, Review, LoyaltyLevel, ChatMessage, AppConfig, AppNotification } from './types';
import { SERVICES as INITIAL_SERVICES, TIME_SLOTS, WHATSAPP_NUMBER, CONFIG as INITIAL_CONFIG, LOYALTY_LEVELS, CATEGORIES as INITIAL_CATEGORIES, QUIZ_QUESTIONS } from './constants';
import { getCarCareAdvice, getQuizRecommendation, askSpecialist } from './geminiService';

// --- Icons ---
const CarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CalendarIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PlusIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ClockIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const TrashIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const ShieldIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const CameraIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const ReviewTabIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9 10l2 2 4-4"/></svg>;
const PhoneIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const StarIcon = ({ filled, className = "w-5 h-5", key }: { filled: boolean; className?: string; key?: React.Key }) => (
  <svg key={key} className={`${className} ${filled ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
const MessageIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>;
const SendIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const CheckIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const NotificationIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;

// --- Utils ---
const compressImage = (base64Str: string, maxWidth = 300, maxHeight = 300): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6)); 
    };
    img.onerror = () => resolve(base64Str);
  });
};

const getHealthColors = (score: number) => {
  if (score >= 70) return { text: 'text-emerald-500', bg: 'bg-emerald-500', track: 'bg-emerald-50' };
  if (score >= 40) return { text: 'text-amber-500', bg: 'bg-amber-500', track: 'bg-amber-50' };
  return { text: 'text-rose-500', bg: 'bg-rose-500', track: 'bg-rose-50' };
};

const HealthBar: React.FC<{ score: number; size?: 'sm' | 'md' }> = ({ score, size = 'md' }) => {
  const colors = getHealthColors(score);
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <span className={`font-black tracking-tighter ${colors.text} ${size === 'md' ? 'text-xl' : 'text-[10px]'}`}>
          {Math.round(score)}%
        </span>
      </div>
      <div className={`w-full ${size === 'md' ? 'h-3' : 'h-1.5'} ${colors.track} rounded-full overflow-hidden shadow-inner`}>
        <div 
          className={`h-full ${colors.bg} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

export default function App() {
  // --- Persistent States ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('duocar_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('duocar_admin') === 'true');

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('duocar_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('duocar_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('duocar_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('duocar_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('duocar_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const [customers, setCustomers] = useState<User[]>(() => {
    const saved = localStorage.getItem('duocar_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'landing' | 'client-login' | 'admin-login' | 'home' | 'booking' | 'profile' | 'quiz' | 'history' | 'reviews' | 'admin-dashboard' | 'chat'>('landing');
  const [adminTab, setAdminTab] = useState<'patio' | 'schedule_control' | 'customers' | 'services' | 'categories' | 'settings'>('patio');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  
  const [adminSelectedDate, setAdminSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ analysis: string; recommendedServiceId: string } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedAdminCustomer, setSelectedAdminCustomer] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPlate, setRegPlate] = useState("");
  const [regModel, setRegModel] = useState("");
  const [regSize, setRegSize] = useState<VehicleSize>("Médio");

  const [admUser, setAdmUser] = useState("");
  const [admPass, setAdmPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || "");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [confirmDeleteCategoryName, setConfirmDeleteCategoryName] = useState<string | null>(null);

  const [historyTab, setHistoryTab] = useState<'scheduled' | 'completed'>('scheduled');

  useEffect(() => {
    if (user && (view === 'landing' || view === 'client-login')) setView('home');
    if (isAdmin && (view === 'landing' || view === 'admin-login')) setView('admin-dashboard');
  }, [user, isAdmin]);

  // Logic for dynamic home screen states
  const activeBooking = useMemo(() => {
    if (!user) return null;
    return bookings.find(b => b.userId === user.id && (b.status === 'Agendado' || b.status === 'Em Execução'));
  }, [user?.id, bookings]);

  const pendingReviewBooking = useMemo(() => {
    if (!user) return null;
    return bookings.find(b => b.userId === user.id && b.status === 'Concluído' && !reviews.find(r => r.bookingId === b.id));
  }, [user?.id, bookings, reviews]);

  const completedBookingsCount = useMemo(() => {
    if (!user) return 0;
    return bookings.filter(b => b.userId === user.id && b.status === 'Concluído').length;
  }, [user?.id, bookings]);

  const homeState = useMemo(() => {
    if (activeBooking) return 'inProgress';
    if (pendingReviewBooking) return 'pendingReview';
    if (completedBookingsCount > 0) return 'completed';
    return 'noService';
  }, [activeBooking, pendingReviewBooking, completedBookingsCount]);

  const displayTexts = useMemo(() => {
    return appConfig.homeTexts[homeState];
  }, [appConfig.homeTexts, homeState]);

  const currentHealthScore = useMemo(() => {
    if (!user) return 0;
    const userCompleted = bookings.filter(b => b.userId === user.id && b.status === 'Concluído');
    const totalImpact = userCompleted.reduce((acc, curr) => {
      const srv = services.find(s => s.id === curr.serviceId);
      return acc + (srv?.healthImpact || 0);
    }, 0);
    return Math.min(totalImpact, 100);
  }, [user?.id, bookings, services]);

  useEffect(() => {
    if (user && user.healthScore !== currentHealthScore) {
      const updatedUser = { ...user, healthScore: currentHealthScore };
      setUser(updatedUser);
      localStorage.setItem('duocar_user', JSON.stringify(updatedUser));
      setCustomers(prev => prev.map(c => c.id === user.id ? updatedUser : c));
    }
  }, [currentHealthScore, user?.id]);

  useEffect(() => {
    localStorage.setItem('duocar_bookings', JSON.stringify(bookings));
    localStorage.setItem('duocar_reviews', JSON.stringify(reviews));
    localStorage.setItem('duocar_services', JSON.stringify(services));
    localStorage.setItem('duocar_categories', JSON.stringify(categories));
    localStorage.setItem('duocar_config', JSON.stringify(appConfig));
    localStorage.setItem('duocar_customers', JSON.stringify(customers));
  }, [bookings, reviews, services, categories, appConfig, customers]);

  const getLoyaltyForUser = (userId: string) => {
    const count = bookings.filter(b => b.userId === userId && b.status === 'Concluído').length;
    return [...LOYALTY_LEVELS].reverse().find(l => count >= l.required) || LOYALTY_LEVELS[0];
  };

  const userLoyalty = useMemo(() => {
    if (!user) return LOYALTY_LEVELS[0];
    return getLoyaltyForUser(user.id);
  }, [user?.id, bookings]);

  const loyaltyProgress = useMemo(() => {
    const nextLevel = LOYALTY_LEVELS.find(l => l.required > completedBookingsCount);
    if (!nextLevel) return 100;
    const currentLevel = [...LOYALTY_LEVELS].reverse().find(l => l.required <= completedBookingsCount) || LOYALTY_LEVELS[0];
    const totalRequiredInRange = nextLevel.required - currentLevel.required;
    const currentProgressInRange = completedBookingsCount - currentLevel.required;
    return (currentProgressInRange / totalRequiredInRange) * 100;
  }, [completedBookingsCount]);

  const fetchAdvice = useCallback(async () => {
    if (user && !aiAdvice) {
      setLoading(true);
      const advice = await getCarCareAdvice({ ...user, healthScore: currentHealthScore });
      setAiAdvice(advice);
      setLoading(false);
    }
  }, [user?.id, currentHealthScore, aiAdvice]);

  useEffect(() => {
    if (user && view === 'home') fetchAdvice();
  }, [user?.id, view, fetchAdvice]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = regPhone.trim();
    const normalizedPlate = regPlate.trim().toUpperCase();
    
    const existingUser = customers.find(c => 
      c.phone.trim() === normalizedPhone || 
      c.vehiclePlate.trim().toUpperCase() === normalizedPlate
    );

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('duocar_user', JSON.stringify(existingUser));
      setView('home');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      phone: normalizedPhone,
      vehiclePlate: normalizedPlate,
      vehicleModel: regModel,
      vehicleSize: regSize,
      healthScore: 0,
      notifications: []
    };
    setUser(newUser);
    setCustomers(prev => [...prev, newUser]);
    setView('home');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (admUser === "Lucas Detailer" && admPass === "19166588731") {
      setIsAdmin(true);
      sessionStorage.setItem('duocar_admin', 'true');
      setView('admin-dashboard');
    } else {
      setLoginError("Credenciais incorretas.");
      setTimeout(() => setLoginError(""), 3000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const compressed = await compressImage(base64String);
        setUser({ ...user, photo: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    setSaveLoading(true);
    setCustomers(prev => prev.map(c => c.id === user.id ? user : c));
    localStorage.setItem('duocar_user', JSON.stringify(user));

    setTimeout(() => {
      setSaveLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleBooking = () => {
    if (!user || !selectedService || !bookingDate || !bookingTime) return;
    
    if (activeBooking) {
      alert("Você já possui um atendimento em andamento.");
      return;
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      userName: user.name,
      vehiclePlate: user.vehiclePlate,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: bookingDate,
      time: bookingTime,
      status: 'Agendado',
      price: selectedService.price[user.vehicleSize],
      createdAt: new Date().toISOString()
    };
    setBookings([newBooking, ...bookings]);
    setView('history');
    setHistoryTab('scheduled');
    
    let loyaltyBonus = (userLoyalty.name === 'Ouro' || userLoyalty.name === 'Diamante') && newBooking.price >= 60 
      ? "\n*Cliente " + userLoyalty.name + " (Solicito 5% OFF)*" : "";
      
    const msg = `Olá ${appConfig.name}! Agendei pelo app:\nServiço: ${newBooking.serviceName}\nData: ${newBooking.date} às ${newBooking.time}\nVeículo: ${user.vehicleModel}${loyaltyBonus}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitReview = () => {
    if (!user || !reviewBookingId) return;
    const booking = bookings.find(b => b.id === reviewBookingId) || services.find(s => s.id === reviewBookingId);
    if (!booking) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      bookingId: reviewBookingId,
      userId: user.id,
      userName: user.name,
      serviceName: 'name' in booking ? booking.name : (booking as any).serviceName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setReviews([newReview, ...reviews]);
    
    const updatedNotifications = (user.notifications || []).filter(n => n.bookingId !== reviewBookingId);
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    setCustomers(prev => prev.map(c => c.id === user.id ? updatedUser : c));
    localStorage.setItem('duocar_user', JSON.stringify(updatedUser));

    setIsCreatingReview(false);
    setReviewBookingId("");
    setReviewComment("");
    setReviewRating(5);
  };

  const startReviewFromBooking = (bookingId: string) => {
    setReviewBookingId(bookingId);
    setReviewRating(5);
    setReviewComment("");
    setIsCreatingReview(true);
    setView('reviews');
  };

  const handleQuizAnswer = async (answer: string) => {
    const question = QUIZ_QUESTIONS[quizStep].text;
    const newAnswers = { ...quizAnswers, [question]: answer };
    setQuizAnswers(newAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setLoading(true);
      const result = await getQuizRecommendation(user!, newAnswers);
      setQuizResult(result);
      setLoading(false);
    }
  };

  const handleSelectQuizService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setView('booking');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !user) return;
    
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    const specialistResponse = await askSpecialist(user, chatInput);
    const specialistMsg: ChatMessage = { role: 'specialist', text: specialistResponse };
    setChatMessages(prev => [...prev, specialistMsg]);
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(prevBookings => {
      const updated = prevBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
      
      if (newStatus === 'Concluído') {
        const targetBooking = updated.find(b => b.id === bookingId);
        if (targetBooking) {
          setCustomers(prevCust => prevCust.map(c => {
            if (c.id === targetBooking.userId) {
              const userCompleted = updated.filter(ub => ub.userId === c.id && ub.status === 'Concluído');
              const totalImpact = userCompleted.reduce((acc, curr) => {
                const srv = services.find(s => s.id === curr.serviceId);
                return acc + (srv?.healthImpact || 0);
              }, 0);
              
              const currentNotifs = c.notifications || [];
              const alreadyHas = currentNotifs.some(n => n.bookingId === bookingId);
              if (!alreadyHas) {
                currentNotifs.push({
                  id: Math.random().toString(36).substr(2, 9),
                  message: "Lavagem finalizada ✅ Avalie e ganhe benefícios.",
                  bookingId: bookingId,
                  resolved: false,
                  type: 'review_request'
                });
              }

              const updatedCustomer = { ...c, healthScore: Math.min(totalImpact, 100), notifications: currentNotifs };
              
              if (user && user.id === c.id) {
                setUser(updatedCustomer);
                localStorage.setItem('duocar_user', JSON.stringify(updatedCustomer));
              }

              return updatedCustomer;
            }
            return c;
          }));
        }
      }
      return updated;
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('duocar_user');
    sessionStorage.removeItem('duocar_admin');
    setView('landing');
  };

  const saveService = (srv: Service) => {
    if (services.find(s => s.id === srv.id)) {
      setServices(prev => prev.map(s => s.id === srv.id ? srv : s));
    } else {
      setServices(prev => [...prev, srv]);
    }
    setEditingService(null);
  };

  const executeDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setConfirmDeleteId(null);
  };

  const handleSaveCategory = () => {
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories(prev => [...prev, newCategoryName]);
      setIsAddingCategory(false);
      setNewCategoryName("");
    }
  };

  const executeDeleteCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
    setConfirmDeleteCategoryName(null);
  };

  const toggleSlotBlock = (date: string, time: string) => {
    const slotId = `${date}_${time}`;
    setAppConfig(prev => {
      const isBlocked = prev.blockedSlots.includes(slotId);
      return {
        ...prev,
        blockedSlots: isBlocked 
          ? prev.blockedSlots.filter(s => s !== slotId) 
          : [...prev.blockedSlots, slotId]
      };
    });
  };

  const getSlotStatus = (date: string, time: string) => {
    const isOccupied = bookings.some(b => b.date === date && b.time === time && b.status !== 'Cancelado');
    if (isOccupied) return 'Ocupado';
    const isBlocked = appConfig.blockedSlots.includes(`${date}_${time}`);
    if (isBlocked) return 'Bloqueado';
    return 'Disponível';
  };

  // --- RENDERING ---

  if (!user && !isAdmin) {
    if (view === 'landing') {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl animate-scale-in" style={{ backgroundColor: appConfig.theme.secondaryColor }}>
              <CarIcon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900">{appConfig.name}</h1>
            <p className="text-zinc-400 font-medium">Selecione o tipo de acesso</p>
          </div>
          <div className="grid gap-4 w-full max-sm">
            <button onClick={() => setView('client-login')} className="group p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-left transition-all active:scale-95 hover:bg-emerald-100/50">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-black text-emerald-900">Área do Cliente</h3>
                  <p className="text-xs text-emerald-600 font-bold">Agende e acompanhe seu carro</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:rotate-12 transition-transform">
                  <UserIcon />
                </div>
              </div>
            </button>
            <button onClick={() => setView('admin-login')} className="group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-left transition-all active:scale-95 hover:bg-zinc-800">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-black text-white">Área ADM</h3>
                  <p className="text-xs text-zinc-400 font-bold">Gestão de pátio e serviços</p>
                </div>
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:rotate-12 transition-transform">
                  <ShieldIcon />
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (view === 'client-login') {
      return (
        <div className="min-h-screen bg-white flex flex-col p-6 animate-fade-in">
          <button onClick={() => setView('landing')} className="mb-8 font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">← Voltar</button>
          <div className="max-w-sm mx-auto w-full space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900">Acesso do Cliente</h2>
              <p className="text-zinc-400 font-medium text-sm">Entre com seus dados para agendar ou ver histórico.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-3">
                <input required placeholder="Nome completo" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={regName} onChange={e => setRegName(e.target.value)} />
                <input required placeholder="Telefone (WhatsApp)" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                <input required placeholder="Modelo do Veículo" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={regModel} onChange={e => setRegModel(e.target.value)} />
                <input required placeholder="Placa do Carro" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all uppercase" value={regPlate} onChange={e => setRegPlate(e.target.value)} />
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Tamanho do Carro</p>
                  <div className="flex bg-zinc-50 p-1 rounded-2xl gap-1">
                    {(['Pequeno', 'Médio', 'Grande'] as VehicleSize[]).map(size => (
                      <button key={size} type="button" onClick={() => setRegSize(size)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${regSize === size ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:bg-zinc-100'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl active:scale-[0.98] transition-all hover:bg-zinc-800">Entrar</button>
            </form>
          </div>
        </div>
      );
    }

    if (view === 'admin-login') {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col p-6 animate-fade-in text-white">
          <button onClick={() => setView('landing')} className="mb-8 font-black text-xs uppercase tracking-widest text-zinc-500">← Voltar</button>
          <div className="max-w-sm mx-auto w-full space-y-12 my-auto">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><ShieldIcon /></div>
              <h2 className="text-3xl font-black tracking-tighter">Login ADM</h2>
              <p className="text-zinc-500 font-medium text-sm italic">"A excelência está nos detalhes."</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-3">
                <input required placeholder="Usuário" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder-zinc-600" value={admUser} onChange={e => setAdmUser(e.target.value)} />
                <input required type="password" placeholder="Senha" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder-zinc-600" value={admPass} onChange={e => setAdmPass(e.target.value)} />
              </div>
              {loginError && <p className="text-rose-500 text-xs font-bold text-center animate-pulse">{loginError}</p>}
              <button type="submit" className="w-full bg-white text-zinc-900 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl active:scale-[0.98] transition-all hover:bg-zinc-100">Acessar Painel</button>
            </form>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: appConfig.theme.background }}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer tap-highlight-none active:scale-95 transition-transform" onClick={() => isAdmin ? setAdminTab('patio') : setView('home')}>
          <div className="text-white rounded-xl flex items-center justify-center shadow-lg w-10 h-10" style={{ backgroundColor: isAdmin ? appConfig.theme.primaryColor : appConfig.theme.secondaryColor }}>
            {isAdmin ? <ShieldIcon /> : <CarIcon />}
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">{appConfig.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-zinc-400 hover:text-zinc-900 p-2 transition-colors active:scale-90"><LogoutIcon /></button>
          {!isAdmin && (
            <button onClick={() => setView('profile')} className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100 overflow-hidden shadow-sm active:scale-90 transition-transform relative group">
              {user?.photo ? (
                <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <UserIcon />
              )}
            </button>
          )}
        </div>
      </header>

      <main key={view} className="max-w-xl mx-auto p-6 space-y-8 animate-fade-in">
        {isAdmin && view === 'admin-dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gestão Master</p>
                <h2 className="text-2xl font-black tracking-tight">Painel de Controle</h2>
              </div>
              <div className="flex gap-2 bg-zinc-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar max-w-[70%]">
                {(['patio', 'schedule_control', 'customers', 'services', 'categories', 'settings'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => { setAdminTab(tab); setSelectedAdminCustomer(null); }} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${adminTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                  >
                    {tab === 'patio' && 'Pátio'}
                    {tab === 'schedule_control' && 'Horários'}
                    {tab === 'customers' && 'Clientes'}
                    {tab === 'services' && 'Serviços'}
                    {tab === 'categories' && 'Categorias'}
                    {tab === 'settings' && 'Ajustes'}
                  </button>
                ))}
              </div>
            </div>

            {adminTab === 'patio' && (
              <div className="grid gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Pátio de Agendamentos</h3>
                {bookings.filter(b => b.status !== 'Concluído' && b.status !== 'Cancelado').length > 0 ? bookings.filter(b => b.status !== 'Concluído' && b.status !== 'Cancelado').map((b) => (
                  <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-zinc-100 space-y-4 premium-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="space-y-0.5">
                          <span className={`text-[10px] font-black uppercase ${b.status === 'Em Execução' ? 'text-blue-500' : 'text-zinc-400'}`}>{b.status}</span>
                          <h4 className="font-black text-zinc-900">{b.serviceName}</h4>
                          <p className="text-xs font-bold text-zinc-500">{b.userName} • {b.vehiclePlate}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black">R$ {b.price}</span>
                    </div>
                    <div className="flex gap-2">
                      {b.status === 'Agendado' && <button onClick={() => handleUpdateStatus(b.id, 'Em Execução')} className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-bold text-xs">Iniciar</button>}
                      {b.status === 'Em Execução' && <button onClick={() => handleUpdateStatus(b.id, 'Concluído')} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold text-xs">Concluir</button>}
                      <button onClick={() => handleUpdateStatus(b.id, 'Cancelado')} className="flex-1 bg-rose-500 text-white py-2 rounded-xl font-bold text-xs">Cancelar</button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-bold text-sm">Nenhum serviço pendente.</p>
                  </div>
                )}
              </div>
            )}

            {adminTab === 'schedule_control' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-zinc-900">Controle de Horários</h3>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Selecione o dia para gerenciar</p>
                  </div>
                  
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={adminSelectedDate}
                    onChange={(e) => setAdminSelectedDate(e.target.value)}
                  />

                  <div className="grid gap-3">
                    {TIME_SLOTS.map(time => {
                      const status = getSlotStatus(adminSelectedDate, time);
                      return (
                        <div key={time} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                          <span className="font-black text-zinc-900">{time}</span>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              status === 'Disponível' ? 'text-emerald-500' : 
                              status === 'Bloqueado' ? 'text-rose-500' : 'text-blue-500'
                            }`}>
                              {status}
                            </span>
                            {status !== 'Ocupado' ? (
                              <button 
                                onClick={() => toggleSlotBlock(adminSelectedDate, time)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                  status === 'Bloqueado' 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-zinc-200 text-zinc-500'
                                }`}
                              >
                                {status === 'Bloqueado' ? 'Liberar' : 'Bloquear'}
                              </button>
                            ) : (
                              <div className="w-16 flex justify-center">
                                <CheckIcon className="text-blue-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'customers' && (
              <div className="space-y-6">
                {!selectedAdminCustomer ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Todos os Clientes</h3>
                    <div className="grid gap-3">
                      {customers.map((c, idx) => (
                        <div 
                          key={c.id} 
                          onClick={() => setSelectedAdminCustomer(c)}
                          className="bg-white p-4 rounded-[1.5rem] border border-zinc-100 flex items-center justify-between premium-shadow active:scale-[0.98] transition-all animate-fade-in cursor-pointer"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center shadow-sm">
                              {c.photo ? <img src={c.photo} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-zinc-300" />}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-black text-sm text-zinc-900">{c.name}</h4>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">{c.vehicleModel} • {c.vehiclePlate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 min-w-[80px]">
                            <HealthBar score={c.healthScore} size="sm" />
                            <span className="text-xl">{getLoyaltyForUser(c.id).icon}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8 animate-scale-in">
                    <button onClick={() => setSelectedAdminCustomer(null)} className="font-black text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-2">← Voltar para lista</button>
                    
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center shadow-md">
                          {selectedAdminCustomer.photo ? <img src={selectedAdminCustomer.photo} className="w-full h-full object-cover" /> : <UserIcon className="w-8 h-8 text-zinc-300" />}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black tracking-tight">{selectedAdminCustomer.name}</h3>
                          <p className="text-sm font-bold text-zinc-400">{selectedAdminCustomer.phone}</p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase">{selectedAdminCustomer.vehiclePlate}</span>
                            <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[9px] font-black uppercase">{selectedAdminCustomer.vehicleSize}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-50 flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-zinc-400">Fidelidade</p>
                          <div className="flex items-center gap-2">
                             <span className="text-2xl">{getLoyaltyForUser(selectedAdminCustomer.id).icon}</span>
                             <span className="font-black text-zinc-900">{getLoyaltyForUser(selectedAdminCustomer.id).name}</span>
                          </div>
                        </div>
                        <div className="w-1/2">
                           <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">Saúde</p>
                           <HealthBar score={selectedAdminCustomer.healthScore} size="sm" />
                        </div>
                        <a 
                          href={`https://wa.me/${selectedAdminCustomer.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all active:scale-90"
                        >
                          <PhoneIcon />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">Histórico Completo</h4>
                      <div className="grid gap-3">
                        {bookings.filter(b => b.userId === selectedAdminCustomer.id).length > 0 ? (
                          bookings.filter(b => b.userId === selectedAdminCustomer.id).map(b => (
                            <div key={b.id} className="bg-white p-5 rounded-2xl border border-zinc-50 flex justify-between items-center">
                              <div className="space-y-0.5">
                                <h5 className="font-black text-sm text-zinc-900">{b.serviceName}</h5>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">{b.date} • R$ {b.price}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${b.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                {b.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-10 text-zinc-400 font-bold text-xs italic">Nenhum serviço registrado.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {adminTab === 'services' && (
              <div className="space-y-6">
                <button onClick={() => setEditingService({ id: Math.random().toString(36).substr(2, 9), name: '', category: categories[0] || '', price: { Pequeno: 0, Médio: 0, Grande: 0 }, healthImpact: 0 })} className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Criar Novo Serviço</button>
                <div className="grid gap-4">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex justify-between items-center premium-shadow">
                      <div>
                        <h4 className="font-black text-zinc-900">{s.name}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">{s.category} • +{s.healthImpact}% Saúde</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(s)} className="p-3 text-zinc-400 hover:text-zinc-900 active:scale-90 transition-transform"><PlusIcon /></button>
                        <button onClick={() => setConfirmDeleteId(s.id)} className="p-3 text-rose-500 hover:text-rose-600 active:scale-90 transition-transform"><TrashIcon /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'categories' && (
              <div className="space-y-6">
                <button onClick={() => setIsAddingCategory(true)} className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Adicionar Categoria</button>
                <div className="grid gap-3">
                  {categories.map(cat => (
                    <div key={cat} className="bg-white p-5 rounded-2xl border border-zinc-100 flex justify-between items-center premium-shadow active:scale-[0.98] transition-all">
                      <span className="font-black text-zinc-900 uppercase text-xs tracking-widest">{cat}</span>
                      <button onClick={() => setConfirmDeleteCategoryName(cat)} className="text-rose-500 p-2 active:scale-90 transition-transform"><TrashIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Identidade Visual</h3>
                    <div className="grid gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Nome do App</label>
                        <input className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold text-sm" value={appConfig.name} onChange={e => setAppConfig(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Cor Primária</label>
                          <div className="flex gap-2">
                            <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer" value={appConfig.theme.primaryColor} onChange={e => setAppConfig(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))} />
                            <input className="flex-1 p-3 rounded-xl bg-zinc-50 text-[10px] font-black uppercase" value={appConfig.theme.primaryColor} onChange={e => setAppConfig(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value.toUpperCase() } }))} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Cor Secundária</label>
                          <div className="flex gap-2">
                            <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer" value={appConfig.theme.secondaryColor} onChange={e => setAppConfig(prev => ({ ...prev, theme: { ...prev.theme, secondaryColor: e.target.value } }))} />
                            <input className="flex-1 p-3 rounded-xl bg-zinc-50 text-[10px] font-black uppercase" value={appConfig.theme.secondaryColor} onChange={e => setAppConfig(prev => ({ ...prev, theme: { ...prev.theme, secondaryColor: e.target.value.toUpperCase() } }))} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home Marketing Editor */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Mensagens de Venda (Home)</h3>
                  
                  {(['noService', 'inProgress', 'pendingReview', 'completed'] as const).map(key => (
                    <div key={key} className="space-y-4 p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                        {key === 'noService' && 'Sem Serviço Ativo'}
                        {key === 'inProgress' && 'Serviço em Progresso'}
                        {key === 'pendingReview' && 'Aguardando Avaliação'}
                        {key === 'completed' && 'Serviço Finalizado'}
                      </p>
                      <div className="space-y-2">
                        <input 
                          placeholder="Título de Venda" 
                          className="w-full p-3 rounded-xl bg-white border-none font-black text-sm"
                          value={appConfig.homeTexts[key].title}
                          onChange={(e) => setAppConfig(prev => ({
                            ...prev,
                            homeTexts: { ...prev.homeTexts, [key]: { ...prev.homeTexts[key], title: e.target.value } }
                          }))}
                        />
                        <input 
                          placeholder="Subtítulo persuasivo" 
                          className="w-full p-3 rounded-xl bg-white border-none font-bold text-xs text-zinc-500"
                          value={appConfig.homeTexts[key].subtitle}
                          onChange={(e) => setAppConfig(prev => ({
                            ...prev,
                            homeTexts: { ...prev.homeTexts, [key]: { ...prev.homeTexts[key], subtitle: e.target.value } }
                          }))}
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => alert("Configurações salvas!")} className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Confirmar Alterações</button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAdmin && view === 'home' && (
          <div className="space-y-6">
            {/* Automatic Notification Section */}
            {user?.notifications && user.notifications.length > 0 && user.notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => startReviewFromBooking(notif.bookingId)}
                className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] space-y-4 animate-fade-in relative overflow-hidden cursor-pointer active:scale-95 transition-all shadow-lg ring-2 ring-amber-100 animate-pulse-glow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <NotificationIcon />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-950 text-sm">Aviso de Lavagem</h4>
                    <p className="text-amber-800 text-xs font-medium">{notif.message}</p>
                    <p className="text-[10px] font-black uppercase text-amber-600/60 pt-1">Toque para avaliar agora</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl p-6 shadow-xl text-white space-y-4 relative overflow-hidden group" style={{ backgroundColor: appConfig.theme.primaryColor }}>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="text-4xl filter drop-shadow-md">{userLoyalty.icon}</div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase text-white/50 tracking-[0.2em]">Seu Nível Atual</p>
                    <h3 className="text-xl font-black tracking-tight">{userLoyalty.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-black">{completedBookingsCount}</span>
                   <p className="text-[9px] font-black uppercase text-white/50 tracking-[0.1em]">Lavagens</p>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-1000 ease-out" style={{ width: `${loyaltyProgress}%`, backgroundColor: appConfig.theme.secondaryColor }} />
                  </div>
                  <span className="text-[10px] font-black" style={{ color: appConfig.theme.secondaryColor }}>{Math.round(loyaltyProgress)}%</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 mt-2 relative z-10">
                <p className="text-[9px] font-medium text-white/60 leading-tight italic">
                  Este é o seu Cartão Fidelidade. Clientes Ouro ou Diamante ganham 5% de desconto em lavagens acima de R$ 60,00.
                </p>
              </div>
            </div>

            {/* SALES ORIENTED HEALTH CARD - Now with dynamic impact health score */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow hover-lift">
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{displayTexts.title}</h3>
                    <p className="text-xs font-medium text-zinc-400">{displayTexts.subtitle}</p>
                  </div>
                </div>
                {/* Score rises according to real service impact */}
                <HealthBar score={currentHealthScore} />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setView('booking')} 
                  disabled={!!activeBooking}
                  className={`flex-1 text-white py-4 rounded-2xl font-black shadow-lg uppercase text-xs tracking-widest active:scale-95 transition-all ${activeBooking ? 'bg-zinc-200' : ''}`} 
                  style={{ backgroundColor: activeBooking ? undefined : appConfig.theme.primaryColor }}
                >
                  {activeBooking ? 'Em Andamento' : 'Agendar'}
                </button>
                <div className="flex-1 relative group/diag">
                  <button 
                    onClick={() => { setView('quiz'); setQuizStep(0); setQuizResult(null); }} 
                    className="w-full bg-white border-2 border-zinc-100 py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
                  >
                    Diagnosticar
                  </button>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-black uppercase py-1.5 px-3 rounded-lg opacity-0 group-hover/diag:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    Descubra a lavagem ideal
                  </span>
                </div>
              </div>
              {activeBooking && (
                <p className="text-center text-[10px] font-black text-amber-500 uppercase tracking-widest mt-4 animate-fade-in">Você já possui um atendimento em andamento.</p>
              )}
            </div>

            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white space-y-6 premium-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/30 transition-all duration-700" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-[1.2rem] flex items-center justify-center text-emerald-400 shadow-xl border border-white/5 animate-pulse-glow">
                  <MessageIcon />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Consultório Técnico</p>
                  <h3 className="text-xl font-black">Fale com o Especialista</h3>
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-400 leading-relaxed italic relative z-10">
                "Seu carro fala através de ruídos e detalhes. O silêncio do motor esconde segredos que apenas um mestre entende. Sente algo estranho? Tire sua dúvida agora."
              </p>
              <button 
                onClick={() => setView('chat')}
                className="w-full bg-white text-zinc-900 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all relative z-10"
              >
                Abrir Consulta Gratuita
              </button>
            </div>
            
            {aiAdvice && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] space-y-4 animate-fade-in relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-sm"><SparklesIcon /></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-950 text-sm">Especialista Duocar AI</h4>
                    <p className="text-emerald-800 text-xs font-medium italic">"{aiAdvice}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAdmin && view === 'chat' && (
          <div className="flex flex-col h-[75vh] animate-fade-in pb-10">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setView('home')} className="font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">← Voltar</button>
              <h2 className="text-xl font-black tracking-tight">Consultório Técnico</h2>
              <div className="w-12" />
            </div>

            <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                      <MessageIcon />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-zinc-900">O Mestre Duocar está pronto.</h4>
                      <p className="text-xs font-bold text-zinc-400">Qual segredo do seu carro você quer desvendar hoje?</p>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                      <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm font-medium shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-zinc-900 text-white rounded-br-none' 
                          : 'bg-zinc-50 text-zinc-700 rounded-bl-none border border-zinc-100'
                      }`}>
                        {msg.role === 'specialist' && <span className="block text-[8px] font-black uppercase text-emerald-500 mb-1 tracking-widest">Especialista Duocar</span>}
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-zinc-50 p-5 rounded-[1.5rem] rounded-bl-none border border-zinc-100 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-zinc-50/50 border-t border-zinc-100">
                <div className="flex gap-2">
                  <input 
                    placeholder="Ex: Por que meu para-brisa embaça?"
                    className="flex-1 bg-white p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-inner"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || loading}
                    className="bg-zinc-900 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAdmin && view === 'quiz' && (
          <div className="space-y-8 pb-20">
            {!quizResult ? (
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-8 animate-scale-in">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>Check-up Digital</span>
                    <span>Pergunta {quizStep + 1} de {QUIZ_QUESTIONS.length}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 leading-tight">
                    {QUIZ_QUESTIONS[quizStep].text}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => handleQuizAnswer(opt)}
                      className="w-full text-left p-6 rounded-2xl border-2 border-zinc-50 bg-zinc-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-[0.98] font-bold text-zinc-700"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                {loading && (
                  <div className="fixed inset-0 z-[110] bg-white/95 flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-black text-zinc-900">Analizando seu veículo...</h4>
                      <p className="text-zinc-400 font-bold text-sm">O Especialista Duocar está processando seu diagnóstico.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-scale-in">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                      <SparklesIcon />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase text-zinc-400">Veredito Duocar AI</p>
                      <h3 className="text-xl font-black text-zinc-900">Recomendação Final</h3>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-50 p-6 rounded-2xl italic text-sm font-medium text-zinc-700 border-l-4 border-emerald-500">
                    "{quizResult.analysis}"
                  </div>

                  {services.find(s => s.id === quizResult.recommendedServiceId) && (
                    <div className="bg-white border-2 border-emerald-500 p-6 rounded-[2rem] space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-emerald-600 uppercase">Serviço Recomendado</span>
                          <h4 className="text-lg font-black text-zinc-900">
                            {services.find(s => s.id === quizResult.recommendedServiceId)?.name}
                          </h4>
                        </div>
                        <span className="text-lg font-black text-zinc-900">
                          R$ {services.find(s => s.id === quizResult.recommendedServiceId)?.price[user?.vehicleSize || 'Médio']}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleSelectQuizService(quizResult.recommendedServiceId)}
                        className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                      >
                        Agendar Agora
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setView('home'); setQuizResult(null); }}
                    className="w-full text-zinc-400 font-black uppercase text-[10px] tracking-widest pt-2"
                  >
                    Voltar para o Início
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAdmin && view === 'reviews' && (
          <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black tracking-tight">Avaliações</h2>
               {!isCreatingReview && (
                 <button 
                   onClick={() => setIsCreatingReview(true)}
                   className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                 >
                   Avaliar Agora
                 </button>
               )}
            </div>

            {isCreatingReview ? (
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 premium-shadow space-y-6 animate-scale-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-zinc-900">Nova Avaliação</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Qual serviço deseja avaliar?</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <select 
                      className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-zinc-900 transition-all"
                      value={reviewBookingId}
                      onChange={(e) => setReviewBookingId(e.target.value)}
                    >
                      <option value="">Selecione o serviço...</option>
                      {bookings
                        .filter(b => b.userId === user?.id && b.status === 'Concluído' && !reviews.find(r => r.bookingId === b.id))
                        .map(b => (
                          <option key={b.id} value={b.id}>{b.serviceName} - {b.date}</option>
                        ))
                      }
                      <optgroup label="Nossos Serviços">
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-[10px] font-black uppercase text-zinc-400">Sua Nota</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setReviewRating(star)} className="p-1 active:scale-90 transition-transform">
                          <StarIcon filled={star <= reviewRating} className="w-8 h-8" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    placeholder="Conte como foi sua experiência na Duocar..."
                    className="w-full p-6 rounded-[1.5rem] bg-zinc-50 border-none font-medium text-sm h-32 outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-inner"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleSubmitReview}
                      disabled={!reviewBookingId}
                      className="flex-1 bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:bg-zinc-200"
                    >
                      Enviar Feedback
                    </button>
                    <button 
                      onClick={() => setIsCreatingReview(false)}
                      className="flex-1 bg-zinc-100 text-zinc-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.length > 0 ? (
                  reviews.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-[2rem] border border-zinc-50 premium-shadow space-y-3 animate-fade-in hover-lift">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="font-black text-zinc-900 text-sm">{r.userName}</h4>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{r.serviceName} • {r.date}</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= r.rating} className="w-3 h-3" />)}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-zinc-600 leading-relaxed italic">"{r.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-bold text-sm">Seja o primeiro a avaliar!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'booking' && (
          <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-black tracking-tight">Novo Agendamento</h2>
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat, idx) => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedService(null); }} className={`px-5 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all active:scale-95 ${selectedCategory === cat ? 'bg-zinc-900 text-white shadow-lg' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}>{cat}</button>
                ))}
              </div>
              <div className="grid gap-3">
                {services.filter(s => s.category === selectedCategory).map((service, idx) => (
                  <button key={service.id} onClick={() => setSelectedService(service)} className={`p-6 rounded-[2rem] border-2 text-left transition-all active:scale-[0.98] animate-fade-in ${selectedService?.id === service.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-sm">{service.name}</span>
                      <span className="text-emerald-600 font-black">R$ {service.price[user?.vehicleSize || 'Médio']}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                      <ClockIcon />
                      <span>Impacto: +{service.healthImpact}%</span>
                    </div>
                  </button>
                ))}
              </div>
              {selectedService && (
                <div className="space-y-6 animate-scale-in bg-white p-6 rounded-[2.5rem] border border-zinc-100 premium-shadow">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Sobre o serviço</h3>
                    <p className="text-sm font-medium text-zinc-700 leading-relaxed italic">"{selectedService.description}"</p>
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest pt-2">Duração: {selectedService.duration || "Avaliação no local"}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-50 grid grid-cols-2 gap-4">
                    <input type="date" className="p-4 rounded-2xl bg-zinc-50 border-none font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                    <select className="p-4 rounded-2xl bg-zinc-50 border-none font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                      <option value="">Hora</option>
                      {TIME_SLOTS.filter(t => getSlotStatus(bookingDate, t) === 'Disponível').map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button onClick={handleBooking} disabled={!bookingDate || !bookingTime} className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 text-white" style={{ backgroundColor: (!bookingDate || !bookingTime) ? undefined : appConfig.theme.primaryColor }}>Confirmar Agendamento</button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-black tracking-tight">Seu Histórico</h2>
            
            <div className="flex bg-zinc-100 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => setHistoryTab('scheduled')} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${historyTab === 'scheduled' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:bg-zinc-200/50'}`}
              >
                Agendados
              </button>
              <button 
                onClick={() => setHistoryTab('completed')} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${historyTab === 'completed' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:bg-zinc-200/50'}`}
              >
                Histórico de Lavagens
              </button>
            </div>

            <div className="grid gap-4">
              {bookings.filter(b => b.userId === user?.id && (historyTab === 'scheduled' ? (b.status !== 'Concluído' && b.status !== 'Cancelado') : b.status === 'Concluído')).length > 0 ? (
                bookings
                  .filter(b => b.userId === user?.id && (historyTab === 'scheduled' ? (b.status !== 'Concluído' && b.status !== 'Cancelado') : b.status === 'Concluído'))
                  .map((b) => {
                    const bookingReview = reviews.find(r => r.bookingId === b.id);
                    return (
                      <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex flex-col gap-4 animate-fade-in hover-lift">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase text-zinc-300">{b.date} • {b.time}</span>
                            <h4 className="font-black text-zinc-900">{b.serviceName}</h4>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${b.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
                          <div className="space-y-1">
                            <span className="text-xs font-black text-zinc-900">R$ {b.price}</span>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Ref: {b.id}</p>
                          </div>
                          
                          {b.status === 'Concluído' && (
                            bookingReview ? (
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} filled={star <= bookingReview.rating} className="w-3 h-3" />)}
                              </div>
                            ) : (
                              <button 
                                onClick={() => startReviewFromBooking(b.id)}
                                className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all animate-pulse-glow"
                              >
                                Avaliar
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 animate-fade-in">
                  <p className="text-zinc-400 font-bold text-sm">
                    {historyTab === 'scheduled' ? 'Nenhum agendamento ativo no momento.' : 'Seu histórico de lavagens está vazio.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'profile' && user && (
          <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
              <button onClick={() => setView('home')} className="font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">← Voltar</button>
              <h2 className="text-xl font-black tracking-tight">Seu Perfil</h2>
              <div className="w-12" />
            </div>

            <div className="flex flex-col items-center space-y-8">
              <div className="relative group">
                <div className="w-36 h-36 rounded-[2.5rem] bg-white border-4 border-zinc-100 shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-300">
                  {user.photo ? (
                    <img src={user.photo} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <UserIcon className="w-14 h-14 text-zinc-300" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3.5 rounded-2xl shadow-lg hover:bg-emerald-600 active:scale-90 transition-all border-4 border-white animate-pulse-glow"
                >
                  <CameraIcon />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                />
              </div>
              <div className="text-center w-full space-y-1">
                <input 
                  className="text-2xl font-black text-zinc-900 bg-transparent text-center border-b-2 border-transparent focus:border-zinc-200 outline-none w-full transition-all"
                  value={user.name} 
                  placeholder="Seu nome"
                  onChange={e => setUser({...user, name: e.target.value})}
                />
                <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase">{user.phone}</p>
              </div>
            </div>

            <div className="grid gap-4">
               <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-50 premium-shadow flex items-center justify-between hover-lift">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Nível de Fidelidade</p>
                    <h4 className="font-black text-zinc-900">{userLoyalty.name}</h4>
                  </div>
                  <div className="text-4xl filter drop-shadow-md">{userLoyalty.icon}</div>
               </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-50 premium-shadow hover-lift">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1">Veículo Atual</p>
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-zinc-900 text-lg">{user.vehicleModel}</h4>
                    <span className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">{user.vehiclePlate}</span>
                  </div>
               </div>

               <div className="pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${saveSuccess ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                  >
                    {saveLoading ? (
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saveSuccess ? (
                      <><CheckIcon /> Alterações Salvas!</>
                    ) : (
                      'Salvar Alterações do Perfil'
                    )}
                  </button>
                  {saveSuccess && <p className="text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-4 animate-fade-in">Agora o administrador poderá ver sua foto atualizada.</p>}
               </div>
            </div>
          </div>
        )}
      </main>

      {!isAdmin && !['landing', 'client-login', 'admin-login'].includes(view) && (
        <nav className="fixed bottom-8 left-6 right-6 z-50 animate-slide-up">
          <div className="max-w-md mx-auto glass-effect rounded-[2.5rem] border border-white/20 px-4 py-4 flex justify-around items-center shadow-2xl">
            <button onClick={() => setView('home')} className={`p-3 transition-all ${view === 'home' ? 'text-zinc-900 bg-zinc-50 rounded-xl' : 'text-zinc-300'}`}><CarIcon /></button>
            <button onClick={() => setView('booking')} className={`p-4 rounded-full -translate-y-6 text-white shadow-xl ring-4 ring-white/10`} style={{ backgroundColor: appConfig.theme.primaryColor }}><PlusIcon /></button>
            <button onClick={() => setView('history')} className={`p-3 transition-all ${view === 'history' ? 'text-zinc-900 bg-zinc-50 rounded-xl' : 'text-zinc-300'}`}><CalendarIcon /></button>
            <button onClick={() => setView('reviews')} className={`p-3 transition-all ${view === 'reviews' ? 'text-zinc-900 bg-zinc-50 rounded-xl' : 'text-zinc-300'}`}><ReviewTabIcon /></button>
          </div>
        </nav>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-scale-in text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <TrashIcon />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Excluir Serviço?</h3>
              <p className="text-sm font-medium text-zinc-500">Essa ação removerá o serviço permanentemente da lista.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => executeDeleteService(confirmDeleteId)} 
                className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Sim, Excluir
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)} 
                className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingCategory && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-black text-zinc-900 tracking-tight text-center">Nova Categoria</h3>
            <input 
              autoFocus
              placeholder="Nome da Categoria" 
              className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSaveCategory()}
            />
            <div className="flex gap-3">
              <button 
                onClick={handleSaveCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all disabled:bg-zinc-200"
              >
                Salvar
              </button>
              <button 
                onClick={() => { setIsAddingCategory(false); setNewCategoryName(""); }}
                className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteCategoryName && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-scale-in text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <TrashIcon />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Excluir Categoria?</h3>
              <p className="text-sm font-medium text-zinc-500 italic">"{confirmDeleteCategoryName}"</p>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pt-2">Atenção: Serviços vinculados poderão ficar sem categoria.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => executeDeleteCategory(confirmDeleteCategoryName)} 
                className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Sim, Excluir
              </button>
              <button 
                onClick={() => setConfirmDeleteCategoryName(null)} 
                className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-zinc-900">Configurar Serviço</h3>
            <div className="space-y-4">
              <input placeholder="Nome do Serviço" className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold outline-none" value={editingService.name} onChange={e => setEditingService({ ...editingService, name: e.target.value })} />
              <select className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold outline-none" value={editingService.category} onChange={e => setEditingService({ ...editingService, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-2">
                {(['Pequeno', 'Médio', 'Grande'] as VehicleSize[]).map(size => (
                  <div key={size} className="space-y-1 text-center">
                    <label className="text-[9px] font-black uppercase text-zinc-400">{size}</label>
                    <input type="number" placeholder="Preço" className="w-full p-3 rounded-xl bg-zinc-50 border-none text-center font-bold outline-none" value={editingService.price[size]} onChange={e => setEditingService({ ...editingService, price: { ...editingService.price, [size]: Number(e.target.value) } })} />
                  </div>
                ))}
              </div>
              <input type="number" placeholder="Impacto na Saúde (0-100)" className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold outline-none" value={editingService.healthImpact} onChange={e => setEditingService({ ...editingService, healthImpact: Number(e.target.value) })} />
              <textarea placeholder="Descrição completa..." className="w-full p-4 rounded-2xl bg-zinc-50 border-none font-bold h-32 outline-none" value={editingService.description} onChange={e => setEditingService({ ...editingService, description: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => saveService(editingService)} className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95">Salvar</button>
              <button onClick={() => setEditingService(null)} className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
