import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const complexities = [
  { key: 'o1', label: 'O(1)', color: '#10B981', fn: () => 1 },
  { key: 'ologn', label: 'O(log n)', color: '#2563EB', fn: (n: number) => Math.log2(n) },
  { key: 'on', label: 'O(n)', color: '#F59E0B', fn: (n: number) => n },
  { key: 'onlogn', label: 'O(n log n)', color: '#EC4899', fn: (n: number) => n * Math.log2(n) },
  { key: 'on2', label: 'O(n²)', color: '#EF4444', fn: (n: number) => n * n },
];

function generateData(maxN: number) {
  const step = Math.max(1, Math.floor(maxN / 20));
  const data = [];
  for (let n = 1; n <= maxN; n += step) {
    const point: Record<string, number> = { n };
    for (const c of complexities) {
      point[c.key] = Math.min(c.fn(n), maxN * maxN);
    }
    data.push(point);
  }
  return data;
}

export default function BigOVisualizer() {
  const [maxN, setMaxN] = useState(50);
  const [active, setActive] = useState<Set<string>>(new Set(['o1', 'on', 'on2']));
  const data = generateData(maxN);

  function toggleLine(key: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="not-prose my-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="mb-4 text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Visualizador de Complexidade Big O
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {complexities.map((c) => (
          <button
            key={c.key}
            onClick={() => toggleLine(c.key)}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: active.has(c.key) ? c.color : 'transparent',
              borderColor: c.color,
              color: active.has(c.key) ? '#fff' : c.color,
              opacity: active.has(c.key) ? 1 : 0.5,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Tamanho da entrada (n): {maxN}</label>
        <input
          type="range"
          min={10}
          max={200}
          value={maxN}
          onChange={(e) => setMaxN(Number(e.target.value))}
          className="w-full accent-[#8B5CF6]"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="n" label={{ value: 'n (input size)', position: 'bottom', offset: -5 }} />
          <YAxis label={{ value: 'Operations', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [Math.round(value), '']}
          />
          <Legend />
          {complexities.map((c) =>
            active.has(c.key) ? (
              <Line
                key={c.key}
                type="monotone"
                dataKey={c.key}
                name={c.label}
                stroke={c.color}
                strokeWidth={2}
                dot={false}
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
