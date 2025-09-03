'use client'

import { CheckIcon } from '@heroicons/react/24/solid'

interface ProgressStep {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  isCompleted: boolean
  isCurrent: boolean
}

interface ProgressStepperProps {
  steps: ProgressStep[]
  currentStep: string
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                <div className="flex items-center">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2">
                    {step.isCompleted ? (
                      <div className="h-4 w-4 rounded-full bg-primary-600 flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-white" />
                      </div>
                    ) : step.isCurrent ? (
                      <div className="h-4 w-4 rounded-full bg-primary-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-8 -ml-px h-0.5 w-full ${
                        step.isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <span className={`text-xs font-medium ${
                    step.isCompleted ? 'text-primary-600' : step.isCurrent ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.titleAr}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.descriptionAr}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
