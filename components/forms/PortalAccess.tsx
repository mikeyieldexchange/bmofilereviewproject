import { useState, useEffect } from 'react'
import { PortalAccess, SecurityQuestion } from '../../types/form'

interface Props {
  data: PortalAccess
  onUpdate: (data: PortalAccess) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function PortalAccessForm({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState<PortalAccess>(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: keyof PortalAccess, value: string | boolean | string[] | SecurityQuestion[]) => {
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

  const handleSecurityQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const questions = formData.securityQuestions || []
    const updatedQuestions = [...questions]
    
    if (!updatedQuestions[index]) {
      updatedQuestions[index] = { question: '', answer: '' }
    }
    
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    }
    
    handleChange('securityQuestions', updatedQuestions)
  }

  const handleAccessPermissionChange = (permission: string, checked: boolean) => {
    const currentPerms = formData.accessPermissions || []
    let newPerms: string[]
    
    if (checked) {
      newPerms = [...currentPerms, permission]
    } else {
      newPerms = currentPerms.filter(p => p !== permission)
    }
    
    handleChange('accessPermissions', newPerms)
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (!formData.username?.trim()) {
      newErrors.username = true
      isValid = false
    }

    const questions = formData.securityQuestions || []
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

    if (!formData.termsAcceptance) {
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
          <h2 style={{ margin: '0 0 8px 0' }}>eDelivery Portal Access Setup</h2>
          <p className="muted" style={{ margin: 0 }}>
            Configure your online portal access and security settings
          </p>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Account Setup</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" className="required">Preferred Username</label>
            <input
              id="username"
              type="text"
              value={formData.username || ''}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter your preferred username"
            />
            <p className="footnote">
              Username must be at least 6 characters long and contain only letters, numbers, and underscores.
            </p>
            {errors.username && <div className="error show">Please enter a valid username.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Security Questions</h4>
            <p className="muted" style={{ marginBottom: '16px' }}>
              Please select and answer two security questions for account recovery:
            </p>
            
            {[0, 1].map((index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid rgba(255,255,255,.1)', borderRadius: '8px' }}>
                <h5>Security Question {index + 1}</h5>
                
                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor={`question_${index}`} className="required">Question</label>
                  <select
                    id={`question_${index}`}
                    value={formData.securityQuestions?.[index]?.question || ''}
                    onChange={(e) => handleSecurityQuestionChange(index, 'question', e.target.value)}
                  >
                    <option value="">Select a question...</option>
                    {securityQuestions.map((q, i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor={`answer_${index}`} className="required">Answer</label>
                  <input
                    id={`answer_${index}`}
                    type="text"
                    value={formData.securityQuestions?.[index]?.answer || ''}
                    onChange={(e) => handleSecurityQuestionChange(index, 'answer', e.target.value)}
                    placeholder="Enter your answer"
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
                checked={formData.twoFactorAuth || false}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              />
              <label htmlFor="twoFactorAuth">Enable Two-Factor Authentication (Recommended)</label>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', paddingLeft: '24px' }}>
              Two-factor authentication adds an extra layer of security to your account by requiring 
              a verification code sent to your mobile device.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="required">Access Permissions</label>
            <p className="muted" style={{ marginBottom: '12px' }}>Select the portal features you wish to access:</p>
            
            {[
              { value: 'view_statements', label: 'View Account Statements' },
              { value: 'download_documents', label: 'Download Documents' },
              { value: 'update_contact', label: 'Update Contact Information' },
              { value: 'manage_preferences', label: 'Manage Communication Preferences' },
              { value: 'view_tax_documents', label: 'Access Tax Documents' },
              { value: 'account_alerts', label: 'Set Up Account Alerts' }
            ].map((perm) => (
              <div key={perm.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`perm_${perm.value}`}
                  checked={(formData.accessPermissions || []).includes(perm.value)}
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
                checked={formData.termsAcceptance || false}
                onChange={(e) => handleChange('termsAcceptance', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="termsAcceptance" className="required">
                I accept the Terms and Conditions for eDelivery Portal Access
              </label>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', paddingLeft: '24px' }}>
              By checking this box, you agree to the terms and conditions governing the use of 
              BMO's eDelivery portal, including security responsibilities and access limitations.
            </p>
            {errors.termsAcceptance && <div className="error show">You must accept the terms and conditions.</div>}
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
