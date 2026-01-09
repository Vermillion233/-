
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다. Vercel 환경 변수 설정을 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // For complex text tasks like multi-factor risk analysis, gemini-3-pro-preview is preferred.
  const modelName = 'gemini-3-pro-preview';
  
  const prompt = `
    당신은 한국의 산업안전보건법 및 건설기술진흥법에 정통한 건설안전 전문가입니다.
    다음 공사 현장 개요와 대상 공종을 바탕으로 '위험성평가표'를 작성해 주세요.

    [현장 정보]
    - 공사명: ${overview.projectName}
    - 위치: ${overview.location}
    - 기간: ${overview.duration}
    - 특성: ${overview.description}

    [평가 대상 공종]
    ${workTypes}

    [작성 가이드라인]
    1. 각 공종별로 최소 2개 이상의 구체적인 유해·위험요인을 도출하세요.
    2. 위험요인은 '무엇을 하다가(행동/상황), 어떤 결함/원인으로, 어떤 사고(떨어짐, 맞음, 끼임 등)가 발생함'의 형식으로 구체적으로 적으세요.
    3. 위험등급은 상(위험), 중(보통), 하(낮음)로 분류하세요.
    4. 안전대책은 기술적(시설), 관리적(교육/수칙), 인적(보호구) 측면을 모두 포함하여 실질적인 대책을 제시하세요.
    5. 응답은 반드시 한국어로, 지정된 JSON 형식으로만 작성하세요.
  `;

  try {
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
              workType: { type: Type.STRING, description: "공종 명칭" },
              riskFactor: { type: Type.STRING, description: "유해 및 위험요인" },
              riskLevel: { type: Type.STRING, enum: ["상", "중", "하"], description: "위험등급" },
              safetyMeasure: { type: Type.STRING, description: "구체적인 안전대책 (줄바꿈 포함 가능)" }
            },
            required: ["workType", "riskFactor", "riskLevel", "safetyMeasure"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI로부터 유효한 응답을 받지 못했습니다.");
    }

    return JSON.parse(text) as RiskItem[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key")) {
      throw new Error("API Key가 유효하지 않습니다. Vercel 설정을 확인해 주세요.");
    }
    throw new Error(error.message || "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
