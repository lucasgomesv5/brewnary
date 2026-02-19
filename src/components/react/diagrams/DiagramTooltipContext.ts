import { createContext, useContext } from 'react';

export interface TooltipActions {
  show: (text: string, x: number, y: number, nodeHeight: number) => void;
  hide: () => void;
}

export const TooltipContext = createContext<TooltipActions | null>(null);

export function useTooltip() {
  return useContext(TooltipContext);
}
