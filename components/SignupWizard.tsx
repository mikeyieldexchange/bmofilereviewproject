import { useState, useEffect, useCallback } from 'react'
import AccountBasics from './forms/AccountBasics'
import PersonalDetails from './forms/PersonalDetails'
import Jurisdiction from './forms/Jurisdiction'
import W9Form from './forms/W9Form'
import CRSFATCAForm from './forms/CRSFATCAForm'
import TermsAndConditions from './forms/TermsAndConditions'
import KeyIndividuals from './forms/KeyIndividuals'
import DocumentUpload from './forms/DocumentUpload'
import EDeliveryStep from './forms/EDeliveryStep'
import { FormData } from '../types/form'

// Enhanced types for validation
interface ValidationError {
  field: string
  message: string
  type: 'required' | 'format' | 'business' | 'system'
}

interface ValidationState {
  [stepId: number]: {
    isValid: boolean
    errors: ValidationError[]
  }
}

const steps = [
  { id: 1, title: 'Account Basics', progress: 11, component: 'AccountBasics' },
  { id: 2, title: 'Personal Details', progress: 22, component: 'PersonalDetails' },
  { id: 3, title: 'Jurisdiction', progress: 33, component: 'Jurisdiction' },
  { id: 4, title: 'Compliance Forms', progress: 44, component: 'W9Form|CRSFATCAForm' },
  { id: 5, title: 'eDelivery Access', progress: 56, component: 'EDeliveryStep' },
  { id: 6, title: 'Terms & Conditions', progress: 67, component: 'TermsAndConditions' },
  { id: 7, title: 'Key Individuals', progress: 78, component: 'KeyIndividuals' },
  { id: 8, title: 'Document Upload', progress: 89, component: 'DocumentUpload' },
  { id: 9, title: 'Review & Consent', progress: 100, component: 'ReviewConsent' }
]

export default function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<FormData>(() => {
    // Initialize with minimal data to avoid hydration mismatch
    return {
      basics: {},
      personalDetails: {},
      jurisdiction: null,
      w9Form: {},
      additionalTaxResidencies: [],
      fatcaStatus: null,
      giin: null,
      crsFatcaForm: {},
      termsAndConditions: {},
      keyIndividuals: {},
      documentUpload: {},
      eDeliveryConsent: {},
      portalAccess: {},
      progress: {
        currentStep: 1,
        completedSteps: [],
        totalSteps: 9,
        percentage: 11
      }
    }
  })
  const [validationState, setValidationState] = useState<ValidationState>({})

  // Generate unique session ID
  function generateSessionId(): string {
    return `bmo-signup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Initialize metadata only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormData(prev => ({
        ...prev,
        metadata: {
          startTime: new Date(),
          sessionId: generateSessionId(),
          lastSaved: new Date(),
          userAgent: navigator.userAgent
        }
      }))
    }
  }, [])

  // Enhanced form data update with auto-save
  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [section]: data,
        metadata: {
          startTime: prev.metadata?.startTime || new Date(),
          sessionId: prev.metadata?.sessionId || generateSessionId(),
          lastSaved: new Date(),
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server'
        }
      }
      saveToLocalStorage(updated)
      return updated
    })
  }, [])

  // Local storage persistence
  const saveToLocalStorage = useCallback((data: FormData) => {
    try {
      const encryptedData = btoa(JSON.stringify(data)) // Basic encoding
      localStorage.setItem('bmo-signup-form', encryptedData)
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error)
    }
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmo-signup-form')
      if (saved) {
        const decoded = JSON.parse(atob(saved))
        setFormData(prev => ({ ...prev, ...decoded }))
        setCurrentStep(decoded.progress?.currentStep || 1)
        setCompletedSteps(decoded.progress?.completedSteps || [])
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error)
    }
  }, [])

  // Update progress when step changes
  useEffect(() => {
    const currentStepData = steps.find(step => step.id === currentStep)
    if (currentStepData) {
      updateFormData('progress', {
        currentStep,
        completedSteps,
        totalSteps: steps.length,
        percentage: currentStepData.progress
      })
    }
  }, [currentStep, completedSteps, updateFormData])

  // Enhanced step navigation with validation
  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      // Mark current step as completed
      setCompletedSteps(prev => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep]
        }
        return prev
      })
      
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // Validation state management
  const updateValidation = useCallback((stepId: number, validation: { isValid: boolean; errors: ValidationError[] }) => {
    setValidationState(prev => ({
      ...prev,
      [stepId]: validation
    }))
  }, [])

  // Calculate overall progress
  const getProgressPercentage = useCallback(() => {
    const currentStepData = steps.find(step => step.id === currentStep)
    return currentStepData ? currentStepData.progress : 0
  }, [currentStep])

  // Check if step is completed
  const isStepCompleted = useCallback((stepId: number) => {
    return completedSteps.includes(stepId)
  }, [completedSteps])

  // Get step validation status
  const getStepValidation = useCallback((stepId: number) => {
    return validationState[stepId] || { isValid: false, errors: [] }
  }, [validationState])

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountBasics
            data={formData.basics || {}}
            onUpdate={(data) => updateFormData('basics', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 2:
        return (
          <PersonalDetails
            data={formData.personalDetails || {}}
            onUpdate={(data) => updateFormData('personalDetails', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 3:
        return (
          <Jurisdiction
            data={{
              jurisdiction: formData.jurisdiction || null,
              additionalTaxResidencies: formData.additionalTaxResidencies || [],
              fatcaStatus: formData.fatcaStatus || null,
              giin: formData.giin || null
            }}
            onUpdate={(data) => {
              updateFormData('jurisdiction', data.jurisdiction)
              updateFormData('additionalTaxResidencies', data.additionalTaxResidencies)
              updateFormData('fatcaStatus', data.fatcaStatus)
              updateFormData('giin', data.giin)
            }}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 4:
        // Route to appropriate compliance form based on jurisdiction
        if (formData.jurisdiction === 'US') {
          return (
            <W9Form
              data={formData.w9Form || {}}
              onUpdate={(data) => updateFormData('w9Form', data)}
              onNext={nextStep}
              onPrev={prevStep}
              currentStep={currentStep}
            />
          )
        } else {
          // For non-US jurisdictions, show CRS/FATCA form
          return (
            <CRSFATCAForm
              data={formData.crsFatcaForm || {}}
              onUpdate={(data) => updateFormData('crsFatcaForm', data)}
              onNext={nextStep}
              onPrev={prevStep}
              currentStep={currentStep}
            />
          )
        }
      case 5:
        return (
          <TermsAndConditions
            data={formData.termsAndConditions || {}}
            onUpdate={(data) => updateFormData('termsAndConditions', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 6:
        return (
          <KeyIndividuals
            data={formData.keyIndividuals || {}}
            onUpdate={(data) => updateFormData('keyIndividuals', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 7:
        return (
          <DocumentUpload
            data={formData.documentUpload || {}}
            onUpdate={(data) => updateFormData('documentUpload', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 8:
        return (
          <EDeliveryStep
            eDeliveryData={formData.eDeliveryConsent || {}}
            portalData={formData.portalAccess || {}}
            onUpdateEDelivery={(data) => updateFormData('eDeliveryConsent', data)}
            onUpdatePortal={(data) => updateFormData('portalAccess', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 9:
        return (
          <div className="text-center">
            <h2>Review & Consent</h2>
            <p>Coming soon - Final review and submission step</p>
            <div className="inline">
              <button 
                type="button" 
                onClick={prevStep}
                className="btn secondary"
              >
                ← Previous
              </button>
              <button 
                type="button" 
                className="btn primary"
                disabled
              >
                Submit (Coming Soon)
              </button>
            </div>
          </div>
        )
      default:
        return <div>Step {currentStep} - Coming Soon</div>
    }
  }

  return (
    <div className="shell" role="region" aria-label="BMO Signup Wizard">
      {/* Enhanced Progress Header */}
      <div className="progress-header">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${getProgressPercentage()}%` }}
            role="progressbar"
            aria-valuenow={getProgressPercentage()}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Form completion: ${getProgressPercentage()}%`}
          />
        </div>
        <div className="progress-text">
          Step {currentStep} of {steps.length} - {getProgressPercentage()}% Complete
        </div>
      </div>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs" role="navigation" aria-label="Form steps">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = isStepCompleted(step.id)
          const validation = getStepValidation(step.id)
          
          return (
            <div
              key={step.id}
              className={`crumb ${
                isActive ? 'active' : ''
              } ${
                isCompleted ? 'completed' : ''
              } ${
                validation.errors.length > 0 ? 'error' : ''
              }`}
              data-step={step.id}
              role="button"
              tabIndex={0}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${step.title} - ${
                isCompleted ? 'Completed' : isActive ? 'Current' : 'Pending'
              }`}
              onClick={() => setCurrentStep(step.id)}
              style={{ cursor: 'pointer' }}
            >
              <span className="step-number">{step.id}</span>
              <span className="step-title">{step.title}</span>
              {isCompleted && (
                <span className="step-icon completed" aria-label="Completed">
                  ✓
                </span>
              )}
              {validation.errors.length > 0 && (
                <span className="step-icon error" aria-label="Has errors">
                  !
                </span>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Form Panel */}
      <div className="panel active" role="main">
        {renderCurrentStep()}
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', fontSize: '0.8rem' }}>
          <details>
            <summary>Debug Information</summary>
            <pre>{JSON.stringify({ 
              currentStep, 
              completedSteps, 
              validationState,
              sessionId: formData.metadata?.sessionId || 'default-session'
            }, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  )
}
