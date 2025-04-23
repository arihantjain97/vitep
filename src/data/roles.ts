import { Role } from '../types';
import { dummyCustomers } from './dummyCustomers';

// Create customer login entries from dummy customers
const customerLogins = dummyCustomers.reduce((acc, customer) => {
  const emailSlug = customer.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove special chars and spaces

  return {
    ...acc,
    [emailSlug]: {
      email: `cus@${emailSlug}.com`,
      password: '123456',
      title: `${customer.name} Portal`,
      description: 'Manage your API integrations and usage',
      color: 'blue',
      redirect: `/customer/${customer.customerId}/dashboard`
    }
  };
}, {});

export const roles: Record<string, Role> = {
  admin: {
    email: 'admin@sirius.com',
    password: '123456',
    title: 'Sirius Admin Portal',
    description: 'Access internal platform management',
    color: 'green',
    redirect: '/dashboard'
  },
  developer: {
    email: 'dev@sirius.com',
    password: '123456',
    title: 'Developer Portal',
    description: 'Access API documentation and tools',
    color: 'orange',
    redirect: '/developer-dashboard'
  },
  ...customerLogins
};