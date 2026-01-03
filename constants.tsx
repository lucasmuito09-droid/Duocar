
import { Service, AppConfig, LoyaltyLevel } from './types';

export const CONFIG: AppConfig = {
  name: "Duocar Estética Automotiva",
  version: "1.1.0",
  theme: {
    primaryColor: "#0F172A",
    secondaryColor: "#22C55E",
    background: "#F8FAFC"
  }
};

export const LOYALTY_LEVELS: { name: LoyaltyLevel; required: number; color: string; icon: string }[] = [
  { name: 'Bronze', required: 1, color: 'text-orange-600', icon: '🥉' },
  { name: 'Prata', required: 3, color: 'text-gray-400', icon: '🥈' },
  { name: 'Ouro', required: 6, color: 'text-yellow-500', icon: '🥇' },
  { name: 'Diamante', required: 10, color: 'text-cyan-400', icon: '💎' },
];

export const CATEGORIES = [
  "Lavagem",
  "Motor",
  "Higienização Interna",
  "Tratamento de Plásticos",
  "Proteção e Brilho",
  "Vidros",
  "Pintura",
  "Faróis",
  "Serviços Combinados"
];

export const SERVICES: Service[] = [
  { id: "lavagem_essencial", name: "Lavagem Essencial", category: "Lavagem", price: { "Pequeno": 25, "Médio": 35, "Grande": 50 }, healthImpact: 5, recommendedAfterDays: 7 },
  { id: "motor_basico", name: "Motor Básico", category: "Motor", price: { "Pequeno": 50, "Médio": 65, "Grande": 75 }, healthImpact: 10 },
  { id: "motor_detalhado", name: "Motor Detalhado", category: "Motor", price: { "Pequeno": 80, "Médio": 95, "Grande": 120 }, healthImpact: 20 },
  { id: "hig_bancos", name: "Higienização de Bancos", category: "Higienização Interna", price: { "Pequeno": 140, "Médio": 160, "Grande": 190 }, healthImpact: 25 },
  { id: "hig_couro", name: "Higienização de Couro", category: "Higienização Interna", price: { "Pequeno": 160, "Médio": 190, "Grande": 220 }, healthImpact: 30 },
  { id: "hig_teto", name: "Higienização de Teto", category: "Higienização Interna", price: { "Pequeno": 80, "Médio": 100, "Grande": 150 }, healthImpact: 15 },
  { id: "hig_carpete", name: "Higienização de Carpete", category: "Higienização Interna", price: { "Pequeno": 120, "Médio": 150, "Grande": 180 }, healthImpact: 20 },
  { id: "plastico_interno", name: "Plásticos Internos – Tratamento", category: "Tratamento de Plásticos", price: { "Pequeno": 40, "Médio": 50, "Grande": 60 }, healthImpact: 10 },
  { id: "plastico_externo", name: "Plásticos Externos – Renovação", category: "Tratamento de Plásticos", price: { "Pequeno": 30, "Médio": 40, "Grande": 50 }, healthImpact: 10 },
  { id: "cera_espelhada", name: "Cera Espelhada", category: "Proteção e Brilho", price: { "Pequeno": 40, "Médio": 50, "Grande": 70 }, healthImpact: 15 },
  { id: "cera_premium", name: "Cera Premium", category: "Proteção e Brilho", price: { "Pequeno": 80, "Médio": 100, "Grande": 150 }, healthImpact: 25 },
  { id: "polimento_vidros", name: "Polimento de Vidros", category: "Vidros", price: { "Pequeno": 120, "Médio": 150, "Grande": 180 }, healthImpact: 20 },
  { id: "anti_embacante", name: "Tratamento Anti-Embaçante", category: "Vidros", price: { "Pequeno": 120, "Médio": 120, "Grande": 150 }, healthImpact: 15 },
  { id: "revitalizacao_pintura", name: "Revitalização de Pintura", category: "Pintura", price: { "Pequeno": 140, "Médio": 160, "Grande": 180 }, healthImpact: 30 },
  { id: "polimento_farois", name: "Polimento de Faróis", category: "Faróis", price: { "Pequeno": 150, "Médio": 180, "Grande": 200 }, healthImpact: 20 },
  { id: "revitalizacao_farois", name: "Revitalização de Faróis", category: "Faróis", price: { "Pequeno": 80, "Médio": 100, "Grande": 130 }, healthImpact: 15 },
  { id: "combo_chuva", name: "Remoção de Chuva + Lavagem Essencial", category: "Serviços Combinados", price: { "Pequeno": 65, "Médio": 85, "Grande": 110 }, healthImpact: 20 },
  { id: "combo_finalizacao", name: "Finalização + Lavagem Essencial", category: "Serviços Combinados", price: { "Pequeno": 40, "Médio": 45, "Grande": 60 }, healthImpact: 15 },
];

export const TIME_SLOTS = ["08:00", "10:00", "14:00", "16:00"];

export const WHATSAPP_NUMBER = "5524981481285";
