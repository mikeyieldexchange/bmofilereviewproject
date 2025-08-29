import { useState, useEffect } from 'react'
import { EDeliveryConsent, KeyIndividual } from '../../types/form'

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

  const handleChange = (field: keyof EDeliveryConsent, value: string | boolean | string[] | KeyIndividual[]) => {
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

  const addKeyIndividual = () => {
    const current = formData.keyIndividuals || []
    handleChange('keyIndividuals', [...current, {
      name: '',
      title: '',
      email: '',
      consentToReceive: false
    }])
  }

  const updateKeyIndividual = (index: number, field: keyof KeyIndividual, value: string | boolean) => {
    const individuals = formData.keyIndividuals || []
    const updated = [...individuals]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('keyIndividuals', updated)
  }

  const removeKeyIndividual = (index: number) => {
    const individuals = formData.keyIndividuals || []
    const updated = individuals.filter((_, i) => i !== index)
    handleChange('keyIndividuals', updated)
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

      {/* Key Individuals Section */}
      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Key Individuals for Document Receipt</h3>
          <p className="muted" style={{ marginBottom: '16px' }}>
            Designate key individuals within your organization who should receive electronic documents and communications.
          </p>
          
          {(formData.keyIndividuals || []).map((individual, index) => (
            <div key={index} style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '16px',
              background: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0 }}>Key Individual #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeKeyIndividual(index)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#d32f2f', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Remove
                </button>
              </div>
              
              <div className="grid">
                <div className="col-6">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={individual.name}
                    onChange={(e) => updateKeyIndividual(index, 'name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="col-6">
                  <label>Title/Position</label>
                  <input
                    type="text"
                    value={individual.title}
                    onChange={(e) => updateKeyIndividual(index, 'title', e.target.value)}
                    placeholder="e.g., Chief Financial Officer"
                  />
                </div>
                
                <div className="col-12">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={individual.email}
                    onChange={(e) => updateKeyIndividual(index, 'email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="col-12">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <input
                      type="checkbox"
                      id={`consent_${index}`}
                      checked={individual.consentToReceive}
                      onChange={(e) => updateKeyIndividual(index, 'consentToReceive', e.target.checked)}
                    />
                    <label htmlFor={`consent_${index}`} style={{ fontWeight: 'bold' }}>
                      This individual consents to receive electronic documents and communications
                    </label>
                  </div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginTop: '4px', paddingLeft: '24px' }}>
                    By checking this box, you confirm that this individual has agreed to receive documents electronically 
                    and has provided their consent for electronic delivery.
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addKeyIndividual}
            style={{
              background: '#f5f5f5',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '12px 16px',
              width: '100%',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666'
            }}
          >
            + Add Key Individual
          </button>
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
