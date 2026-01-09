
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProjectOverview, RiskItem } from "./types";

/**
 * AI를 사용하여 건설 현장의 위험성평가 항목을 생성합니다.
 */
export const generateRiskAssessment = async (
  overview: ProjectOverview,
  workTypes: string
): Promise<RiskItem[]> => {
  // Initialization must use the named apiKey parameter from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // For complex text tasks like multi-factor risk analysis, gemini-3-pro-preview is preferred.
  const modelName = 'gemini-3-pro-preview';
  
  const prompt = `
    다음 공사 개요와 공종을 바탕으로 한국의 산업안전보건법 및 KOSHA 가이드를 준수하는 위험성평가표를 작성해줘.
    
    공사개요:
    - 공사명: ${overview.projectName}
    - 현장위치: ${overview.location}
    - 공사기간: ${overview.duration}
    - 상세내용: ${overview.description}
    
    대상 공종: ${workTypes}
    
    각 공종별로 최소 2개 이상의 위험요인을 도출하고, 그에 따른 위험등급(상, 중, 하)과 구체적인 안전대책을 제시해줘.
    응답은 반드시 지정된 JSON 형식으로만 작성해줘.
  `;

  try {
    // Calling generateContent with the model and structured configuration.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              workType: { type: Type.STRING, description: "공종 (예: 비계 설치, 터파기 등)" },
              riskFactor: { type: Type.STRING, description: "위험요인 (어떤 상황에서 어떤 사고가 발생할 수 있는지)" },
              riskLevel: { type: Type.STRING, description: "위험등급 (상, 중, 하 중 하나)" },
              safetyMeasure: { type: Type.STRING, description: "안전대책 (구체적인 관리 및 기술적 대책)" }
            },
            required: ["workType", "riskFactor", "riskLevel", "safetyMeasure"]
          }
        }
      }
    });

    // Access the response text directly via the .text property (not a method).
    const text = response.text;
    if (!text) {
      throw new Error("AI로부터 유효한 응답을 받지 못했습니다.");
    }

    return JSON.parse(text) as RiskItem[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Robust error handling for common API issues.
    if (error.message?.includes("API key")) {
      throw new Error("API Key 관련 설정 오류가 발생했습니다.");
    }
    throw new Error(error.message || "위험성 평가 생성 중 오류가 발생했습니다.");
  }
};
