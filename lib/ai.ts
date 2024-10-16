import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { analysisPrompt as defaultAnalysisPrompt } from './prompt';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  httpAgent: process.env.https_proxy
    ? new HttpsProxyAgent(process.env.https_proxy || '')
    : undefined,
  apiKey: OPENAI_API_KEY,
});

let ai: AI | null = null;
class AI {
  openai: OpenAI = openai;

  constructor() {
    this.openai = openai;
    console.log('AI is ready!');
  }

  async getPromptSegments({
    mjPrompt,
    model,
    analysisPrompt,
    responseFormat,
  }: {
    mjPrompt: string;
    model?: string;
    analysisPrompt?: string | null;
    responseFormat?: 'json';
  }) {
    if (!mjPrompt) {
      throw new Error('Prompt is required');
    }
    if (mjPrompt.length > 1000) {
      throw new Error('Input too long, please contact Link1987 for help');
    }

    console.log('generating summary');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: analysisPrompt || process.env.ANALYSIS_PROMPT || defaultAnalysisPrompt,
        },
        {
          role: 'user',
          content: mjPrompt,
        },
      ],
      model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format:
        responseFormat === 'json'
          ? {
              type: 'json_object',
            }
          : undefined,
    });
    return completion;
  }
}

export function getAI() {
  if (!ai) {
    ai = new AI();
  }
  return ai;
}

export { AI };
