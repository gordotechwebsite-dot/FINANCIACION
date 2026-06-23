interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div>
      <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-[3px] sm:h-1 flex-1 rounded-full transition-all duration-300 ${
              i + 1 <= currentStep ? 'bg-white' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <p className="text-[10px] sm:text-xs text-white/60">
        {currentStep}/{totalSteps} — <span className="text-white/90">{labels[currentStep - 1]}</span>
      </p>
    </div>
  );
}
