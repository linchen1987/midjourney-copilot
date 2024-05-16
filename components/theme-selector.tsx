'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ring-0 focus:ring-0 relative">
          <Sun className="h-6 w-6 scale-100 dark:hidden" />
          <Moon className="h-6 w-6 scale-100  hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:text-gray-400">
        <DropdownMenuItem onClick={() => setTheme('light')}>浅色模式</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>深色模式</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>跟随系统</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
