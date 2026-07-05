import { useLocation, Link } from '@tanstack/react-router';
import { DOCS_NAV_ITEMS } from '../../routes/docs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocsPagerFooter() {
  const { pathname } = useLocation();
  
  // Find current position in navigation config
  // Normalize both paths (remove trailing slash if any, except for root /docs)
  const normalizedPathname = pathname.replace(/\/$/, '') || '/docs';
  
  const currentIndex = DOCS_NAV_ITEMS.findIndex(item => {
    const itemPathNormalized = item.path.replace(/\/$/, '') || '/docs';
    return itemPathNormalized === normalizedPathname;
  });

  const prevItem = currentIndex > 0 ? DOCS_NAV_ITEMS[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < DOCS_NAV_ITEMS.length - 1 ? DOCS_NAV_ITEMS[currentIndex + 1] : null;

  if (!prevItem && !nextItem) return null;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800/80 pt-6 mt-10">
      {prevItem ? (
        <Link
          to={prevItem.path}
          className="group flex flex-col gap-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all duration-300 max-w-[48%] text-left"
        >
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display truncate">
            {prevItem.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextItem ? (
        <Link
          to={nextItem.path}
          className="group flex flex-col gap-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all duration-300 max-w-[48%] text-right ml-auto"
        >
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 justify-end">
            Next
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display truncate">
            {nextItem.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
