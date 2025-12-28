
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodImage = async (base64Data: string, mimeType: string, characterName: string) => {
  const ai = getAI();
  const prompt = `Analyze this food image for a Zootopia-themed fitness app. 
  Act as ${characterName}. 
  Return a JSON object with:
  {
    "name": "Name of the food",
    "calories": number,
    "macros": { "protein": number, "carbs": number, "fat": number },
    "category": "sweet" | "junk" | "healthy" | "protein" | "veggie" | "fruit" | "carb",
    "feedback": "A short, funny, in-character quote from ${characterName} about this meal",
    "zpdStatus": "A ZPD-themed status code like 'CODE RED: METABOLIC EMERGENCY' or 'CLEAR PATH: OPTIMAL FUELING'"
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generatePlanBriefing = async (stats: any, goal: string, characterName: string) => {
  const ai = getAI();
  const prompt = `User Stats: Age ${stats.age}, Height ${stats.height}, Weight ${stats.weight}, Activity ${stats.activityLevel}.
  Goal: ${goal}.
  Coach: ${characterName} from Zootopia.
  
  Write a high-energy Zootopia ZPD mission briefing (max 60 words) for their fitness assignment. 
  Include puns related to Zootopia and the coach's personality.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateCharacterImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `A high-quality 3D Disney/Pixar Zootopia style character render. Full body, cinematic lighting. Character: ${prompt}` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};
