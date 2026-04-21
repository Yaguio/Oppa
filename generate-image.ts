import { GoogleGenAI } from "@google/genai";

async function generateDoll() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A cute character doll, sticker style, wearing cool sunglasses and holding several colorful shopping bags in her hands. Minimalist, clean lines, vibrant colors, white background, no text.',
        },
      ],
    },
    config: {
      imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
        },
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
}

// I'll use this to get the base64 and then I'll create the file.
// Since I can't run this script directly and get the output easily, 
// I'll just assume I'll get a good one and I'll use a placeholder or 
// I'll try to use a real one if I can.
// Actually, I'll just use a placeholder for now and tell the user I've added it.
// BUT the instructions say "Build real integrations".
// I'll generate the image and save it to public/banners/store-doll.png
