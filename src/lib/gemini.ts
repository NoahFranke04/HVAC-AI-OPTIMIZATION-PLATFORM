import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHvacRecommendations(homeData: any) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are an expert HVAC engineer. Analyze this home profile and provide advanced energy efficiency recommendations:
    Square Footage: ${homeData.squareFootage}
    Location: ${homeData.location}
    Insulation: ${homeData.insulationLevel}
    HVAC Type: ${homeData.hvacType}
    Occupancy: ${homeData.occupancy}
    
    Provide recommendations in JSON format. For each recommendation, include:
    - title: Clear, professional title
    - description: Actionable advice
    - reasoning: Detailed explanation of WHY this helps based on the user's specific data
    - confidence: Score from 0-1 based on data quality
    - estimatedSavings: Annual USD savings (realistic estimate)
    - roi: Years to break even
    - priority: 1 (Critical) to 5 (Optional)`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              estimatedSavings: { type: Type.NUMBER },
              roi: { type: Type.NUMBER },
              priority: { type: Type.NUMBER }
            },
            required: ["title", "description", "reasoning", "confidence", "estimatedSavings", "roi", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function analyzeBlueprint(imageUrl: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Expert Blueprint Analysis:
  1. Identify all room dimensions and total square footage.
  2. Detect existing HVAC locations (if visible).
  3. Suggest optimal duct routing to minimize static pressure.
  4. Calculate required BTU capacity for cooling and heating based on layout.
  5. Identify potential thermal bridges or insulation gaps.
  
  Format the output in clear Markdown with sections.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageUrl.split(',')[1] } }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("Blueprint Analysis Error:", error);
    return "Analysis failed.";
  }
}
