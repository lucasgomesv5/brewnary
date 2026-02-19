import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { trackColors } from '../../lib/tracks';

interface SearchItem {
  title: string;
  track: string;
  url: string;
  description?: string;
}

interface Props {
  items: SearchItem[];
}

export default function SearchPalette({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = new Fuse(items, {
    keys: ['title', 'description', 'track'],
    threshold: 0.3,
  });

  const results = query.length > 0 ? fuse.search(query).slice(0, 8) : [];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
          <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar lições, tópicos..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <kbd className="hidden rounded bg-[var(--color-border)]/50 px-2 py-0.5 text-xs text-[var(--color-text-muted)] sm:inline-block">
            ESC
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map(({ item }) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--color-border)]/30"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: trackColors[item.track] }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    {item.description && (
                      <div className="truncate text-xs text-[var(--color-text-muted)]">{item.description}</div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
            Nenhum resultado para "{query}"
          </div>
        )}

        {query.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">Digite para buscar...</div>
        )}
      </div>
    </div>
  );
}
