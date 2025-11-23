
import { GoogleGenAI, Type } from "@google/genai";
import { TourPackageData } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePackageDetails = async (
  destination: string, 
  duration: number,
  purpose: string,
  accommodation: string,
  peopleCount: number
): Promise<TourPackageData> => {
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }

  const prompt = `
    Create a comprehensive travel agency tour package for "${destination}" for ${duration} days.
    
    Context:
    - Travel Theme/Purpose: ${purpose} (e.g., Honeymoon, Family Trip, Backpacking, Luxury).
    - Accommodation Standard/Type: ${accommodation} (e.g., 5-star hotel, Pool Villa).
    - Group Size: ${peopleCount} people.
    
    The output must be in Korean.
    
    Include:
    1. A catchy marketing title for the package that reflects the theme and accommodation.
    2. An estimated price per person in Korean Won (KRW) formatted nicely (e.g., 1,200,000원).
    3. 3 to 5 key selling points (Product Points) that make this tour special.
    4. A HIGHLY DETAILED day-by-day itinerary. 
       - For each day, provide a 'title', a brief 'description' (overview of the day), and a 'schedule' list.
       - The 'schedule' must contain specific time slots (e.g., "09:00", "12:00", "오후", "저녁") and specific activities (e.g., "호텔 조식", "00 관광지 방문", "현지 맛집 중식").
       - Ensure the accommodation mentioned in the itinerary matches the requested standard (${accommodation}).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy marketing title" },
            destination: { type: Type.STRING, description: "The name of the destination" },
            price: { type: Type.STRING, description: "Per person price formatted with currency" },
            points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 key selling points"
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  schedule: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: "Time of day (e.g. 09:00, Morning)" },
                        activity: { type: Type.STRING, description: "Activity detail" }
                      },
                      required: ["time", "activity"]
                    }
                  }
                },
                required: ["day", "title", "description", "schedule"]
              }
            }
          },
          required: ["title", "destination", "price", "points", "itinerary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text);
    
    // Inject the input data back into the object
    return {
      ...data,
      duration,
      purpose,
      accommodation,
      peopleCount,
    };

  } catch (error) {
    console.error("Error generating package:", error);
    throw error;
  }
};