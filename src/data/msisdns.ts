import { MSISDN } from '../types';
import { dummyCustomers } from './dummyCustomers';

// Generate 40 static MSISDNs per customer
export const msisdns: MSISDN[] = dummyCustomers.flatMap(customer => 
  [
    // Singapore number format: +65 XXXX XXXX
    '+6581234567',
    '+6582345678',
    '+6583456789',
    '+6584567890',
    '+6585678901',
    '+6586789012',
    '+6587890123',
    '+6588901234',
    '+6589012345',
    '+6580123456',
    // Add 30 more numbers per customer
    ...Array(30).fill('').map((_, i) => `+65${90000000 + i}`)
  ].map((number, index) => ({
    id: `msisdn-${customer.customerId}-${index + 1}`,
    number,
    status: index % 3 === 0 ? 'NOT_ALLOWED' : 'ALLOWED',
    type: index % 3 === 0 ? 'VOICE' : index % 3 === 1 ? 'DATA' : 'BOTH',
    activationDate: '2024-01-01T00:00:00Z',
    customerId: customer.customerId,
    location: {
      lat: customer.location.lat + (index * 0.001),
      lng: customer.location.lng + (index * 0.001)
    }
  }))
);