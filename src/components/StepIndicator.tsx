import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success text-white'
                    : isCurrent
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check size={18} /> : step}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isCurrent ? 'text-accent' : isCompleted ? 'text-success' : 'text-gray-400'
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 transition-all duration-300 ${
                  isCompleted ? 'bg-success' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
