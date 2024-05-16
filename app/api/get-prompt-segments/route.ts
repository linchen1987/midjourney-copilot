import { AI } from '@/lib/ai';
import { translate } from '@/lib/translator';
import type { Segment } from '@/types';

const ai = new AI();

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;
  if (!prompt) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }

  const res = await ai.getPromptSegments({
    mjPrompt: prompt,
  });

  try {
    const data: Record<string, string | string[]> = JSON.parse(
      res.choices[0].message.content || ''
    );
    if (!data) {
      return Response.json({ error: 'OpenAI response is empty' }, { status: 500 });
    }

    const segments: Segment[] = [];
    let saySomething: string;
    for (const [category, texts] of Object.entries(data)) {
      if (category === 'saySomething') {
        const txt = typeof texts === 'string' ? texts : texts[0];
        saySomething = txt;
      }

      if (typeof texts === 'string') {
        segments.push({ text: texts, tag: category });
      } else {
        for (const text of texts as Array<string>) {
          segments.push({ text, tag: category });
        }
      }
    }

    try {
      // saySomething 不属于 MJ 提示词，不需要翻译
      const filteredSegments = segments.filter((x) => x.tag !== 'saySomething');
      const sourceList = [
        {
          id: 'segments',
          text: filteredSegments.map((x: any) => x.text).join('|'),
        },
      ];
      const translates = await translate(sourceList);
      (translates[0].TargetText || '').split('|').forEach((text: string, i: number) => {
        segments[i].textLocalized = text;
      });
      return Response.json(segments);
    } catch (err: any) {
      console.error(err);
      return Response.json(segments);
    }
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
