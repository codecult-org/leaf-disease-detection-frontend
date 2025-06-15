import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  // Handle preflight requests
  return withCORS(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { disease } = body;
  if (!disease) {
    return withCORS(
      NextResponse.json({ error: "Disease is required" }, { status: 400 })
    );
  }
  try {
    const prompt = `
You are a researcher cum doctor of plant diseases. 
The crop is cultivated in West Bengal, India.
Give exactly 5 points as remedies for the plant disease: ${disease}.
Do not add any prefix or suffix like discussion, introduction, or conclusion.
Use simple language and avoid complex terms.
give remedies in a numbered list format.
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return withCORS(
      NextResponse.json({ remedy: response.text || "No remedy found." })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ error: "Failed to fetch remedies." }, { status: 500 })
    );
  }
}