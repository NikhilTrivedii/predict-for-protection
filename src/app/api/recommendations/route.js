import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const data = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an elite, compassionate cardiologist AI for PredictForProtection. 
      Analyze the following patient cardiovascular indicators and generate 2 highly specific, personalized health recommendations.
      
      Patient Data:
      ${JSON.stringify(data)}

      CRITICAL RULES:
      1. Exactly 70% of the dietary suggestions (Dos and Donts) MUST be authentic Indian foods and contextualized to the specific risk score.
      2. Return the response STRICTLY as a JSON array matching this exact format:
      [
        {
          "category": "Diet & Nutrition",
          "title": "Heart Healthy Indian Diet",
          "dos": ["Eat X...", "Consume Y..."],
          "donts": ["Avoid Z...", "Limit W..."],
          "time_guide": "When to eat or duration..."
        },
        {
          "category": "Exercise & Activity",
          "title": "Daily Cardiovascular Routine",
          "dos": ["..."],
          "donts": ["..."],
          "time_guide": "..."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
          responseMimeType: "application/json",
      }
    });

    const recommendations = JSON.parse(response.text);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
  }
}
