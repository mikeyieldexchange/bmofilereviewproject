# BMO Signup Wizard - Process Flow Documentation

## Overview
The BMO signup wizard is a comprehensive 5-step progressive disclosure form that routes users through different compliance requirements based on their jurisdiction. The process ensures all necessary tax and regulatory documentation is collected while providing a streamlined, accessible user experience with robust validation and error handling.

## Architecture Principles

### Design Patterns (Inspired by Yield Exchange)
- **Progressive Disclosure**: Information revealed step-by-step based on user selections
- **Conditional Routing**: Dynamic form paths based on jurisdiction and entity type
- **Real-time Validation**: Field-level validation with immediate feedback
- **State Persistence**: Form data maintained across steps with recovery capability
- **Accessibility First**: ARIA labels, keyboard navigation, screen reader support
- **Error Recovery**: Graceful handling of validation errors and system failures

### Technical Architecture
- **Component-Based**: Modular form components for maintainability
- **Type Safety**: Full TypeScript implementation with strict validation
- **State Management**: Centralized form state with immutable updates
- **Validation Engine**: Multi-layer validation (field, form, cross-step)
- **Progress Tracking**: Visual progress indicators with step completion states

## Step Flow Structure

### Step 1: Account Basics
**Component**: `AccountBasics.tsx`
**Progress**: 20%
**Purpose**: Collect fundamental entity and contact information

**Required Fields**:
- `entityName` - Legal entity name
- `entityType` - Corporation, Partnership, LLC, Trust, Sole Proprietorship, Non-Profit, Government, Other
- `incorporationDate` - Date of incorporation/formation
- `contactFirstName` - Primary contact first name
- `contactLastName` - Primary contact last name
- `contactTitle` - Job title
- `contactEmail` - Work email (validated)
- `contactPhone` - Telephone number
- `address1` - Street address
- `city` - City
- `state` - State/Province
- `postalCode` - Postal/ZIP code
- `country` - Country selection

**Optional Fields**:
- `tradeName` - Trade/operating name if different
- `language` - Language preference (English/French)
- `address2` - Address line 2

**Validation Rules**:
- All required fields must be completed
- Email format validation with domain verification
- Phone number format validation with country code
- Postal code format validation by country
- Entity name uniqueness check (future enhancement)
- Incorporation date cannot be in the future

**Real-time Validation**:
- Field-level validation on blur
- Visual feedback with error states
- Tooltip help text for complex fields
- Cross-field validation (address consistency)

**Error Handling**:
- Field-specific error messages
- Form submission prevention on validation errors
- Recovery suggestions for common errors
- Accessibility announcements for screen readers

---

### Step 2: Jurisdiction
**Component**: `Jurisdiction.tsx`
**Progress**: 40%
**Purpose**: Determine tax residency and route to appropriate compliance forms

**Core Selection**:
- `jurisdiction` - Primary jurisdiction (CA/US/OTHER)
  - **Canada**: Routes to CRS/FATCA form
  - **United States**: Routes to W9 form  
  - **Other Countries**: Routes to CRS/FATCA form with additional requirements

**Conditional Fields** (Non-Canadian jurisdictions):
- `additionalTaxResidencies[]` - Array of additional tax residencies
  - `country` - Additional country of tax residency
  - `tin` - Tax identification number
- `fatcaStatus` - FATCA classification
  - Financial Institution with GIIN
  - Financial Institution without GIIN
  - Active NFFE, Passive NFFE, Exempt Entity, etc.
- `giin` - Global Intermediary Identification Number (if FI with GIIN selected)

**Flow Logic**: 
- Canadian entities: Simplified path, no FATCA status required
- US entities: W9 form in Step 3
- Other jurisdictions: CRS/FATCA form in Step 3, may require controlling persons data

**Smart Routing**:
- Dynamic form path determination
- Conditional field display based on selections
- Progress recalculation based on selected path
- Validation rule adjustment per jurisdiction

**Enhanced Features**:
- Country search with autocomplete
- Tax residency conflict detection
- FATCA status help tooltips
- Jurisdiction-specific guidance text

---

### Step 3: Compliance Forms
**Component**: `W9Form.tsx` | `CRSFATCAForm.tsx`
**Progress**: 60%
**Purpose**: Collect tax compliance documentation based on jurisdiction

#### Route A: US Entities (W9 Form)
**Required Fields**:
- `name` - Name as shown on tax return
- `taxClassification` - Federal tax classification
  - Individual/sole proprietor
  - C Corporation, S Corporation
  - Partnership, Trust/estate
  - Limited liability company
- `llcTaxClass` - LLC tax classification (if LLC selected)
- `address` - Address
- `cityStateZip` - City, state, ZIP
- `ssn` OR `ein` - Social Security Number OR Employer ID (mutually exclusive)
- `certification` - Certification checkbox
- `signature` - Electronic signature
- `date` - Date

**Optional Fields**:
- `businessName` - Business name if different
- `exemptPayeeCode` - Exempt payee code
- `exemptFatcaCode` - FATCA exemption code
- `accountNumbers` - Account numbers

**Enhanced Validation**:
- SSN/EIN format validation with masking
- Tax classification consistency checks
- Electronic signature with timestamp
- PDF generation for record keeping
- Real-time field completion indicators

#### Route B: Non-US Entities (CRS/FATCA Form)
**Required Fields**:
- `entityName` - Entity name (prefilled)
- `countryOfIncorporation` - Country (prefilled)
- `currentAddress` - Current address (prefilled)
- `entityType` - Entity type classification
- `taxResidencies[]` - Tax residency information
  - `country` - Country of tax residency
  - `tin` - Tax identification number
- `canadianBusinessNumber` - CRA business number (for Canadian tax residents)
- `certifyAccuracy` - Accuracy certification
- `certifyCapacity` - Authorization certification
- `signature` - Authorized signature
- `date` - Date

**Optional Fields**:
- `mailingAddress` - Mailing address if different
- `trustAccountNumber` - Trust account number
- `financialInstitution` - Financial institution flag
- `activeNFFE` - Active NFFE flag
- `passiveNFFE` - Passive NFFE flag

**Conditional Section** (Passive NFFE entities):
- `controllingPersons[]` - Array of controlling persons
  - `name` - Full name
  - `currentAddress` - Current address
  - `mailingAddress` - Mailing address
  - `dateOfBirth` - Date of birth
  - `placeOfBirth` - Place of birth
  - `countryOfBirth` - Country of birth
  - `taxResidencies[]` - Tax residencies
  - `controlType` - Type of control
  - `ownershipPercentage` - Ownership percentage

**Dynamic Person Management**:
- Add/remove controlling persons dynamically
- Individual validation per person
- Ownership percentage validation (must sum to ≤100%)
- Duplicate person detection
- Bulk import capability (future enhancement)

---

### Step 4: eDelivery Access
**Component**: `EDeliveryStep.tsx`
**Progress**: 80%
**Purpose**: Configure electronic delivery preferences and portal access

#### eDelivery Consent Section
**Required Fields**:
- `consentToElectronic` - Consent to electronic delivery
- `emailAddress` - Email address for delivery
- `optOutRights` - Acknowledgment of opt-out rights
- `systemRequirements` - System requirements confirmation

**Optional Fields**:
- `communicationPreferences[]` - Array of communication types
  - Account Statements
  - Trade Confirmations
  - Regulatory Notices
  - Tax Documents
- `languagePreference` - Language preference
- `keyIndividuals[]` - Key individuals for document receipt
  - `name` - Full name
  - `title` - Title/position
  - `email` - Email address
  - `consentToReceive` - Individual consent flag

#### Portal Access Section
**Required Fields**:
- `username` - Portal username
- `securityQuestions[]` - Security questions (minimum 2)
  - `question` - Selected security question
  - `answer` - Answer to question
- `termsAcceptance` - Terms and conditions acceptance

**Optional Fields**:
- `twoFactorAuth` - Two-factor authentication preference
- `accessPermissions[]` - Array of access permissions
  - View Statements
  - Download Documents
  - Update Contact Info
  - Manage Preferences

**Security Features**:
- Username availability checking
- Password strength meter with requirements
- Security question uniqueness validation
- Two-factor authentication setup
- Access permission matrix validation
- Terms and conditions versioning

---

### Step 5: Review & Consent
**Component**: `ReviewConsent.tsx` (Coming Soon)
**Progress**: 100%
**Purpose**: Final review and submission

**Expected Fields**:
- Summary of all collected information
- Final certifications and consents
- Electronic signature with legal binding
- Submission confirmation
- Audit trail generation

**Review Features**:
- Expandable section summaries
- Edit links to previous steps
- Data validation summary
- Missing information alerts
- PDF generation for records
- Email confirmation setup

---

## Data Flow Architecture

### Enhanced Form State Management
```typescript
FormData {
  // Core form data
  basics: BasicInfo
  jurisdiction: string | null
  additionalTaxResidencies: TaxResidency[]
  fatcaStatus: string | null
  giin: string | null
  w9Form: W9FormData
  crsFatcaForm: CRSFATCAData
  eDeliveryConsent: EDeliveryConsent
  portalAccess: PortalAccess
  
  // Enhanced state management
  validation: {
    [stepId: string]: {
      isValid: boolean
      errors: ValidationError[]
      warnings: ValidationWarning[]
    }
  }
  progress: {
    currentStep: number
    completedSteps: number[]
    totalSteps: number
    percentage: number
  }
  metadata: {
    startTime: Date
    lastSaved: Date
    sessionId: string
    userAgent: string
  }
}
```

### State Persistence Strategy
- **Local Storage**: Form data backup every 30 seconds
- **Session Recovery**: Restore form state on page reload
- **Auto-save**: Critical field changes saved immediately
- **Conflict Resolution**: Handle multiple browser tab scenarios

### Routing Logic
1. **Step 1 → Step 2**: Always proceeds
2. **Step 2 → Step 3**: Routes based on jurisdiction
   - `jurisdiction === 'US'` → W9Form component
   - `jurisdiction !== 'US'` → CRSFATCAForm component
3. **Step 3 → Step 4**: Always proceeds to eDelivery
4. **Step 4 → Step 5**: Proceeds to review (not implemented)

### Validation Rules
- **Progressive validation**: Each step validates only its own fields
- **Required field enforcement**: Form cannot proceed without required fields
- **Format validation**: Email, phone, TIN formats validated
- **Conditional validation**: Fields required based on selections (e.g., GIIN for FI entities)
- **Cross-step validation**: Some fields in later steps depend on earlier selections

### Enhanced Data Persistence
- **React State**: Primary form data storage during session
- **Local Storage**: Backup persistence with encryption
- **Session Recovery**: Automatic restoration on page reload
- **Progressive Saving**: Critical data saved to backend incrementally
- **Conflict Resolution**: Handle multiple session scenarios
- **Data Encryption**: Sensitive data encrypted in local storage

## Field Dependencies

### Jurisdiction-Based Dependencies
- **Canadian entities**: Simplified CRS form, no FATCA status required
- **US entities**: W9 form only, bypasses CRS requirements
- **Other jurisdictions**: Full CRS/FATCA form with potential controlling persons

### Conditional Field Display
- **LLC Tax Classification**: Only shown when entity type is LLC
- **GIIN Field**: Only shown when FATCA status is "Financial Institution with GIIN"
- **Additional Tax Residencies**: Only shown for non-US jurisdictions
- **Controlling Persons**: Only shown for Passive NFFE entities
- **Security Questions**: Minimum 2 required for portal access

### Enhanced Validation System

#### Field-Level Validation
- **Real-time validation**: On blur, with debouncing
- **Format validation**: Email, phone, TIN, postal codes
- **Business logic**: Entity-specific validation rules
- **Cross-field validation**: Address consistency, date ranges

#### Form-Level Validation
- **Required field checking**: Dynamic based on selections
- **Completeness validation**: All sections properly filled
- **Consistency validation**: Data coherence across steps
- **Business rule validation**: Regulatory compliance checks

#### Validation Dependencies
- **TIN Validation**: Either SSN or EIN required for W9, not both
- **Email Validation**: Format validation across multiple steps
- **Controlling Persons**: Required for Passive NFFE, optional otherwise
- **Key Individuals**: Optional but if added, consent required for each
- **Ownership Validation**: Controlling person percentages ≤ 100%
- **Date Validation**: Incorporation date, birth dates within reasonable ranges

#### Error Handling Strategy
- **Progressive disclosure**: Show errors as user progresses
- **Contextual help**: Inline help text and tooltips
- **Recovery guidance**: Specific instructions for error resolution
- **Accessibility**: Screen reader announcements for errors
