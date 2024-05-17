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

  if (data?.error) {
    if (data.error.includes('is not valid JSON')) {
      throw new Error('AI: 抱歉我走神了，请再试一次。');
    }
    throw new Error(data.error);
  }

  return data;
};

export async function fetchPromptSegments(prompt: string) {
  const data = await _fetch(`/api/get-prompt-segments`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  const { segments, saySomething, sessionId } = data as unknown as {
    segments: Segment[];
    saySomething?: string;
    sessionId?: string;
  };

  return {
    saySomething,
    segments,
    sessionId,
  };
}

export async function postFeedback({
  feedback,
  sessionId,
  result,
}: {
  feedback: 'good' | 'bad';
  sessionId: string;
  result?: any;
}) {
  try {
    return _fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
        sessionId,
        result,
      }),
    });
  } catch (error: Error | any) {
    console.error(error?.message);
  }
}

export async function fetchTranslate(text: string) {
  const sourceList = [
    {
      id: 'mjPrompt',
      text,
    },
  ];

  const data = await _fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourceList,
    }),
  });

  return data[0];
}

export async function fetchUsages() {
  return _fetch('/api/usages', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
