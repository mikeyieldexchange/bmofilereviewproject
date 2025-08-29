import { useState, useEffect } from 'react'
import { BasicInfo } from '../../types/form'

interface Props {
  data: Pick<BasicInfo, 'contactFirstName' | 'contactLastName' | 'contactTitle' | 'contactEmail' | 'contactPhone' | 'contactTimezone' | 'contactLinkedIn' | 'language'>
  onUpdate: (data: Pick<BasicInfo, 'contactFirstName' | 'contactLastName' | 'contactTitle' | 'contactEmail' | 'contactPhone' | 'contactTimezone' | 'contactLinkedIn' | 'language'>) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function PersonalDetails({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const validate = () => {
    const requiredFields = [
      'contactFirstName', 'contactLastName', 'contactTitle', 'contactEmail', 'contactPhone', 'language'
    ]
    
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData]
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = true
        isValid = false
      }
    })

    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = true
      isValid = false
    }

    // Phone validation (basic)
    if (formData.contactPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = true
      isValid = false
    }

    // LinkedIn URL validation (if provided)
    if (formData.contactLinkedIn && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/.test(formData.contactLinkedIn)) {
      newErrors.contactLinkedIn = true
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
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Personal Details</h2>
          <p className="muted">Primary contact information for your organization.</p>
          
          <div className="grid">
            <div className="col-6">
              <label htmlFor="contactFirstName" className="required">First Name</label>
              <input
                id="contactFirstName"
                type="text"
                value={formData.contactFirstName || ''}
                onChange={(e) => handleChange('contactFirstName', e.target.value)}
                placeholder="First name"
              />
              {errors.contactFirstName && <div className="error show">Please enter a first name.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="contactLastName" className="required">Last Name</label>
              <input
                id="contactLastName"
                type="text"
                value={formData.contactLastName || ''}
                onChange={(e) => handleChange('contactLastName', e.target.value)}
                placeholder="Last name"
              />
              {errors.contactLastName && <div className="error show">Please enter a last name.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="contactTitle" className="required">Job Title</label>
              <input
                id="contactTitle"
                type="text"
                value={formData.contactTitle || ''}
                onChange={(e) => handleChange('contactTitle', e.target.value)}
                placeholder="e.g., Chief Financial Officer"
              />
              {errors.contactTitle && <div className="error show">Please enter a job title.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="contactEmail" className="required">Work Email</label>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="name@organization.com"
              />
              {errors.contactEmail && <div className="error show">Enter a valid email address.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="contactPhone" className="required">Telephone</label>
              <input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1 416 555 0123"
              />
              {errors.contactPhone && <div className="error show">Please enter a valid phone number.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="contactTimezone">Timezone</label>
              <select
                id="contactTimezone"
                value={formData.contactTimezone || ''}
                onChange={(e) => handleChange('contactTimezone', e.target.value)}
              >
                <option value="">Select timezone</option>
                <option value="America/Toronto">Eastern Time (Toronto)</option>
                <option value="America/Winnipeg">Central Time (Winnipeg)</option>
                <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                <option value="America/New_York">Eastern Time (New York)</option>
                <option value="America/Chicago">Central Time (Chicago)</option>
                <option value="America/Denver">Mountain Time (Denver)</option>
                <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
              </select>
            </div>
            
            <div className="col-6">
              <label htmlFor="contactLinkedIn">LinkedIn Profile (optional)</label>
              <input
                id="contactLinkedIn"
                type="url"
                value={formData.contactLinkedIn || ''}
                onChange={(e) => handleChange('contactLinkedIn', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
              {errors.contactLinkedIn && <div className="error show">Please enter a valid LinkedIn URL.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="language" className="required">Language Preference</label>
              <select
                id="language"
                value={formData.language || 'en'}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
              <p className="footnote">Language preference will be applied to eDelivery notifications.</p>
            </div>
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
