import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNonEnglishCharCountExceeding80Percent(input: string): boolean {
  const str = input.trim();
  if (str.length === 0) return false; // 空字符串处理

  // 定义英文字符的正则表达式
  const englishCharPattern = /[a-zA-Z]/;
  let nonEnglishCharCount = 0;

  // 遍历字符串并计算非英文字符的数量
  for (let i = 0; i < str.length; i++) {
    if (!englishCharPattern.test(input[i])) {
      nonEnglishCharCount++;
    }
  }

  // 计算非英文字符的百分比
  const nonEnglishCharPercentage = (nonEnglishCharCount / str.length) * 100;

  // 判断是否超过 80%
  return nonEnglishCharPercentage > 80;
}

/**
 * return yyyy-mm-dd
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};
