'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Textarea } from '@/components/ui/textarea';
import PromptWithTags from '@/components/prompt-with-tags';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { getPromptSegments } from '@/lib/api';
import { Segment } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

const filterSegments = (segments: Segment[], categoryId: string): Segment[] => {
  const list = [...segments.filter((x) => x.tag === categoryId)];
  if (!list.length) {
    list.push({ text: '无', tag: categoryId });
  }
  return list;
};

const exampleMjPrompt =
  'luminogram miniature forest , The forest is densely packed with lush trees, eye-level shot, rgb,volumetric, 3D, colorful, hyper detailed, hyper realistic, moonlight, nighttime';

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [outputPrompt, setOutputPrompt] = useState<string>('');
  const [outputPromptLocalized, setOutputPromptLocalized] = useState<string>('');
  const [outputSegments, setOutputSegments] = useState<Segment[]>([]);
  const [saySomething, setSaySomething] = useState<string>();

  const fetchTranslate = async (text: string) => {
    const sourceList = [
      {
        id: 'mjPrompt',
        text,
      },
    ];
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceList,
        }),
      });
      const data = await res.json();
      data[0].TargetText && setOutputPromptLocalized(data[0].TargetText);
    } catch (error: Error | any) {
      toast({
        title: error?.message,
      });
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setOutputSegments([]);
    setOutputPrompt('');
    if (!input) {
      setInput(exampleMjPrompt);
    }
    const mjPrompt = (input || exampleMjPrompt).trim();
    try {
      fetchTranslate(mjPrompt);
      const { segments: _segments, saySomething: _saySomething } =
        await getPromptSegments(mjPrompt);
      setOutputSegments(_segments);
      setOutputPrompt(mjPrompt);
      setSaySomething(_saySomething);
      setLoading(false);
    } catch (error: Error | any) {
      toast({
        title: error?.message,
      });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 lg:px-8 container">
      <div className="w-full font-extrabold text-4xl text-orange-600">
        <a href="/">Midjourney 小白理解助手</a>
      </div>

      <div className="mt-10">
        <Textarea
          id="description"
          className="min-h-32 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400"
          placeholder={exampleMjPrompt}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="mt-2 w-full"
          disabled={loading || !!(input && !input.trim())}
          onClick={onSubmit}>
          {loading ? <Spinner className="text-inherit size-4 mr-1" /> : null}
          {input && input === outputPrompt ? '再试一次' : '帮我理解一下'}
        </Button>
      </div>

      {!!outputSegments.length && (
        <div className="mt-10">
          <div className="text-gray-500 flex items-end">
            <img src="/robot-line-icon.svg" alt="bot" width="36" className="mr-2" />
            {saySomething || '结果'}
          </div>
          <div className="mt-8 space-y-2 px-0">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="flex text-lg mr-2">
                <div className={clsx('font-bold shrink-0', category.textColor)}>
                  {new Array(4 - category.name.length).fill('').map((x) => (
                    // 占位
                    <span key={x} className="opacity-0">
                      占
                    </span>
                  ))}
                  {category.name}：
                </div>
                <div className="flex flex-wrap shrink w-full">
                  {filterSegments(outputSegments, category.id).map((x, index) => (
                    <div
                      className={clsx(
                        'flex items-center shrink-0 text-white mx-2 mb-2 text-[1rem] rounded-lg overflow-hidden max-w-full leading-6'
                      )}
                      key={x.text}>
                      <div
                        className={clsx(
                          'py-0.5 pl-2.5',
                          x.textLocalized ? 'pr-2' : 'pr-2.5',
                          category.bgColor
                        )}>
                        {x.text}
                      </div>
                      {!!x.textLocalized && (
                        <div className={clsx('pl-2 pr-2.5 py-0.5', 'bg-gray-500')}>
                          {x.textLocalized}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border p-4 mt-6">
            <PromptWithTags text={outputPrompt} segments={outputSegments} />
            {!!outputPromptLocalized && (
              <div className="mt-4 pt-4 border-t">{outputPromptLocalized}</div>
            )}
          </div>
          <div className="mt-12 text-gray-400 text-sm text-center">内容由大模型生成</div>
        </div>
      )}
    </main>
  );
}
