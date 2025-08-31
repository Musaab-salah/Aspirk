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
  price?: number;
  currency: 'AED' | 'USD';
  isAvailable: boolean;
  supplierId?: string;
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
  currency: 'AED' | 'USD';
  shippingMethod: 'air' | 'land';
  destinationCountry: string;
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
  currency: 'AED' | 'USD';
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
  method: 'air' | 'land';
  country: string;
  baseCost: number;
  currency: 'AED' | 'USD';
  estimatedDays: number;
  isAvailable: boolean;
}

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  isSupported: boolean;
  supportedMethods: ('air' | 'land')[];
}

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

// Shipping cost calculation function
export const calculateShippingCost = (method: 'air' | 'land', country: string): ShippingCost => {
  const baseCosts = {
    air: {
      // Arab Countries - Air Shipping
      'EG': { cost: 85, days: 3 },
      'SD': { cost: 90, days: 3 },
      'SA': { cost: 80, days: 2 },
      'AE': { cost: 50, days: 1 },
      'QA': { cost: 75, days: 2 },
      'BH': { cost: 65, days: 2 },
      'KW': { cost: 70, days: 2 },
      'OM': { cost: 60, days: 2 },
      'YE': { cost: 95, days: 3 },
      'JO': { cost: 90, days: 3 },
      'LB': { cost: 100, days: 3 },
      'SY': { cost: 95, days: 3 },
      'IQ': { cost: 95, days: 3 },
      'PS': { cost: 90, days: 3 },
      'DZ': { cost: 110, days: 4 },
      'TN': { cost: 105, days: 4 },
      'MA': { cost: 110, days: 4 },
      'LY': { cost: 100, days: 3 },
      'MR': { cost: 115, days: 4 },
      'SO': { cost: 120, days: 4 },
      'KM': { cost: 125, days: 5 },
      'DJ': { cost: 110, days: 4 },
      // African Countries - Air Shipping
      'NG': { cost: 150, days: 5 },
      'KE': { cost: 140, days: 5 },
      'ET': { cost: 145, days: 5 },
      'GH': { cost: 155, days: 6 },
      'ZA': { cost: 160, days: 6 },
      'TZ': { cost: 145, days: 5 },
      'UG': { cost: 140, days: 5 },
      'SN': { cost: 150, days: 6 },
      'RW': { cost: 135, days: 5 },
      'ZM': { cost: 155, days: 6 },
      'ZW': { cost: 155, days: 6 },
      'MW': { cost: 150, days: 6 },
      'BW': { cost: 160, days: 6 },
      'NA': { cost: 165, days: 6 },
      'TD': { cost: 130, days: 5 },
      'ML': { cost: 145, days: 6 },
      'NE': { cost: 140, days: 6 },
      'CF': { cost: 135, days: 5 },
      'CM': { cost: 150, days: 6 },
      'CI': { cost: 155, days: 6 },
      'BF': { cost: 150, days: 6 },
      'MG': { cost: 170, days: 7 },
      'AO': { cost: 165, days: 6 },
      'MZ': { cost: 160, days: 6 },
      'SS': { cost: 125, days: 4 },
      'ER': { cost: 130, days: 4 },
      'SL': { cost: 160, days: 6 },
      'TG': { cost: 155, days: 6 },
      'BJ': { cost: 155, days: 6 },
      'GW': { cost: 165, days: 6 },
      'GN': { cost: 160, days: 6 },
      'GM': { cost: 165, days: 6 },
      'CV': { cost: 170, days: 7 },
      'ST': { cost: 175, days: 7 },
      'GQ': { cost: 155, days: 6 },
      'GA': { cost: 150, days: 6 },
      'CG': { cost: 145, days: 5 },
      'CD': { cost: 140, days: 5 },
      'BI': { cost: 135, days: 5 },
      'SC': { cost: 180, days: 7 },
      'MU': { cost: 175, days: 7 },
      'LS': { cost: 165, days: 6 },
      'SZ': { cost: 160, days: 6 }
    },
    land: {
      // Arab Countries - Land Shipping (only for countries that support it)
      'EG': { cost: 60, days: 4 },
      'SD': { cost: 70, days: 5 },
      'SA': { cost: 50, days: 3 },
      'AE': { cost: 30, days: 1 },
      'QA': { cost: 55, days: 3 },
      'BH': { cost: 40, days: 2 },
      'KW': { cost: 45, days: 3 },
      'OM': { cost: 35, days: 2 },
      'YE': { cost: 75, days: 5 },
      'JO': { cost: 70, days: 5 },
      'SY': { cost: 75, days: 5 },
      'IQ': { cost: 75, days: 5 },
      'PS': { cost: 70, days: 5 },
      'DZ': { cost: 85, days: 6 },
      'TN': { cost: 80, days: 6 },
      'MA': { cost: 85, days: 6 },
      'LY': { cost: 75, days: 5 },
      'MR': { cost: 90, days: 6 },
      'DJ': { cost: 80, days: 5 }
      // Note: African countries don't support land shipping
    }
  };

  const countryData = baseCosts[method][country as keyof typeof baseCosts[typeof method]];
  
  if (!countryData) {
    return {
      method,
      country,
      baseCost: 0,
      currency: 'AED',
      estimatedDays: 0,
      isAvailable: false
    };
  }

  return {
    method,
    country,
    baseCost: countryData.cost,
    currency: 'AED',
    estimatedDays: countryData.days,
    isAvailable: true
  };
};

// Validation functions
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
