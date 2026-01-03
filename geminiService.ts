
import { GoogleGenAI } from "@google/genai";
import { User, Booking, Service } from "./types";
import { SERVICES } from "./constants";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCarCareAdvice = async (user: User) => {
  try {
    const prompt = `
      Você é o "Especialista Duocar". Sua missão é converter o score de saúde do carro em uma ação de agendamento usando EMOÇÃO.
      
      CONTEXTO:
      - Cliente: ${user.name}
      - Veículo: ${user.vehicleModel}
      - Score de Saúde: ${user.healthScore}/100.
      
      REGRAS DE OURO (Siga rigorosamente):
      1. NUNCA use listas, tópicos ou textos longos.
      2. Máximo de 250 caracteres (aproximadamente 2 a 3 frases curtas).
      3. Seja persuasivo: Se o score for baixo (${user.healthScore}%), fale sobre "resgatar o orgulho" ou "proteger seu investimento".
      4. Termine com uma pergunta instigante ou convite para tirar dúvida.
      
      EXEMPLO DE TOM:
      "Olá ${user.name}! Notei que seu ${user.vehicleModel} está com a saúde em ${user.healthScore}%. Cuidar da estética é mais que beleza, é valorizar seu patrimônio e seu bem-estar. Que tal tirarmos suas dúvidas sobre o melhor tratamento para ele agora?"

      Responda em português de forma direta e calorosa.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Manter seu carro limpo é preservar o valor do seu patrimônio.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Seu carro reflete quem você é. Vamos devolver o brilho que ele merece hoje?";
  }
};

export const askSpecialist = async (user: User, question: string) => {
  try {
    const prompt = `
      Você é o "Especialista Duocar", consultor de estética automotiva. 
      Responda à dúvida do cliente ${user.name} sobre seu ${user.vehicleModel}.
      
      PERGUNTA: "${question}"
      
      REGRAS:
      - Seja breve (máximo 3 frases).
      - Resposta técnica mas acessível.
      - Se a dúvida envolver um problema, sugira o serviço ideal da nossa lista: ${SERVICES.map(s => s.name).join(', ')}.
      - Tom encorajador e profissional.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Essa é uma excelente pergunta! O ideal para o seu caso seria uma avaliação técnica aqui na Duocar.";
  } catch (error) {
    console.error("Error asking Gemini:", error);
    return "Desculpe, estou processando muitas informações. Pode repetir a pergunta ou nos chamar no WhatsApp?";
  }
};

export const getQuizRecommendation = async (user: User, quizData: Record<string, string>) => {
  try {
    const quizSummary = Object.entries(quizData).map(([q, a]) => `- ${q}: ${a}`).join('\n');
    const serviceList = SERVICES.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');

    const prompt = `
      Você é o especialista técnico da Duocar.
      Com base no diagnóstico do ${user.vehicleModel}, dê um veredito curto e persuasivo.
      
      DADOS:
      ${quizSummary}
      
      RECOMENDE UM DESTES:
      ${serviceList}
      
      REGRAS: Máximo 2 frases. Seja direto na solução.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "Seu carro merece um cuidado especial para brilhar como novo!";
  } catch (error) {
    console.error("Error in Quiz AI:", error);
    return "Seu carro precisa de uma atenção especial. Agende uma avaliação agora!";
  }
};
