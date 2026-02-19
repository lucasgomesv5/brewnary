import { useState } from 'react';
import { FlaskConical, Check, X } from 'lucide-react';

interface Props {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

const QUIZ_COLORS = {
  correct: '#10B981',
  correctBg: '#10B98110',
  incorrect: '#EF4444',
  incorrectBg: '#EF444410',
  selected: '#8B5CF6',
  selectedBg: '#8B5CF610',
} as const;

export default function QuizQuestion({ question, options, correctIndex, explanation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
  }

  function handleCheck() {
    if (selected === null) return;
    setRevealed(true);
  }

  function handleReset() {
    setSelected(null);
    setRevealed(false);
  }

  const isCorrect = selected === correctIndex;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-5 py-3">
        <div className="flex items-center gap-2">
          <FlaskConical size={16} />
          <span className="text-sm font-semibold">Teste seu conhecimento</span>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-4 font-medium">{question}</p>

        <div className="mb-4 space-y-2">
          {options.map((option, i) => {
            let borderColor = 'var(--color-border)';
            let bg = 'transparent';

            if (revealed && i === correctIndex) {
              borderColor = QUIZ_COLORS.correct;
              bg = QUIZ_COLORS.correctBg;
            } else if (revealed && i === selected && !isCorrect) {
              borderColor = QUIZ_COLORS.incorrect;
              bg = QUIZ_COLORS.incorrectBg;
            } else if (selected === i) {
              borderColor = QUIZ_COLORS.selected;
              bg = QUIZ_COLORS.selectedBg;
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="w-full rounded-lg border px-4 py-3 text-left text-sm transition-all"
                style={{ borderColor, backgroundColor: bg }}
                disabled={revealed}
              >
                <span className="mr-2 font-medium">{String.fromCharCode(65 + i)}.</span>
                {option}
                {revealed && i === correctIndex && (
                  <Check size={14} className="ml-2 inline" style={{ color: QUIZ_COLORS.correct }} />
                )}
                {revealed && i === selected && !isCorrect && i !== correctIndex && (
                  <X size={14} className="ml-2 inline" style={{ color: QUIZ_COLORS.incorrect }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40`}
              style={{ backgroundColor: QUIZ_COLORS.selected }}
            >
              Verificar
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
            >
              Tentar novamente
            </button>
          )}

          {revealed && (
            <span
              className="text-sm font-medium"
              style={{ color: isCorrect ? QUIZ_COLORS.correct : QUIZ_COLORS.incorrect }}
            >
              {isCorrect ? 'Correto!' : 'Incorreto'}
            </span>
          )}
        </div>

        {revealed && explanation && (
          <div className="mt-4 rounded-lg bg-[var(--color-bg-alt)] p-3 text-sm">
            <p className="mb-1 font-medium">Explicação:</p>
            <p className="text-[var(--color-text-muted)]">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
