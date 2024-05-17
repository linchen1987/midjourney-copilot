import { BookOpenIcon } from '@heroicons/react/24/outline';
import { UsersIcon } from 'lucide-react';

export default function Footer() {
  const teamLink = 'https://vvcgxa4aijv.feishu.cn/wiki/X4q0wmrhOiaKVIk3rR8cbdQ2nfc';

  return (
    <div className="border-t pt-4 mt-32">
      <div className="sm:flex justify-between items-center mb-8">
        <div className="flex text-gray-600 dark:text-gray-400 items-center mb-4 sm:mb-0">
          <div className="mr-2">推荐：</div>
          <a
            className="flex items-center p-4 border rounded-lg"
            title="产品经理的AI服务搭建实操课"
            href="https://ui1aq1cogim.feishu.cn/docx/WDrsdpuTro9fdwx9v1tcxwhHnpe"
            target="_blank">
            <BookOpenIcon className="w-5 mr-2" /> 产品经理的 AI 服务搭建实操课
          </a>
        </div>
        <div className="text-gray-600">
          <a href={teamLink} target="_blank" className="flex items-center">
            <UsersIcon className="size-5 mr-1" /> 关于我们
          </a>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        © Copyright 2024.{' '}
        <a href={teamLink} target="_blank" className="text-orange-500">
          AI应用开荒小分队
        </a>{' '}
        All rights reserved.
      </div>
    </div>
  );
}
