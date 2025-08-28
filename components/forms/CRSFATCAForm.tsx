import { useState, useEffect } from 'react'

interface CRSFATCAData {
  // Section 1: Entity Information
  entityName?: string
  countryOfIncorporation?: string
  currentAddress?: string
  mailingAddress?: string
  entityType?: string
  
  // Financial institution flags
  financialInstitution?: boolean
  activeNFFE?: boolean
  passiveNFFE?: boolean
  
  // Controlling persons
  hasControllingPersons?: boolean
  controllingPersons?: ControllingPerson[]
  
  // Tax residencies
  taxResidencies?: TaxResidency[]
  canadianBusinessNumber?: string
  trustAccountNumber?: string
  
  // FATCA specific
  fatcaStatus?: string
  giin?: string
  
  // Certifications
  certifyAccuracy?: boolean
  certifyCapacity?: boolean
  signature?: string
  date?: string
}

interface ControllingPerson {
  name: string
  currentAddress: string
  mailingAddress?: string
  dateOfBirth: string
  placeOfBirth: string
  countryOfBirth: string
  taxResidencies: TaxResidency[]
  controlType: string
  controlTypeOther?: string
  ownershipPercentage?: number
}

interface TaxResidency {
  country: string
  tin: string
  reasonNoTIN?: string
  canadianBusinessNumber?: string
  trustAccountNumber?: string
}

interface Props {
  data: CRSFATCAData
  onUpdate: (data: CRSFATCAData) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function CRSFATCAForm({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState<CRSFATCAData>(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showControllingPersons, setShowControllingPersons] = useState(false)

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  useEffect(() => {
    setShowControllingPersons(formData.passiveNFFE === true)
  }, [formData.passiveNFFE])

  const handleChange = (field: keyof CRSFATCAData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const addTaxResidency = () => {
    const current = formData.taxResidencies || []
    handleChange('taxResidencies', [...current, { country: '', tin: '' }])
  }

  const updateTaxResidency = (index: number, field: keyof TaxResidency, value: string) => {
    const residencies = formData.taxResidencies || []
    const updated = [...residencies]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('taxResidencies', updated)
  }

  const addControllingPerson = () => {
    const current = formData.controllingPersons || []
    handleChange('controllingPersons', [...current, {
      name: '',
      currentAddress: '',
      mailingAddress: '',
      dateOfBirth: '',
      placeOfBirth: '',
      countryOfBirth: '',
      taxResidencies: [{ country: '', tin: '' }],
      controlType: '',
      controlTypeOther: '',
      ownershipPercentage: 0
    }])
  }

  const updateControllingPerson = (index: number, field: keyof ControllingPerson, value: any) => {
    const persons = formData.controllingPersons || []
    const updated = [...persons]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('controllingPersons', updated)
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    // Required fields validation
    const requiredFields = ['entityName', 'countryOfIncorporation', 'currentAddress', 'entityType']
    requiredFields.forEach(field => {
      if (!formData[field as keyof CRSFATCAData]) {
        newErrors[field] = true
        isValid = false
      }
    })

    // Tax residency validation
    if (!formData.taxResidencies || formData.taxResidencies.length === 0) {
      newErrors.taxResidencies = true
      isValid = false
    }

    // Controlling persons validation for Passive NFEs
    if (formData.passiveNFFE && (!formData.controllingPersons || formData.controllingPersons.length === 0)) {
      newErrors.controllingPersons = true
      isValid = false
    }

    // Certification validation
    if (!formData.certifyAccuracy || !formData.certifyCapacity) {
      newErrors.certification = true
      isValid = false
    }

    if (!formData.signature || !formData.date) {
      newErrors.signature = true
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    // if (validate()) {
      onNext()
    // }
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
          <h2 style={{ margin: '0 0 8px 0' }}>CRS Self-Certification</h2>
          <p className="muted" style={{ margin: 0 }}>
            Entity Self-Certification for Common Reporting Standard (CRS) and Foreign Account Tax Compliance Act (FATCA)
          </p>
        </div>
      </div>

      {/* Section 1: Entity Information - Prefilled from Account Basics */}
      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Section 1: Entity Information</h3>
          <p className="muted" style={{ marginBottom: '16px' }}>
            Information below has been prefilled from your Account Basics. Please review and update if needed.
          </p>
          
          <div className="grid">
            <div className="col-12">
              <label>Name of Entity</label>
              <div className="prefilled-field">
                {formData.entityName || 'Not provided'}
              </div>
            </div>
            
            <div className="col-6">
              <label>Country of Incorporation/Organization</label>
              <div className="prefilled-field">
                {formData.countryOfIncorporation === 'CA' ? 'Canada' : 
                 formData.countryOfIncorporation === 'US' ? 'United States' :
                 formData.countryOfIncorporation || 'Not provided'}
              </div>
            </div>
            
            <div className="col-6">
              <label>Entity Type</label>
              <div className="prefilled-field">
                {formData.entityType === 'corporation' ? 'Corporation' :
                 formData.entityType === 'partnership' ? 'Partnership' :
                 formData.entityType === 'trust' ? 'Trust' :
                 formData.entityType || 'Not provided'}
              </div>
            </div>
            
            <div className="col-12">
              <label>Current Address</label>
              <div className="prefilled-field">
                {formData.currentAddress || 'Not provided'}
              </div>
            </div>
            
            <div className="col-12">
              <label htmlFor="mailingAddress">Mailing Address (if different)</label>
              <textarea
                id="mailingAddress"
                value={formData.mailingAddress || ''}
                onChange={(e) => handleChange('mailingAddress', e.target.value)}
                placeholder="Complete mailing address if different from current address"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Entity Classification */}
      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Section 2: Entity Classification for CRS</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="required">Entity Type</label>
            {[
              { value: 'corporation', label: 'Corporation' },
              { value: 'partnership', label: 'Partnership' },
              { value: 'trust', label: 'Trust' },
              { value: 'other', label: 'Other (specify in comments)' }
            ].map((type) => (
              <div key={type.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="radio"
                  id={`entityType_${type.value}`}
                  name="entityType"
                  value={type.value}
                  checked={formData.entityType === type.value}
                  onChange={(e) => handleChange('entityType', e.target.value)}
                />
                <label htmlFor={`entityType_${type.value}`}>{type.label}</label>
              </div>
            ))}
            {errors.entityType && <div className="error show">Please select an entity type.</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="required">FATCA Classification</label>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                id="financialInstitution"
                checked={formData.financialInstitution || false}
                onChange={(e) => handleChange('financialInstitution', e.target.checked)}
              />
              <label htmlFor="financialInstitution">Financial Institution</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                id="activeNFFE"
                checked={formData.activeNFFE || false}
                onChange={(e) => handleChange('activeNFFE', e.target.checked)}
              />
              <label htmlFor="activeNFFE">Active Non-Financial Foreign Entity (NFFE)</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                id="passiveNFFE"
                checked={formData.passiveNFFE || false}
                onChange={(e) => handleChange('passiveNFFE', e.target.checked)}
              />
              <label htmlFor="passiveNFFE">Passive Non-Financial Foreign Entity (NFFE)</label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Section 2: Declaration of Tax Residence - Canada</h3>
            <div className="form-section">
              <p><strong>Entity is a tax resident of Canada</strong></p>
              
              <div className="form-subsection">
                <p><em>If the entity is a trust, give the 8 digit account number issued by the Canada Revenue Agency (CRA). Otherwise, give the 9 digit business number with any one of the program accounts issued by the CRA.</em></p>
                
                <div className="form-row">
                  <div className="col-6">
                    <label>Business Number</label>
                    <input
                      type="text"
                      value={formData.canadianBusinessNumber || ''}
                      onChange={(e) => handleChange('canadianBusinessNumber', e.target.value)}
                      placeholder="9 digit business number"
                      maxLength={9}
                    />
                  </div>
                  
                  <div className="col-6">
                    <label>Trust Account Number</label>
                    <input
                      type="text"
                      value={formData.trustAccountNumber || ''}
                      onChange={(e) => handleChange('trustAccountNumber', e.target.value)}
                      placeholder="8 digit account number"
                      maxLength={8}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Controlling Persons (for Passive NFEs) */}
      {showControllingPersons && (
        <div className="col-12">
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Section 3: Controlling Persons</h3>
            <p className="muted">For Passive NFEs, please provide information about controlling persons (individuals who exercise control over the entity).</p>
            
            {(formData.controllingPersons || []).map((person, index) => (
              <div key={index} style={{ marginBottom: '24px', padding: '16px', border: '1px solid rgba(255,255,255,.1)', borderRadius: '8px' }}>
                <h4>Controlling Person {index + 1}</h4>
                
                <div className="grid">
                  <div className="col-6">
                    <label className="required">Full Name</label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updateControllingPerson(index, 'name', e.target.value)}
                      placeholder="Full legal name"
                    />
                  </div>
                  
                  <div className="col-6">
                    <label className="required">Date of Birth</label>
                    <input
                      type="date"
                      value={person.dateOfBirth}
                      onChange={(e) => updateControllingPerson(index, 'dateOfBirth', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="required">Current Address</label>
                    <textarea
                      value={person.currentAddress}
                      onChange={(e) => updateControllingPerson(index, 'currentAddress', e.target.value)}
                      placeholder="Complete current address"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label>Mailing Address (if different)</label>
                    <textarea
                      value={person.mailingAddress || ''}
                      onChange={(e) => updateControllingPerson(index, 'mailingAddress', e.target.value)}
                      placeholder="Complete mailing address if different"
                      rows={2}
                    />
                  </div>
                  
                  <div className="col-6">
                    <label className="required">Place of Birth</label>
                    <input
                      type="text"
                      value={person.placeOfBirth}
                      onChange={(e) => updateControllingPerson(index, 'placeOfBirth', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div className="col-6">
                    <label className="required">Country of Birth</label>
                    <select
                      value={person.countryOfBirth}
                      onChange={(e) => updateControllingPerson(index, 'countryOfBirth', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  <div className="col-6">
                    <label className="required">Type of Control</label>
                    <select
                      value={person.controlType}
                      onChange={(e) => updateControllingPerson(index, 'controlType', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="ownership">Ownership (25% or more)</option>
                      <option value="voting">Voting rights</option>
                      <option value="other_means">Control by other means</option>
                      <option value="senior_managing">Senior managing official</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" className="btn secondary" onClick={addControllingPerson}>
              + Add Controlling Person
            </button>
            {errors.controllingPersons && <div className="error show">Please add at least one controlling person for Passive NFFE.</div>}
          </div>
        </div>
      )}

      {/* Certification Section */}
      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Certification</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="certifyAccuracy"
                checked={formData.certifyAccuracy || false}
                onChange={(e) => handleChange('certifyAccuracy', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="certifyAccuracy" className="required">
                I certify that the information provided is true, correct, and complete
              </label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="certifyCapacity"
                checked={formData.certifyCapacity || false}
                onChange={(e) => handleChange('certifyCapacity', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="certifyCapacity" className="required">
                I certify that I am authorized to sign for the entity
              </label>
            </div>
            {errors.certification && <div className="error show">Please complete all certifications.</div>}
          </div>

          <div className="grid">
            <div className="col-6">
              <label htmlFor="signature" className="required">Authorized Signature (Full Name)</label>
              <input
                id="signature"
                type="text"
                value={formData.signature || ''}
                onChange={(e) => handleChange('signature', e.target.value)}
                placeholder="Type your full name"
              />
            </div>
            
            <div className="col-6">
              <label htmlFor="date" className="required">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>
          {errors.signature && <div className="error show">Please provide signature and date.</div>}
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
