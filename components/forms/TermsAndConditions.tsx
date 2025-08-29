import { useState, useEffect } from 'react'

interface Props {
  data: {
    termsAccepted?: boolean
    termsAcceptedDate?: string
    termsVersion?: string
  }
  onUpdate: (data: {
    termsAccepted?: boolean
    termsAcceptedDate?: string
    termsVersion?: string
  }) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function TermsAndConditions({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState(data)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  useEffect(() => {
    // Since we're showing static content instead of PDF, set loaded immediately
    setPdfLoaded(true)
  }, [])

  const handleAccept = () => {
    // const updatedData = {
    //   ...formData,
    //   termsAccepted: true,
    //   termsAcceptedDate: new Date().toISOString(),
    //   termsVersion: '2024.1'
    // }
    // setFormData(updatedData)
    // onUpdate(updatedData)
    onNext()
  }

  const handleDecline = () => {
    if (confirm('Are you sure you want to decline the terms and conditions? This will exit the signup process.')) {
      // Redirect to main site or show exit message
      window.location.href = '/'
    }
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Terms and Conditions</h2>
          <p className="muted">Please review and accept the BMO eDelivery Agreement and Terms of Service.</p>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px',
            minHeight: '400px',
            backgroundColor: '#f9f9f9'
          }}>
            {!pdfLoaded ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '400px',
                flexDirection: 'column'
              }}>
                <div className="loading-spinner" style={{ marginBottom: '10px' }}>⏳</div>
                <p>Loading Terms and Conditions...</p>
              </div>
            ) : (
              <div>
                <h3>BMO eDelivery Agreement and Terms of Service</h3>
                
                <h4>1. Electronic Delivery Consent</h4>
                <p>By accepting these terms, you consent to receive account statements, trade confirmations, regulatory notices, tax documents, and other communications electronically via email and through the BMO online portal.</p>
                
                <h4>2. System Requirements</h4>
                <p>To access electronic documents, you must have:</p>
                <ul>
                  <li>A valid email address</li>
                  <li>Internet access and a web browser</li>
                  <li>Adobe Acrobat Reader or equivalent PDF viewer</li>
                  <li>The ability to download and save electronic documents</li>
                </ul>
                
                <h4>3. Document Retention</h4>
                <p>Electronic documents will be available through the online portal for a minimum of 7 years. You are responsible for downloading and saving documents for your records.</p>
                
                <h4>4. Opt-Out Rights</h4>
                <p>You may withdraw your consent to electronic delivery at any time by contacting BMO client services. Upon withdrawal, you will receive paper documents by mail, which may incur additional fees.</p>
                
                <h4>5. Contact Information Updates</h4>
                <p>You must promptly notify BMO of any changes to your email address or contact information to ensure continued delivery of electronic documents.</p>
                
                <h4>6. Privacy and Security</h4>
                <p>BMO employs industry-standard security measures to protect your electronic documents and personal information. You are responsible for maintaining the confidentiality of your login credentials.</p>
                
                <h4>7. Compliance and Regulatory Requirements</h4>
                <p>Electronic delivery of documents satisfies all regulatory requirements for document delivery, including those under securities legislation and banking regulations.</p>
                
                <h4>8. Agreement Modifications</h4>
                <p>BMO may modify these terms from time to time. You will be notified of material changes and may be required to re-consent to continue receiving electronic documents.</p>
                
                <p style={{ marginTop: '30px', fontWeight: 'bold' }}>
                  By clicking "Accept", you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
                </p>
              </div>
            )}
          </div>
          
          {pdfLoaded && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn secondary" 
                onClick={handleDecline}
                style={{ minWidth: '120px' }}
              >
                Decline
              </button>
              <button 
                type="button" 
                className="btn primary" 
                onClick={handleAccept}
                style={{ minWidth: '120px' }}
              >
                Accept & Continue
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="inline">
          <button type="button" className="btn secondary" onClick={onPrev}>
            ← Previous
          </button>
        </div>
      </div>
    </div>
  )
}
