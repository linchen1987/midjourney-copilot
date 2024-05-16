import { getRemainingTimes } from '@/lib/db/usages';

export async function GET(req: Request) {
  try {
    const remainingTimes = await getRemainingTimes();
    return Response.json({
      remainingTimes,
    });
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
