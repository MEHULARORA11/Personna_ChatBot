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
        <div className="p-4 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            System Docs
          </h2>
          <p className="text-[11px] text-text-muted font-mono mt-1">Persona ChatBot Architecture</p>
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
                activeProps={{ className: 'bg-accent/10 border-accent text-accent font-semibold' }}
                inactiveProps={{ className: 'text-text-muted hover:text-text-primary border-transparent' }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-r-lg text-sm border-l-2 transition-colors duration-200"
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
      <section
        className="md:col-span-9 rounded-2xl p-5 sm:p-8 border"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
      >
        <Outlet />
      </section>
    </div>
  );
}
