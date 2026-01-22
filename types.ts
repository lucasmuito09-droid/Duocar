
export type VehicleSize = 'Pequeno' | 'Médio' | 'Grande';
export type BookingStatus = 'Agendado' | 'Em Execução' | 'Concluído' | 'Cancelado';
export type LoyaltyLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';

export interface AppNotification {
  id: string;
  message: string;
  bookingId: string;
  resolved: boolean;
  type: 'review_request';
}

export interface User {
  id: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleSize: VehicleSize;
  healthScore: number;
  lastServiceDate?: string;
  photo?: string;
  notifications?: AppNotification[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: Record<VehicleSize, number>;
  healthImpact: number;
  recommendedAfterDays?: number;
  description?: string;
  duration?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  vehiclePlate: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppConfig {
  name: string;
  version: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    background: string;
  };
  blockedSlots: string[]; // Formato: "YYYY-MM-DD_HH:mm"
  homeTexts: {
    noService: { title: string; subtitle: string };
    inProgress: { title: string; subtitle: string };
    pendingReview: { title: string; subtitle: string };
    completed: { title: string; subtitle: string };
  };
}

export interface ChatMessage {
  role: 'user' | 'specialist';
  text: string;
}
