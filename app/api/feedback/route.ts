import { updatePromptAnalysisTable } from '@/lib/db/prompt-analysis';

export async function POST(req: Request) {
  const body = await req.json();
  const { sessionId, feedback, result } = body;
  if (!sessionId) {
    return Response.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    await updatePromptAnalysisTable({
      id: sessionId,
      result,
      feedback,
    });

    return Response.json({});
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
