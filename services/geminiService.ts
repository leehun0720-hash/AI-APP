import { GoogleGenAI } from "@google/genai";
import { InvoiceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvoiceEmail = async (data: InvoiceData): Promise<string> => {
  // Calculate total amount
  const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  // Format items list for the prompt
  const itemsList = data.items.map((item, index) => 
    `${index + 1}. Product: ${item.name} | Spec: ${item.spec} | Qty: ${item.quantity} | Unit Price: ${item.unitPrice} | Total: ${item.quantity * item.unitPrice} | Remarks: ${item.remarks}`
  ).join('\n    ');

  const prompt = `
    You are a professional business communication expert.
    Write a polite, professional, and clear invoice/quotation email based on the following details:

    - Recipient Name: ${data.clientName}
    - Total Amount: ${totalAmount} ${data.currency}
    - Payment Due Date: ${data.dueDate}
    - Delivery Deadline: ${data.deliveryDate}
    - Language: ${data.language}
    
    Item Details:
    ${itemsList}

    Requirements:
    1. Use a professional subject line that includes the client name.
    2. Include a polite opening appropriate for business etiquette.
    3. Clearly state the purpose of the email (Invoice/Quotation).
    4. Summarize the items provided, including the total amount.
    5. Explicitly mention the **Delivery Deadline** and **Payment Due Date**.
    6. Include a placeholder for payment details (e.g., [Bank Account Details]).
    7. Use a professional closing.
    8. Return ONLY the email content (Subject and Body). Do not include any other text or markdown block indicators like \`\`\`.
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
