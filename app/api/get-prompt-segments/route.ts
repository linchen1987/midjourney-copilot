import { AI } from '@/lib/ai';
import { translate } from '@/lib/translator';
import type { Segment } from '@/types';
import { increaseUsedTimes, getRemainingTimes } from '@/lib/db/usages';
import { recordUserInputPrompt } from '@/lib/db/prompt-analysis';

const ai = new AI();

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;
  if (!prompt) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }

  const remainingTimes = await getRemainingTimes();
  if (remainingTimes < 0) {
    return Response.json({ error: '今日免费解读次数用完了' }, { status: 403 });
  }

  try {
    const [aiRes, session] = await Promise.all([
      ai.getPromptSegments({
        mjPrompt: prompt,
        responseFormat: 'json',
      }),
      recordUserInputPrompt({ prompt }),
    ]);

    let data: Record<string, string | string[]> | undefined = undefined;
    try {
      data = JSON.parse(aiRes.choices[0].message.content || '');
    } catch (error) {
      console.error(`ai response is not valid json: ${aiRes.choices[0].message.content}`);
    }

    if (!data) {
      console.error('OpenAI response is empty', prompt, aiRes);
      return Response.json({ error: 'OpenAI response is empty' }, { status: 500 });
    }

    const segments: Segment[] = [];
    let saySomething: string = '';
    for (const [category, texts] of Object.entries(data)) {
      if (category === 'saySomething') {
        const txt = typeof texts === 'string' ? texts : texts[0];
        saySomething = txt;
      } else if (typeof texts === 'string') {
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
    } catch (err) {
      console.error(err);
    }

    // update used times
    increaseUsedTimes().catch(console.error);

    const res = {
      sessionId: session.id,
      segments,
      saySomething,
    };

    return Response.json(res);
  } catch (err: any) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
