
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Generates a concise summary for textbook content.
   */
  async generateSummary(text: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please provide a clear, concise summary of the following textbook material for a visually impaired student. Focus on key concepts and structure it for easy listening: \n\n ${text}`,
    });
    return response.text;
  },

  /**
   * Explains a diagram or image.
   */
  async explainDiagram(base64Image: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: "Describe this diagram in detail for a visually impaired person. Explain the spatial layout, the labels, and the scientific or educational concept it represents. Use step-by-step logic." }
        ]
      }
    });
    return response.text;
  },

  /**
   * Chat interaction.
   */
  async chatResponse(history: { role: string, content: string }[], message: string) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are Lumina, an empathetic and clear AI tutor for visually impaired students. Use descriptive language and keep explanations simple and structured."
      }
    });
    
    // Convert history format if needed, but for simple mock we just send the message
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  /**
   * Converts text to speech using Gemini's high-quality TTS.
   */
  async textToSpeech(text: string, voiceName: 'Kore' | 'Puck' | 'Zephyr' = 'Kore'): Promise<Uint8Array | null> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return this.decodeBase64(base64Audio);
      }
    } catch (e) {
      console.error("TTS Error:", e);
    }
    return null;
  },

  decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },

  async playAudio(audioData: Uint8Array) {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const dataInt16 = new Int16Array(audioData.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    return new Promise((resolve) => {
      source.onended = resolve;
    });
  }
};
