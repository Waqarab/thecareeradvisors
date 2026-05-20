import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "⚠️ ERROR: API Key not found." }); 
    }

    // Now accepting 'image' from the frontend
    const { message, history, image } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: `
        You are the official AI Academic Counsellor for 'The Career Advisors'.
        
        CORE BRAND VALUES: 
        - We offer 100% Free Counselling booked via our website.
        - We provide affordable, high-quality MBBS admissions in countries like Russia, Kazakhstan, Georgia, Bangladesh, and Egypt.
        - We are highly trusted: No scams, no spam, fully secure, and 100% transparent.
        
        RULES:
        1. Keep answers concise (under 3-4 sentences). 
        2. Never recommend universities not in our standard list.
        3. IMAGE HANDLING: If the user uploads an image (like a NEET scorecard, 12th marksheet, etc.), briefly acknowledge what you see (e.g., "I see you scored 450 in NEET"). However, you MUST tell them that for an official university match and verification, they need to book a Free Counselling session through the website or call +91 78897 08059. Do NOT give official admission guarantees.
        4. Never break character. Be empathetic, highly professional, and encouraging.
      `
    });

    const validHistory = history
      .filter((msg: any) => msg.content !== "Hi! I'm the AI Assistant for The Career Advisors. How can I help you with your MBBS journey today?")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: validHistory,
    });

    // Handle Multimodal Input (Text + Image)
    let parts: any[] = [{ text: message || "Please review this image." }];
    
    if (image) {
      // The frontend will send a base64 string like: "data:image/jpeg;base64,/9j/4AAQ..."
      const mimeType = image.match(/data:(.*?);base64/)[1];
      const base64Data = image.split(',')[1];
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const result = await chat.sendMessage(parts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ 
      reply: `⚠️ Google API Error: ${error.message}` 
    });
  }
}