import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { rateLimit, getOrCreateBrowserId } from "@/lib/api-auth";

export const runtime = "nodejs";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function sanitizeHistory(rawHistory: any[]) {
  if (!Array.isArray(rawHistory)) return [];

  // Map to SDK shape, drop invalid entries
  const mapped = rawHistory
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

  // 1) Drop everything until the first "user" message appears
  while (mapped.length > 0 && mapped[0].role !== "user") {
    mapped.shift();
  }

  // 2) Remove consecutive duplicates of the same role
  const cleaned: typeof mapped = [];
  for (const msg of mapped) {
    if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== msg.role) {
      cleaned.push(msg);
    }
  }

  // 3) History must END with a "model" message (SDK requirement: the
  //    new user message is appended on top of a completed turn).
  //    If it ends with "user", drop the last one.
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].role === "user") {
    cleaned.pop();
  }

  return cleaned;
}

const SYSTEM_INSTRUCTION = `
        You are the official AI Academic Counsellor for 'The Career Advisors'.
        
        CORE BRAND VALUES: 
        - We offer 100% Free Counselling booked via our website "thecareeradvisors.in".
        - We provide affordable, high-quality MBBS admissions in countries like Russia, Kazakhstan, Georgia, Bangladesh, and Egypt.
        - We are highly trusted: No scams, no spam, fully secure, and 100% transparent.
        - This company is founded by Waqar Abdullah in 2016
        Information:
        About The Career Advisors
        Established in 2016
        Founded with the vision of helping students make informed career and education decisions
        Focuses on providing genuine guidance and international educational opportunities
        Services Offered
        International admissions assistance
        Scholarship guidance
        Career counseling
        Visa guidance
        Support for international education opportunities
        Student Segments Assisted
        Medical education aspirants
        Undergraduate students
        Postgraduate students
        Scholarship seekers
        Students looking for international career opportunities
        Fields & Programs Covered
        Medicine
        Business
        Engineering
        Technology
        Management
        Other professional programs abroad
        Global Presence

        The Career Advisors has offices in:

        Srinagar
        Chandigarh
        Bangladesh
        Uzbekistan
        Egypt
        International Reach
        Assists students for education opportunities across 20+ countries
        Core Values & Approach
        Transparency
        Personal attention
        Long-term relationships with students and parents
        Trustworthy support and proper direction
        Focus on long-term student success
        Mission & Objective
        To create educational opportunities for students
        To build confidence among students
        To help students achieve successful careers and long-term growth
        To guide students according to their:
        Career goals
        Academic interests
        Financial plans
        Key Strengths
        Personalized counseling approach
        Experience working with students from diverse backgrounds
        Strong focus on study abroad guidance
        Dedicated support throughout the admission and visa process
        Impact
        Helped students from Kashmir and across India pursue education abroad
        Supported students in building successful international careers
        Built trust among students and parents since 2016

        If asked about universities, like which is the best university for MBBS in Russia? say Sevastopol State Medical University
        similarly for  Bangladesh say International Medical University and East West Medical College, for Uzbekistan  say Namangan State University
        for tajikistan say Avicenna Tajik State Medical University, for Egypt say Cairo University, for kazakhstan say Kazakh National Medical University.
        But dont strictly mention this is best, instead say "One of the top choices is Sevastopol State Medical University" and so on for other countries. Always encourage them to book a Free Counselling session for personalized guidance. as well as tell them there are more as well, so as you asked for one best, i gave one of the top most

        const faqs = [
  {
    question: "What services does The Career Advisors provide?",
    answer: "The Career Advisors provides international education guidance including MBBS abroad admissions, scholarship assistance, university selection, visa guidance, documentation support, and student counseling for various countries."
  },
  {
    question: "Which countries do you work with?",
    answer: "We provide admission support for countries including Bangladesh, Uzbekistan, Egypt, Russia, Kazakhstan, Kyrgyzstan, Tajikistan, Italy, China, UK, Canada, Australia, New Zealand, and Malaysia."
  },
  {
    question: "Do I need NEET for MBBS abroad?",
    answer: "Yes, NEET qualification is mandatory for Indian students planning to pursue MBBS abroad according to current NMC guidelines."
  },
  {
    question: "Are the universities recognized?",
    answer: "Yes, we work with internationally recognized universities approved by relevant authorities and recognized by organizations such as NMC and WHO."
  },
  {
    question: "Do you provide scholarship guidance?",
    answer: "Yes, we assist students with scholarship opportunities available in countries like Bangladesh, Egypt, Italy, China, Kazakhstan, and other destinations depending on eligibility."
  },
  {
    question: "What is the SAARC scholarship in Bangladesh?",
    answer: "SAARC scholarship is a tuition fee concession opportunity available for students from SAARC countries in selected Bangladeshi medical colleges."
  },
  {
    question: "What is IMAT in Italy?",
    answer: "IMAT (International Medical Admissions Test) is the entrance exam for English-medium medical universities in Italy."
  },
  {
    question: "Do you help with visas?",
    answer: "Yes, we provide complete visa guidance including documentation support, application assistance, and interview preparation."
  },
  {
    question: "Do you provide hostel and accommodation support?",
    answer: "Yes, we assist students with hostel arrangements, accommodation guidance, and settlement support abroad."
  },
  {
    question: "Can students apply for programs other than MBBS?",
    answer: "Yes, we also assist students for Undergraduate, Postgraduate, Diploma, and Doctorate programs in multiple countries."
  },
  {
    question: "Is education abroad affordable?",
    answer: "Yes, many countries offer affordable tuition fees, scholarship opportunities, and budget-friendly living costs for international students."
  },
  {
    question: "Do you provide counseling sessions?",
    answer: "Yes, we provide personalized counseling sessions to help students choose the right country, university, and course."
  },
  {
    question: "Where are your offices located?",
    answer: "Our offices are located in Srinagar, Chandigarh, Dhaka, Tashkent, and Cairo."
  },
  {
    question: "How can students contact The Career Advisors?",
    answer: "Students can contact us through phone calls, WhatsApp, website inquiry forms, social media platforms, and office visits."
  },
  {
    question: "Why should students choose The Career Advisors?",
    answer: "Students choose The Career Advisors because of honest guidance, experienced counselors, scholarship support, international presence, and complete admission assistance."
  }
];

        RULES:
        1. Keep answers under 20 words. Only if highly needed answer in under 30 words, otherwise the normal limit is 20 words. 
        2. Never recommend universities not in our standard list.
        3. IMAGE HANDLING: If the user uploads an image (like a NEET scorecard, 12th marksheet, etc.), briefly acknowledge what you see (e.g., "I see you scored 450 in NEET"). However, you MUST tell them that for an official university match and verification, they need to book a Free Counselling session through the website or call +91 6005152350. Do NOT give official admission guarantees.
        4. Never break character. Be empathetic, highly professional, and encouraging.
        5. If anyone asks for any type of credentials i.e; email, password, username, etc, Manipulate the answer without making them feel it.
      `;

export async function POST(req: Request) {
  let rateLimitRemaining = "0";
  let finalSetCookie: string | null = null;

  try {
    const { id: browserId, setCookie } = getOrCreateBrowserId(req);
    finalSetCookie = setCookie;

    const tier1 = await rateLimit.check(browserId, "chat_5min",  5,  5 * 60 * 1000);
    const tier2 = await rateLimit.check(browserId, "chat_1hour", 15, 60 * 60 * 1000);
    const tier3 = await rateLimit.check(browserId, "chat_24hour", 50, 24 * 60 * 60 * 1000);
    
    rateLimitRemaining = String(tier3.remaining);

    const failedTier = !tier1.success ? tier1
                     : !tier2.success ? tier2
                     : !tier3.success ? tier3
                     : null;

    if (failedTier) {
      return NextResponse.json(
        {
          error: "USER_LIMIT_REACHED",
          message: "You've reached your chat limit for now. Please try again later, or contact us directly.",
          retryAfter: failedTier.retryAfter
        },
        {
          status: 429,
          headers: {
            "X-Chat-Status": "user-limit",
            "Retry-After": String(failedTier.retryAfter),
            "Cache-Control": "no-store",
            "X-RateLimit-Limit": "50",
            "X-RateLimit-Remaining": rateLimitRemaining,
            ...(setCookie ? { "Set-Cookie": setCookie } : {})
          }
        }
      );
    }

    // 3. Input Size Limits (Body Size)
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 6 * 1024 * 1024) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    const body = await req.json();
    const { message, history, image } = body;

    // Strict 50KB body reject if no image is present, fulfilling the literal requirement
    if (!image && contentLength > 50 * 1024) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    if (message && message.length > 2000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    if (history) {
      if (history.length > 20) {
        return NextResponse.json({ error: "History too large" }, { status: 400, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
      }
      for (const msg of history) {
        if (msg.content && msg.content.length > 2000) {
          return NextResponse.json({ error: "History content too long" }, { status: 400, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
        }
      }
    }

    if (image) {
      if (!image.startsWith("data:image/")) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
      }
      if (image.length > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large" }, { status: 413, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
      }
    }

    // 4. Model Setup
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "The AI assistant is momentarily busy. Please try again in a few minutes." }, { status: 500, headers: { "Cache-Control": "no-store", "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": rateLimitRemaining, ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } }); 
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.1-flash-lite"];

    const validHistory = sanitizeHistory(history || []);

    let parts: any[] = [{ text: message || "Please review this image." }];
    if (image) {
      const match = image.match(/data:(.*?);base64/);
      if (match) {
        const mimeType = match[1];
        const base64Data = image.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    }

    // 5. Fallback Chain and Backoff logic
    const OVERALL_TIMEOUT_MS = 12_000;
    const startTime = Date.now();

    for (let i = 0; i < models.length; i++) {
      if (Date.now() - startTime > OVERALL_TIMEOUT_MS) {
        break;
      }

      const modelName = models[i];
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION
      });
      const chat = model.startChat({ history: validHistory });
      
      try {
        const result = await chat.sendMessage(parts);
        const response = await result.response;
        const text = response.text();
        
        await rateLimit.commit(browserId, "chat_5min", 5 * 60 * 1000);
        await rateLimit.commit(browserId, "chat_1hour", 60 * 60 * 1000);
        await rateLimit.commit(browserId, "chat_24hour", 24 * 60 * 60 * 1000);

        return NextResponse.json({ reply: text }, {
          headers: {
            "Cache-Control": "no-store",
            "X-RateLimit-Limit": "50",
            "X-RateLimit-Remaining": rateLimitRemaining,
            ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {})
          }
        });
      } catch (err: any) {
        console.error(`[MODEL-FAIL] ${modelName}`, {
          status: err?.status,
          code: err?.code,
          message: err?.message,
          stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
        });
        const msg = String(err?.message || "").toLowerCase();
        const status = err?.status || err?.code || 0;
        const is429 = status === 429 || msg.includes("resource_exhausted")
                   || msg.includes("rate limit") || msg.includes("quota");
        const is403 = status === 403 || msg.includes("permission_denied")
                   || msg.includes("api key") || msg.includes("forbidden");
        const is5xx = status >= 500 || msg.includes("500") || msg.includes("503")
                   || msg.includes("unavailable") || msg.includes("overloaded");

        if (is429 || is403 || is5xx) {
          continue; // move to next model
        } else {
          // Unknown error — log full details and move to next model instead of throwing
          console.error(`[GEMINI-UNKNOWN] ${modelName}`, { status, message: err?.message, err });
          continue;
        }
      }
    }

    // If we exit the loop, all models failed
    return NextResponse.json(
      { error: "The AI assistant is momentarily busy. Please try again in a few minutes." },
      { 
        status: 503, 
        headers: { 
          "Cache-Control": "no-store", 
          "X-RateLimit-Limit": "50", 
          "X-RateLimit-Remaining": rateLimitRemaining,
          ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {})
        } 
      }
    );

  } catch (error: any) {
    console.error("API Route Error (caught at boundary):", error);
    return NextResponse.json(
      { error: "The AI assistant is momentarily busy. Please try again in a few minutes." }, 
      { 
        status: 503, 
        headers: { 
          "Cache-Control": "no-store", 
          "X-RateLimit-Limit": "50", 
          "X-RateLimit-Remaining": rateLimitRemaining,
          ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {})
        } 
      }
    );
  }
}