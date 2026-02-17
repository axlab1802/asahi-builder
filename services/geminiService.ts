import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { MapItem } from "../types";

// Define the response schema using the GenAI Type enum
const mapActionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "Conversational response to the user.",
    },
    actions: {
      type: Type.ARRAY,
      description: "List of actions to perform on the map.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["add", "remove", "update"],
            description: "Type of action to perform.",
          },
          targetName: {
            type: Type.STRING,
            description: "The exact name of the item to remove or update. Required for remove/update.",
          },
          item: {
            type: Type.OBJECT,
            description: "The item details for add/update actions.",
            properties: {
              name: { type: Type.STRING },
              emoji: { type: Type.STRING },
              type: {
                type: Type.STRING,
                enum: ["landmark", "infrastructure", "nature", "entertainment", "transport"],
              },
              lat: { type: Type.NUMBER, description: "Latitude (approx 35.7)" },
              lng: { type: Type.NUMBER, description: "Longitude (approx 140.6)" },
              description: { type: Type.STRING },
              size: { type: Type.NUMBER },
              population: { type: Type.NUMBER, description: "Estimated population increase" },
              taxRevenue: { type: Type.NUMBER, description: "Estimated annual tax revenue increase in JPY" },
            },
            required: ["name", "emoji", "type", "lat", "lng", "population", "taxRevenue"],
          },
        },
        required: ["type"],
      },
    },
  },
  required: ["text", "actions"],
};

export class GeminiService {
  private ai: GoogleGenAI;
  private modelId: string = "gemini-2.5-flash";

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing!");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || "" });
  }

  async processUserRequest(
    userPrompt: string,
    currentItems: MapItem[]
  ): Promise<any> {
    try {
      // We send the current map state as context so the AI knows what exists
      const mapContext = `
      Current Map State (JSON):
      ${JSON.stringify(currentItems.map(i => ({ 
        name: i.name, 
        lat: i.lat, 
        lng: i.lng, 
        type: i.type, 
        population: i.population,
        taxRevenue: i.taxRevenue 
      })))}
      `;

      const finalPrompt = `
      ${mapContext}
      
      User Request: "${userPrompt}"
      `;

      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: finalPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: mapActionSchema,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        text: "申し訳ありません。リクエストの処理中にエラーが発生しました。もう一度お試しください。",
        actions: [],
      };
    }
  }
}

export const geminiService = new GeminiService();