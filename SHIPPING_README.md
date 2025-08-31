# Shipping Method and Destination Country Implementation

This document describes the implementation of shipping method and destination country fields for the Spare Parts ordering system.

## Features Implemented

### 1. Shipping Method Field
- **Radio buttons** for Air and Land shipping methods
- **Visual indicators** with icons (plane for air, truck for land)
- **Descriptive text** explaining each method's benefits
- **Client-side validation** with error messages

### 2. Destination Country Field
- **Searchable dropdown** with comprehensive country list
- **Bilingual support** (English and Arabic country names)
- **Real-time filtering** based on search input
- **Method compatibility** - countries are disabled if they don't support the selected shipping method

### 3. Validation (Client + Server Side)
- **Client-side validation** using `validateShippingFields()` function
- **Server-side validation** in `/api/orders` endpoint
- **Error messages**:
  - "Please select a shipping method."
  - "Invalid or unsupported country."
  - Method-specific availability errors

### 4. Order Model Integration
- **Updated Order interface** with `shippingMethod` and `destinationCountry` fields
- **API integration** - values saved via POST `/api/orders`
- **Database-ready** structure for future implementation

### 5. Order Summary Display
- **Shipping information section** showing selected method and country
- **Cost calculation** display with estimated delivery time
- **Real-time updates** as user changes selections

### 6. Admin Panel Integration
- **Shipping details** shown in order listings
- **Method and country** displayed for each order
- **Visual indicators** for quick identification

### 7. Cost Calculation
- **Dynamic pricing** based on method and country
- **Estimated delivery times** for each combination
- **Availability checking** for method-country combinations

## Technical Implementation

### Types and Interfaces
```typescript
// Updated Order interface
interface Order {
  // ... existing fields
  shippingMethod: 'air' | 'land';
  destinationCountry: string;
}

// New interfaces
interface ShippingValidation {
  isValid: boolean;
  errors: {
    shippingMethod?: string;
    destinationCountry?: string;
  };
}

interface ShippingCost {
  method: 'air' | 'land';
  country: string;
  baseCost: number;
  currency: 'AED' | 'USD';
  estimatedDays: number;
  isAvailable: boolean;
}

interface Country {
  code: string;
  name: string;
  nameAr: string;
  isSupported: boolean;
  supportedMethods: ('air' | 'land')[];
}
```

### Components
- **ShippingForm.tsx** - Reusable shipping form component
- **Updated RequestSummary** - Integrated shipping form
- **Updated Admin Panel** - Shows shipping information

### API Endpoints
- **POST /api/orders** - Creates orders with shipping validation
- **Server-side validation** ensures data integrity
- **Error handling** with detailed validation messages

### Validation Functions
```typescript
// Client and server-side validation
validateShippingFields(shippingMethod: string, destinationCountry: string): ShippingValidation

// Cost calculation
calculateShippingCost(method: 'air' | 'land', country: string): ShippingCost
```

## Country Support Matrix

| Country | Air Shipping | Land Shipping | Base Air Cost | Base Land Cost | Air Days | Land Days |
|---------|-------------|---------------|---------------|----------------|----------|-----------|
| UAE (AE) | ✅ | ✅ | 50 AED | 30 AED | 1 | 1 |
| Saudi Arabia (SA) | ✅ | ✅ | 80 AED | 50 AED | 2 | 3 |
| Kuwait (KW) | ✅ | ✅ | 70 AED | 45 AED | 2 | 3 |
| Qatar (QA) | ✅ | ✅ | 75 AED | 55 AED | 2 | 3 |
| Bahrain (BH) | ✅ | ✅ | 65 AED | 40 AED | 2 | 2 |
| Oman (OM) | ✅ | ✅ | 60 AED | 35 AED | 2 | 2 |
| Jordan (JO) | ✅ | ✅ | 90 AED | 70 AED | 3 | 5 |
| Lebanon (LB) | ✅ | ❌ | 100 AED | - | 3 | - |
| Egypt (EG) | ✅ | ✅ | 85 AED | 60 AED | 3 | 4 |
| Iraq (IQ) | ✅ | ✅ | 95 AED | 75 AED | 3 | 5 |
| United States (US) | ✅ | ❌ | 200 AED | - | 7 | - |
| United Kingdom (GB) | ✅ | ❌ | 180 AED | - | 5 | - |
| Germany (DE) | ✅ | ❌ | 170 AED | - | 5 | - |
| France (FR) | ✅ | ❌ | 175 AED | - | 5 | - |
| Italy (IT) | ✅ | ❌ | 165 AED | - | 5 | - |

## Testing

### Unit Tests
- **Validation functions** - `__tests__/shipping.test.ts`
- **Cost calculation** - Comprehensive test coverage
- **Country data** - Validation of country configurations

### E2E Tests
- **Form interaction** - `__tests__/shipping.e2e.test.ts`
- **Validation scenarios** - Error message testing
- **API integration** - End-to-end order creation
- **UI responsiveness** - Cross-browser testing

### Test Commands
```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Error Handling

### Client-Side Errors
- **Missing shipping method** - "Please select a shipping method."
- **Missing country** - "Please select a destination country."
- **Unsupported country** - "Invalid or unsupported country."
- **Method not available** - "Shipping method 'X' is not available for this country."

### Server-Side Errors
- **Validation failures** - Returns 400 with detailed error messages
- **Missing data** - Proper error responses for incomplete requests
- **Database errors** - Graceful handling of storage failures

## Future Enhancements

### Optional Features
1. **Dynamic pricing** based on order weight/volume
2. **Real-time shipping rates** from external APIs
3. **Tracking integration** with shipping providers
4. **Custom delivery zones** within countries
5. **Bulk shipping discounts** for multiple orders

### Database Integration
- **Shipping rates table** for dynamic pricing
- **Country restrictions** management interface
- **Shipping provider** integration
- **Order tracking** system

## Usage Examples

### Basic Form Usage
```tsx
<ShippingForm
  shippingMethod={shippingMethod}
  destinationCountry={destinationCountry}
  onShippingMethodChange={setShippingMethod}
  onDestinationCountryChange={setDestinationCountry}
  validation={validation}
  showValidation={showValidation}
/>
```

### API Integration
```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerInfo,
    selectedParts,
    shippingMethod: 'air',
    destinationCountry: 'AE',
    // ... other fields
  }),
});
```

### Validation Usage
```typescript
const validation = validateShippingFields(shippingMethod, destinationCountry);
if (!validation.isValid) {
  // Handle validation errors
  console.log(validation.errors);
}
```

## Security Considerations

1. **Input sanitization** - All user inputs are validated
2. **Server-side validation** - Client-side validation is not trusted
3. **Rate limiting** - API endpoints should implement rate limiting
4. **Data encryption** - Sensitive shipping data should be encrypted
5. **Access control** - Admin panel requires proper authentication

## Performance Considerations

1. **Lazy loading** - Country data loaded on demand
2. **Caching** - Shipping costs cached for frequently used combinations
3. **Optimized queries** - Database queries optimized for shipping data
4. **CDN usage** - Static assets served via CDN
5. **Bundle optimization** - Shipping components tree-shaken when unused
