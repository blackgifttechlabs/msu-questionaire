
import { GoogleGenAI } from "@google/genai";

export const analyzeFeedback = async (feedbacks: string[]): Promise<string> => {
  if (!process.env.API_KEY) return "API key missing. Cannot provide insights.";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these open-ended responses from farmers in Zimbabwe about their challenges with Finger Millet and provide a concise summary of the top 3 themes and suggestions: \n\n${feedbacks.join("\n")}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate insights.";
  }
};
