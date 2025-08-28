import { useState, useEffect } from 'react'
import { W9FormData } from '../../types/form'

interface Props {
  data: W9FormData
  onUpdate: (data: W9FormData) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function W9Form({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState<W9FormData>(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showLlcTaxClass, setShowLlcTaxClass] = useState(false)

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  useEffect(() => {
    setShowLlcTaxClass(formData.taxClassification === 'llc')
  }, [formData.taxClassification])

  const handleChange = (field: keyof W9FormData, value: string | boolean) => {
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

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9)
    if (digits.length > 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
    } else if (digits.length > 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    }
    return digits
  }

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9)
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`
    }
    return digits
  }

  const handleSSNChange = (value: string) => {
    const formatted = formatSSN(value)
    handleChange('ssn', formatted)
    if (formatted && formData.ein) {
      handleChange('ein', '')
    }
  }

  const handleEINChange = (value: string) => {
    const formatted = formatEIN(value)
    handleChange('ein', formatted)
    if (formatted && formData.ssn) {
      handleChange('ssn', '')
    }
  }

  const validate = () => {
    const requiredFields = ['name', 'address', 'cityStateZip', 'signature', 'date']
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    requiredFields.forEach(field => {
      if (!formData[field as keyof W9FormData]) {
        newErrors[field] = true
        isValid = false
      }
    })

    if (!formData.taxClassification) {
      newErrors.taxClassification = true
      isValid = false
    } else if (formData.taxClassification === 'llc' && !formData.llcTaxClass) {
      newErrors.taxClassification = true
      isValid = false
    }

    if (!formData.ssn && !formData.ein) {
      newErrors.tin = true
      isValid = false
    }

    if (!formData.certification) {
      newErrors.certification = true
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
          <h2 style={{ margin: '0 0 8px 0' }}>IRS Form W-9</h2>
          <p className="muted" style={{ margin: 0 }}>Request for Taxpayer Identification Number and Certification</p>
        </div>
      </div>

      <div className="col-12">
        <div style={{
          border: '1px solid rgba(255,255,255,.1)',
          borderRadius: '8px',
          padding: '16px',
          background: 'rgba(255,255,255,.02)'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
            Form W-9 (Rev. October 2023)
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '12px', color: 'var(--muted)' }}>
            Department of the Treasury • Internal Revenue Service
          </div>
          
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            padding: '10px',
            background: 'rgba(255,255,255,.03)',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <p><strong>Purpose of Form:</strong> A person who is required to file an information return with the IRS must obtain your correct taxpayer identification number (TIN) to report income paid to you, real estate transactions, mortgage interest you paid, acquisition or abandonment of secured property, cancellation of debt, or contributions you made to an IRA.</p>
          </div>
          
          <div className="grid">
            <div className="col-12">
              <label htmlFor="w9_name" className="required">1. Name (as shown on your income tax return)</label>
              <input
                id="w9_name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter legal name"
              />
              {errors.name && <div className="error show">Please enter your legal name as shown on your tax return.</div>}
            </div>
            
            <div className="col-12">
              <label htmlFor="w9_business_name">2. Business name/disregarded entity name, if different from above</label>
              <input
                id="w9_business_name"
                type="text"
                value={formData.businessName || ''}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="If applicable"
              />
            </div>
            
            <div className="col-12">
              <label className="required">3. Federal tax classification (check appropriate box)</label>
              <div className="grid" style={{ gap: '10px' }}>
                {[
                  { value: 'individual', label: 'Individual/sole proprietor or single-member LLC' },
                  { value: 'c_corporation', label: 'C Corporation' },
                  { value: 's_corporation', label: 'S Corporation' },
                  { value: 'partnership', label: 'Partnership' },
                  { value: 'trust_estate', label: 'Trust/estate' },
                  { value: 'llc', label: 'Limited liability company' }
                ].map((option) => (
                  <div key={option.value} className="col-6">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="radio"
                        id={`w9_${option.value}`}
                        name="w9_tax_classification"
                        value={option.value}
                        checked={formData.taxClassification === option.value}
                        onChange={(e) => handleChange('taxClassification', e.target.value)}
                        style={{ marginTop: '3px' }}
                      />
                      <label htmlFor={`w9_${option.value}`}>{option.label}</label>
                    </div>
                  </div>
                ))}
              </div>
              
              {showLlcTaxClass && (
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="w9_llc_tax_class" className="required">Enter the tax classification (C=C corporation, S=S corporation, P=Partnership)</label>
                  <select
                    id="w9_llc_tax_class"
                    value={formData.llcTaxClass || ''}
                    onChange={(e) => handleChange('llcTaxClass', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="C">C - C Corporation</option>
                    <option value="S">S - S Corporation</option>
                    <option value="P">P - Partnership</option>
                  </select>
                </div>
              )}
              
              {errors.taxClassification && <div className="error show">Please select a federal tax classification.</div>}
            </div>
            
            <div className="col-12">
              <label style={{ marginTop: '12px' }}>4. Exemptions (codes apply only to certain entities, not individuals)</label>
              <div className="grid" style={{ gap: '10px' }}>
                <div className="col-6">
                  <label htmlFor="w9_exempt_payee_code">Exempt payee code (if any)</label>
                  <input
                    id="w9_exempt_payee_code"
                    type="text"
                    value={formData.exemptPayeeCode || ''}
                    onChange={(e) => handleChange('exemptPayeeCode', e.target.value)}
                    placeholder="If applicable"
                  />
                </div>
                
                <div className="col-6">
                  <label htmlFor="w9_exempt_fatca_code">Exemption from FATCA reporting code (if any)</label>
                  <input
                    id="w9_exempt_fatca_code"
                    type="text"
                    value={formData.exemptFatcaCode || ''}
                    onChange={(e) => handleChange('exemptFatcaCode', e.target.value)}
                    placeholder="If applicable"
                  />
                </div>
              </div>
              <div className="footnote">Applies to accounts maintained outside the U.S.</div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div className="grid">
              <div className="col-12">
                <label htmlFor="w9_address" className="required">5. Address (number, street, and apt. or suite no.)</label>
                <input
                  id="w9_address"
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter address"
                />
                {errors.address && <div className="error show">Please enter your address.</div>}
              </div>
              
              <div className="col-12">
                <label htmlFor="w9_city_state_zip" className="required">6. City, state, and ZIP code</label>
                <input
                  id="w9_city_state_zip"
                  type="text"
                  value={formData.cityStateZip || ''}
                  onChange={(e) => handleChange('cityStateZip', e.target.value)}
                  placeholder="City, ST 12345"
                />
                {errors.cityStateZip && <div className="error show">Please enter your city, state, and ZIP code.</div>}
              </div>
              
              <div className="col-12">
                <label htmlFor="w9_account_numbers">7. List account number(s) here (optional)</label>
                <input
                  id="w9_account_numbers"
                  type="text"
                  value={formData.accountNumbers || ''}
                  onChange={(e) => handleChange('accountNumbers', e.target.value)}
                  placeholder="If applicable"
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Part I: Taxpayer Identification Number (TIN)</h3>
            <p className="muted">Enter your TIN in the appropriate box. The TIN provided must match the name given on line 1 to avoid backup withholding.</p>
            
            <div className="grid">
              <div className="col-6">
                <label htmlFor="w9_ssn" className="required">Social Security Number (SSN)</label>
                <input
                  id="w9_ssn"
                  type="text"
                  value={formData.ssn || ''}
                  onChange={(e) => handleSSNChange(e.target.value)}
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              
              <div className="col-6">
                <label htmlFor="w9_ein" className="required">Employer Identification Number (EIN)</label>
                <input
                  id="w9_ein"
                  type="text"
                  value={formData.ein || ''}
                  onChange={(e) => handleEINChange(e.target.value)}
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>
            <div className="footnote">Note: You must provide either an SSN or EIN, but not both.</div>
            {errors.tin && <div className="error show">Please enter either a Social Security Number or an Employer Identification Number.</div>}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Part II: Certification</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="w9_certification"
                checked={formData.certification || false}
                onChange={(e) => handleChange('certification', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="w9_certification" className="required">Under penalties of perjury, I certify that:</label>
            </div>
            <ol style={{ color: 'var(--muted)', fontSize: '0.9rem', paddingLeft: '20px' }}>
              <li>The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and</li>
              <li>I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and</li>
              <li>I am a U.S. citizen or other U.S. person; and</li>
              <li>The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.</li>
            </ol>
            {errors.certification && <div className="error show">You must certify the above statements to continue.</div>}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div className="grid">
              <div className="col-6">
                <label htmlFor="w9_signature" className="required">Electronic Signature (Full Name)</label>
                <input
                  id="w9_signature"
                  type="text"
                  value={formData.signature || ''}
                  onChange={(e) => handleChange('signature', e.target.value)}
                  placeholder="Type your full name"
                />
                {errors.signature && <div className="error show">Please enter your full name as your electronic signature.</div>}
              </div>
              
              <div className="col-6">
                <label htmlFor="w9_date" className="required">Date</label>
                <input
                  id="w9_date"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && <div className="error show">Please enter today's date.</div>}
              </div>
            </div>
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
