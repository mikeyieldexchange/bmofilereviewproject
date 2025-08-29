import { useState, useEffect } from 'react'
import { TaxResidency } from '../../types/form'

interface Props {
  data: {
    jurisdiction: string | null
    additionalTaxResidencies: TaxResidency[]
    fatcaStatus: string | null
    giin: string | null
    // Enhanced jurisdiction fields
    primaryTaxResidency?: TaxResidency
    isUSPerson?: boolean
    hasMultipleResidencies?: boolean
    fatcaClassification?: string
    crsReportable?: boolean
    treatyBenefits?: string[]
    taxExemptions?: string[]
    specialCircumstances?: string
  }
  onUpdate: (data: {
    jurisdiction: string | null
    additionalTaxResidencies: TaxResidency[]
    fatcaStatus: string | null
    giin: string | null
    primaryTaxResidency?: TaxResidency
    isUSPerson?: boolean
    hasMultipleResidencies?: boolean
    fatcaClassification?: string
    crsReportable?: boolean
    treatyBenefits?: string[]
    taxExemptions?: string[]
    specialCircumstances?: string
  }) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function Jurisdiction({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showAdditionalTax, setShowAdditionalTax] = useState(false)
  const [showGiin, setShowGiin] = useState(false)

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  useEffect(() => {
    setShowAdditionalTax(formData.jurisdiction !== 'US' && formData.jurisdiction !== null)
    setShowGiin(formData.fatcaStatus === 'FI_GIIN')
  }, [formData.jurisdiction, formData.fatcaStatus])

  const handleJurisdictionChange = (jurisdiction: string) => {
    setFormData(prev => ({
      ...prev,
      jurisdiction
    }))
    
    if (errors.jurisdiction) {
      setErrors(prev => ({ ...prev, jurisdiction: false }))
    }
  }

  const handleFatcaChange = (fatcaStatus: string) => {
    setFormData(prev => ({
      ...prev,
      fatcaStatus,
      giin: fatcaStatus === 'FI_GIIN' ? prev.giin : null
    }))
    
    if (errors.fatcaStatus) {
      setErrors(prev => ({ ...prev, fatcaStatus: false }))
    }
  }

  const handleGiinChange = (giin: string) => {
    setFormData(prev => ({
      ...prev,
      giin
    }))
    
    if (errors.giin) {
      setErrors(prev => ({ ...prev, giin: false }))
    }
  }

  const addTaxResidency = () => {
    setFormData(prev => ({
      ...prev,
      additionalTaxResidencies: [...prev.additionalTaxResidencies, { country: '', tin: '' }]
    }))
  }

  const updateTaxResidency = (index: number, field: 'country' | 'tin', value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalTaxResidencies: prev.additionalTaxResidencies.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (!formData.jurisdiction) {
      newErrors.jurisdiction = true
      isValid = false
    }

    // FATCA status only required for non-Canadian jurisdictions
    if (formData.jurisdiction !== 'CA') {
      if (!formData.fatcaStatus) {
        newErrors.fatcaStatus = true
        isValid = false
      }

      if (formData.fatcaStatus === 'FI_GIIN' && !formData.giin?.trim()) {
        newErrors.giin = true
        isValid = false
      }
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
          <h2 style={{ margin: '0 0 8px 0' }}>Jurisdiction of Domicile / Tax Residency</h2>
          <p className="muted" style={{ margin: 0 }}>
            We branch your compliance forms based on where your entity is a tax resident. This determines which tax forms you'll need to complete.
          </p>
        </div>
      </div>

      <div className="col-12">
        <div className="grid">
          <label className="col-12 muted required">Select your primary jurisdiction:</label>
          
          <div 
            className={`col-12 card radio-card ${formData.jurisdiction === 'CA' ? 'selected' : ''}`}
            onClick={() => handleJurisdictionChange('CA')}
          >
            <input 
              type="radio" 
              name="jurisdiction" 
              value="CA" 
              checked={formData.jurisdiction === 'CA'}
              onChange={() => {}}
              style={{ marginTop: '4px' }}
            />
            <div>
              <strong>🇨🇦 Canada</strong>
              <div className="muted">You'll complete the CRS/FATCA self‑certification and provide CRA Business Number(s).</div>
              <div style={{ color: 'var(--accent-2)', fontSize: '.9rem', marginTop: '8px' }}>✓ Streamlined for Canadian entities</div>
            </div>
          </div>

          <div 
            className={`col-12 card radio-card ${formData.jurisdiction === 'US' ? 'selected' : ''}`}
            onClick={() => handleJurisdictionChange('US')}
          >
            <input 
              type="radio" 
              name="jurisdiction" 
              value="US" 
              checked={formData.jurisdiction === 'US'}
              onChange={() => {}}
              style={{ marginTop: '4px' }}
            />
            <div>
              <strong>🇺🇸 United States</strong>
              <div className="muted">You'll complete IRS <strong>Form W‑9</strong> (SSN/EIN, federal tax classification, FATCA codes if applicable).</div>
              <div style={{ color: 'var(--accent-2)', fontSize: '.9rem', marginTop: '8px' }}>✓ W‑9 replaces CRS for U.S. persons</div>
            </div>
          </div>

          <div 
            className={`col-12 card radio-card ${formData.jurisdiction === 'OTHER' ? 'selected' : ''}`}
            onClick={() => handleJurisdictionChange('OTHER')}
          >
            <input 
              type="radio" 
              name="jurisdiction" 
              value="OTHER" 
              checked={formData.jurisdiction === 'OTHER'}
              onChange={() => {}}
              style={{ marginTop: '4px' }}
            />
            <div>
              <strong>🌍 Other Countries</strong>
              <div className="muted">You'll complete the <strong>CRS/FATCA</strong> entity self‑certification (TINs for each tax residence; controlling persons if Passive NFE).</div>
              <div style={{ color: 'var(--warning)', fontSize: '.9rem', marginTop: '8px' }}>! May require additional details for reportable jurisdictions</div>
            </div>
          </div>
          
          <div className="col-12">
            {errors.jurisdiction && <div className="error show">Please select a jurisdiction to continue.</div>}
          </div>
        </div>
      </div>
      
      {showAdditionalTax && (
        <div className="col-12">
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Additional Tax Residencies</h3>
            <p className="muted">If your entity is tax resident in multiple jurisdictions, please specify all applicable countries.</p>
            
            {formData.additionalTaxResidencies.map((residency, index) => (
              <div key={index} className="grid" style={{ marginBottom: '16px' }}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Jurisdiction Selection</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="jurisdiction"
                          value="CA"
                          checked={formData.jurisdiction === 'CA'}
                          onChange={(e) => handleJurisdictionChange(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Canada</div>
                          <div className="text-sm text-gray-500">Canadian tax resident entity</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="jurisdiction"
                          value="US"
                          checked={formData.jurisdiction === 'US'}
                          onChange={(e) => handleJurisdictionChange(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">United States</div>
                          <div className="text-sm text-gray-500">US tax resident entity (requires W-9)</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="jurisdiction"
                          value="OTHER"
                          checked={formData.jurisdiction === 'OTHER'}
                          onChange={(e) => handleJurisdictionChange(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Other</div>
                          <div className="text-sm text-gray-500">Non-US/Non-Canadian entity (requires CRS/FATCA)</div>
                        </div>
                      </label>
                    </div>
                    
                    {errors.jurisdiction && (
                      <div className="mt-2 text-sm text-red-600">
                        Please select your primary tax jurisdiction
                      </div>
                    )}
                  </div>

                  {/* US Person Classification */}
                  {formData.jurisdiction && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">US Person Classification</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isUSPerson"
                            checked={formData.isUSPerson === true}
                            onChange={() => setFormData(prev => ({ ...prev, isUSPerson: true }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes, this entity is a US person</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isUSPerson"
                            checked={formData.isUSPerson === false}
                            onChange={() => setFormData(prev => ({ ...prev, isUSPerson: false }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">No, this entity is not a US person</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Primary Tax Residency Details */}
                  {formData.jurisdiction && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Primary Tax Residency</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="primaryCountry" className="block text-sm font-medium text-gray-700">
                            Country of Tax Residency *
                          </label>
                          <select
                            id="primaryCountry"
                            value={formData.primaryTaxResidency?.country || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              primaryTaxResidency: {
                                ...prev.primaryTaxResidency,
                                country: e.target.value,
                                tin: prev.primaryTaxResidency?.tin || '',
                                reasonNoTIN: prev.primaryTaxResidency?.reasonNoTIN || ''
                              }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select country</option>
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="JP">Japan</option>
                            <option value="AU">Australia</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="primaryTIN" className="block text-sm font-medium text-gray-700">
                            Tax Identification Number
                          </label>
                          <input
                            type="text"
                            id="primaryTIN"
                            value={formData.primaryTaxResidency?.tin || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              primaryTaxResidency: {
                                ...prev.primaryTaxResidency,
                                country: prev.primaryTaxResidency?.country || '',
                                tin: e.target.value,
                                reasonNoTIN: prev.primaryTaxResidency?.reasonNoTIN || ''
                              }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        {!formData.primaryTaxResidency?.tin && (
                          <div className="md:col-span-2">
                            <label htmlFor="reasonNoTIN" className="block text-sm font-medium text-gray-700">
                              Reason for no TIN (if applicable)
                            </label>
                            <select
                              id="reasonNoTIN"
                              value={formData.primaryTaxResidency?.reasonNoTIN || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                primaryTaxResidency: {
                                  ...prev.primaryTaxResidency,
                                  country: prev.primaryTaxResidency?.country || '',
                                  tin: prev.primaryTaxResidency?.tin || '',
                                  reasonNoTIN: e.target.value
                                }
                              }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select reason</option>
                              <option value="not-required">TIN not required by jurisdiction</option>
                              <option value="not-issued">TIN not issued by jurisdiction</option>
                              <option value="applied-for">Applied for but not yet received</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="inline" style={{ marginTop: '10px' }}>
              <button type="button" className="btn secondary" onClick={addTaxResidency}>
                + Add another tax residency
              </button>
            </div>
            
            <div className="footnote">
              Note: Additional tax residencies may require supplementary documentation.
            </div>
          </div>
        </div>
      )}
      
      {/* FATCA Status Section - Only for non-Canadian jurisdictions */}
      {formData.jurisdiction !== 'CA' && (
        <div className="col-12">
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>FATCA Classification</h3>
            <p className="muted">Please indicate your entity's FATCA status. This helps determine reporting requirements for US tax compliance.</p>
            
            <label htmlFor="fatcaStatus" className="required">FATCA Status</label>
            <select
              id="fatcaStatus"
              value={formData.fatcaStatus || ''}
              onChange={(e) => handleFatcaChange(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="FI_GIIN">Financial Institution with GIIN</option>
              <option value="FI_NO_GIIN">Financial Institution without GIIN</option>
              <option value="ACTIVE_NFFE">Active NFFE</option>
              <option value="PASSIVE_NFFE">Passive NFFE</option>
              <option value="EXEMPT">Exempt Entity</option>
              <option value="GOVT">Government Entity</option>
              <option value="INTL_ORG">International Organization</option>
              <option value="CENTRAL_BANK">Central Bank</option>
              <option value="PUBLIC_CORP">Publicly Traded Corporation</option>
              <option value="RELATED_ENTITY">Related Entity of Publicly Traded Corporation</option>
            </select>
            {errors.fatcaStatus && <div className="error show">Please select a FATCA status.</div>}
            
            {showGiin && (
              <div style={{ marginTop: '16px' }}>
                <label htmlFor="giin">Global Intermediary Identification Number (GIIN)</label>
                <input
                  type="text"
                  id="giin"
                  value={formData.giin || ''}
                  onChange={(e) => handleGiinChange(e.target.value)}
                  placeholder="Format: XXXXXX.XXXXX.XX.XXX"
                />
                {errors.giin && <div className="error show">Please enter a valid GIIN.</div>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="col-12">
        {errors.jurisdiction && <div className="error show">Please select a jurisdiction to continue.</div>}
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
