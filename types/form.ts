export interface BasicInfo {
  entityName?: string
  tradeName?: string
  entityType?: string
  incorporationDate?: string
  contactFirstName?: string
  contactLastName?: string
  contactTitle?: string
  contactEmail?: string
  contactPhone?: string
  language?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface TaxResidency {
  country: string
  tin: string
  reasonNoTIN?: string
  canadianBusinessNumber?: string
  trustAccountNumber?: string
}

export interface W9FormData {
  name?: string
  businessName?: string
  taxClassification?: string
  llcTaxClass?: string
  exemptPayeeCode?: string
  exemptFatcaCode?: string
  address?: string
  cityStateZip?: string
  accountNumbers?: string
  ssn?: string
  ein?: string
  certification?: boolean
  signature?: string
  date?: string
}

export interface KeyIndividual {
  name: string
  title: string
  email: string
  consentToReceive: boolean
}

export interface EDeliveryConsent {
  consentToElectronic?: boolean
  emailAddress?: string
  communicationPreferences?: string[]
  languagePreference?: string
  optOutRights?: boolean
  systemRequirements?: boolean
  keyIndividuals?: KeyIndividual[]
}

export interface PortalAccess {
  username?: string
  securityQuestions?: SecurityQuestion[]
  twoFactorAuth?: boolean
  accessPermissions?: string[]
  termsAcceptance?: boolean
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
}

export interface ControllingPerson {
  name: string
  currentAddress: string
  mailingAddress?: string
  dateOfBirth: string
  placeOfBirth: string
  countryOfBirth: string
  taxResidencies: TaxResidency[]
  controlType: string
  controlTypeOther?: string
  ownershipPercentage?: number
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
}
