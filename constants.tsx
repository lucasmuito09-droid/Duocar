
import { Service, AppConfig, LoyaltyLevel } from './types';

export const CONFIG: AppConfig = {
  name: "Duocar Estética Automotiva",
  version: "1.1.0",
  theme: {
    primaryColor: "#0F172A",
    secondaryColor: "#22C55E",
    background: "#F8FAFC"
  },
  blockedSlots: [],
  homeTexts: {
    noService: { 
      title: "Seu carro precisa de cuidados", 
      subtitle: "Uma lavagem correta aumenta a vida útil do veículo."
    },
    inProgress: { 
      title: "Cuidado em progresso", 
      subtitle: "Seu carro já está recebendo atenção profissional."
    },
    pendingReview: { 
      title: "Lavagem concluída com sucesso", 
      subtitle: "Avalie o serviço para liberar o diagnóstico completo."
    },
    completed: { 
      title: "Veículo com manutenção em dia", 
      subtitle: "Continue cuidando para manter o desempenho ideal."
    }
  }
};

export const LOYALTY_LEVELS: { name: LoyaltyLevel; required: number; color: string; icon: string; benefit?: string }[] = [
  { name: 'Bronze', required: 0, color: 'text-orange-600', icon: '🥉', benefit: 'Inicie sua jornada Duocar' },
  { name: 'Prata', required: 3, color: 'text-gray-400', icon: '🥈', benefit: 'Acesso a promoções exclusivas' },
  { name: 'Ouro', required: 6, color: 'text-yellow-500', icon: '🥇', benefit: '5% OFF em serviços acima de R$60' },
  { name: 'Diamante', required: 11, color: 'text-cyan-400', icon: '💎', benefit: '5% OFF em qualquer serviço acima de R$60' },
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
  { 
    id: "lavagem_essencial", 
    name: "Lavagem Essencial", 
    category: "Lavagem", 
    price: { "Pequeno": 25, "Médio": 35, "Grande": 50 }, 
    healthImpact: 5, 
    recommendedAfterDays: 7,
    duration: "40 a 60 minutos",
    description: "Limpeza completa do exterior e interior. Inclui aspiração detalhada, limpeza de painel com APC, lavagem técnica dos tapetes, pré-lavagem para remoção de resíduos, esfregação manual com shampoo PH neutro, secagem segura, aplicação de pretinho nos pneus e acabamento final."
  },
  { 
    id: "motor_basico", 
    name: "Motor Básico", 
    category: "Motor", 
    price: { "Pequeno": 50, "Médio": 65, "Grande": 75 }, 
    healthImpact: 10,
    duration: "45 a 60 minutos",
    description: "Limpeza técnica superficial do compartimento do motor. Focada na remoção de poeira e fuligem acumulada nas partes plásticas e metálicas superiores, garantindo um aspecto de novo sem riscos aos componentes eletrônicos."
  },
  { 
    id: "motor_detalhado", 
    name: "Motor Detalhado", 
    category: "Motor", 
    price: { "Pequeno": 80, "Médio": 95, "Grande": 120 }, 
    healthImpact: 20,
    duration: "1:30h a 2:00h",
    description: "Limpeza profunda e técnica de todo o cofre do motor. Utiliza desengraxantes específicos e pincéis de detalhamento. Finaliza com a aplicação de verniz de motor para proteção das partes plásticas e borrachas contra ressecamento."
  },
  { 
    id: "hig_bancos", 
    name: "Higienização de Bancos", 
    category: "Higienização Interna", 
    price: { "Pequeno": 140, "Médio": 160, "Grande": 190 }, 
    healthImpact: 25,
    duration: "3 a 5 horas",
    description: "Processo de extração profunda em bancos de tecido. Remove manchas, odores, ácaros e fungos. Utiliza máquinas extratoras de alta pressão e produtos bactericidas que renovam a cor e o toque do tecido."
  },
  { 
    id: "hig_couro", 
    name: "Higienização de Couro", 
    category: "Higienização Interna", 
    price: { "Pequeno": 160, "Médio": 190, "Grande": 220 }, 
    healthImpact: 30,
    duration: "1:30h a 2:30h",
    description: "Limpeza técnica dos assentos em couro com pH balanceado para remover gordura e sujeira encrustada. Acompanha hidratação profunda com condicionadores que devolvem a maciez e evitam rachaduras precoces."
  },
  { 
    id: "hig_teto", 
    name: "Higienização de Teto", 
    category: "Higienização Interna", 
    price: { "Pequeno": 80, "Médio": 100, "Grande": 150 }, 
    healthImpact: 15,
    duration: "1:00h a 1:30h",
    description: "Limpeza controlada do forro interno. Remove manchas de gordura e marcas de uso. O processo é feito com pouca umidade para preservar a integridade da cola do teto e evitar desprendimentos."
  },
  { 
    id: "hig_carpete", 
    name: "Higienização de Carpete", 
    category: "Higienização Interna", 
    price: { "Pequeno": 120, "Médio": 150, "Grande": 180 }, 
    healthImpact: 20,
    duration: "2 a 3 horas",
    description: "Extração de sujeira pesada acumulada na base do veículo. Ideal para carros que frequentam áreas com terra ou areia. Elimina odores impregnados e devolve o aspecto de higiene total ao assoalho."
  },
  { 
    id: "plastico_interno", 
    name: "Tratamento de Plásticos Internos", 
    category: "Tratamento de Plásticos", 
    price: { "Pequeno": 40, "Médio": 50, "Grande": 60 }, 
    healthImpact: 10,
    duration: "40 a 50 minutos",
    description: "Limpeza minuciosa com pincéis em todas as frestas do painel e portas. Aplicação de condicionador fosco com proteção UV que não deixa aspecto engordurado e protege contra o desbotamento causado pelo sol."
  },
  { 
    id: "plastico_externo", 
    name: "Renovação de Plásticos Externos", 
    category: "Tratamento de Plásticos", 
    price: { "Pequeno": 30, "Médio": 40, "Grande": 50 }, 
    healthImpact: 10,
    duration: "30 a 45 minutos",
    description: "Restauração da cor original de para-choques e frisos desbotados. Utiliza revitalizadores de alta performance que criam uma barreira hidrofóbica contra a chuva e raios solares por semanas."
  },
  { 
    id: "cera_simples", 
    name: "Enceramento Simples", 
    category: "Proteção e Brilho", 
    price: { "Pequeno": 20, "Médio": 30, "Grande": 40 }, 
    healthImpact: 10,
    duration: "30 a 40 minutos",
    description: "Aplicação de cera líquida ou em spray de alta qualidade. Oferece brilho instantâneo e uma camada básica de proteção que facilita as próximas lavagens e repele poeira leve."
  },
  { 
    id: "cera_espelhada", 
    name: "Enceramento Espelhado", 
    category: "Proteção e Brilho", 
    price: { "Pequeno": 40, "Médio": 50, "Grande": 70 }, 
    healthImpact: 15,
    duration: "50 a 70 minutos",
    description: "Utiliza ceras em pasta com polímeros sintéticos. Proporciona um brilho 'molhado' intenso e alta repelência à água. A durabilidade da proteção é superior, resistindo a diversas lavagens."
  },
  { 
    id: "cera_premium", 
    name: "Enceramento Premium", 
    category: "Proteção e Brilho", 
    price: { "Pequeno": 80, "Médio": 100, "Grande": 150 }, 
    healthImpact: 25,
    duration: "1:15h a 1:45h",
    description: "O ápice da proteção em cera. Aplicação manual de Carnaúba pura ou Selantes de alta tecnologia. Cria uma camada de sacrifício sobre o verniz, com brilho profundo e toque aveludado incomparável."
  },
  { 
    id: "polimento_vidros", 
    name: "Polimento de Vidros", 
    category: "Vidros", 
    price: { "Pequeno": 120, "Médio": 150, "Grande": 180 }, 
    healthImpact: 20,
    duration: "1:30h a 2:30h",
    description: "Remoção técnica de manchas de chuva ácida e contaminações que a lavagem comum não tira. Melhora drasticamente a visibilidade em dias de chuva e o funcionamento das palhetas."
  },
  { 
    id: "anti_embacante", 
    name: "Tratamento Anti-Embaçante", 
    category: "Vidros", 
    price: { "Pequeno": 120, "Médio": 120, "Grande": 150 }, 
    healthImpact: 15,
    duration: "30 a 50 minutos",
    description: "Limpeza química interna dos vidros seguida da aplicação de selante anti-embaçante. Impede a formação de condensação interna, garantindo segurança total em climas frios e úmidos."
  },
  { 
    id: "revitalizacao_pintura", 
    name: "Revitalização de Pintura", 
    category: "Pintura", 
    price: { "Pequeno": 140, "Médio": 160, "Grande": 180 }, 
    healthImpact: 30,
    duration: "3 a 5 horas",
    description: "Polimento comercial de etapa única. Remove riscos superficiais (teias de aranha), oxidação leve e devolve a vivacidade da cor original. Finalizado com selante protetor."
  },
  { 
    id: "polimento_farois", 
    name: "Polimento Técnico de Faróis", 
    category: "Faróis", 
    price: { "Pequeno": 150, "Médio": 180, "Grande": 200 }, 
    healthImpact: 20,
    duration: "1:00h a 1:30h",
    description: "Processo de lixamento controlado para remover o amarelado e o fosco. Finalizado com polimento de alto brilho e aplicação de proteção UV ou Verniz para evitar que voltem a amarelar."
  },
  { 
    id: "revitalizacao_farois", 
    name: "Limpeza de Faróis", 
    category: "Faróis", 
    price: { "Pequeno": 80, "Médio": 100, "Grande": 130 }, 
    healthImpact: 15,
    duration: "30 a 50 minutos",
    description: "Limpeza química e polimento leve para faróis que estão apenas começando a perder o brilho. Recupera a transparência básica e melhora a iluminação noturna."
  },
  { 
    id: "combo_chuva", 
    name: "Combo: Chuva Ácida + Lavagem", 
    category: "Serviços Combinados", 
    price: { "Pequeno": 65, "Médio": 85, "Grande": 110 }, 
    healthImpact: 20,
    duration: "1:30h a 2:15h",
    description: "Lavagem Essencial completa somada ao tratamento de remoção de chuva ácida nos vidros principais (para-brisa e luneta). O melhor custo-benefício para quem quer visibilidade e limpeza."
  },
  { 
    id: "combo_finalizacao", 
    name: "Combo: Proteção + Lavagem", 
    category: "Serviços Combinados", 
    price: { "Pequeno": 40, "Médio": 45, "Grande": 60 }, 
    healthImpact: 15,
    duration: "1:15h a 1:45h",
    description: "Lavagem Essencial reforçada com Enceramento Espelhado e Condicionamento de Plásticos Internos. Deixa o carro protegido e com aspecto de exposição por mais tempo."
  },
];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

export const WHATSAPP_NUMBER = "5524981481285";

export const QUIZ_QUESTIONS = [
  { 
    text: "Qual o brilho atual da pintura?", 
    options: ["Brilhando como novo", "Opaco/Sem vida", "Muitos riscos circulares", "Manchas de sol/queimado"] 
  },
  { 
    text: "Como estão os bancos por dentro?", 
    options: ["Limpos", "Manchados/Sujeira visível", "Com mau odor", "Couro ressecado/Sem brilho"] 
  },
  { 
    text: "Como está a limpeza do motor?", 
    options: ["Limpo", "Muita poeira", "Vazamentos/Graxa pesada", "Nunca limpei"] 
  },
  { 
    text: "Vidros embaçam ou têm manchas?", 
    options: ["Sempre transparentes", "Manchas de 'Chuva Ácida'", "Embaçam muito no frio", "Gordurosos por dentro"] 
  },
  { 
    text: "Os plásticos externos (frisos/para-choques)?", 
    options: ["Pretos e hidratados", "Esbranquiçados pelo sol", "Ressecados", "Manchados de cera"] 
  },
  { 
    text: "Como está o teto do carro?", 
    options: ["Impecável", "Escurecido/Com pó", "Manchas de gordura/mão", "Descolando"] 
  },
  { 
    text: "Qual a frequência de uso do carro?", 
    options: ["Carro de final de semana", "Uso diário (trabalho)", "Trabalho com passageiros (Uber)", "Viagens constantes"] 
  },
  { 
    text: "Onde o carro costuma ficar estacionado?", 
    options: ["Garagem coberta", "No sol e chuva", "Debaixo de árvores", "Próximo à construção/poeira"] 
  },
  { 
    text: "Qual foi a última vez que encerou?", 
    options: ["Mês passado", "Há mais de 6 meses", "Nunca encerei", "Não sei dizer"] 
  },
  { 
    text: "Qual seu maior desejo para o carro hoje?", 
    options: ["Proteção duradoura", "Limpeza interna profunda", "Recuperar o brilho total", "Apenas uma lavagem rápida"] 
  }
];
