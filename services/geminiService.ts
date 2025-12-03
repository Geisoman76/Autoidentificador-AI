import { GoogleGenAI, Type } from "@google/genai";
import { VehicleData } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const identifyVehicle = async (base64Image: string, mimeType: string = "image/jpeg"): Promise<VehicleData> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analise esta imagem. Se houver um veículo (carro, moto, caminhão, etc.), identifique-o com precisão.
    Forneça as seguintes informações em Português do Brasil:
    - Marca (Make)
    - Modelo (Model)
    - Faixa de Ano Estimada (Year Range based on visual cues)
    - Tipo de Carroceria (SUV, Sedan, Hatchback, etc.)
    - Motorização provável (Engine)
    - Transmissão provável
    - Resumo de performance (0-100, cavalos aproximados)
    - Uma descrição detalhada e atraente do veículo (2 parágrafos).
    - Lista de 4-5 características principais visuais ou técnicas.
    - isVehicle: true se for um veículo, false se não for.
    - confidenceScore: 0 a 100 baseado na clareza da imagem.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            yearRange: { type: Type.STRING },
            bodyType: { type: Type.STRING },
            engine: { type: Type.STRING },
            transmission: { type: Type.STRING },
            performance: { type: Type.STRING },
            description: { type: Type.STRING },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isVehicle: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VehicleData;
    } else {
      throw new Error("Não foi possível gerar uma resposta.");
    }
  } catch (error) {
    console.error("Erro ao identificar veículo:", error);
    throw error;
  }
};