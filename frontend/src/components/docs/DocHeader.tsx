import { Clock } from 'lucide-react';

interface DocHeaderProps {
  title: string;
  subtitle: string;
  readingTime?: string;
}

export default function DocHeader({ title, subtitle, readingTime }: DocHeaderProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-display">
          {title}
        </h1>
        {readingTime && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-3xl">
        {subtitle}
      </p>
    </div>
  );
}
