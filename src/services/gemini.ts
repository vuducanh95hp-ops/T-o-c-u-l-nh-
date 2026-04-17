import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface PromptResult {
  platform: string;
  prompt: string;
  explanation: string;
}

export async function generatePrompts(idea: string, platforms: string[], style: string, length: string): Promise<PromptResult[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Bạn là một Chuyên gia Kỹ thuật Câu lệnh (Prompt Engineer) hàng đầu. 
Nhiệm vụ của bạn là chuyển đổi ý tưởng thô của người dùng thành các câu lệnh chuyên nghiệp, tối ưu cho các nền tảng AI cụ thể.

Các nền tảng hỗ trợ:
- ChatGPT/Claude/Perplexity (Văn bản/Tra cứu): Cần cấu trúc rõ ràng, vai trò chuyên gia, và các ràng buộc logic.
- Midjourney/Leonardo.ai (Hình ảnh): Cần mô tả hình ảnh sống động, thông số kỹ thuật (aspect ratio, stylize, lighting).
- Stable Diffusion/Adobe Firefly (Hình ảnh/Thiết kế): Cần các từ khóa kỹ thuật, trọng số, và các phong cách nghệ thuật cụ thể.
- DALL-E (Hình ảnh): Cần mô tả chi tiết, mang tính kể chuyện.
- Runway/Pika (Video): Cần mô tả chuyển động, góc máy, ánh sáng điện ảnh.
- Suno/Udio (Âm nhạc): Cần phong cách nhạc, nhạc cụ, nhịp độ và cảm xúc.

Phong cách yêu cầu: ${style}
Độ dài yêu cầu: ${length} (Ngắn, Trung bình, hoặc Dài). Hãy điều chỉnh độ chi tiết của câu lệnh dựa trên yêu cầu này.

Đầu ra phải là một mảng JSON các đối tượng, mỗi đối tượng chứa:
- platform: Tên nền tảng.
- prompt: Câu lệnh được tạo bằng ngôn ngữ phù hợp (thường là tiếng Anh cho hình ảnh, tiếng Việt hoặc Anh cho văn bản tùy ngữ cảnh, nhưng ưu tiên tiếng Anh cho độ chính xác cao nhất trên các model quốc tế).
- explanation: Giải thích ngắn gọn tại sao câu lệnh này hiệu quả (bằng tiếng Việt).`;

  const response = await ai.models.generateContent({
    model,
    contents: `Ý tưởng người dùng: "${idea}"\nCác nền tảng cần tạo: ${platforms.join(", ")}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            prompt: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["platform", "prompt", "explanation"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}
