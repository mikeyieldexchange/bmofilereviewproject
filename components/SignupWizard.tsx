import { useState } from 'react'
import AccountBasics from './forms/AccountBasics'
import Jurisdiction from './forms/Jurisdiction'
import W9Form from './forms/W9Form'
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
            <div className="grid">
              <div className="col-12">
                <div className="card">
                  <h2 style={{ margin: '0 0 8px 0' }}>CRS/FATCA Self-Certification</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    For {formData.jurisdiction === 'CA' ? 'Canadian' : 'international'} entities, 
                    you'll complete the Common Reporting Standard (CRS) and FATCA self-certification form.
                  </p>
                </div>
              </div>
              
              <div className="col-12">
                <div className="card">
                  <h3>Required Information:</h3>
                  <ul style={{ color: 'var(--muted)', paddingLeft: '20px' }}>
                    <li>Entity classification for tax purposes</li>
                    <li>Tax identification numbers for all jurisdictions</li>
                    <li>Controlling persons information (if applicable)</li>
                    <li>FATCA status and classification</li>
                  </ul>
                  <p className="muted" style={{ marginTop: '16px' }}>
                    This form will be implemented in the next development phase.
                  </p>
                </div>
              </div>

              <div className="controls">
                <button type="button" className="btn secondary" onClick={prevStep}>
                  Back
                </button>
                <div className="inline">
                  <span className="muted">Step {currentStep} of 5</span>
                  <button type="button" className="btn" onClick={nextStep}>
                    Continue
                  </button>
                </div>
              </div>
            </div>
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
