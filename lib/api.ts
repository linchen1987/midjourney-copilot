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
  return _fetch(`/api/get-prompt-segments`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}
