import { useState, useEffect } from 'react'
import { KeyIndividual } from '../../types/form'

interface Props {
  data: {
    keyIndividuals?: KeyIndividual[]
  }
  onUpdate: (data: {
    keyIndividuals?: KeyIndividual[]
  }) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function KeyIndividuals({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const addKeyIndividual = () => {
    const newIndividual: KeyIndividual = {
      name: '',
      title: '',
      email: '',
      consentToReceive: false
    }
    
    setFormData(prev => ({
      ...prev,
      keyIndividuals: [...(prev.keyIndividuals || []), newIndividual]
    }))
  }

  const removeKeyIndividual = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyIndividuals: prev.keyIndividuals?.filter((_, i) => i !== index) || []
    }))
  }

  const updateKeyIndividual = (index: number, field: keyof KeyIndividual, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      keyIndividuals: prev.keyIndividuals?.map((individual, i) => 
        i === index ? { ...individual, [field]: value } : individual
      ) || []
    }))
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    formData.keyIndividuals?.forEach((individual, index) => {
      if (!individual.name?.trim()) {
        newErrors[`name_${index}`] = true
        isValid = false
      }
      if (!individual.title?.trim()) {
        newErrors[`title_${index}`] = true
        isValid = false
      }
      if (!individual.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(individual.email)) {
        newErrors[`email_${index}`] = true
        isValid = false
      }
    })

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
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Key Individuals</h2>
          <p className="muted">
            Specify key individuals who should receive electronic documents and communications. 
            At least one key individual is recommended for document delivery.
          </p>
          
          {formData.keyIndividuals?.map((individual, index) => (
            <div key={index} className="grid" style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div className="col-12" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Key Individual #{index + 1}</h4>
                  {formData.keyIndividuals && formData.keyIndividuals.length > 1 && (
                    <button 
                      type="button" 
                      className="btn secondary small" 
                      onClick={() => removeKeyIndividual(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              <div className="col-6">
                <label htmlFor={`name_${index}`} className="required">Full Name</label>
                <input
                  id={`name_${index}`}
                  type="text"
                  value={individual.name || ''}
                  onChange={(e) => updateKeyIndividual(index, 'name', e.target.value)}
                  placeholder="Full name"
                />
                {errors[`name_${index}`] && <div className="error show">Please enter a name.</div>}
              </div>
              
              <div className="col-6">
                <label htmlFor={`title_${index}`} className="required">Title/Position</label>
                <input
                  id={`title_${index}`}
                  type="text"
                  value={individual.title || ''}
                  onChange={(e) => updateKeyIndividual(index, 'title', e.target.value)}
                  placeholder="e.g., Chief Financial Officer"
                />
                {errors[`title_${index}`] && <div className="error show">Please enter a title.</div>}
              </div>
              
              <div className="col-6">
                <label htmlFor={`email_${index}`} className="required">Email Address</label>
                <input
                  id={`email_${index}`}
                  type="email"
                  value={individual.email || ''}
                  onChange={(e) => updateKeyIndividual(index, 'email', e.target.value)}
                  placeholder="name@organization.com"
                />
                {errors[`email_${index}`] && <div className="error show">Please enter a valid email.</div>}
              </div>
              
              <div className="col-6">
                <label htmlFor={`phone_${index}`}>Phone Number</label>
                <input
                  id={`phone_${index}`}
                  type="tel"
                  value={individual.phone || ''}
                  onChange={(e) => updateKeyIndividual(index, 'phone', e.target.value)}
                  placeholder="+1 416 555 0123"
                />
              </div>
              
              <div className="col-6">
                <label htmlFor={`department_${index}`}>Department</label>
                <input
                  id={`department_${index}`}
                  type="text"
                  value={individual.department || ''}
                  onChange={(e) => updateKeyIndividual(index, 'department', e.target.value)}
                  placeholder="e.g., Finance, Treasury"
                />
              </div>
              
              <div className="col-6">
                <label htmlFor={`accessLevel_${index}`}>Access Level</label>
                <select
                  id={`accessLevel_${index}`}
                  value={individual.accessLevel || 'standard'}
                  onChange={(e) => updateKeyIndividual(index, 'accessLevel', e.target.value)}
                >
                  <option value="standard">Standard Access</option>
                  <option value="admin">Administrative Access</option>
                  <option value="view-only">View Only</option>
                </select>
              </div>
              
              <div className="col-12">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={individual.consentToReceive || false}
                    onChange={(e) => updateKeyIndividual(index, 'consentToReceive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    This individual consents to receive electronic documents and communications
                  </span>
                </label>
              </div>
              
              <div className="col-12">
                <label htmlFor={`documentTypes_${index}`}>Document Types (optional)</label>
                <div className="mt-2 space-y-2">
                  {[
                    'Account Statements',
                    'Trade Confirmations', 
                    'Regulatory Notices',
                    'Tax Documents',
                    'System Updates'
                  ].map((docType) => (
                    <label key={docType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={individual.documentTypes?.includes(docType) || false}
                        onChange={(e) => {
                          const currentTypes = individual.documentTypes || []
                          if (e.target.checked) {
                            updateKeyIndividual(index, 'documentTypes', [...currentTypes, docType])
                          } else {
                            updateKeyIndividual(index, 'documentTypes', currentTypes.filter(t => t !== docType))
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{docType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="inline" style={{ marginTop: '10px' }}>
            <button type="button" className="btn secondary" onClick={addKeyIndividual}>
              + Add Key Individual
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="inline">
          <button type="button" className="btn secondary" onClick={onPrev}>
            ← Previous
          </button>
          <button type="button" className="btn primary" onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
