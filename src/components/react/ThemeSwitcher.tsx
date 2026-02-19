import { useState, useEffect, useRef } from 'react';
import { Check, Palette } from 'lucide-react';
import { themes, defaultThemeId, getTheme, applyTheme } from '../../lib/themes';
import type { Theme } from '../../lib/themes';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(defaultThemeId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('brewnary-theme');
    const valid = themes.find((t) => t.id === stored);
    setCurrentId(valid ? stored! : defaultThemeId);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function select(theme: Theme) {
    applyTheme(theme);
    localStorage.setItem('brewnary-theme', theme.id);
    setCurrentId(theme.id);
    setOpen(false);
  }

  const current = getTheme(currentId);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        aria-label="Tema"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{current?.name}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] py-1 shadow-xl">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => select(theme)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors ${
                currentId === theme.id
                  ? 'bg-[var(--color-border)]/30 text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/20 hover:text-[var(--color-text)]'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-white/10"
                style={{ backgroundColor: theme.colors.bg }}
              />
              <span className="flex-1 text-left">{theme.name}</span>
              {currentId === theme.id && <Check className="h-3.5 w-3.5 opacity-50" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
