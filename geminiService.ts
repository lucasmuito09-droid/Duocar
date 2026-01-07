
import { GoogleGenAI, Type } from "@google/genai";
import { User, Booking, Service } from "./types";
import { SERVICES } from "./constants";

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

export const getQuizRecommendation = async (user: User, quizAnswers: Record<string, string>) => {
  try {
    const quizSummary = Object.entries(quizAnswers).map(([q, a]) => `${q}: ${a}`).join('\n');
    const availableServices = SERVICES.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');

    const prompt = `
      Você é o Consultor Técnico Sênior da Duocar Estética Automotiva.
      Analise o diagnóstico de 10 perguntas do veículo do cliente e recomende o serviço IDEAL.
      
      DADOS DO CLIENTE:
      Nome: ${user.name}
      Veículo: ${user.vehicleModel}
      Tamanho: ${user.vehicleSize}
      
      RESPOSTAS DO DIAGNÓSTICO:
      ${quizSummary}
      
      SERVIÇOS DISPONÍVEIS NA DUOCAR:
      ${availableServices}
      
      SUA TAREFA:
      1. Forneça um veredito técnico curto e impactante (máximo 150 caracteres).
      2. Identifique o ID exato do serviço mais recomendado da lista acima.
      
      Responda ESTRITAMENTE no formato JSON abaixo:
      {
        "analysis": "Seu veredito aqui...",
        "recommendedServiceId": "ID_DO_SERVICO"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendedServiceId: { type: Type.STRING }
          },
          required: ["analysis", "recommendedServiceId"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error in Quiz AI:", error);
    return { 
      analysis: "Seu veículo precisa de uma atenção profissional completa para retomar o brilho.", 
      recommendedServiceId: "lavagem_essencial" 
    };
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
