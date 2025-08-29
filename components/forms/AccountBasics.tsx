import { useState, useEffect } from 'react'
import { BasicInfo } from '../../types/form'

interface Props {
  data: BasicInfo
  onUpdate: (data: BasicInfo) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function AccountBasics({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState<BasicInfo>(data)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: keyof BasicInfo, value: string | string[]) => {
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
      'entityName', 'entityType', 'incorporationDate',
      'address1', 'city', 'state', 'postalCode', 'country'
    ]
    
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    requiredFields.forEach(field => {
      const value = formData[field as keyof BasicInfo]
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
          <h2 style={{ margin: '0 0 8px 0' }}>Account Basics</h2>
          <p className="muted" style={{ margin: 0 }}>
            Tell us about your organization and key contact information to begin the signup process.
          </p>
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <label htmlFor="entityName" className="required">Legal Entity Name</label>
          <input
            id="entityName"
            type="text"
            value={formData.entityName || ''}
            onChange={(e) => handleChange('entityName', e.target.value)}
            placeholder="e.g., Northern Trust of Canada Limited"
          />
          {errors.entityName && <div className="error show">Please enter your legal entity name.</div>}
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <label htmlFor="tradeName">Trade / Operating Name (optional)</label>
          <input
            id="tradeName"
            type="text"
            value={formData.tradeName || ''}
            onChange={(e) => handleChange('tradeName', e.target.value)}
            placeholder="If different from legal entity"
          />
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <label htmlFor="entityType" className="required">Entity Type</label>
          <select
            id="entityType"
            value={formData.entityType || ''}
            onChange={(e) => handleChange('entityType', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="llc">Limited Liability Company</option>
            <option value="trust">Trust</option>
            <option value="soleProprietor">Sole Proprietorship</option>
            <option value="nonprofit">Non-Profit Organization</option>
            <option value="government">Government Entity</option>
            <option value="other">Other</option>
          </select>
          {errors.entityType && <div className="error show">Please select an entity type.</div>}
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <label htmlFor="incorporationDate" className="required">Date of Incorporation/Formation</label>
          <input
            id="incorporationDate"
            type="date"
            value={formData.incorporationDate || ''}
            onChange={(e) => handleChange('incorporationDate', e.target.value)}
          />
          {errors.incorporationDate && <div className="error show">Please enter the date of incorporation.</div>}
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Business Information</h3>
          <div className="grid">
            <div className="col-12">
              <div>
                <label htmlFor="incorporationProvince" className="block text-sm font-medium text-gray-700">
                  Province/State of Incorporation *
                </label>
                <input
                  type="text"
                  id="incorporationProvince"
                  value={formData.incorporationProvince || ''}
                  onChange={(e) => handleChange('incorporationProvince', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="incorporationNumber" className="block text-sm font-medium text-gray-700">
                  Incorporation Number
                </label>
                <input
                  type="text"
                  id="incorporationNumber"
                  value={formData.incorporationNumber || ''}
                  onChange={(e) => handleChange('incorporationNumber', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="craBusinessNumber" className="block text-sm font-medium text-gray-700">
                  CRA Business Number
                </label>
                <input
                  type="text"
                  id="craBusinessNumber"
                  value={formData.craBusinessNumber || ''}
                  onChange={(e) => handleChange('craBusinessNumber', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456789RP0001"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry *
                </label>
                <select
                  id="industry"
                  value={formData.industry || ''}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="financial-services">Financial Services</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="energy">Energy</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="education">Education</option>
                  <option value="government">Government</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Company Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
            
            <div className="col-12">
              <label htmlFor="intendedUseOfAccount" className="block text-sm font-medium text-gray-700">
                Intended Use of Account *
              </label>
              <div className="mt-2 space-y-2">
                {[
                  'Investment Management',
                  'Treasury Operations',
                  'Trade Finance',
                  'Foreign Exchange',
                  'Cash Management',
                  'Payroll Processing',
                  'Vendor Payments',
                  'Customer Collections',
                  'Other'
                ].map((use) => (
                  <label key={use} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.intendedUseOfAccount?.includes(use) || false}
                      onChange={(e) => {
                        const currentUses = formData.intendedUseOfAccount || []
                        if (e.target.checked) {
                          handleChange('intendedUseOfAccount', [...currentUses, use])
                        } else {
                          handleChange('intendedUseOfAccount', currentUses.filter(u => u !== use))
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{use}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="col-12">
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                id="companyDescription"
                rows={3}
                value={formData.companyDescription || ''}
                onChange={(e) => handleChange('companyDescription', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your business activities..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Primary Contact Information</h3>
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
            
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Mailing Address</h3>
          <div className="grid">
            <div className="col-12">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useSameMailingAddress || false}
                  onChange={(e) => {
                    handleChange('useSameMailingAddress', e.target.checked ? 'true' : 'false')
                    if (e.target.checked) {
                      // Copy business address to mailing address
                      handleChange('mailingAddress1', formData.address1 || '')
                      handleChange('mailingAddress2', formData.address2 || '')
                      handleChange('mailingCity', formData.city || '')
                      handleChange('mailingState', formData.state || '')
                      handleChange('mailingPostalCode', formData.postalCode || '')
                      handleChange('mailingCountry', formData.country || '')
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Use same as business address</span>
              </label>
            </div>
            
            {!formData.useSameMailingAddress && (
              <>
                <div className="col-12">
                  <label htmlFor="mailingAddress1">Mailing Address Line 1</label>
                  <input
                    id="mailingAddress1"
                    type="text"
                    value={formData.mailingAddress1 || ''}
                    onChange={(e) => handleChange('mailingAddress1', e.target.value)}
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="mailingAddress2">Mailing Address Line 2</label>
                  <input
                    id="mailingAddress2"
                    type="text"
                    value={formData.mailingAddress2 || ''}
                    onChange={(e) => handleChange('mailingAddress2', e.target.value)}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="col-4">
                  <label htmlFor="mailingCity">City</label>
                  <input
                    id="mailingCity"
                    type="text"
                    value={formData.mailingCity || ''}
                    onChange={(e) => handleChange('mailingCity', e.target.value)}
                  />
                </div>
                
                <div className="col-4">
                  <label htmlFor="mailingState">Province/State</label>
                  <input
                    id="mailingState"
                    type="text"
                    value={formData.mailingState || ''}
                    onChange={(e) => handleChange('mailingState', e.target.value)}
                  />
                </div>
                
                <div className="col-4">
                  <label htmlFor="mailingPostalCode">Postal/ZIP Code</label>
                  <input
                    id="mailingPostalCode"
                    type="text"
                    value={formData.mailingPostalCode || ''}
                    onChange={(e) => handleChange('mailingPostalCode', e.target.value)}
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="mailingCountry">Country</label>
                  <select
                    id="mailingCountry"
                    value={formData.mailingCountry || ''}
                    onChange={(e) => handleChange('mailingCountry', e.target.value)}
                  >
                    <option value="">Select country</option>
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Business Address</h3>
          <div className="grid">
            <div className="col-12">
              <label htmlFor="address1" className="required">Address Line 1</label>
              <input
                id="address1"
                type="text"
                value={formData.address1 || ''}
                onChange={(e) => handleChange('address1', e.target.value)}
                placeholder="Street address, P.O. box, company name"
              />
              {errors.address1 && <div className="error show">Please enter an address.</div>}
            </div>
            
            <div className="col-12">
              <label htmlFor="address2">Address Line 2</label>
              <input
                id="address2"
                type="text"
                value={formData.address2 || ''}
                onChange={(e) => handleChange('address2', e.target.value)}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>
            
            <div className="col-4">
              <label htmlFor="city" className="required">City</label>
              <input
                id="city"
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
              {errors.city && <div className="error show">Please enter a city.</div>}
            </div>
            
            <div className="col-4">
              <label htmlFor="state" className="required">State/Province</label>
              <input
                id="state"
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
              />
              {errors.state && <div className="error show">Please enter a state or province.</div>}
            </div>
            
            <div className="col-4">
              <label htmlFor="postalCode" className="required">Postal/ZIP Code</label>
              <input
                id="postalCode"
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
              {errors.postalCode && <div className="error show">Please enter a postal code.</div>}
            </div>
            
            <div className="col-6">
              <label htmlFor="country" className="required">Country</label>
              <select
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
                <option value="other">Other</option>
              </select>
              {errors.country && <div className="error show">Please select a country.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button type="button" className="btn secondary" disabled>
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
