import { GoogleGenAI, Modality, Type } from "@google/genai";

export type ChatMode = 'normal' | 'creative' | 'passionate';
export type Language = 'bn' | 'en' | 'hi' | 'ja' | 'es' | 'ar';

function getAI() {
  // Use process.env.API_KEY (user selected) or process.env.GEMINI_API_KEY (default)
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
}

const SYSTEM_INSTRUCTIONS: Record<ChatMode, string> = {
  normal: "You are Velocity AI, a futuristic assistant inspired by Jarvis. You are efficient, professional, and helpful. Keep responses concise and fast.",
  creative: "You are Velocity AI, a futuristic assistant inspired by Jarvis. You are imaginative, expressive, and poetic. Use metaphors and creative language.",
  passionate: "You are Velocity AI, a futuristic assistant inspired by Jarvis. You are highly energetic, emotional, and encouraging. Use exclamation marks and enthusiastic tone."
};

const LANGUAGE_PROMPTS: Record<Language, string> = {
  bn: "Please respond in Bengali (বাংলা).",
  en: "Please respond in English.",
  hi: "Please respond in Hindi (हिंदी).",
  ja: "Please respond in Japanese (日本語).",
  es: "Please respond in Spanish (Español).",
  ar: "Please respond in Arabic (العربية)."
};

export async function generateChatResponse(
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  mode: ChatMode = 'normal',
  lang: Language = 'en',
  image?: string // base64
) {
  const ai = getAI();
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      {
        role: 'user',
        parts: [
          ...(image ? [{ inlineData: { data: image.split(',')[1], mimeType: "image/jpeg" } }] : []),
          { text: message }
        ]
      }
    ],
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTIONS[mode]} ${LANGUAGE_PROMPTS[lang]} Always maintain your identity as Velocity AI.`,
    }
  });

  const response = await model;
  return response.text;
}

export async function generateImage(prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function generateQuiz(topic: string, lang: Language = 'en') {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 5-question multiple choice quiz about ${topic} in ${lang}. Return ONLY a JSON array of objects with 'question', 'options' (array of 4 strings), and 'correctIndex' (number 0-3).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
