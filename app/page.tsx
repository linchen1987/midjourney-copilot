"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import data1 from "../.local/data/1";
import PromptWithTags from "@/components/prompt-with-tags";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { getPromptSegments } from "@/lib/api";
import { Segment } from "@/types";
import { CATEGORY_MAP } from "@/lib/constants";

const categories = [
  {
    id: "subject",
    name: "主体",
  },
  {
    id: "environment",
    name: "环境",
  },
  {
    id: "composition",
    name: "构图",
  },
  {
    id: "scenery",
    name: "景别",
  },
  {
    id: "light",
    name: "光线",
  },
  {
    id: "style",
    name: "风格",
  },
];
export default function Home() {
  // const [input, setInput] = useState<string>("");
  const [input, setInput] = useState<string>(
    "Create a dynamic and colorful urban street art-inspired composition that blends various elements of graffiti, such as expressive cartoon characters, dripping paint effects, and layered tagging. Incorporate a mixture of vibrant and contrasting colors like electric blue, vivid yellow, and hot pink, while embedding symbols like peace signs, hearts, and iconic pop culture references. Ensure the artwork conveys a sense of spontaneous creativity and the raw energy of the urban underground art scene"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     // router.push(`/search?q=${encodeURIComponent(value)}`);
  //   }
  // };
  const onSubmit = async () => {
    setLoading(true);
    setSegments([]);
    try {
      const res = await getPromptSegments(input);
      const _segments: Segment[] = [];
      for (const [category, texts] of Object.entries(res)) {
        if (typeof texts === "string") {
          _segments.push({ text: texts, tag: category });
        } else {
          for (const text of texts as Array<string>) {
            _segments.push({ text, tag: category });
          }
        }
      }
      setSegments(_segments);
      setLoading(false);
    } catch (error) {
      // TODO toast
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 lg:px-8 container">
      <div className="w-full font-mono font-bold text-2xl text-orange-600">
        <a href="/">Midjourney Toolkit</a>
      </div>

      <div className="mt-10 relative">
        <Textarea
          id="description"
          className="min-h-32"
          placeholder="输入提示词"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="absolute right-2 bottom-2 rounded-full"
          disabled={loading || !input}
          onClick={onSubmit}
        >
          {loading ? <Spinner className="text-inherit size-4 mr-1" /> : null}
          提交
        </Button>
      </div>

      {!!segments.length && (
        <div className="mt-10">
          <h2 className="text-2xl mb-4">结果</h2>
          {categories.map((category) => (
            <p key={category.id}>
              <span>{category.name}：</span>
              <span>
                {segments
                  .filter((x) => x.tag === category.id)
                  .map((x) => x.text)
                  .join(", ") || "无"}
              </span>
            </p>
          ))}
        </div>
      )}

      {!!input && !!segments?.length && (
        <div className="mt-10 border p-4">
          <PromptWithTags text={input} segments={segments} />
        </div>
      )}
    </main>
  );
}
