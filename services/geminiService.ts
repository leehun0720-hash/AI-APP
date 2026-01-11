import { GoogleGenAI } from "@google/genai";
import { InvoiceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvoiceEmail = async (data: InvoiceData): Promise<string> => {
  const prompt = `
    You are a professional business communication expert.
    Write a polite, professional, and clear invoice email based on the following details:

    - Recipient Name: ${data.clientName}
    - Service/Item: ${data.itemDescription}
    - Amount: ${data.amount} ${data.currency}
    - Due Date: ${data.dueDate}
    - Language: ${data.language}

    Requirements:
    1. Use a professional subject line.
    2. Include a polite opening appropriate for the season or general business etiquette.
    3. Clearly state the amount due and the service provided.
    4. Include a placeholder for payment details (e.g., [Bank Account Details]).
    5. Use a professional closing.
    6. Ensure the tone is courteous but firm regarding the due date.
    7. Return ONLY the email content (Subject and Body).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate email content. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to AI service.");
  }
};
