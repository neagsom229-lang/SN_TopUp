interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  isCompleted
                    ? 'bg-primary text-gray-950 shadow-lg shadow-primary/20'
                    : isCurrent
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : 'bg-gray-800 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${isCurrent ? 'text-white' : 'text-gray-400'}`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition ${isCompleted ? 'bg-primary' : 'bg-gray-800'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
