import { useState, useCallback } from 'react';

export interface DiagramStepDef {
  description: string;
  activeElements?: string[];
}

export function useInteractiveDiagram(stepDefs: DiagramStepDef[]) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepDefs.length - 1));
  }, [stepDefs.length]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const getOpacity = (elementStep: number) => (currentStep >= elementStep ? 1 : 0);

  const isActive = (elementId: string) => stepDefs[currentStep]?.activeElements?.includes(elementId) ?? false;

  return {
    currentStep,
    totalSteps: stepDefs.length - 1,
    stepDescription: stepDefs[currentStep]?.description ?? '',
    isComplete: currentStep >= stepDefs.length - 1,
    handleStep,
    handleReset,
    getOpacity,
    isActive,
  };
}
