import { useEffect, useState, useRef } from 'react';
import { animate } from 'animejs';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Read from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // AnimeJS micro-interaction: Pop and rotate the icon container
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: newTheme === 'dark' ? [0, 360] : [360, 0],
        scale: [0.7, 1.1, 1],
        duration: 500,
        ease: 'easeOutElastic(1, .6)'
      });
    }

    // AnimeJS micro-interaction: Pulse the button border/bg
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: [1, 0.95, 1],
        duration: 200,
        ease: 'easeInOutQuad'
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
      aria-label="Toggle Theme"
    >
      <div ref={iconRef}>
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 transition-colors" />
        )}
      </div>
    </button>
  );
}
