import { useEffect, useState } from 'react';

interface HeadingItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Find all h2 elements in the container
    const container = document.querySelector('.docs-content');
    if (!container) return;

    const elements = Array.from(container.querySelectorAll('h2'));
    const items: HeadingItem[] = elements.map((el, idx) => {
      if (!el.id) {
        // Create an ID if one doesn't exist
        const slug = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        el.id = slug || `section-${idx}`;
      }
      return {
        id: el.id,
        text: el.textContent || '',
      };
    });

    setHeadings(items);

    // Setup intersection observer to track reading position
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px', // Trigger when section is near top of viewport
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block w-52 shrink-0 sticky top-24 self-start space-y-3 pl-6 border-l border-zinc-200 dark:border-zinc-800/80">
      <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
        On this page
      </p>
      <ul className="space-y-2.5 text-xs">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
                setActiveId(heading.id);
              }}
              className={`block transition-all duration-200 leading-normal hover:text-amber-500 dark:hover:text-amber-400 ${
                activeId === heading.id
                  ? 'text-amber-600 dark:text-amber-400 font-semibold translate-x-0.5'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
