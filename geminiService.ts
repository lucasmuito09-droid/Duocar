
import { GoogleGenAI } from "@google/genai";
import { User, Booking, Service } from "./types";
import { SERVICES } from "./constants";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCarCareAdvice = async (user: User) => {
  try {
    const prompt = `
      Você é o "Especialista Duocar", um consultor de estética automotiva amigável, educador e empático.
      
      CONTEXTO:
      - Cliente: ${user.name}
      - Veículo: ${user.vehicleModel} (${user.vehicleSize})
      - Score de Saúde: ${user.healthScore}/100.
      
      DIRETRIZES:
      - Use psicologia emocional: "Cuidar do seu carro é cuidar do seu bem-estar".
      - Seja educativo: explique POR QUE o cuidado é importante (valorização, proteção, conforto).
      - Se o score for baixo (<40), use um tom de preocupação amigável.
      - Se o score for alto (>80), parabenize.
      - Forneça conselhos curtos.

      Responda em português.
    `;

    // Removed maxOutputTokens as it requires thinkingBudget for Gemini 3 series models
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
    return "Um carro bem cuidado reflete o carinho que você tem por si mesmo. Vamos manter o brilho em dia?";
  }
};

export const askSpecialist = async (user: User, question: string) => {
  try {
    const prompt = `
      Você é o "Especialista Duocar", consultor de estética automotiva. 
      Responda à dúvida do cliente ${user.name} sobre seu ${user.vehicleModel}.
      
      PERGUNTA: "${question}"
      
      REGRAS:
      - Seja breve, técnico mas acessível.
      - Sempre foque em preservação e estética.
      - Se ele perguntar sobre algo que não fazemos, sugira o serviço mais próximo da nossa lista: ${SERVICES.map(s => s.name).join(', ')}.
      - Use um tom encorajador.
    `;

    // Removed maxOutputTokens as it requires thinkingBudget for Gemini 3 series models
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
      Você é o especialista técnico da Duocar. O cliente respondeu um quiz de diagnóstico.
      
      DADOS DO VEÍCULO: ${user.vehicleModel} (${user.vehicleSize})
      RESPOSTAS DO QUIZ:
      ${quizSummary}
      
      SERVIÇOS DISPONÍVEIS:
      ${serviceList}
      
      OBJETIVO:
      Identifique a maior "dor" do cliente e recomende o serviço ideal com base no quiz.
      Seja breve e use um tom de "Veredito Amigável".
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
