import { useState } from 'react'
import AccountBasics from './forms/AccountBasics'
import Jurisdiction from './forms/Jurisdiction'
import W9Form from './forms/W9Form'
import CRSFATCAForm from './forms/CRSFATCAForm'
import EDeliveryStep from './forms/EDeliveryStep'
import { FormData } from '../types/form'

const steps = [
  { id: 1, title: 'Account Basics' },
  { id: 2, title: 'Jurisdiction' },
  { id: 3, title: 'Compliance Forms' },
  { id: 4, title: 'eDelivery Access' },
  { id: 5, title: 'Review & Consent' }
]

export default function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    basics: {},
    jurisdiction: null,
    w9Form: {},
    additionalTaxResidencies: [],
    fatcaStatus: null,
    giin: null,
    crsFatcaForm: {},
    eDeliveryConsent: {},
    portalAccess: {}
  })

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountBasics
            data={formData.basics}
            onUpdate={(data) => updateFormData('basics', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      case 2:
        return (
          <Jurisdiction
            data={{
              jurisdiction: formData.jurisdiction,
              additionalTaxResidencies: formData.additionalTaxResidencies,
              fatcaStatus: formData.fatcaStatus,
              giin: formData.giin
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
      case 3:
        // Route to appropriate compliance form based on jurisdiction
        if (formData.jurisdiction === 'US') {
          return (
            <W9Form
              data={formData.w9Form}
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
              data={formData.crsFatcaForm}
              onUpdate={(data) => updateFormData('crsFatcaForm', data)}
              onNext={nextStep}
              onPrev={prevStep}
              currentStep={currentStep}
            />
          )
        }
      case 4:
        return (
          <EDeliveryStep
            eDeliveryData={formData.eDeliveryConsent}
            portalData={formData.portalAccess}
            onUpdateEDelivery={(data) => updateFormData('eDeliveryConsent', data)}
            onUpdatePortal={(data) => updateFormData('portalAccess', data)}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        )
      default:
        return <div>Step {currentStep} - Coming Soon</div>
    }
  }

  return (
    <div className="shell" role="region" aria-label="Signup Wizard">
      <div className="breadcrumbs">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`crumb ${index < currentStep ? 'active' : ''}`}
            data-step={step.id}
          >
            {step.title}
          </div>
        ))}
      </div>
      
      <div className="panel active">
        {renderCurrentStep()}
      </div>
    </div>
  )
}
