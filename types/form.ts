export interface BasicInfo {
  // Entity Information
  entityName?: string
  tradeName?: string
  entityType?: string
  incorporationDate?: string
  incorporationProvince?: string
  incorporationNumber?: string
  craBusinessNumber?: string
  industry?: string
  intendedUseOfAccount?: string[]
  website?: string
  companyDescription?: string
  
  // Contact Information
  contactFirstName?: string
  contactLastName?: string
  contactTitle?: string
  contactEmail?: string
  contactPhone?: string
  contactTimezone?: string
  contactLinkedIn?: string
  language?: string
  
  // Business Address
  address1?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  
  // Mailing Address (if different)
  mailingAddress1?: string
  mailingAddress2?: string
  mailingCity?: string
  mailingState?: string
  mailingPostalCode?: string
  mailingCountry?: string
  useSameMailingAddress?: boolean
  
  // Bank-specific fields
  organizationSelection?: string
  bicCode?: string
  finCode?: string
  branchCode?: string
  
  // Logo/Branding
  logoFile?: File
  logoUrl?: string
}

export interface TaxResidency {
  country: string
  tin: string
  reasonNoTIN?: string
  canadianBusinessNumber?: string
  trustAccountNumber?: string
  
  // Additional fields for comprehensive tax residency
  tinType?: string
  issuingAuthority?: string
  tinUnavailableReason?: string
  explanationNoTIN?: string
}

export interface W9FormData {
  // Part 1: Name and Address
  name?: string
  businessName?: string
  
  // Part 2: Federal Tax Classification
  taxClassification?: string
  llcTaxClass?: string
  
  // Part 3: Exemptions
  exemptPayeeCode?: string
  exemptFatcaCode?: string
  
  // Part 4: Address
  address?: string
  cityStateZip?: string
  
  // Part 5: Account Numbers
  accountNumbers?: string
  
  // Part 6: TIN
  ssn?: string
  ein?: string
  
  // Part 7: Certification
  certification?: boolean
  certificationText?: string
  
  // Part 8: Signature
  signature?: string
  signatureTitle?: string
  date?: string
  
  // Additional validation fields
  tinType?: 'ssn' | 'ein'
  isBackupWithholdingExempt?: boolean
  isFatcaExempt?: boolean
}

export interface KeyIndividual {
  // Basic Information
  name: string
  firstName?: string
  lastName?: string
  title: string
  department?: string
  
  // Contact Information
  email: string
  phone?: string
  alternateEmail?: string
  
  // Consent and Preferences
  consentToReceive: boolean
  consentDate?: string
  documentTypes?: string[]
  deliveryPreferences?: string[]
  languagePreference?: string
  
  // Access Control
  accessLevel?: string
  canDelegate?: boolean
  delegateEmail?: string
  
  // Status
  isActive?: boolean
  startDate?: string
  endDate?: string
}

export interface EDeliveryConsent {
  // Basic Consent
  consentToElectronic?: boolean
  emailAddress?: string
  communicationPreferences?: string[]
  languagePreference?: string
  optOutRights?: boolean
  systemRequirements?: boolean
  
  // Key Individuals
  keyIndividuals?: KeyIndividual[]
  
  // Enhanced eDelivery fields
  deliveryMethod?: string
  alternativeEmailAddress?: string
  notificationPreferences?: string[]
  documentRetentionPeriod?: string
  
  // Consent tracking
  consentDate?: string
  consentVersion?: string
  ipAddress?: string
  userAgent?: string
  
  // Accessibility requirements
  accessibilityNeeds?: boolean
  accessibilityDescription?: string
  
  // Backup delivery options
  backupDeliveryMethod?: string
  physicalMailingAddress?: string
}

export interface PortalAccess {
  // Authentication
  username?: string
  password?: string
  confirmPassword?: string
  
  // Security
  securityQuestions?: SecurityQuestion[]
  twoFactorAuth?: boolean
  twoFactorMethod?: string
  recoveryEmail?: string
  recoveryPhone?: string
  
  // Access Control
  accessPermissions?: string[]
  userRole?: string
  departmentAccess?: string[]
  
  // Terms and Agreements
  termsAcceptance?: boolean
  termsVersion?: string
  privacyPolicyAcceptance?: boolean
  
  // Session Management
  sessionTimeout?: number
  allowMultipleSessions?: boolean
  
  // Notifications
  loginNotifications?: boolean
  securityAlerts?: boolean
  systemUpdates?: boolean
  
  // Password Policy
  passwordStrength?: number
  lastPasswordChange?: string
  passwordExpiryDays?: number
}

export interface SecurityQuestion {
  question: string
  answer: string
}

export interface CRSFATCAData {
  // Part I: Entity Information
  entityName?: string
  countryOfIncorporation?: string
  currentAddress?: string
  mailingAddress?: string
  usTin?: string
  giin?: string
  referenceNumber?: string
  
  // Part II: Entity Classification
  entityType?: string
  
  // CRS Classification
  crsClassification?: string
  crsFinancialInstitutionType?: string
  
  // FATCA Classification  
  fatcaClassification?: string
  fatcaFinancialInstitutionType?: string
  fatcaSpecialClassification?: string
  
  // Enhanced FATCA fields
  isFinancialInstitution?: boolean
  isActiveNFFE?: boolean
  isPassiveNFFE?: boolean
  isExemptEntity?: boolean
  isGovernmentEntity?: boolean
  isInternationalOrganization?: boolean
  isCentralBank?: boolean
  isPublicCorporation?: boolean
  isRelatedEntity?: boolean
  
  // Part III: Tax Residency
  taxResidencies?: TaxResidency[]
  canadianBusinessNumber?: string
  trustAccountNumber?: string
  
  // Part IV: Controlling Persons
  hasControllingPersons?: boolean
  controllingPersons?: ControllingPerson[]
  
  // Part V: Declarations and Undertakings
  certifyAccuracy?: boolean
  undertakeToAdvise?: boolean
  undertakeToUpdate?: boolean
  certifyControllingPersons?: boolean
  
  // Part VI: Signature
  authorizedPersonName?: string
  authorizedPersonTitle?: string
  signature?: string
  date?: string
  
  // Additional fields for comprehensive compliance
  entityClassificationOther?: string
  fatcaStatusOther?: string
  specialCircumstances?: string
  additionalInformation?: string
}

export interface ControllingPerson {
  // Personal Information
  name: string
  firstName?: string
  lastName?: string
  middleName?: string
  
  // Address Information
  currentAddress: string
  mailingAddress?: string
  
  // Birth Information
  dateOfBirth: string
  placeOfBirth: string
  cityOfBirth?: string
  countryOfBirth: string
  
  // Tax Information
  taxResidencies: TaxResidency[]
  
  // Control Information
  controlType: string
  controlTypeOther?: string
  ownershipPercentage?: number
  votingRights?: number
  
  // Additional fields
  nationality?: string
  occupation?: string
  reasonForControl?: string
  isUSPerson?: boolean
  
  // Identification
  identificationNumber?: string
  identificationType?: string
  issuingCountry?: string
}

// Enhanced validation types
export interface ValidationError {
  field: string
  message: string
  type: 'required' | 'format' | 'business' | 'system'
}

export interface ValidationState {
  [stepId: number]: {
    isValid: boolean
    errors: ValidationError[]
  }
}

export interface ProgressState {
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  percentage: number
}

export interface FormMetadata {
  startTime: Date
  lastSaved: Date
  sessionId: string
  userAgent: string
}

export interface FormData {
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
  validation?: ValidationState
  progress?: ProgressState
  metadata?: FormMetadata
}
