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

export default function Home() {
  const { toast } = useToast();
  // const [input, setInput] = useState<string>("");
  const [input, setInput] = useState<string>(
    'Create a dynamic and colorful urban street art-inspired composition that blends various elements of graffiti, such as expressive cartoon characters, dripping paint effects, and layered tagging. Incorporate a mixture of vibrant and contrasting colors like electric blue, vivid yellow, and hot pink, while embedding symbols like peace signs, hearts, and iconic pop culture references. Ensure the artwork conveys a sense of spontaneous creativity and the raw energy of the urban underground art scene'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputPrompt, setOutputPrompt] = useState<string>('');
  const [outputSegments, setOutputSegments] = useState<Segment[]>([]);
  // const [outputSegments, setOutputSegments] = useState<Segment[]>([
  //   {
  //     text: 'composition',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'graffiti',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'expressive cartoon characters',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'dripping paint effects',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'layered tagging',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'symbols',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'pop culture references',
  //     tag: 'subject',
  //   },
  //   {
  //     text: 'urban street art scene',
  //     tag: 'environment',
  //   },
  //   {
  //     text: 'spontaneous creativity',
  //     tag: 'environment',
  //   },
  //   {
  //     text: 'raw energy',
  //     tag: 'environment',
  //   },
  //   {
  //     text: 'dynamic',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'colorful',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'urban street art-inspired',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'vibrant',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'contrasting',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'electric blue',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'vivid yellow',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'hot pink',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'peace signs',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'hearts',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'iconic pop culture references',
  //     tag: 'mediumAndStyles',
  //   },
  //   {
  //     text: 'blends various elements',
  //     tag: 'pointOfViewAndComposition',
  //   },
  //   {
  //     text: 'incorporate a mixture',
  //     tag: 'pointOfViewAndComposition',
  //   },
  //   {
  //     text: 'ensure the artwork conveys',
  //     tag: 'pointOfViewAndComposition',
  //   },
  // ]);

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     // router.push(`/search?q=${encodeURIComponent(value)}`);
  //   }
  // };

  const onSubmit = async () => {
    setLoading(true);
    setOutputSegments([]);
    setOutputPrompt('');
    try {
      const res = await getPromptSegments(input);
      const _segments: Segment[] = [];
      for (const [category, texts] of Object.entries(res)) {
        if (typeof texts === 'string') {
          _segments.push({ text: texts, tag: category });
        } else {
          for (const text of texts as Array<string>) {
            _segments.push({ text, tag: category });
          }
        }
      }
      setOutputSegments(_segments);
      console.log(_segments);
      setOutputPrompt(input);
      setLoading(false);
    } catch (error: Error | any) {
      toast({
        title: error?.message,
        // description: "Friday, February 10, 2023 at 5:57 PM",
      });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 lg:px-8 container">
      <div className="w-full font-extrabold text-4xl text-orange-600">
        <a href="/">Midjourney Toolkit</a>
      </div>

      <div className="mt-10">
        <Textarea
          id="description"
          className="min-h-32 focus:ring-0 focus-visible:ring-0"
          placeholder="输入提示词"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button className="mt-2 w-full" disabled={loading || !input} onClick={onSubmit}>
          {loading ? <Spinner className="text-inherit size-4 mr-1" /> : null}
          提交
        </Button>
      </div>

      {!!outputSegments.length && (
        <div className="mt-10 space-y-2">
          <h2 className="text-3xl mb-4 font-bold text-gray-800">结果</h2>
          {CATEGORIES.map((category) => (
            <p key={category.id} className="flex text-lg mr-2">
              <div className={clsx('font-bold shrink-0', category.textColor)}>
                {category.name}：
              </div>
              {/* <span className={clsx('font-bold grow-0', category.textColor)}>
                {outputSegments
                  .filter((x) => x.tag === category.id)
                  .map((x) => x.text)
                  .join(', ') || '无'}
              </span> */}
              <div className="flex flex-wrap shrink-1">
                {filterSegments(outputSegments, category.id).map((x, index) => (
                  <div
                    className={clsx(
                      'shrink-0 text-white px-2 mx-2 mb-2 rounded-full text-[1rem]',
                      category.bgColor
                    )}
                    key={x.text}>
                    {x.text}
                  </div>
                ))}
              </div>
            </p>
          ))}
        </div>
      )}

      {!!input && !!outputSegments?.length && (
        <div className="mt-10 border p-4">
          <PromptWithTags text={outputPrompt} segments={outputSegments} />
        </div>
      )}
    </main>
  );
}
