import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full border border-border-main bg-bg-surface text-text-muted hover:text-accent hover:border-accent/40 transition-colors duration-200 flex items-center justify-center cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === 'dark' ? 'opacity-0 scale-50 -rotate-45' : 'opacity-100 scale-100 rotate-0'
        }`}
      />
      <Moon
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45'
        }`}
      />
    </button>
  );
}
