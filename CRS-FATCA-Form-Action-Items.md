# CRS/FATCA Form - Complete Action Items & Implementation Guide

Based on the CRS FATCA Form PDF, here are all the required steps and action items that need to be implemented in the UI:

## **Part I: Entity Information**

### **Section A: Identifying Information**
- [ ] Legal name of entity (as it appears in organizational documents)
- [ ] Country/jurisdiction of incorporation or organization
- [ ] Current address of entity (street, city, state/province, postal code, country)
- [ ] Mailing address (if different from current address)
- [ ] US TIN (if available)
- [ ] GIIN (if applicable)
- [ ] Reference number (if any)

### **Section B: Entity Type Classification**
- [ ] Corporation
- [ ] Partnership  
- [ ] Trust
- [ ] Other (specify): ___________

## **Part II: Entity Classification for CRS and FATCA Purposes**

### **Section A: CRS Classification**
- [ ] Financial Institution
  - [ ] Custodial Institution
  - [ ] Depository Institution
  - [ ] Investment Entity
  - [ ] Specified Insurance Company
- [ ] Active Non-Financial Entity (Active NFE)
- [ ] Passive Non-Financial Entity (Passive NFE)

### **Section B: FATCA Classification**
- [ ] Financial Institution
  - [ ] Depository Institution
  - [ ] Custodial Institution
  - [ ] Investment Entity
  - [ ] Specified Insurance Company
- [ ] Active NFFE
- [ ] Passive NFFE
- [ ] Excepted NFFE
- [ ] Direct Reporting NFFE

### **Section C: Special Classifications**
- [ ] Government Entity
- [ ] International Organization
- [ ] Central Bank
- [ ] Publicly Traded Corporation
- [ ] Related Entity of Publicly Traded Corporation
- [ ] Exempt Beneficial Owner

## **Part III: Tax Residency**

### **For Each Tax Residency:**
- [ ] Country/jurisdiction of tax residency
- [ ] TIN (Tax Identification Number)
- [ ] If no TIN available, reason:
  - [ ] The country/jurisdiction does not issue TINs
  - [ ] The entity is unable to obtain a TIN
  - [ ] No TIN is required (explain): ___________

### **Multiple Tax Residencies**
- [ ] Add additional tax residency sections as needed
- [ ] Validate each TIN format per country requirements

## **Part IV: Controlling Persons** (Required for Passive NFEs)

### **For Each Controlling Person:**
- [ ] Full name (surname, first name, middle name)
- [ ] Current address (street, city, state/province, postal code, country)
- [ ] Mailing address (if different)
- [ ] Date of birth (DD/MM/YYYY)
- [ ] Place of birth (city, country)
- [ ] Tax residency information:
  - [ ] Country/jurisdiction of tax residency
  - [ ] TIN
  - [ ] If no TIN, reason (same options as entity)

### **Type of Controlling Person:**
- [ ] Controlling Person of a legal person - ownership
- [ ] Controlling Person of a legal person - other means
- [ ] Controlling Person of a legal person - senior managing official
- [ ] Controlling Person of a trust - settlor
- [ ] Controlling Person of a trust - trustee
- [ ] Controlling Person of a trust - protector
- [ ] Controlling Person of a trust - beneficiary
- [ ] Controlling Person of a trust - other

### **Ownership Percentage:**
- [ ] Percentage of ownership interest: _____%

## **Part V: Declarations and Undertakings**

### **Entity Declarations:**
- [ ] I declare that the information provided in this form is true, correct and complete
- [ ] I undertake to advise the recipient of this form within 30 days of any change in circumstances that causes the information contained herein to become incorrect
- [ ] I undertake to provide the recipient with a suitably updated self-certification within 30 days of any change in circumstances

### **Controlling Person Declarations (if applicable):**
- [ ] I declare that the information provided regarding controlling persons is true, correct and complete
- [ ] I undertake to notify of any changes to controlling person information

## **Part VI: Signature and Date**
- [ ] Signature of authorized person
- [ ] Print name of authorized person
- [ ] Title/capacity of authorized person
- [ ] Date of signature (DD/MM/YYYY)

## **Additional UI Requirements Missing from Current Implementation:**

### **Form Navigation & UX:**
- [ ] Progress indicator showing completion percentage
- [ ] Save & Resume functionality
- [ ] Form validation with specific error messages
- [ ] Help tooltips for complex fields
- [ ] Country-specific TIN format validation
- [ ] Dynamic form sections based on entity type

### **Data Validation Rules:**
- [ ] Required field validation
- [ ] TIN format validation per country
- [ ] Date format validation
- [ ] Address format validation
- [ ] Percentage validation (0-100%)
- [ ] Cross-field validation (e.g., if Passive NFE selected, controlling persons required)

### **Enhanced Features:**
- [ ] Auto-populate fields from previous steps
- [ ] Country dropdown with search functionality
- [ ] TIN format hints per selected country
- [ ] Duplicate controlling person detection
- [ ] Export completed form as PDF
- [ ] Print-friendly view

### **Compliance Features:**
- [ ] Audit trail logging
- [ ] Data encryption for sensitive fields
- [ ] Session timeout warnings
- [ ] Form completion certificate
- [ ] Regulatory compliance notices

### **Missing Form Sections in Current UI:**
1. **Reference number field** - for tracking purposes
2. **Detailed FATCA sub-classifications** - current UI has basic options only
3. **CRS-specific classifications** - separate from FATCA
4. **Place of birth** for controlling persons
5. **Ownership percentage** fields
6. **Detailed controlling person type classifications**
7. **Multiple address types** (current vs mailing)
8. **Undertakings section** - promises to update information
9. **Authorized person details** - separate from just signature

### **Technical Implementation Gaps:**
- [ ] Dynamic form sections based on selections
- [ ] Conditional field requirements
- [ ] Multi-step validation within the CRS form
- [ ] Data persistence across browser sessions
- [ ] Form state management for complex nested data
- [ ] Integration with document generation services

## **Priority Implementation Order:**

### **Phase 1 (Critical):**
1. Add missing required fields (reference number, place of birth, etc.)
2. Implement proper FATCA/CRS sub-classifications
3. Add controlling person type classifications
4. Implement ownership percentage fields

### **Phase 2 (Important):**
1. Add undertakings/declarations section
2. Implement country-specific TIN validation
3. Add authorized person details section
4. Enhance form validation

### **Phase 3 (Enhancement):**
1. Add save/resume functionality
2. Implement progress indicators
3. Add help tooltips and guidance
4. Create print/export functionality

This comprehensive list ensures the CRS/FATCA form implementation matches the actual regulatory requirements from the PDF form.
