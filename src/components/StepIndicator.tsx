interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i + 1 <= currentStep ? 'bg-accent' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Paso {currentStep} de {totalSteps} — <span className="font-medium text-primary">{labels[currentStep - 1]}</span>
      </p>
    </div>
  );
}
