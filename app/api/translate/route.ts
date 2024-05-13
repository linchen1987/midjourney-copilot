import { translate } from '@/lib/translator';

export async function POST(req: Request) {
  const body = await req.json();
  const { sourceList = [] } = body;
  try {
    const data = await translate(sourceList);
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
