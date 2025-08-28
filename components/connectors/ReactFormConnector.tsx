import { useState } from 'react'
import SignupWizard from '../SignupWizard'
import HtmlFormConnector from './HtmlFormConnector'

type ViewMode = 'react' | 'html'

export default function ReactFormConnector() {
  const [viewMode, setViewMode] = useState<ViewMode>('react')
  const [currentHtmlForm, setCurrentHtmlForm] = useState('bmo-signup-form-part1.html')

  const htmlForms = [
    { file: 'bmo-signup-form-part1.html', title: 'Account Basics (HTML)' },
    { file: 'bmo-signup-form-part2.html', title: 'Jurisdiction (HTML)' },
    { file: 'bmo-signup-form-part3.html', title: 'W9 Form (HTML)' }
  ]

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 16px 0' }}>BMO Signup Form Connector</h2>
        <p className="muted" style={{ marginBottom: '16px' }}>
          Choose between the React implementation or view the original HTML forms.
        </p>
        
        <div className="inline" style={{ marginBottom: '16px' }}>
          <button
            className={`btn ${viewMode === 'react' ? '' : 'secondary'}`}
            onClick={() => setViewMode('react')}
          >
            React Components
          </button>
          <button
            className={`btn ${viewMode === 'html' ? '' : 'secondary'}`}
            onClick={() => setViewMode('html')}
          >
            Original HTML Forms
          </button>
        </div>

        {viewMode === 'html' && (
          <div className="inline">
            {htmlForms.map((form, index) => (
              <button
                key={form.file}
                className={`btn ${currentHtmlForm === form.file ? '' : 'secondary'}`}
                onClick={() => setCurrentHtmlForm(form.file)}
                style={{ fontSize: '0.85rem' }}
              >
                Part {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'react' ? (
        <SignupWizard />
      ) : (
        <HtmlFormConnector
          htmlFile={currentHtmlForm}
          title={htmlForms.find(f => f.file === currentHtmlForm)?.title || 'HTML Form'}
        />
      )}
    </div>
  )
}
