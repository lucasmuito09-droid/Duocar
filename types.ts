
export type Role = 'cliente' | 'admin';
export type VehicleSize = 'Pequeno' | 'Médio' | 'Grande';
export type BookingStatus = 'Agendado' | 'Em Execução' | 'Concluído' | 'Cancelado';
export type LoyaltyLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';

export interface User {
  id: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleSize: VehicleSize;
  healthScore: number;
  role: Role;
  lastServiceDate?: string;
  photo?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: Record<VehicleSize, number>;
  healthImpact: number;
  recommendedAfterDays?: number;
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
}
