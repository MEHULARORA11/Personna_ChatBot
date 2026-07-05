import { Outlet, Link } from '@tanstack/react-router';
import { BookOpen, User, Key, RefreshCw, MessageSquare } from 'lucide-react';

export const DOCS_NAV_ITEMS = [
  {
    path: '/docs',
    label: 'Overview & Request Flow',
    icon: BookOpen,
    exact: true
  },
  {
    path: '/docs/persona-data',
    label: 'Persona Data Source',
    icon: User
  },
  {
    path: '/docs/prompt-engineering',
    label: 'Prompt Engineering',
    icon: Key
  },
  {
    path: '/docs/context-management',
    label: 'Context & Cookies',
    icon: RefreshCw
  },
  {
    path: '/docs/sample-conversations',
    label: 'Sample Conversations',
    icon: MessageSquare
  }
];

export default function DocsLayout() {
  return (
    <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-8 py-4">
      {/* Sidebar Navigation */}
      <aside className="md:col-span-3 flex flex-col gap-4">
        <div className="p-4 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            System Docs
          </h2>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">
            Persona ChatBot Architecture
          </p>
        </div>

        {/* Desktop Sidebar Links (hidden on mobile) */}
        <nav className="hidden md:flex flex-col gap-1">
          {DOCS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                activeOptions={{ exact: item.exact }}
                activeProps={{
                  className: 'bg-amber-500/10 border-l-2 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                }}
                inactiveProps={{
                  className: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border-l-2 border-transparent'
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-r-lg text-sm transition-all duration-200"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Horizontal Navigation (hidden on desktop) */}
        <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x px-1">
          {DOCS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                activeOptions={{ exact: item.exact }}
                activeProps={{
                  className: 'bg-amber-600 text-white font-semibold'
                }}
                inactiveProps={{
                  className: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs snap-center whitespace-nowrap border border-zinc-200/50 dark:border-zinc-800/50"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Reading Panel */}
      <section className="md:col-span-9 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <Outlet />
      </section>
    </div>
  );
}
