export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    bgAlt: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    accentMuted: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    colors: {
      bg: '#2D2520',
      bgAlt: '#352E28',
      text: '#FAF6F1',
      textMuted: '#B8A898',
      border: '#4A3F36',
      accent: '#D4956B',
      accentMuted: '#D4956B20',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      bg: '#0D1117',
      bgAlt: '#161B22',
      text: '#E6EDF3',
      textMuted: '#7D8590',
      border: '#30363D',
      accent: '#58A6FF',
      accentMuted: '#58A6FF20',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      bg: '#282A36',
      bgAlt: '#2D2F3D',
      text: '#F8F8F2',
      textMuted: '#6272A4',
      border: '#44475A',
      accent: '#BD93F9',
      accentMuted: '#BD93F920',
    },
  },
];

export const defaultThemeId = 'espresso';

export function getTheme(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);
  root.style.setProperty('--color-bg', theme.colors.bg);
  root.style.setProperty('--color-bg-alt', theme.colors.bgAlt);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-accent-muted', theme.colors.accentMuted);
}
