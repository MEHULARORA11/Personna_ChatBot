import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import ByokControl from '../components/ByokControl';
import { FileText, MessageSquare, Menu, X } from 'lucide-react';

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChat = pathname === '/';

  return (
    <div className={`flex flex-col bg-bg-base text-text-primary transition-colors duration-300 ${isChat ? 'h-dvh overflow-hidden' : 'min-h-dvh'}`}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border-main/70 bg-bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMenuOpen(false)}
          >
            <span className="w-9 h-9 rounded-full bg-accent/12 border border-accent/25 flex items-center justify-center text-accent font-display text-lg font-semibold group-hover:bg-accent/18 transition-colors">
              P
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight">
                Personic
              </span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.16em]">
                Chai &amp; Code
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              activeProps={{ className: 'text-text-primary bg-bg-surface border-border-main shadow-sm' }}
              inactiveProps={{ className: 'text-text-muted border-transparent hover:text-text-primary' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </Link>
            <Link
              to="/docs"
              activeProps={{ className: 'text-text-primary bg-bg-surface border-border-main shadow-sm' }}
              inactiveProps={{ className: 'text-text-muted border-transparent hover:text-text-primary' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs</span>
            </Link>
            <div className="h-6 w-px bg-border-main mx-1" />
            <ByokControl />
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex sm:hidden items-center gap-2">
            <ByokControl />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="p-2.5 rounded-full border border-border-main text-text-muted hover:text-text-primary transition-colors"
            >
              {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        {menuOpen && (
          <nav className="sm:hidden border-t border-border-main/70 px-4 py-3 flex flex-col gap-1 bg-bg-base/95">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              activeProps={{ className: 'text-text-primary bg-bg-surface border-border-main' }}
              inactiveProps={{ className: 'text-text-muted border-transparent' }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            <Link
              to="/docs"
              onClick={() => setMenuOpen(false)}
              activeProps={{ className: 'text-text-primary bg-bg-surface border-border-main' }}
              inactiveProps={{ className: 'text-text-muted border-transparent' }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            >
              <FileText className="w-4 h-4" />
              Docs
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main
        className={`w-full max-w-7xl mx-auto flex flex-col ${
          isChat ? 'flex-1 min-h-0 overflow-hidden px-0 sm:px-6 lg:px-8 py-0 sm:py-4' : 'flex-1 px-4 sm:px-6 lg:px-8 py-6'
        }`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      {!isChat && (
        <footer className="hidden sm:block border-t border-border-main/70 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-text-muted">
            <p>Personic &mdash; inspired by Hitesh Choudhary &amp; Piyush Garg</p>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-text-primary transition-colors">Chat</Link>
              <span className="opacity-40">&bull;</span>
              <Link to="/docs" className="hover:text-text-primary transition-colors">Docs</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
