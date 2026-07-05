import { Outlet, Link } from '@tanstack/react-router';
import ThemeToggle from '../components/ThemeToggle';
import { Coffee, FileText, MessageSquare } from 'lucide-react';

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-text-primary transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-95 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/10">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight font-display bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                PersonaBot
              </span>
              <span className="text-[10px] block font-mono text-zinc-500 leading-none tracking-widest uppercase">
                Chai & Code
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/"
              activeProps={{ className: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-semibold' }}
              inactiveProps={{ className: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/40' }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>
            <Link
              to="/docs"
              activeProps={{ className: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-semibold' }}
              inactiveProps={{ className: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/40' }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Docs</span>
            </Link>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>&copy; 2026 PersonaBot. Inspired by Hitesh Choudhary & Piyush Garg.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Chat Dashboard</Link>
            <span>&bull;</span>
            <Link to="/docs" className="hover:underline">System Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
