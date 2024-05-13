import { Categories } from '../types';

export const CATEGORIES = [
  {
    id: 'subject',
    name: '主体',
    color: 'blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  {
    id: 'environment',
    name: '环境',
    color: 'green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-500',
  },
  {
    id: 'pointOfViewAndComposition',
    name: '构图',
    color: 'yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
  },
  {
    id: 'lightingAndColor',
    name: '光线',
    color: 'red-600',
    textColor: 'text-red-600',
    bgColor: 'bg-red-500',
  },
  {
    id: 'mediumAndStyles',
    name: '风格',
    color: 'purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
];

export const CATEGORY_MAP: Categories = CATEGORIES.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {} as Categories);
