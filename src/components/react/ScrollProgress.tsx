import { useState, useEffect } from 'react';

interface Props {
  trackColor?: string;
}

export default function ScrollProgress({ trackColor = '#8B5CF6' }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((window.scrollY / docHeight) * 100, 100));
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 z-[60] h-[3px]">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, backgroundColor: trackColor }}
      />
    </div>
  );
}
