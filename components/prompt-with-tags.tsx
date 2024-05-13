'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import clone from 'lodash/clone';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Segment } from '@/types';

const categories: Record<string, { name: string; color: string }> = {
  subject: {
    name: '主体',
    color: 'text-blue-600',
  },
  environment: {
    name: '环境',
    color: 'text-green-600',
  },
  pointOfViewAndComposition: {
    name: '构图',
    color: 'text-yellow-600',
  },
  lightingAndColor: {
    name: '光线',
    color: 'text-red-600',
  },
  mediumAndStyles: {
    name: '风格',
    color: 'text-purple-600',
  },
};

function segmentText(text: string, segments: Segment[]): Segment[] {
  let result: Segment[] = [];
  let currentIndex = 0;

  const parsedSegments: Segment[] = [];
  for (const x of segments) {
    const segment = clone(x);
    segment.text = (segment.text || '').toLowerCase();

    if (segment.text.includes(',')) {
      parsedSegments.push(
        ...segment.text
          .split(',')
          .map((text) => ({ text: text.trim(), tag: segment.tag }))
      );
    } else {
      parsedSegments.push(segment);
    }
  }

  const lowerCasedText = text.toLowerCase();
  // 首先，按照 segments 中的顺序对 text 进行分割
  const filteredSegments = parsedSegments.filter(
    (segment) => segment.text && lowerCasedText.includes(segment.text)
  );
  filteredSegments.sort(
    (a, b) => lowerCasedText.indexOf(a.text) - lowerCasedText.indexOf(b.text)
  );

  filteredSegments.forEach((segment) => {
    const startIndex = lowerCasedText.indexOf(segment.text, currentIndex);
    if (startIndex > currentIndex) {
      // 添加未标记的文本片段
      result.push({ text: text.substring(currentIndex, startIndex) });
    }
    // 添加标记的文本片段
    result.push(segment);
    currentIndex = startIndex + segment.text.length;
  });

  // 添加最后一个未标记的文本片段
  if (currentIndex < text.length) {
    result.push({ text: text.substring(currentIndex) });
  }

  return result;
}

export default function PromptWithTags({
  text,
  segments,
}: {
  text?: string;
  segments: Segment[];
}) {
  const [texts, setTexts] = useState<Segment[]>(segmentText(text || '', segments));

  useEffect(() => {
    const res = segmentText(text || '', segments);
    setTexts(res);
  }, [text, segments]);

  return (
    <div className="flex items-center flex-wrap">
      {texts.map((segment, index) =>
        segment.tag ? (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger>
                <span className={clsx('mx-0.5', categories[segment.tag]?.color)}>
                  {segment.text}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="p-2">
                  <div className="text-sm text-gray-600">
                    {categories[segment.tag]?.name}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </div>
  );
}
