export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CarBrand {
  id: string;
  name: string;
  nameAr: string;
  logo?: string;
}

export interface CarModel {
  id: string;
  brandId: string;
  name: string;
  nameAr: string;
  years: number[];
}

export interface Car {
  id: string;
  brandId: string;
  modelId: string;
  year: number;
  brand: CarBrand;
  model: CarModel;
}

export interface SparePart {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  category: string;
  categoryAr: string;
  compatibleCars: string[]; // Car IDs
  prices: {
    original: {
      aed: number;
      sdg: number;
      usd: number;
    };
    commercial: {
      aed: number;
      sdg: number;
      usd: number;
    };
  };
  isAvailable: boolean;
  supplierId?: string;
  partNumber: string;
  countryOfOrigin: string;
}

// Exchange rate configuration
export interface ExchangeRateConfig {
  id: string;
  aedToSdg: number; // 1 AED = X SDG
  lastUpdated: Date;
  updatedBy: string;
}

// System configuration
export interface SystemConfig {
  exchangeRate: ExchangeRateConfig;
  displayCurrency: 'SDG'; // Only SDG for users
  adminCurrency: 'AED'; // Admin enters prices in AED
}

// Utility functions for exchange rate calculations
export const calculateSDGPrice = (aedPrice: number, exchangeRate: number): number => {
  return Math.round(aedPrice * exchangeRate);
};

export const validateExchangeRate = (rate: number): { isValid: boolean; error?: string } => {
  if (rate <= 0) {
    return { isValid: false, error: 'سعر الصرف يجب أن يكون أكبر من صفر' };
  }
  if (rate > 1000) {
    return { isValid: false, error: 'سعر الصرف مرتفع جداً، يرجى التحقق من القيمة' };
  }
  return { isValid: true };
};

export interface SparePartSelection {
  partId: string;
  quantity: number;
  type: 'original' | 'commercial';
  part: SparePart;
}

export interface SparePartCategory {
  id: string;
  name: string;
  nameAr: string;
  icon?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  sparePartId: string;
  quantity: number;
  type: 'original' | 'commercial';
  requestedPrice?: number;
  approvedPrice?: number;
  sparePart: SparePart;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  carId: string;
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  totalAmount: number;
  shippingCost: number;
  currency: 'SDG';
  shippingMethod: 'land' | 'sea';
  cityId: string;
  notes?: string;
  adminNotes?: string;
  expectedShippingDate?: Date;
  actualShippingDate?: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  customer: User;
  car: Car;
  items: OrderItem[];
}

export interface Supplier {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  accountNumber?: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'order_update' | 'price_approval' | 'shipping_update' | 'general';
  isRead: boolean;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  totalAmount: number;
  shippingCost: number;
  currency: 'SDG';
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  paidAt?: Date;
  createdAt: Date;
  order: Order;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  topBrands: Array<{ brand: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
}

export interface SearchFilters {
  brand?: string;
  model?: string;
  year?: number;
  category?: string;
  priceRange?: { min: number; max: number };
  availability?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ShippingValidation {
  isValid: boolean;
  errors: {
    shippingMethod?: string;
    destinationCountry?: string;
  };
}

export interface ShippingCost {
  method: 'land' | 'sea';
  cityId: string;
  baseCost: number;
  currency: 'SDG';
  estimatedDays: number;
  isAvailable: boolean;
  freeShippingThreshold?: number;
}

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  isSupported: boolean;
  supportedMethods: ('air' | 'land')[];
}

export interface SudaneseCity {
  id: string;
  name: string;
  nameAr: string;
  active: boolean;
  state?: string;
  stateAr?: string;
}

export interface DeliveryCost {
  id: string;
  cityId: string;
  method: 'land' | 'sea';
  cost: number;
  estimatedDays: number;
  freeShippingThreshold?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sudanese cities data
export const SUDANESE_CITIES: SudaneseCity[] = [
  // Khartoum State
  { id: '1', name: 'Khartoum', nameAr: 'الخرطوم', active: true, state: 'Khartoum', stateAr: 'ولاية الخرطوم' },
  { id: '2', name: 'Omdurman', nameAr: 'أم درمان', active: true, state: 'Khartoum', stateAr: 'ولاية الخرطوم' },
  { id: '3', name: 'Khartoum North', nameAr: 'بحري', active: true, state: 'Khartoum', stateAr: 'ولاية الخرطوم' },
  
  // Red Sea State
  { id: '4', name: 'Port Sudan', nameAr: 'بورتسودان', active: true, state: 'Red Sea', stateAr: 'ولاية البحر الأحمر' },
  { id: '5', name: 'Suakin', nameAr: 'سواكن', active: true, state: 'Red Sea', stateAr: 'ولاية البحر الأحمر' },
  
  // Kassala State
  { id: '6', name: 'Kassala', nameAr: 'كسلا', active: true, state: 'Kassala', stateAr: 'ولاية كسلا' },
  { id: '7', name: 'Hamashkoraib', nameAr: 'هماشكوريب', active: true, state: 'Kassala', stateAr: 'ولاية كسلا' },
  
  // Gedaref State
  { id: '8', name: 'Gedaref', nameAr: 'القضارف', active: true, state: 'Gedaref', stateAr: 'ولاية القضارف' },
  { id: '9', name: 'Gallabat', nameAr: 'القلابات', active: true, state: 'Gedaref', stateAr: 'ولاية القضارف' },
  
  // Blue Nile State
  { id: '10', name: 'Ad-Damazin', nameAr: 'الدمازين', active: true, state: 'Blue Nile', stateAr: 'ولاية النيل الأزرق' },
  { id: '11', name: 'Roseires', nameAr: 'الروصيرص', active: true, state: 'Blue Nile', stateAr: 'ولاية النيل الأزرق' },
  
  // White Nile State
  { id: '12', name: 'Rabak', nameAr: 'ربك', active: true, state: 'White Nile', stateAr: 'ولاية النيل الأبيض' },
  { id: '13', name: 'Kosti', nameAr: 'كوستي', active: true, state: 'White Nile', stateAr: 'ولاية النيل الأبيض' },
  
  // Sennar State
  { id: '14', name: 'Sennar', nameAr: 'سنار', active: true, state: 'Sennar', stateAr: 'ولاية سنار' },
  { id: '15', name: 'Singa', nameAr: 'سنقا', active: true, state: 'Sennar', stateAr: 'ولاية سنار' },
  
  // North Kordofan State
  { id: '16', name: 'El-Obeid', nameAr: 'الأبيض', active: true, state: 'North Kordofan', stateAr: 'ولاية شمال كردفان' },
  { id: '17', name: 'Bara', nameAr: 'بارا', active: true, state: 'North Kordofan', stateAr: 'ولاية شمال كردفان' },
  
  // South Kordofan State
  { id: '18', name: 'Kadugli', nameAr: 'كادقلي', active: true, state: 'South Kordofan', stateAr: 'ولاية جنوب كردفان' },
  { id: '19', name: 'Dilling', nameAr: 'الدلنج', active: true, state: 'South Kordofan', stateAr: 'ولاية جنوب كردفان' },
  
  // West Kordofan State
  { id: '20', name: 'El-Fula', nameAr: 'الفولة', active: true, state: 'West Kordofan', stateAr: 'ولاية غرب كردفان' },
  { id: '21', name: 'Babanusa', nameAr: 'بابنوسة', active: true, state: 'West Kordofan', stateAr: 'ولاية غرب كردفان' },
  
  // North Darfur State
  { id: '22', name: 'El-Fasher', nameAr: 'الفاشر', active: true, state: 'North Darfur', stateAr: 'ولاية شمال دارفور' },
  { id: '23', name: 'Kutum', nameAr: 'كتم', active: true, state: 'North Darfur', stateAr: 'ولاية شمال دارفور' },
  
  // West Darfur State
  { id: '24', name: 'El-Geneina', nameAr: 'الجنينة', active: true, state: 'West Darfur', stateAr: 'ولاية غرب دارفور' },
  { id: '25', name: 'Zalingei', nameAr: 'زالنجي', active: true, state: 'West Darfur', stateAr: 'ولاية غرب دارفور' },
  
  // South Darfur State
  { id: '26', name: 'Nyala', nameAr: 'نيالا', active: true, state: 'South Darfur', stateAr: 'ولاية جنوب دارفور' },
  { id: '27', name: 'Ed-Daein', nameAr: 'الضعين', active: true, state: 'South Darfur', stateAr: 'ولاية جنوب دارفور' },
  
  // Central Darfur State
  { id: '28', name: 'Zalingei', nameAr: 'زالنجي', active: true, state: 'Central Darfur', stateAr: 'ولاية وسط دارفور' },
  
  // East Darfur State
  { id: '29', name: 'Ed-Daein', nameAr: 'الضعين', active: true, state: 'East Darfur', stateAr: 'ولاية شرق دارفور' },
  
  // River Nile State
  { id: '30', name: 'Ed-Damer', nameAr: 'الدامر', active: true, state: 'River Nile', stateAr: 'ولاية نهر النيل' },
  { id: '31', name: 'Atbara', nameAr: 'عطبرة', active: true, state: 'River Nile', stateAr: 'ولاية نهر النيل' },
  
  // Northern State
  { id: '32', name: 'Dongola', nameAr: 'دنقلا', active: true, state: 'Northern', stateAr: 'الولاية الشمالية' },
  { id: '33', name: 'Karima', nameAr: 'كريمة', active: true, state: 'Northern', stateAr: 'الولاية الشمالية' }
];

// Countries data with shipping information - African and Arab countries only
export const COUNTRIES: Country[] = [
  // Arab Countries
  {
    code: 'EG',
    name: 'Egypt',
    nameAr: 'مصر',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'SD',
    name: 'Sudan',
    nameAr: 'السودان',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'QA',
    name: 'Qatar',
    nameAr: 'قطر',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'BH',
    name: 'Bahrain',
    nameAr: 'البحرين',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'KW',
    name: 'Kuwait',
    nameAr: 'الكويت',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'OM',
    name: 'Oman',
    nameAr: 'عمان',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'YE',
    name: 'Yemen',
    nameAr: 'اليمن',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'JO',
    name: 'Jordan',
    nameAr: 'الأردن',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'LB',
    name: 'Lebanon',
    nameAr: 'لبنان',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SY',
    name: 'Syria',
    nameAr: 'سوريا',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'IQ',
    name: 'Iraq',
    nameAr: 'العراق',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'PS',
    name: 'Palestine',
    nameAr: 'فلسطين',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'DZ',
    name: 'Algeria',
    nameAr: 'الجزائر',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'TN',
    name: 'Tunisia',
    nameAr: 'تونس',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'MA',
    name: 'Morocco',
    nameAr: 'المغرب',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'LY',
    name: 'Libya',
    nameAr: 'ليبيا',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'MR',
    name: 'Mauritania',
    nameAr: 'موريتانيا',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  {
    code: 'SO',
    name: 'Somalia',
    nameAr: 'الصومال',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'KM',
    name: 'Comoros',
    nameAr: 'جزر القمر',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    nameAr: 'جيبوتي',
    isSupported: true,
    supportedMethods: ['air', 'land']
  },
  // African Countries
  {
    code: 'NG',
    name: 'Nigeria',
    nameAr: 'نيجيريا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'KE',
    name: 'Kenya',
    nameAr: 'كينيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    nameAr: 'إثيوبيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GH',
    name: 'Ghana',
    nameAr: 'غانا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ZA',
    name: 'South Africa',
    nameAr: 'جنوب أفريقيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    nameAr: 'تنزانيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'UG',
    name: 'Uganda',
    nameAr: 'أوغندا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SN',
    name: 'Senegal',
    nameAr: 'السنغال',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'RW',
    name: 'Rwanda',
    nameAr: 'رواندا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ZM',
    name: 'Zambia',
    nameAr: 'زامبيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    nameAr: 'زيمبابوي',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'MW',
    name: 'Malawi',
    nameAr: 'ملاوي',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'BW',
    name: 'Botswana',
    nameAr: 'بوتسوانا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'NA',
    name: 'Namibia',
    nameAr: 'ناميبيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'TD',
    name: 'Chad',
    nameAr: 'تشاد',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ML',
    name: 'Mali',
    nameAr: 'مالي',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'NE',
    name: 'Niger',
    nameAr: 'النيجر',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    nameAr: 'جمهورية أفريقيا الوسطى',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CM',
    name: 'Cameroon',
    nameAr: 'الكاميرون',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CI',
    name: 'Ivory Coast',
    nameAr: 'ساحل العاج',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    nameAr: 'بوركينا فاسو',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'MG',
    name: 'Madagascar',
    nameAr: 'مدغشقر',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'AO',
    name: 'Angola',
    nameAr: 'أنغولا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    nameAr: 'موزمبيق',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SS',
    name: 'South Sudan',
    nameAr: 'جنوب السودان',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ER',
    name: 'Eritrea',
    nameAr: 'إريتريا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    nameAr: 'سيراليون',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'TG',
    name: 'Togo',
    nameAr: 'توغو',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'BJ',
    name: 'Benin',
    nameAr: 'بنين',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    nameAr: 'غينيا بيساو',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GN',
    name: 'Guinea',
    nameAr: 'غينيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GM',
    name: 'Gambia',
    nameAr: 'غامبيا',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CV',
    name: 'Cape Verde',
    nameAr: 'الرأس الأخضر',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'ST',
    name: 'Sao Tome and Principe',
    nameAr: 'ساو تومي وبرينسيبي',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    nameAr: 'غينيا الاستوائية',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'GA',
    name: 'Gabon',
    nameAr: 'الغابون',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CG',
    name: 'Republic of the Congo',
    nameAr: 'جمهورية الكونغو',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    nameAr: 'جمهورية الكونغو الديمقراطية',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'BI',
    name: 'Burundi',
    nameAr: 'بوروندي',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SC',
    name: 'Seychelles',
    nameAr: 'سيشل',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'MU',
    name: 'Mauritius',
    nameAr: 'موريشيوس',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'LS',
    name: 'Lesotho',
    nameAr: 'ليسوتو',
    isSupported: true,
    supportedMethods: ['air']
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    nameAr: 'إسواتيني',
    isSupported: true,
    supportedMethods: ['air']
  }
];

// Default delivery costs for Sudanese cities
export const DEFAULT_DELIVERY_COSTS: DeliveryCost[] = [
  // Khartoum State - Major cities with both land and sea access
  { id: '1', cityId: '1', method: 'land', cost: 50, estimatedDays: 2, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', cityId: '1', method: 'sea', cost: 80, estimatedDays: 5, freeShippingThreshold: 1500, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', cityId: '2', method: 'land', cost: 55, estimatedDays: 2, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', cityId: '2', method: 'sea', cost: 85, estimatedDays: 5, freeShippingThreshold: 1500, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', cityId: '3', method: 'land', cost: 52, estimatedDays: 2, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', cityId: '3', method: 'sea', cost: 82, estimatedDays: 5, freeShippingThreshold: 1500, active: true, createdAt: new Date(), updatedAt: new Date() },
  
  // Red Sea State - Coastal cities with better sea access
  { id: '7', cityId: '4', method: 'land', cost: 120, estimatedDays: 4, freeShippingThreshold: 1200, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', cityId: '4', method: 'sea', cost: 60, estimatedDays: 3, freeShippingThreshold: 800, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', cityId: '5', method: 'land', cost: 130, estimatedDays: 4, freeShippingThreshold: 1200, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', cityId: '5', method: 'sea', cost: 65, estimatedDays: 3, freeShippingThreshold: 800, active: true, createdAt: new Date(), updatedAt: new Date() },
  
  // Eastern states - More expensive land, moderate sea
  { id: '11', cityId: '6', method: 'land', cost: 100, estimatedDays: 3, freeShippingThreshold: 1100, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', cityId: '6', method: 'sea', cost: 90, estimatedDays: 4, freeShippingThreshold: 1300, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '13', cityId: '8', method: 'land', cost: 95, estimatedDays: 3, freeShippingThreshold: 1100, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '14', cityId: '8', method: 'sea', cost: 85, estimatedDays: 4, freeShippingThreshold: 1300, active: true, createdAt: new Date(), updatedAt: new Date() },
  
  // Southern states - Moderate costs
  { id: '15', cityId: '10', method: 'land', cost: 80, estimatedDays: 3, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '16', cityId: '10', method: 'sea', cost: 100, estimatedDays: 6, freeShippingThreshold: 1400, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '17', cityId: '12', method: 'land', cost: 75, estimatedDays: 3, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '18', cityId: '12', method: 'sea', cost: 95, estimatedDays: 5, freeShippingThreshold: 1400, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '19', cityId: '13', method: 'land', cost: 78, estimatedDays: 3, freeShippingThreshold: 1000, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '20', cityId: '13', method: 'sea', cost: 98, estimatedDays: 5, freeShippingThreshold: 1400, active: true, createdAt: new Date(), updatedAt: new Date() },
  
  // Western states - Higher costs due to distance
  { id: '21', cityId: '16', method: 'land', cost: 110, estimatedDays: 4, freeShippingThreshold: 1200, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '22', cityId: '16', method: 'sea', cost: 140, estimatedDays: 7, freeShippingThreshold: 1600, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '23', cityId: '22', method: 'land', cost: 150, estimatedDays: 5, freeShippingThreshold: 1300, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '24', cityId: '22', method: 'sea', cost: 180, estimatedDays: 8, freeShippingThreshold: 1800, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '25', cityId: '26', method: 'land', cost: 140, estimatedDays: 5, freeShippingThreshold: 1300, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '26', cityId: '26', method: 'sea', cost: 170, estimatedDays: 8, freeShippingThreshold: 1800, active: true, createdAt: new Date(), updatedAt: new Date() },
  
  // Northern states - Moderate to high costs
  { id: '27', cityId: '31', method: 'land', cost: 90, estimatedDays: 3, freeShippingThreshold: 1100, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '28', cityId: '31', method: 'sea', cost: 110, estimatedDays: 6, freeShippingThreshold: 1400, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '29', cityId: '32', method: 'land', cost: 105, estimatedDays: 4, freeShippingThreshold: 1200, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '30', cityId: '32', method: 'sea', cost: 125, estimatedDays: 6, freeShippingThreshold: 1500, active: true, createdAt: new Date(), updatedAt: new Date() }
];

// Shipping cost calculation function for Sudanese cities
export const calculateShippingCost = (method: 'land' | 'sea', cityId: string, orderTotal?: number): ShippingCost => {
  const deliveryCost = DEFAULT_DELIVERY_COSTS.find(
    cost => cost.cityId === cityId && cost.method === method && cost.active
  );
  
  if (!deliveryCost) {
    return {
      method,
      cityId,
      baseCost: 0,
      currency: 'SDG',
      estimatedDays: 0,
      isAvailable: false
    };
  }

  // Check if free shipping applies
  const isFreeShipping = orderTotal && deliveryCost.freeShippingThreshold && 
                        orderTotal >= deliveryCost.freeShippingThreshold;

  return {
    method,
    cityId,
    baseCost: isFreeShipping ? 0 : deliveryCost.cost,
    currency: 'SDG',
    estimatedDays: deliveryCost.estimatedDays,
    isAvailable: true,
    freeShippingThreshold: deliveryCost.freeShippingThreshold
  };
};

// Validation functions for city-based shipping
export interface CityShippingValidation {
  isValid: boolean;
  errors: {
    shippingMethod?: string;
    cityId?: string;
  };
}

export const validateCityShippingFields = (
  shippingMethod: string,
  cityId: string
): CityShippingValidation => {
  const errors: { shippingMethod?: string; cityId?: string } = {};

  // Validate shipping method
  if (!shippingMethod) {
    errors.shippingMethod = 'يرجى اختيار طريقة الشحن';
  } else if (!['land', 'sea'].includes(shippingMethod)) {
    errors.shippingMethod = 'يرجى اختيار طريقة شحن صالحة';
  }

  // Validate city
  if (!cityId) {
    errors.cityId = 'يرجى اختيار المدينة';
  } else {
    const city = SUDANESE_CITIES.find((c: SudaneseCity) => c.id === cityId);
    if (!city) {
      errors.cityId = 'مدينة غير صالحة أو غير مدعومة';
    } else if (!city.active) {
      errors.cityId = 'هذه المدينة غير متاحة حالياً';
    } else {
      // Check if shipping method is available for this city
      const deliveryCost = DEFAULT_DELIVERY_COSTS.find(
        cost => cost.cityId === cityId && cost.method === shippingMethod && cost.active
      );
      if (!deliveryCost) {
        errors.cityId = `طريقة الشحن "${shippingMethod === 'land' ? 'البري' : 'البحري'}" غير متاحة لهذه المدينة`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Keep the old function for backward compatibility
export const validateShippingFields = (
  shippingMethod: string,
  destinationCountry: string
): ShippingValidation => {
  const errors: { shippingMethod?: string; destinationCountry?: string } = {};

  // Validate shipping method
  if (!shippingMethod) {
    errors.shippingMethod = 'Please select a shipping method.';
  } else if (!['air', 'land'].includes(shippingMethod)) {
    errors.shippingMethod = 'Please select a valid shipping method.';
  }

  // Validate destination country
  if (!destinationCountry) {
    errors.destinationCountry = 'Please select a destination country.';
  } else {
    const country = COUNTRIES.find((c: Country) => c.code === destinationCountry);
    if (!country) {
      errors.destinationCountry = 'Invalid or unsupported country.';
    } else if (!country.isSupported) {
      errors.destinationCountry = 'This country is not currently supported.';
    } else if (!country.supportedMethods.includes(shippingMethod as 'air' | 'land')) {
      errors.destinationCountry = `Shipping method "${shippingMethod}" is not available for this country.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation functions for spare parts
export const validateSparePart = (part: Omit<SparePart, 'id' | 'createdAt' | 'updatedAt'>, existingParts: SparePart[]): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate part number
  if (!part.partNumber || part.partNumber.trim() === '') {
    errors.partNumber = 'Part number is required';
  } else if (part.partNumber.length < 3) {
    errors.partNumber = 'Part number must be at least 3 characters long';
  } else if (existingParts.some(p => p.partNumber === part.partNumber)) {
    errors.partNumber = 'Part number must be unique';
  }

  // Validate name
  if (!part.name || part.name.trim() === '') {
    errors.name = 'Part name is required';
  }

  // Validate nameAr
  if (!part.nameAr || part.nameAr.trim() === '') {
    errors.nameAr = 'Arabic part name is required';
  }

  // Validate category
  if (!part.category || part.category.trim() === '') {
    errors.category = 'Category is required';
  }

  // Validate country of origin
  if (!part.countryOfOrigin || part.countryOfOrigin.trim() === '') {
    errors.countryOfOrigin = 'Country of origin is required';
  }

  // Validate prices if provided
  if (part.prices?.original?.aed !== undefined && (part.prices.original.aed < 0 || isNaN(part.prices.original.aed))) {
    errors['prices.original.aed'] = 'Original price must be a positive number';
  }
  
  if (part.prices?.commercial?.aed !== undefined && (part.prices.commercial.aed < 0 || isNaN(part.prices.commercial.aed))) {
    errors['prices.commercial.aed'] = 'Commercial price must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate unique part number
export const generatePartNumber = (category: string, existingParts: SparePart[]): string => {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  let partNumber = `${prefix}-${timestamp}`;
  
  // Ensure uniqueness
  let counter = 1;
  while (existingParts.some(p => p.partNumber === partNumber)) {
    partNumber = `${prefix}-${timestamp}-${counter}`;
    counter++;
  }
  
  return partNumber;
};
