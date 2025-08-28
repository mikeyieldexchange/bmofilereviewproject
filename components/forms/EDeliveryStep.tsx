import { useState, useEffect } from 'react'
import { EDeliveryConsent, PortalAccess } from '../../types/form'

interface Props {
  eDeliveryData: EDeliveryConsent
  portalData: PortalAccess
  onUpdateEDelivery: (data: EDeliveryConsent) => void
  onUpdatePortal: (data: PortalAccess) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function EDeliveryStep({ 
  eDeliveryData, 
  portalData, 
  onUpdateEDelivery, 
  onUpdatePortal, 
  onNext, 
  onPrev, 
  currentStep 
}: Props) {
  const [eDeliveryForm, setEDeliveryForm] = useState<EDeliveryConsent>(eDeliveryData)
  const [portalForm, setPortalForm] = useState<PortalAccess>(portalData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdateEDelivery(eDeliveryForm)
  }, [eDeliveryForm])

  useEffect(() => {
    onUpdatePortal(portalForm)
  }, [portalForm])

  const handleEDeliveryChange = (field: keyof EDeliveryConsent, value: any) => {
    setEDeliveryForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const handlePortalChange = (field: keyof PortalAccess, value: any) => {
    setPortalForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleCommunicationPreferenceChange = (preference: string, checked: boolean) => {
    const currentPrefs = eDeliveryForm.communicationPreferences || []
    let newPrefs: string[]
    
    if (checked) {
      newPrefs = [...currentPrefs, preference]
    } else {
      newPrefs = currentPrefs.filter(p => p !== preference)
    }
    
    handleEDeliveryChange('communicationPreferences', newPrefs)
  }

  const handleSecurityQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const questions = portalForm.securityQuestions || []
    const updatedQuestions = [...questions]
    
    if (!updatedQuestions[index]) {
      updatedQuestions[index] = { question: '', answer: '' }
    }
    
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    handlePortalChange('securityQuestions', updatedQuestions)
  }

  const handleAccessPermissionChange = (permission: string, checked: boolean) => {
    const currentPerms = portalForm.accessPermissions || []
    let newPerms: string[]
    
    if (checked) {
      newPerms = [...currentPerms, permission]
    } else {
      newPerms = currentPerms.filter(p => p !== permission)
    }
    
    handlePortalChange('accessPermissions', newPerms)
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    // eDelivery validation
    if (!eDeliveryForm.consentToElectronic) {
      newErrors.consentToElectronic = true
      isValid = false
    }

    if (!eDeliveryForm.emailAddress?.trim()) {
      newErrors.emailAddress = true
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eDeliveryForm.emailAddress)) {
      newErrors.emailAddress = true
      isValid = false
    }

    if (!eDeliveryForm.optOutRights) {
      newErrors.optOutRights = true
      isValid = false
    }

    if (!eDeliveryForm.systemRequirements) {
      newErrors.systemRequirements = true
      isValid = false
    }

    // Portal validation
    if (!portalForm.username?.trim()) {
      newErrors.username = true
      isValid = false
    }

    const questions = portalForm.securityQuestions || []
    if (questions.length < 2) {
      newErrors.securityQuestions = true
      isValid = false
    } else {
      for (let i = 0; i < 2; i++) {
        if (!questions[i]?.question || !questions[i]?.answer?.trim()) {
          newErrors.securityQuestions = true
          isValid = false
          break
        }
      }
    }

    if (!portalForm.termsAcceptance) {
      newErrors.termsAcceptance = true
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

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your favorite movie?",
    "What was the make of your first car?",
    "What is your favorite food?",
    "What was your childhood nickname?"
  ]

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
          <h2 style={{ margin: '0 0 8px 0' }}>eDelivery Access Setup</h2>
          <p className="muted" style={{ margin: 0 }}>
            Configure electronic delivery preferences and portal access
          </p>
        </div>
      </div>

      {/* eDelivery Consent Section */}
      <div className="col-6">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Electronic Delivery Consent</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="consentToElectronic"
                checked={eDeliveryForm.consentToElectronic || false}
                onChange={(e) => handleEDeliveryChange('consentToElectronic', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="consentToElectronic" className="required">
                I consent to receive documents electronically
              </label>
            </div>
            {errors.consentToElectronic && <div className="error show">You must consent to electronic delivery.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="emailAddress" className="required">Email Address</label>
            <input
              id="emailAddress"
              type="email"
              value={eDeliveryForm.emailAddress || ''}
              onChange={(e) => handleEDeliveryChange('emailAddress', e.target.value)}
              placeholder="Enter your email address"
            />
            {errors.emailAddress && <div className="error show">Please enter a valid email address.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Communication Preferences</label>
            {[
              { value: 'statements', label: 'Account Statements' },
              { value: 'confirmations', label: 'Trade Confirmations' },
              { value: 'notices', label: 'Regulatory Notices' },
              { value: 'tax_documents', label: 'Tax Documents' }
            ].map((pref) => (
              <div key={pref.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`pref_${pref.value}`}
                  checked={(eDeliveryForm.communicationPreferences || []).includes(pref.value)}
                  onChange={(e) => handleCommunicationPreferenceChange(pref.value, e.target.checked)}
                />
                <label htmlFor={`pref_${pref.value}`}>{pref.label}</label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="optOutRights"
                checked={eDeliveryForm.optOutRights || false}
                onChange={(e) => handleEDeliveryChange('optOutRights', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="optOutRights" className="required">
                I understand my right to opt out
              </label>
            </div>
            {errors.optOutRights && <div className="error show">You must acknowledge your opt-out rights.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="systemRequirements"
                checked={eDeliveryForm.systemRequirements || false}
                onChange={(e) => handleEDeliveryChange('systemRequirements', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="systemRequirements" className="required">
                I have the necessary system requirements
              </label>
            </div>
            {errors.systemRequirements && <div className="error show">You must confirm system requirements.</div>}
          </div>
        </div>
      </div>

      {/* Portal Access Section */}
      <div className="col-6">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Portal Access Setup</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" className="required">Username</label>
            <input
              id="username"
              type="text"
              value={portalForm.username || ''}
              onChange={(e) => handlePortalChange('username', e.target.value)}
              placeholder="Enter username"
            />
            {errors.username && <div className="error show">Please enter a username.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Security Questions</h4>
            {[0, 1].map((index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid rgba(255,255,255,.1)', borderRadius: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <label className="required">Question {index + 1}</label>
                  <select
                    value={portalForm.securityQuestions?.[index]?.question || ''}
                    onChange={(e) => handleSecurityQuestionChange(index, 'question', e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="">Select...</option>
                    {securityQuestions.map((q, i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="required">Answer</label>
                  <input
                    type="text"
                    value={portalForm.securityQuestions?.[index]?.answer || ''}
                    onChange={(e) => handleSecurityQuestionChange(index, 'answer', e.target.value)}
                    placeholder="Enter answer"
                  />
                </div>
              </div>
            ))}
            {errors.securityQuestions && <div className="error show">Please complete both security questions.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={portalForm.twoFactorAuth || false}
                onChange={(e) => handlePortalChange('twoFactorAuth', e.target.checked)}
              />
              <label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Access Permissions</label>
            {[
              { value: 'view_statements', label: 'View Statements' },
              { value: 'download_documents', label: 'Download Documents' },
              { value: 'update_contact', label: 'Update Contact Info' },
              { value: 'manage_preferences', label: 'Manage Preferences' }
            ].map((perm) => (
              <div key={perm.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`perm_${perm.value}`}
                  checked={(portalForm.accessPermissions || []).includes(perm.value)}
                  onChange={(e) => handleAccessPermissionChange(perm.value, e.target.checked)}
                />
                <label htmlFor={`perm_${perm.value}`}>{perm.label}</label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="termsAcceptance"
                checked={portalForm.termsAcceptance || false}
                onChange={(e) => handlePortalChange('termsAcceptance', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="termsAcceptance" className="required">
                I accept the Terms and Conditions
              </label>
            </div>
            {errors.termsAcceptance && <div className="error show">You must accept the terms and conditions.</div>}
          </div>
        </div>
      </div>

      <div className="col-12">
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
    </div>
  )
}
