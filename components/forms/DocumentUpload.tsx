import { useState, useEffect } from 'react'

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  status: 'uploading' | 'completed' | 'error'
}

interface Props {
  data: {
    uploadedDocuments?: UploadedDocument[]
    documentsSkipped?: boolean
  }
  onUpdate: (data: {
    uploadedDocuments?: UploadedDocument[]
    documentsSkipped?: boolean
  }) => void
  onNext: () => void
  onPrev: () => void
  currentStep: number
}

export default function DocumentUpload({ data, onUpdate, onNext, onPrev, currentStep }: Props) {
  const [formData, setFormData] = useState(data)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const requiredDocuments = [
    {
      id: 'articles_incorporation',
      name: 'Articles of Incorporation',
      description: 'Legal document that establishes your corporation',
      required: true
    },
    {
      id: 'certificate_incorporation',
      name: 'Certificate of Incorporation',
      description: 'Official certificate from government registry',
      required: true
    },
    {
      id: 'business_license',
      name: 'Business License',
      description: 'Current business operating license',
      required: false
    },
    {
      id: 'financial_statements',
      name: 'Recent Financial Statements',
      description: 'Latest audited or reviewed financial statements',
      required: false
    }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    const maxSize = 10 * 1024 * 1024 // 10MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not supported: ${file.name}. Please upload PDF, JPG, or PNG files.`)
        return
      }

      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`)
        return
      }

      const newDocument: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploading'
      }

      // Add document to state
      setFormData(prev => ({
        ...prev,
        uploadedDocuments: [...(prev.uploadedDocuments || []), newDocument]
      }))

      // Simulate upload process
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          uploadedDocuments: prev.uploadedDocuments?.map(doc => 
            doc.id === newDocument.id ? { ...doc, status: 'completed' as const } : doc
          )
        }))
      }, 2000)
    })
  }

  const removeDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments?.filter(doc => doc.id !== documentId)
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSkip = () => {
    if (confirm('Are you sure you want to skip document upload? You can upload documents later through your account portal.')) {
      setFormData(prev => ({
        ...prev,
        documentsSkipped: true
      }))
      onNext()
    }
  }

  const validate = () => {
    const hasRequiredDocs = requiredDocuments
      .filter(doc => doc.required)
      .every(doc => 
        formData.uploadedDocuments?.some(uploaded => 
          uploaded.name.toLowerCase().includes(doc.id.replace('_', ' ')) ||
          uploaded.status === 'completed'
        )
      )

    if (!hasRequiredDocs && !formData.documentsSkipped) {
      setErrors({ documents: true })
      return false
    }

    return true
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
          <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Document Upload</h2>
          <p className="muted">
            Please upload the required incorporation documents. These documents help verify your organization's legal status.
          </p>
          
          {/* Required Documents List */}
          <div style={{ marginBottom: '20px' }}>
            <h4>Required Documents:</h4>
            <ul style={{ marginLeft: '20px' }}>
              {requiredDocuments.map(doc => (
                <li key={doc.id} style={{ marginBottom: '8px' }}>
                  <strong>{doc.name}</strong>
                  {doc.required && <span style={{ color: 'red' }}> *</span>}
                  <br />
                  <small style={{ color: '#666' }}>{doc.description}</small>
                </li>
              ))}
            </ul>
          </div>

          {/* Upload Area */}
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
              borderColor: dragActive ? '#007bff' : '#ccc',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              Drag and drop files here, or click to select
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Supported formats: PDF, JPG, PNG (Max 10MB per file)
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>

          {errors.documents && (
            <div className="error show" style={{ marginBottom: '20px' }}>
              Please upload the required documents or choose to skip.
            </div>
          )}

          {/* Uploaded Documents */}
          {formData.uploadedDocuments && formData.uploadedDocuments.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>Uploaded Documents:</h4>
              {formData.uploadedDocuments.map(doc => (
                <div key={doc.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {doc.status === 'uploading' && (
                      <span style={{ color: '#007bff' }}>Uploading...</span>
                    )}
                    {doc.status === 'completed' && (
                      <span style={{ color: '#28a745' }}>✓ Complete</span>
                    )}
                    {doc.status === 'error' && (
                      <span style={{ color: '#dc3545' }}>✗ Error</span>
                    )}
                    <button
                      type="button"
                      className="btn secondary small"
                      onClick={() => removeDocument(doc.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skip Option */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>Note:</strong> You can skip document upload now and submit these documents later through your account portal. 
              However, your account activation may be delayed until all required documents are received.
            </p>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="inline">
          <button type="button" className="btn secondary" onClick={onPrev}>
            ← Previous
          </button>
          <button type="button" className="btn secondary" onClick={handleSkip}>
            Skip for Now
          </button>
          <button type="button" className="btn primary" onClick={handleNext}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
