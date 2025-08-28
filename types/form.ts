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

export interface EDeliveryConsent {
  consentToElectronic?: boolean
  emailAddress?: string
  communicationPreferences?: string[]
  languagePreference?: string
  optOutRights?: boolean
  systemRequirements?: boolean
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

export interface FormData {
  basics: BasicInfo
  jurisdiction: string | null
  additionalTaxResidencies: TaxResidency[]
  fatcaStatus: string | null
  giin: string | null
  w9Form: W9FormData
  eDeliveryConsent: EDeliveryConsent
  portalAccess: PortalAccess
}
