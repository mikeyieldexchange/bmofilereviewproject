import ReactFormConnector from '../components/connectors/ReactFormConnector'

export default function ConnectorPage() {
  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <div>
            <div className="title">BMO Form Connector</div>
            <div className="subtitle">Switch between React and HTML implementations</div>
          </div>
        </div>
        <div className="inline">
          <span className="chip">Dual Implementation</span>
          <span className="chip">Component Comparison</span>
        </div>
      </div>
      
      <ReactFormConnector />
      
      <p className="footnote">
        Use this connector to compare the React implementation with the original HTML forms.
      </p>
    </div>
  )
}
