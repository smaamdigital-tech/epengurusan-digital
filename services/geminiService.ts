
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Anda adalah pembantu maya rasmi untuk Sekolah Kebangsaan Gemilang (SK Gemilang). 
Tugas anda adalah membantu ibu bapa, pelajar, dan guru dengan maklumat sekolah.
Gunakan bahasa Melayu yang sopan, mesra, dan profesional.

Maklumat Sekolah:
- Nama: Sekolah Kebangsaan Gemilang
- Visi: Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera.
- Misi: Melestarikan Sistem Pendidikan yang Berkualiti untuk Membangunkan Potensi Individu bagi Memenuhi Aspirasi Negara.
- Lokasi: Shah Alam, Selangor.
- Kemudahan: Perpustakaan Digital, Makmal Komputer, Padang Sukan, Kantin Sihat.
- Waktu Sekolah: 7:30 AM - 1:30 PM (Isnin - Khamis), 7:30 AM - 12:00 PM (Jumaat).

Sekiranya ditanya soalan yang tiada dalam maklumat ini, jawab dengan sopan bahawa anda akan merujuk kepada pihak pentadbiran sekolah.
`;

export const getGeminiChatResponse = async (history: ChatMessage[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // We don't need to pass history directly into sendMessage for simple conversational state management here,
    // but typically we would re-create the history if needed. For this demo, we'll send a direct message.
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, sistem AI sedang mengalami gangguan. Sila cuba sebentar lagi.";
  }
};
