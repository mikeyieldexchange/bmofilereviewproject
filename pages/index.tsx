import { useState } from 'react'
import SignupWizard from '../components/SignupWizard'

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <div>
            <div className="title">BMO Yield Exchange — Comprehensive Signup</div>
            <div className="subtitle">Complete onboarding process with all required compliance documents</div>
          </div>
        </div>
        <div className="inline">
          <span className="chip">SOC 2 Type II compliant</span>
          <span className="chip">OWASP‑guided</span>
          <span className="chip">Audit‑friendly</span>
        </div>
      </div>
      
      <SignupWizard />
      
      <p className="footnote">
        All fields marked with * are required. Your information is securely processed in accordance with BMO's privacy policy.
      </p>
    </div>
  )
}
