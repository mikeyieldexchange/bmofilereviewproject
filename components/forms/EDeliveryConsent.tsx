import { useState, useEffect } from 'react'
import { EDeliveryConsent } from '../../types/form'

interface Props {
  data: EDeliveryConsent
  onUpdate: (data: EDeliveryConsent) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function EDeliveryConsentForm({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState<EDeliveryConsent>(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: keyof EDeliveryConsent, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const handleCommunicationPreferenceChange = (preference: string, checked: boolean) => {
    const currentPrefs = formData.communicationPreferences || []
    let newPrefs: string[]
    
    if (checked) {
      newPrefs = [...currentPrefs, preference]
    } else {
      newPrefs = currentPrefs.filter(p => p !== preference)
    }
    
    handleChange('communicationPreferences', newPrefs)
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (!formData.consentToElectronic) {
      newErrors.consentToElectronic = true
      isValid = false
    }

    if (!formData.emailAddress?.trim()) {
      newErrors.emailAddress = true
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = true
      isValid = false
    }

    if (!formData.optOutRights) {
      newErrors.optOutRights = true
      isValid = false
    }

    if (!formData.systemRequirements) {
      newErrors.systemRequirements = true
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div style={{
          background: 'rgba(0,121,193,.1)',
          border: '1px solid rgba(0,121,193,.2)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <h2 style={{ margin: '0 0 8px 0' }}>BMO eDelivery Consent Agreement</h2>
          <p className="muted" style={{ margin: 0 }}>
            Electronic delivery of documents and communications
          </p>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Electronic Delivery Consent</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="consentToElectronic"
                checked={formData.consentToElectronic || false}
                onChange={(e) => handleChange('consentToElectronic', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="consentToElectronic" className="required">
                I consent to receive documents and communications electronically
              </label>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', paddingLeft: '24px' }}>
              By checking this box, you agree to receive account statements, trade confirmations, 
              regulatory notices, and other communications via electronic delivery instead of paper mail.
            </p>
            {errors.consentToElectronic && <div className="error show">You must consent to electronic delivery to continue.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="emailAddress" className="required">Primary Email Address for Electronic Delivery</label>
            <input
              id="emailAddress"
              type="email"
              value={formData.emailAddress || ''}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
              placeholder="Enter your primary email address"
            />
            <p className="footnote">
              This email will be used for all electronic communications. Please ensure it's accurate and regularly monitored.
            </p>
            {errors.emailAddress && <div className="error show">Please enter a valid email address.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="required">Communication Preferences</label>
            <p className="muted" style={{ marginBottom: '12px' }}>Select the types of communications you wish to receive electronically:</p>
            
            {[
              { value: 'statements', label: 'Account Statements' },
              { value: 'confirmations', label: 'Trade Confirmations' },
              { value: 'notices', label: 'Regulatory Notices' },
              { value: 'marketing', label: 'Marketing Communications' },
              { value: 'research', label: 'Research Reports' },
              { value: 'tax_documents', label: 'Tax Documents' }
            ].map((pref) => (
              <div key={pref.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`pref_${pref.value}`}
                  checked={(formData.communicationPreferences || []).includes(pref.value)}
                  onChange={(e) => handleCommunicationPreferenceChange(pref.value, e.target.checked)}
                />
                <label htmlFor={`pref_${pref.value}`}>{pref.label}</label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="languagePreference">Language Preference</label>
            <select
              id="languagePreference"
              value={formData.languagePreference || 'en'}
              onChange={(e) => handleChange('languagePreference', e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="optOutRights"
                checked={formData.optOutRights || false}
                onChange={(e) => handleChange('optOutRights', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="optOutRights" className="required">
                I understand my right to opt out of electronic delivery
              </label>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', paddingLeft: '24px' }}>
              You may withdraw your consent to electronic delivery at any time by contacting BMO. 
              If you opt out, you will receive paper copies of all documents.
            </p>
            {errors.optOutRights && <div className="error show">You must acknowledge your opt-out rights.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="systemRequirements"
                checked={formData.systemRequirements || false}
                onChange={(e) => handleChange('systemRequirements', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="systemRequirements" className="required">
                I confirm I have the necessary system requirements
              </label>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', paddingLeft: '24px' }}>
              You confirm that you have access to a computer with internet connection, 
              email capability, and PDF reader software to view electronic documents.
            </p>
            {errors.systemRequirements && <div className="error show">You must confirm system requirements.</div>}
          </div>
        </div>
      </div>

      <div className="controls">
        <button type="button" className="btn secondary" onClick={onPrev}>
          Back
        </button>
        <div className="inline">
          <span className="muted">Step {currentStep} of 5</span>
          <button type="button" className="btn" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
