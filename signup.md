# Yield Exchange Signup Process Documentation

## Overview
The Yield Exchange signup process is a comprehensive multi-step registration system that handles both depositor and financial institution account creation. The process includes account type selection, user details collection, organization information, password setup, terms acceptance, and document uploads.

## Architecture

### Main Components
- **SignUpIndex.vue**: Main orchestrator component that manages the entire signup flow
- **Layout Components**: Header, MainSidebar, SignUpLayout for consistent UI
- **Shared Components**: Reusable form inputs, modals, and UI elements
- **Subpage Components**: Individual step components for each registration phase

### State Management
The signup process uses Vuex store for state management with the following key getters:
- `getCurrentStep`: Current step in the signup flow
- `getUserType`: Selected user type (depositor/bank)
- `getDepositorType`: Type of depositor (businessInvestor/personalInvestor)
- `getProgress`: Progress percentage (0-100)
- `getIsConference`: Conference mode flag
- `getisTermsAndConditions`: Terms and conditions mode flag

## Signup Flow Steps

### 1. Account Type Selection (`landing` step)
**Component**: `ChooseAccount.vue`
**Progress**: 10%

**Fields**:
- Corporate account option
- Financial Institution account option

**Logic**:
- Displays two choice cards with dynamic counts
- Corporate: "Connect immediately to X financial institutions"
- FI: "Connect with X depositors by submitting rates"
- Sets `userType` in store and navigates to next step

**Validation**: None (selection required)

**Navigation**:
- Corporate → `deptype` step
- Bank → `depOrgDetails` step

### 2. Depositor Type Selection (`deptype` step)
**Component**: `ChooseDepositorType.vue`
**Progress**: 20%

**Fields**:
- Organizational Investments
- Personal Investments (Coming Soon - redirects to waitlist)

**Logic**:
- Only shown for depositor user type
- Sets `depositorType` in store
- Personal investments redirect to waiting list

**Validation**: None (selection required)

**Navigation**:
- Business Investor → `depOrgDetails` step
- Personal Investor → `waiting` step
- Previous → `landing` step

### 3. Organization Details (`depOrgDetails` step)
**Component**: `DepositorOrganizationDetails.vue`
**Progress**: 30%

**Fields**:
- **Logo Upload**: Optional organization logo (400x400px, JPG/PNG)
- **Organization Selection** (Banks only): Dropdown of financial institutions
- **Organization Name**: Required text input
- **Trade Name**: Optional text input
- **Industry**: Required dropdown selection
- **Incorporation Type**: Required dropdown (varies by user type)
- **Incorporation Number**: Required text input
- **CRA Business Number**: Required text input
- **Incorporation Date**: Required date picker
- **Province of Incorporation**: Required dropdown
- **Intended Use of Account**: Required multi-select checkboxes
- **Website**: Optional URL input
- **Company Description**: Optional textarea
- **Business Address**: Required address fields
- **Mailing Address**: Optional (can use business address)
- **BIC Code** (Banks): Optional text input
- **FIN Code** (Banks): Optional text input
- **Branch Code** (Banks): Optional text input

**Validation Rules**:
- All required fields must be filled
- Email format validation
- URL format validation for website
- Date validation for incorporation date
- Address validation
- Incorporation number format validation
- CRA number format validation

**Logic**:
- Different fields shown based on user type (bank vs depositor)
- Address copying functionality between business and mailing
- Dynamic province loading via API
- Industry data loaded via API
- File upload handling for logo

**API Calls**:
- `/get-all-provinces-sign-up`: Fetch provinces
- `/industries`: Fetch industry types
- `/depositors-Fi-count`: Get depositor/FI counts

**Navigation**:
- Next → `userDetails` step
- Previous → `deptype` step (depositors) or `landing` step (banks)

### 4. User Details (`userDetails` step)
**Component**: `SetUserDetails.vue`
**Progress**: 40%

**Fields**:
- **First Name**: Required text input (pre-filled if logged in)
- **Last Name**: Required text input (pre-filled if logged in)
- **Email**: Required email input (disabled, pre-filled)
- **Telephone**: Required phone input with country code
- **Job Title**: Required text input (2-150 chars)
- **Timezone**: Required timezone selection (auto-detected via IP)
- **LinkedIn Profile**: Optional URL input

**Validation Rules**:
- First name: Required, non-empty
- Last name: Required, non-empty
- Email: Required, valid email format (pre-filled, disabled)
- Phone: Required, valid phone format with country code
- Job title: Required, 2-150 characters
- Timezone: Required, must be supported timezone
- LinkedIn: Optional, valid URL format if provided

**Logic**:
- Auto-detects timezone using IPInfo API
- Timezone validation against supported timezones
- Shows timezone selection modal if needed
- Handles unsupported timezone regions (redirects to waitlist)
- Updates user info in store and backend

**API Calls**:
- `https://ipinfo.io/json?token=${ipinfokey}`: Get user's timezone
- `/update-user-info`: Update user information

**Error Handling**:
- Timezone not supported → Shows modal with options to change or join waitlist
- API failures → Shows error modal with retry option

**Navigation**:
- Next → `setpassword` step
- Previous → `depOrgDetails` step
- Timezone error → `biwaiting` step (business investor waitlist)

### 5. Password Setup (`setpassword` step)
**Component**: `SetUserPassword.vue`
**Progress**: 50%

**Fields**:
- **Password**: Required password input (min 12 chars)
- **Confirm Password**: Required password confirmation
- **Show Password**: Optional checkbox toggle

**Validation Rules**:
- Password: Minimum 12 characters, strength validation
- Confirm Password: Must match password exactly
- Password strength indicators (1-5 levels)

**Logic**:
- Real-time password strength calculation
- Visual strength indicators with color coding
- Password match validation
- Show/hide password functionality

**Password Strength Levels**:
- 1-3: Low (red indicators) - "Add numbers or symbols to strengthen"
- 4-5: Strong (green indicators) - "Strong Password"

**API Calls**:
- `/reset-password-final-step`: Set user password

**Error Handling**:
- Password mismatch → Validation error display
- API failure → Error modal with retry option

**Navigation**:
- Next → `termsandcondition` step (regular) or `keyIndividuals` step (conference mode)
- Previous → `userDetails` step

### 6. Terms and Conditions (`termsandcondition` step)
**Component**: `TermsAndConditions.vue`
**Progress**: 60%

**Fields**:
- PDF viewer displaying terms and conditions
- Accept/Decline buttons (shown after PDF loads)

**Logic**:
- Displays PDF: "Agreement_Yield_Exchange_Depositor_Acct.pdf"
- Buttons only appear after PDF is fully loaded
- Handles both regular signup and old onboarding flows

**API Calls**:
- `/depositor-terms-review`: Submit terms acceptance/decline

**Actions**:
- **Accept**: Continues to next step or completes registration
- **Decline**: Shows confirmation modal, then redirects to main site

**Navigation**:
- Accept → `keyIndividuals` step (regular) or redirect to main site (old onboarding)
- Decline → Redirect to main site

### 7. Entity Details & Key Individuals (`keyIndividuals` step)
**Component**: `IndividualAndEntititySummary.vue`
**Progress**: 70-80% (varies by substep)

**Substeps**:
- `entitydetails` (70% progress)
- `individualandentitysummary` (80% progress)
- `keyIndividuals` (70% progress)

**Logic**:
- Complex multi-step form for entity and individual information
- Progress updates based on current substep
- Handles corporate structure and key personnel details

**Navigation**:
- Next → `documentsUpload` step
- Previous → `termsandcondition` step

### 8. Document Upload (`documentsUpload` step)
**Component**: `DocumentsUpload.vue`
**Progress**: 90%

**Required Documents**:
- Articles of Incorporation
- Certificate of Incorporation

**Logic**:
- Drag and drop file upload interface
- Document validation and processing
- Skip option available

**Navigation**:
- Next → `regcomplete` step
- Previous → `keyIndividuals` step
- Skip → `regcomplete` step

### 9. Registration Complete (`regcomplete` step)
**Component**: `RegistrationComplete.vue`
**Progress**: 100%

**Content**:
- Success message
- Next steps information
- Action items for new users

**Actions Available**:
- Join Us Fully: Create additional accounts
- Refer A Friend: Share platform with others
- Reach Out To Us: Contact support

**Navigation**:
- Exit → Redirect to main website

## Waiting List Flows

### Personal Investor Waitlist (`waiting` step)
**Component**: `WaitingList.vue`

**Logic**:
- Shown when personal investor option is selected
- Collects basic information for waitlist
- Sends confirmation email

### Business Investor Waitlist (`biwaiting` step)
**Component**: `BusinessInvestorWaitingList.vue`

**Logic**:
- Shown when timezone is not supported
- Alternative path for business investors in unsupported regions

### Waitlist Details (`waitinglistdetails` step)
**Component**: `WaitingListDetails.vue`

**Logic**:
- Detailed waitlist information collection
- Used for general waitlist signups

## Special Modes

### Conference Mode
**Trigger**: URL parameter `?isconfrence=isconfrence`
**Behavior**:
- Skips initial account selection
- Goes directly to organization details
- Modified navigation flow
- Different completion handling

### Terms and Conditions Mode
**Trigger**: URL parameter `?termsandconditions=termsandconditions`
**Behavior**:
- Goes directly to terms and conditions
- Used for existing users to accept updated terms
- Redirects to main site after completion

## Shared Components

### Form Inputs
- **CustomTextInput**: Text input with validation and tooltips
- **CustomPasswordInput**: Password input with strength meter
- **CustomTelInput**: Phone number input with country codes
- **CustomSelectInput**: Dropdown select with search
- **CustomMultiSelect**: Multi-selection dropdown
- **CustomDateInput**: Date picker component
- **CustomLocationPicker**: Address/location selection
- **FileInput**: File upload component
- **UploadImage**: Image upload with preview

### UI Components
- **CustomSubmit**: Styled submit button with loading states
- **ChoiceCard**: Selection card with hover effects
- **Checkbox**: Custom checkbox component
- **DoubleCheckbox**: Paired checkbox component
- **PopUpModal**: Modal dialog component
- **ActionMessageModal**: Action confirmation modal
- **PdfViewer**: PDF document viewer

### Utility Components
- **TitleWithIcon**: Header with icon
- **ChooseWhereTo**: Navigation helper

## Validation System

### Field Validation
- Real-time validation on input change
- Error state management per field
- Visual feedback with error messages
- Tooltip help text for complex fields

### Form Validation
- Submit-time validation for all required fields
- Cross-field validation (password matching)
- API response validation
- Error handling and user feedback

### Data Validation
- Email format validation
- URL format validation
- Phone number format validation
- Date range validation
- File type and size validation

## API Integration

### Data Loading
- Province data loading
- Industry data loading
- Financial institution data
- User count statistics

### Data Submission
- User information updates
- Organization details submission
- Password setting
- Terms acceptance
- Document uploads

### Error Handling
- Network error handling
- Validation error display
- Retry mechanisms
- Fallback options

## Progress Tracking

### Progress Calculation
- Step-based progress (10% increments)
- Visual progress bar
- Progress persistence across sessions

### Step Tracking
- Current step state management
- Previous step tracking for navigation
- Completed steps tracking

## Navigation System

### Step Management
- Centralized step routing
- Conditional navigation based on user type
- Back/forward navigation support
- Step validation before navigation

### URL Management
- Query parameter handling
- Special mode detection
- Deep linking support

## Security Considerations

### Data Protection
- Sensitive data encryption
- Secure API communication
- File upload validation
- Input sanitization

### Authentication
- User session management
- Password strength requirements
- Secure password storage
- Email verification

## Error Handling

### User Errors
- Validation error messages
- Field-specific error states
- Form submission error handling
- User-friendly error messages

### System Errors
- API failure handling
- Network error recovery
- Timeout handling
- Graceful degradation

## Accessibility Features

### Form Accessibility
- Proper label associations
- ARIA attributes
- Keyboard navigation
- Screen reader support

### Visual Accessibility
- High contrast support
- Font size considerations
- Color-blind friendly indicators
- Focus management

## Performance Considerations

### Loading Optimization
- Lazy component loading
- Image optimization
- API call optimization
- Caching strategies

### User Experience
- Loading states
- Progress indicators
- Smooth transitions
- Responsive design

## Testing Considerations

### Unit Testing
- Component testing
- Validation testing
- API integration testing
- Error handling testing

### Integration Testing
- Full flow testing
- Cross-browser testing
- Mobile responsiveness
- Accessibility testing

## Deployment Notes

### Environment Configuration
- API endpoint configuration
- Feature flag management
- Third-party service keys
- Environment-specific settings

### Monitoring
- Error tracking
- Performance monitoring
- User flow analytics
- Conversion tracking