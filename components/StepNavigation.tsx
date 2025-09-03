'use client'

import { CheckIcon } from '@heroicons/react/24/solid'
import { HomeIcon, TruckIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

interface Step {
  id: string
  title: string
  titleAr: string
  icon: React.ComponentType<{ className?: string }>
  isCompleted: boolean
  isCurrent: boolean
}

interface StepNavigationProps {
  currentStep: string
  steps: Step[]
}

export default function StepNavigation({ currentStep, steps }: StepNavigationProps) {
  return (
    <div className="w-full py-6 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                <div className="flex items-center">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2">
                    {step.isCompleted ? (
                      <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    ) : step.isCurrent ? (
                      <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <step.icon className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <step.icon className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-10 -ml-px h-0.5 w-full ${
                        step.isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <span className={`text-sm font-medium ${
                    step.isCompleted ? 'text-primary-600' : step.isCurrent ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.titleAr}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.title}
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
