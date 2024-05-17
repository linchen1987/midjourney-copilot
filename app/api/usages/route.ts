import { getUsages } from '@/lib/db/usages';

export async function GET(req: Request) {
  try {
    const { remainingTimes, totalTimes } = await getUsages();
    return Response.json({
      remainingTimes,
      totalTimes,
    });
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}

export const revalidate = 0;
