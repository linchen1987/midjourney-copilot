'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { BookOpen, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import GithubIcon from '@/components/icons/github';
import DiscordIcon from '@/components/icons/discord';
import { Textarea } from '@/components/ui/textarea';
import PromptWithTags from '@/components/prompt-with-tags';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import {
  fetchPromptSegments,
  postFeedback,
  fetchTranslate,
  fetchRemainingTimes,
} from '@/lib/api';
import { isNonEnglishCharCountExceeding80Percent } from '@/lib/utils';
import { Segment } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import Footer from '@/components/footer';
import ThemeSelector from '@/components/theme-selector';
import LeftTimes from '@/components/left-times';

const filterSegments = (segments: Segment[], categoryId: string): Segment[] => {
  const list = [...segments.filter((x) => x.tag === categoryId)];
  if (!list.length) {
    list.push({ text: '无', tag: categoryId });
  }
  return list;
};

const exampleMjPrompt = 'A cat, on the couch, pixel art ,canary yellow,closeup';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRemainingTimes, setLoadingRemainingTimes] = useState<boolean>(false);
  const [remainingTimes, setRemainingTimes] = useState<number>();
  const [input, setInput] = useState<string>('');
  // status
  const [sessionId, setSessionId] = useState<string>();
  const [outputPrompt, setOutputPrompt] = useState<string>('');
  const [outputPromptLocalized, setOutputPromptLocalized] = useState<string>('');
  const [outputSegments, setOutputSegments] = useState<Segment[]>([]);
  const [saySomething, setSaySomething] = useState<string>();
  const [feedback, setFeedback] = useState<'good' | 'bad' | undefined>();

  const submitFeedback = async (params: Parameters<typeof postFeedback>[0]) => {
    toast.success('感谢您的反馈！', {
      duration: 2000,
    });
    try {
      setFeedback(params.feedback);
      await postFeedback(params);
    } catch (error: Error | any) {
      setFeedback(undefined);
      toast.error(error?.message);
      console.error(error?.message);
    }
  };

  const getTranslate = async (text: string) => {
    try {
      const data = await fetchTranslate(text);
      data?.TargetText && setOutputPromptLocalized(data.TargetText);
    } catch (error: Error | any) {
      toast.error(error?.message);
    }
  };

  const clearState = () => {
    setOutputSegments([]);
    setOutputPrompt('');
    setOutputPromptLocalized('');
    setSaySomething('');
    setSessionId('');
    setFeedback(undefined);
  };

  const onSubmit = async () => {
    const mjPrompt = (input || exampleMjPrompt).trim();

    if (isNonEnglishCharCountExceeding80Percent(mjPrompt)) {
      toast.error('这好像不是一个提示词哦，试试输入英文提示词吧！');
      setLoading(false);
      return;
    }

    // clear state
    clearState();
    setInput(mjPrompt);
    setLoading(true);
    try {
      // update remaining times first
      getRemainingTimes({ silent: true });

      getTranslate(mjPrompt);
      const res = await fetchPromptSegments(mjPrompt);

      // fill state
      setOutputSegments(res.segments || []);
      setOutputPrompt(mjPrompt);
      setSaySomething(res.saySomething);
      setSessionId(res.sessionId);
      setLoading(false);

      // update remaining times again
      setTimeout(() => {
        getRemainingTimes({ silent: true });
      }, 1000);
    } catch (error: Error | any) {
      toast.error(error?.message);
      setLoading(false);
    }
  };

  const getRemainingTimes = async ({ silent }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoadingRemainingTimes(true);
      }
      const data = await fetchRemainingTimes();
      setRemainingTimes(data.remainingTimes);
      setLoadingRemainingTimes(false);
    } catch (error: Error | any) {
      console.error(error?.message);
      setLoadingRemainingTimes(false);
    }
  };

  useEffect(() => {
    getRemainingTimes();
  }, []);

  return (
    <main className="min-h-screen py-8 px-4 lg:px-8 container flex flex-col">
      <div className="w-full flex justify-between items-center sm:items-end">
        <a
          href="/"
          className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-orange-600">
          Midjourney 小白理解助手
        </a>
        <div className="flex text-gray-600 dark:text-gray-400 items-center">
          <a
            className=""
            title="Github"
            href="https://github.com/linchen1987/midjourney-copilot"
            target="_blank">
            <GithubIcon className="w-8" />
          </a>
          <a
            className=""
            title="Discord"
            href="https://discord.gg/VhjXsqSY"
            target="_blank">
            <DiscordIcon className="w-8" />
          </a>
          <a
            className="ml-1 mr-2"
            title="产品经理的AI服务搭建实操课"
            href="https://ui1aq1cogim.feishu.cn/docx/WDrsdpuTro9fdwx9v1tcxwhHnpe"
            target="_blank">
            <BookOpen className="w-8" />
          </a>
          <ThemeSelector />
        </div>
      </div>

      <div className="mt-16">
        <div className="text-lg mb-0 sm:mb-1 font-bold text-gray-600 dark:text-gray-300 flex items-center">
          <Bot className="mr-2" />
          输入一段提示词，我来帮你理解它
        </div>
        <LeftTimes
          className="text-gray-500 dark:text-gray-400 mb-4 pl-8 text-sm"
          remainingTimes={loadingRemainingTimes ? '...' : remainingTimes}
        />
        <Textarea
          id="description"
          className="min-h-32 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 text-base"
          placeholder={exampleMjPrompt}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="mt-2 w-full"
          disabled={loading || !!(input && !input.trim())}
          onClick={onSubmit}>
          {loading ? <Spinner className="text-inherit size-4 mr-1" /> : null}
          {input && input === outputPrompt ? '再理解一次' : '帮我理解一下'}
        </Button>
      </div>

      {!!outputSegments.length && (
        <div className="mt-10">
          <div className="text-gray-500 dark:text-gray-300 flex items-start sm:items-end">
            <Bot className="mr-2" />
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
          <div className="mt-12 text-gray-400 text-sm justify-center flex items-center">
            内容由大模型生成
            {sessionId && (
              <>
                <ThumbsUp
                  className={clsx(
                    'ml-4 w-5 mr-1 transition',
                    !feedback &&
                      'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200',
                    feedback === 'good' && 'text-orange-600'
                  )}
                  onClick={() =>
                    !feedback &&
                    submitFeedback({
                      feedback: 'good',
                      sessionId,
                      result: outputSegments,
                    })
                  }
                />
                <ThumbsDown
                  className={clsx(
                    'ml-2 w-5 transition',
                    !feedback &&
                      'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200',
                    feedback === 'bad' && 'text-orange-600'
                  )}
                  onClick={() =>
                    !feedback &&
                    submitFeedback({ feedback: 'bad', sessionId, result: outputSegments })
                  }
                />
              </>
            )}
          </div>
        </div>
      )}
      <div className="grow"></div>
      <Footer />
    </main>
  );
}
