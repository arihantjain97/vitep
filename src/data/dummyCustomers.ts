import { Customer } from '../types';

export const dummyCustomers: Customer[] = [
  {
    customerId: 'CUST-001',
    name: 'DBS Bank Ltd',
    type: 'B2B',
    accountNumber: 'ACC-DBS-001',
    taxId: '197800306G',
    email: 'enterprise@dbs.com',
    phone: '+65 6878 8888',
    officeAddress: '12 Marina Boulevard, DBS Asia Central, Marina Bay Financial Centre Tower 3',
    postalCode: '018982',
    billingAddress: '12 Marina Boulevard, DBS Asia Central, Marina Bay Financial Centre Tower 3',
    billingAccountNumber: 'BILL-DBS-001',
    paymentMethod: 'BANK_TRANSFER',
    billingFrequency: 'ANNUALLY',
    status: 'ACTIVE',
    location: {
      lat: 1.2789,
      lng: 103.8536
    },
    accountManager: 'John Smith'
  },
  {
    customerId: 'CUST-002',
    name: 'Grab Holdings Inc.',
    type: 'B2B',
    accountNumber: 'ACC-GRAB-001',
    taxId: '201316157N',
    email: 'enterprise@grab.com',
    phone: '+65 6655 0005',
    officeAddress: '6 Battery Road',
    postalCode: '049909',
    billingAddress: '6 Battery Road',
    billingAccountNumber: 'BILL-GRAB-001',
    paymentMethod: 'CREDIT_CARD',
    billingFrequency: 'MONTHLY',
    status: 'ACTIVE',
    location: {
      lat: 1.2847,
      lng: 103.8506
    },
    accountManager: 'Sarah Lee'
  },
  {
    customerId: 'CUST-003',
    name: 'OCBC Bank',
    type: 'B2B',
    accountNumber: 'ACC-OCBC-001',
    taxId: '193200032W',
    email: 'enterprise@ocbc.com',
    phone: '+65 6363 3333',
    officeAddress: '65 Chulia Street, OCBC Centre',
    postalCode: '049513',
    billingAddress: '65 Chulia Street, OCBC Centre',
    billingAccountNumber: 'BILL-OCBC-001',
    paymentMethod: 'BANK_TRANSFER',
    billingFrequency: 'QUARTERLY',
    status: 'ACTIVE',
    location: {
      lat: 1.2845,
      lng: 103.8499
    },
    accountManager: 'Michael Wong'
  },
  {
    customerId: 'CUST-004',
    name: 'Singtel Mobile',
    type: 'B2B',
    accountNumber: 'ACC-SINGTEL-001',
    taxId: '199201624D',
    email: 'enterprise@singtel.com',
    phone: '+65 6838 3388',
    officeAddress: '31 Exeter Road, Comcentre',
    postalCode: '239732',
    billingAddress: '31 Exeter Road, Comcentre',
    billingAccountNumber: 'BILL-SINGTEL-001',
    paymentMethod: 'DIRECT_DEBIT',
    billingFrequency: 'MONTHLY',
    status: 'ACTIVE',
    location: {
      lat: 1.3006,
      lng: 103.8365
    },
    accountManager: 'Lisa Chen'
  },
  {
    customerId: 'CUST-005',
    name: 'United Overseas Bank',
    type: 'B2B',
    accountNumber: 'ACC-UOB-001',
    taxId: '193500026Z',
    email: 'enterprise@uob.com',
    phone: '+65 6533 9898',
    officeAddress: '80 Raffles Place, UOB Plaza',
    postalCode: '048624',
    billingAddress: '80 Raffles Place, UOB Plaza',
    billingAccountNumber: 'BILL-UOB-001',
    paymentMethod: 'BANK_TRANSFER',
    billingFrequency: 'ANNUALLY',
    status: 'ACTIVE',
    location: {
      lat: 1.2847,
      lng: 103.8509
    },
    accountManager: 'John Smith'
  }
];