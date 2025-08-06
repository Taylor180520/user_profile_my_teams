import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {/* Toggle背景轨道 */}
      <span className="sr-only">切换主题</span>
      
      {/* 滑动按钮 */}
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-300 shadow-lg transition-transform duration-200 ease-in-out ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {/* 图标容器 */}
        <span className="flex h-full w-full items-center justify-center">
          {theme === 'light' ? (
            <Sun size={14} className="text-yellow-500" />
          ) : (
            <Moon size={14} className="text-blue-400" />
          )}
        </span>
      </span>
      
      {/* 左侧Light图标 */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2">
        <Sun size={12} className={`transition-opacity duration-200 ${
          theme === 'light' ? 'opacity-0' : 'opacity-60 text-gray-400'
        }`} />
      </span>
      
      {/* 右侧Dark图标 */}
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <Moon size={12} className={`transition-opacity duration-200 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-60 text-gray-500'
        }`} />
      </span>
    </button>
  );
};

export default ThemeToggle;