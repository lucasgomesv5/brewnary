import { useState } from 'react';

const LANGS = ['js', 'py', 'cpp'] as const;
const LANG_LABELS: Record<(typeof LANGS)[number], string> = {
  js: 'JS',
  py: 'Python',
  cpp: 'C++',
};

interface Props {
  codes: Record<'js' | 'py' | 'cpp', string>;
  color?: string;
}

export default function AlgorithmCodeView({ codes, color = '#8B5CF6' }: Props) {
  const [lang, setLang] = useState<(typeof LANGS)[number]>('js');

  return (
    <div>
      <div className="mb-3 flex gap-1">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
            style={
              lang === l
                ? { backgroundColor: color, color: '#fff' }
                : {
                    backgroundColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }
            }
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <pre className="p-4 font-mono text-xs leading-relaxed">
          <code>
            {codes[lang].split('\n').map((line, i) => {
              const isComment =
                line.trimStart().startsWith('//') ||
                line.trimStart().startsWith('#') ||
                line.trimStart().startsWith('/*') ||
                line.trimStart().startsWith('*');

              return (
                <span key={i}>
                  {isComment ? (
                    <span style={{ color: 'var(--color-text-muted)' }}>{line}</span>
                  ) : (
                    <span style={{ color: 'var(--color-text)' }}>{line}</span>
                  )}
                  {'\n'}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
