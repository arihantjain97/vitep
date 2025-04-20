export interface API {
  id: string;
  name: string;
  description: string;
  category: 'device' | 'location' | 'verification';
  status: 'available' | 'coming_soon';
  documentation: string;
  pricing: {
    basic: number;
    premium: number;
  };
}

export interface OrderDetails {
  apiId: string;
  plan: 'basic' | 'premium';
  quantity: number;
}

export interface Customer {
  customerId: string;
  name: string;
  type: 'B2B' | 'B2C';
  accountNumber: string;
  taxId?: string;
  email: string;
  phone: string;
  officeAddress: string;
  postalCode: string;
  billingAddress: string;
  billingAccountNumber: string;
  paymentMethod: string;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  location: Location;
  accountManager?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface MSISDN {
  id: string;
  number: string;
  status: 'ALLOWED' | 'NOT_ALLOWED';
  type: 'VOICE' | 'DATA' | 'BOTH';
  activationDate: string;
  customerId: string;
  location: Location;
}