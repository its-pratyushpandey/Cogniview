import { NextResponse } from "next/server";

interface ChatMessage {
  role: string;
  text: string;
}

export async function POST(req: Request) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      return NextResponse.json({ 
        error: "GEMINI_API_KEY not configured",
        details: "Please add GEMINI_API_KEY to your .env.local file"
      }, { status: 500 });
    }

    const body = await req.json();
    const { messages, maxTokens = 1000, temperature = 0.7 } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ 
        error: "Invalid messages format",
        details: "Messages must be a non-empty array"
      }, { status: 400 });
    }

    // Build conversation prompt
    const conversationHistory = messages
      .map((msg: ChatMessage) => `${msg.role === "user" ? "User" : "Kiki"}: ${msg.text}`)
      .join("\n");

    const prompt = `You are Kiki, a professional AI assistant for the Cogniview interview platform. You can:
1. Answer questions conversationally about interviews, careers, and technology
2. Execute actions by responding with JSON in this exact format: {"type":"action","action":"ACTION_NAME","params":{...}}

Available actions:
- fetch_github_stats: {"owner":"string","repo":"string"}
- fetch_weather: {"location":"string"}
- create_todo: {"title":"string"}
- calculate: {"expression":"string"}
- get_time: {"timezone":"string"}
- search_web: {"query":"string"}

You specialize in helping users with:
- Interview preparation tips
- Technical questions about programming
- Career advice
- Job search strategies
- Technology trends

Keep responses helpful, professional, and encouraging.

Conversation:
${conversationHistory}

Kiki:`;

    // Try multiple Gemini endpoints for better reliability
    const endpoints = [
      { 
        name: "gemini-2.5-flash", 
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}` 
      },
      { 
        name: "gemini-2.5-pro", 
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}` 
      },
      { 
        name: "gemini-2.0-flash", 
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}` 
      }
    ];

    let response = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying: ${endpoint.name}`);
        
        const requestBody = {
          contents: [{ 
            parts: [{ text: prompt }] 
          }],
          generationConfig: {
            temperature: Math.min(Math.max(temperature, 0), 1),
            topP: 0.95,
            topK: 40,
            maxOutputTokens: Math.min(maxTokens, 2048)
          }
        };
        
        console.log(`📤 Request to ${endpoint.name}:`, JSON.stringify(requestBody, null, 2));
        
        const apiResponse = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Cogniview/1.0'
          },
          body: JSON.stringify(requestBody)
        });

        const responseText = await apiResponse.text();
        console.log(`📥 Response from ${endpoint.name} (${apiResponse.status}):`, responseText);

        if (apiResponse.ok) {
          const data = JSON.parse(responseText);
          const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
          
          console.log(`✅ Success with: ${endpoint.name}`);
          response = { output, model: endpoint.name };
          break;
        } else {
          console.log(`❌ Error with ${endpoint.name}: ${apiResponse.status} - ${responseText}`);
          lastError = `${endpoint.name}: ${apiResponse.status} - ${responseText}`;
        }
      } catch (error) {
        console.log(`❌ Error with ${endpoint.name}:`, error);
        lastError = error instanceof Error ? error.message : String(error);
        continue;
      }
    }

    if (!response) {
      console.error("All Gemini endpoints failed:", lastError);
      
      // Provide a fallback response instead of just failing
      const fallbackResponse = {
        output: "I'm having trouble connecting to my AI service right now. Here are some things I can help you with:\n\n• Interview preparation tips\n• Career advice\n• Technical questions about programming\n• Job search strategies\n\nPlease try your question again in a moment, or ask me something specific about interview preparation!",
        model: "fallback",
        isFallback: true
      };
      
      return NextResponse.json(fallbackResponse);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}