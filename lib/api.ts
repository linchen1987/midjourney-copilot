import type { Segment } from '@/types';

const _fetch = async (url: string, opts: RequestInit = {}) => {
  const { headers, ...restOpts } = opts;
  const res = await fetch(url, {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    ...restOpts,
  });
  const data = await res.json();

  return data;
};

export async function getPromptSegments(prompt: string) {
  let data = await _fetch(`/api/get-prompt-segments`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  let saySomething;
  const segments: Segment[] = [];
  for (const item of data as unknown as Segment[]) {
    if (item?.tag === 'saySomething') {
      saySomething = item.text;
    } else {
      segments.push(item);
    }
  }
  console.log(saySomething, segments);

  return {
    saySomething,
    segments,
  };
}
