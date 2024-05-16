import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <div className="border-t pt-4">
      <div>
        <div className="flex text-gray-600 mb-2">
          <a
            className="flex items-center p-4 border rounded-lg"
            title="产品经理的AI服务搭建实操课"
            href="https://ui1aq1cogim.feishu.cn/docx/WDrsdpuTro9fdwx9v1tcxwhHnpe"
            target="_blank">
            <BookOpenIcon className="w-5 mr-2" /> 产品经理的 AI 服务搭建实操课
          </a>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        © Copyright 2024.{' '}
        <a href="https://link1987.site" target="_blank" className="text-orange-600">
          Link1987
        </a>{' '}
        All rights reserved.
      </div>
    </div>
  );
}
