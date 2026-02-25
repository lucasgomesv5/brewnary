import { useState, useCallback } from 'react';

export interface DiagramStepDef {
  description: string;
  activeElements?: string[];
}

export function useInteractiveDiagram(stepDefs: DiagramStepDef[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepDefs.length - 1));
  }, [stepDefs.length]);

  const handleReset = useCallback(() => {
    setShowAll(false);
    setCurrentStep(0);
  }, []);

  const handleShowAll = useCallback(() => {
    setShowAll(true);
    setCurrentStep(stepDefs.length - 1);
  }, [stepDefs.length]);

  const getOpacity = (elementStep: number) => (showAll ? 1 : currentStep >= elementStep ? 1 : 0);

  const isActive = (elementId: string) => (showAll ? false : stepDefs[currentStep]?.activeElements?.includes(elementId) ?? false);

  return {
    currentStep,
    totalSteps: stepDefs.length - 1,
    stepDescription: stepDefs[currentStep]?.description ?? '',
    isComplete: currentStep >= stepDefs.length - 1,
    showAll,
    handleStep,
    handleReset,
    handleShowAll,
    getOpacity,
    isActive,
  };
}
