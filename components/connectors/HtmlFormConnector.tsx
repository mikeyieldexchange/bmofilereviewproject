import { useEffect, useRef } from 'react'

interface Props {
  htmlFile: string
  title: string
}

export default function HtmlFormConnector({ htmlFile, title }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      // Set iframe source to the HTML file
      iframeRef.current.src = htmlFile
    }
  }, [htmlFile])

  return (
    <div className="html-form-connector">
      <div className="card" style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>{title}</h2>
        <p className="muted" style={{ margin: 0 }}>
          This form is loaded from the original HTML file: {htmlFile}
        </p>
      </div>
      
      <div style={{ 
        border: '1px solid rgba(255,255,255,.1)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        background: 'white'
      }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="800px"
          style={{ border: 'none' }}
          title={title}
        />
      </div>
    </div>
  )
}
