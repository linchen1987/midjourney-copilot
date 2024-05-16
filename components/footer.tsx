import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <div className="border-t pt-4">
      <div className="flex text-gray-600 mb-8 items-center">
        <div className="mr-2">推荐：</div>
        <a
          className="flex items-center p-4 border rounded-lg"
          title="产品经理的AI服务搭建实操课"
          href="https://ui1aq1cogim.feishu.cn/docx/WDrsdpuTro9fdwx9v1tcxwhHnpe"
          target="_blank">
          <BookOpenIcon className="w-5 mr-2" /> 产品经理的 AI 服务搭建实操课
        </a>
      </div>
      <div className="text-center text-sm text-gray-500">
        © Copyright 2024. AI应用开荒小分队 All rights reserved.
      </div>
    </div>
  );
}
