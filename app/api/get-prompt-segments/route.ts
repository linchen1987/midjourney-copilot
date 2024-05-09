import { AI } from "@/lib/ai";

const ai = new AI();

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const res = await ai.getPromptSegments(prompt);
  try {
    const data = JSON.parse(res.choices[0].message.content || "");
    if (!data) {
      return Response.json(
        { error: "OpenAI response is empty" },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
