import { useState, useEffect } from 'react';

interface Props {
  lessonId: string;
  trackColor?: string;
}

export default function ProgressTracker({ lessonId, trackColor = '#8B5CF6' }: Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brewnary-progress');
    if (stored) {
      const data = JSON.parse(stored) as string[];
      setCompleted(data.includes(lessonId));
    }
  }, [lessonId]);

  function toggle() {
    const stored = localStorage.getItem('brewnary-progress');
    const data: string[] = stored ? JSON.parse(stored) : [];

    let next: string[];
    if (data.includes(lessonId)) {
      next = data.filter((id) => id !== lessonId);
    } else {
      next = [...data, lessonId];
    }

    localStorage.setItem('brewnary-progress', JSON.stringify(next));
    setCompleted(!completed);
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border px-4 py-2 text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: completed ? trackColor : 'transparent',
        borderColor: trackColor,
        color: completed ? '#FFFFFF' : trackColor,
      }}
    >
      {completed ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Concluída
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
          </svg>
          Marcar como concluída
        </>
      )}
    </button>
  );
}
