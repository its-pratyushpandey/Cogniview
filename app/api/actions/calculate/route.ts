import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { expression } = await req.json();
    
    if (!expression) {
      return NextResponse.json({ error: "Expression is required" }, { status: 400 });
    }

    // Safe evaluation (only allow basic math)
    const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
    
    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return NextResponse.json({
        expression: expression,
        result: result,
        message: `${expression} = ${result}`
      });
    } catch {
      return NextResponse.json({ error: "Invalid mathematical expression" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}