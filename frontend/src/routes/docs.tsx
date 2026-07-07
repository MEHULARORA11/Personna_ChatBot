import { Outlet, Link } from '@tanstack/react-router';
import { BookOpen, User, Key, RefreshCw, MessageSquare } from 'lucide-react';

export const DOCS_NAV_ITEMS = [
  {
    path: '/docs',
    label: 'Overview & Request Flow',
    icon: BookOpen,
    exact: true,
  },
  {
    path: '/docs/persona-data',
    label: 'Persona Data Source',
    icon: User,
  },
  {
    path: '/docs/prompt-engineering',
    label: 'Prompt Engineering',
    icon: Key,
  },
  {
    path: '/docs/context-management',
    label: 'Context & Cookies',
    icon: RefreshCw,
  },
  {
    path: '/docs/sample-conversations',
    label: 'Sample Conversations',
    icon: MessageSquare,
  },
];

export default function DocsLayout() {
  return (
    <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8">
      {/* Sidebar Navigation */}
      <aside className="md:col-span-3 flex flex-col gap-4">
        <div className="px-4 py-2 select-none">
          <h2 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            System Docs
          </h2>
          <p className="text-[10px] text-text-muted font-mono mt-1">ChatBot Architecture</p>
        </div>

        {/* Desktop Sidebar Links */}
        <nav className="hidden md:flex flex-col gap-1">
          {DOCS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: 'bg-accent/8 border-accent text-accent font-medium' }}
                inactiveProps={{ className: 'text-text-muted hover:text-text-primary border-transparent hover:bg-bg-surface/30' }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-r-lg text-sm border-l-2 transition-all duration-200"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Horizontal Navigation */}
        <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {DOCS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: 'bg-accent text-white font-semibold border-accent' }}
                inactiveProps={{ className: 'text-text-muted border-border-main' }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs whitespace-nowrap border shrink-0"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Reading Panel */}
      <section className="md:col-span-9 flex flex-col min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
