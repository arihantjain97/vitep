import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Upload, 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Receipt,
  Download,
  Trash2,
  Filter,
  MapPin,
  UserCog,
  UserCheck,
  UserX,
  FileDown,
  ArrowRight,
  Activity,
  Clock,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomerActions } from '../components/CustomerActions';
import { dummyCustomers } from '../data/dummyCustomers';

interface Location {
  lat: number;
  lng: number;
}

interface Customer {
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

interface AccountManager {
  id: string;
  name: string;
  email: string;
  customerCount: number;
}

interface AnalyticsPanelProps {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ totalCustomers, activeCustomers, suspendedCustomers }) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Customer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold text-green-600">{activeCustomers}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Suspended Customers</p>
              <p className="text-2xl font-semibold text-yellow-600">{suspendedCustomers}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <UserX className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* API Analytics */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total API Calls (24h)</p>
                <p className="text-2xl font-semibold text-gray-900">847,392</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">↑ 8.2% from yesterday</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">76ms</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">↓ 12ms improvement</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">API Health Score</p>
                <p className="text-2xl font-semibold text-gray-900">99.98%</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">All systems operational</p>
          </div>
        </div>

        {/* Unified Dashboard Button */}
        <div className="flex justify-end">
          <Link
            to="/unified-dashboard"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go to Unified Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [currentStep, setCurrentStep] = useState(1);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [filters, setFilters] = useState({
    type: 'ALL',
    status: 'ALL',
    billingFrequency: 'ALL',
    accountManager: 'ALL'
  });

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [suspendedCustomers, setSuspendedCustomers] = useState(0);

  const [accountManagers] = useState<AccountManager[]>([
    { id: '1', name: 'John Smith', email: 'john.smith@Sirius.com', customerCount: 0 },
    { id: '2', name: 'Sarah Lee', email: 'sarah.lee@Sirius.com', customerCount: 0 },
    { id: '3', name: 'Michael Wong', email: 'michael.wong@Sirius.com', customerCount: 0 },
    { id: '4', name: 'Lisa Chen', email: 'lisa.chen@Sirius.com', customerCount: 0 },
  ]);

  const [newCustomer, setNewCustomer] = useState<Customer>({
    customerId: '',
    name: '',
    type: 'B2B',
    accountNumber: '',
    email: '',
    phone: '',
    officeAddress: '',
    postalCode: '',
    billingAddress: '',
    billingAccountNumber: '',
    paymentMethod: 'BANK_TRANSFER',
    billingFrequency: 'MONTHLY',
    status: 'ACTIVE',
    location: {
      lat: 1.3521,
      lng: 103.8198
    }
  });

  useEffect(() => {
    setTotalCustomers(customers.length);
    setActiveCustomers(customers.filter(c => c.status === 'ACTIVE').length);
    setSuspendedCustomers(customers.filter(c => c.status === 'SUSPENDED').length);
  }, [customers]);

  const getCoordinatesFromPostalCode = async (postalCode: string): Promise<Location | null> => {
    try {
      const response = await fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: parseFloat(result.LATITUDE),
          lng: parseFloat(result.LONGITUDE)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'postalCode' && value.length === 6) {
      const coordinates = await getCoordinatesFromPostalCode(value);
      if (coordinates) {
        setNewCustomer(prev => ({
          ...prev,
          [name]: value,
          location: coordinates
        }));
        return;
      }
    }
    
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (!newCustomer.name || !newCustomer.email || !newCustomer.postalCode) {
      setNotification({ type: 'error', message: 'Please fill all required fields' });
      return;
    }

    const customerId = `CUST-${Date.now()}`;
    setCustomers(prev => [...prev, { ...newCustomer, customerId }]);
    setNotification({ type: 'success', message: 'Customer added successfully' });
    setCurrentStep(1);
    setNewCustomer({
      customerId: '',
      name: '',
      type: 'B2B',
      accountNumber: '',
      email: '',
      phone: '',
      officeAddress: '',
      postalCode: '',
      billingAddress: '',
      billingAccountNumber: '',
      paymentMethod: 'BANK_TRANSFER',
      billingFrequency: 'MONTHLY',
      status: 'ACTIVE',
      location: {
        lat: 1.3521,
        lng: 103.8198
      }
    });
  };

  const handleAssignAccountManager = (customerId: string, accountManagerId: string) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.customerId === customerId) {
        const manager = accountManagers.find(m => m.id === accountManagerId);
        return {
          ...customer,
          accountManager: manager?.name
        };
      }
      return customer;
    }));
    setNotification({ type: 'success', message: 'Account manager assigned successfully' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        const newCustomers: Customer[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [
              name, email, phone, type, accountNumber,
              officeAddress, postalCode, billingAddress
            ] = line.split(',');

            if (name && email && postalCode) {
              const coordinates = await getCoordinatesFromPostalCode(postalCode);
              
              newCustomers.push({
                customerId: `CUST-${Date.now()}-${i}`,
                name,
                type: type as 'B2B' | 'B2C',
                accountNumber: accountNumber || `ACC-${Date.now()}-${i}`,
                email,
                phone,
                officeAddress,
                postalCode,
                billingAddress,
                billingAccountNumber: `BILL-${Date.now()}-${i}`,
                paymentMethod: 'BANK_TRANSFER',
                billingFrequency: 'MONTHLY',
                status: 'ACTIVE',
                location: coordinates || {
                  lat: 1.3521 + (Math.random() - 0.5) * 0.1,
                  lng: 103.8198 + (Math.random() - 0.5) * 0.1
                }
              });
            }
          }
        }

        setCustomers(prev => [...prev, ...newCustomers]);
        setNotification({ 
          type: 'success', 
          message: `${newCustomers.length} customers imported successfully` 
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = `Name,Email,Phone,Type,Account Number,Office Address,Postal Code,Billing Address
ABC Technologies,abc@tech.com,+65 6789 1234,B2B,ACC001,71 Ayer Rajah Crescent,139951,71 Ayer Rajah Crescent
Global Solutions Pte Ltd,contact@globalsolutions.com,+65 6321 7890,B2B,ACC002,1 Fusionopolis Walk,138628,1 Fusionopolis Walk`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const headers = ['Name,Email,Phone,Type,Account Number,Office Address,Postal Code,Billing Address,Status,Billing Frequency,Account Manager\n'];
    const csvContent = customers.map(customer => 
      `${customer.name},${customer.email},${customer.phone},${customer.type},${customer.accountNumber},${customer.officeAddress},${customer.postalCode},${customer.billingAddress},${customer.status},${customer.billingFrequency},${customer.accountManager || ''}`
    ).join('\n');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.customerId !== customerId));
    setNotification({ type: 'success', message: 'Customer deleted successfully' });
  };

  const filteredCustomers = customers.filter(customer => {
    const typeMatch = filters.type === 'ALL' || customer.type === filters.type;
    const statusMatch = filters.status === 'ALL' || customer.status === filters.status;
    const billingMatch = filters.billingFrequency === 'ALL' || customer.billingFrequency === filters.billingFrequency;
    const managerMatch = filters.accountManager === 'ALL' || customer.accountManager === filters.accountManager;
    return typeMatch && statusMatch && billingMatch && managerMatch;
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Customer Identification</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name / Company Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Customer Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newCustomer.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="B2B">Business (B2B)</option>
                  <option value="B2C">Individual (B2C)</option>
                </select>
              </div>
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={newCustomer.taxId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700">
                  Office Address *
                </label>
                <textarea
                  id="officeAddress"
                  name="officeAddress"
                  value={newCustomer.officeAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={newCustomer.postalCode}
                  onChange={handleInputChange}
                  maxLength={6}
                  placeholder="123456"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
                  Billing Address
                </label>
                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={newCustomer.billingAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={newCustomer.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DIRECT_DEBIT">Direct Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Billing Frequency
                </label>
                <select
                  name="billingFrequency"
                  value={newCustomer.billingFrequency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="ANNUALLY">Annually</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Manager Assignment</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Account Manager
                </label>
                <select
                  name="accountManager"
                  value={newCustomer.accountManager}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select an account manager</option>
                  {accountManagers.map(manager => (
                    <option key={manager.id} value={manager.name}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Status
                </label>
                <select
                  name="status"
                  value={newCustomer.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Analytics Panel */}
      <AnalyticsPanel
        totalCustomers={totalCustomers}
        activeCustomers={activeCustomers}
        suspendedCustomers={suspendedCustomers}
      />

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-center`}>
          {notification.type === 'success' ? 
            <CheckCircle className="h-5 w-5 mr-2" /> : 
            <AlertCircle className="h-5 w-5 mr-2" />
          }
          {notification.message}
        </div>
      )}

      {/* Bulk Upload Section */}
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Bulk Customer Upload</h2>
          </div>
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Sample CSV
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <div className="text-sm text-gray-500">
            Upload a CSV file with customer details
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Customer Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-6">
            <UserPlus className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Add Customer</h2>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[
                { icon: Building2, label: 'Identification' },
                { icon: Users, label: 'Contact' },
                { icon: Receipt, label: 'Billing' },
                { icon: UserCog, label: 'Assignment' }
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    currentStep > index ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > index ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-1">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute left-0 right-0 h-1 bg-gray-200">
                <div
                  className="absolute h-1 bg-green-600 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {currentStep === 4 ? 'Submit' : 
                  'Next'}
              </button>
            </div>
          </form>
        </div>

        {/* Singapore Map */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Customer Locations</h2>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[1.3521, 103.8198]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {customers.map((customer, index) => (
                <Marker
                  key={index}
                  position={[customer.location.lat, customer.location.lng]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm">{customer.type}</p>
                      <p className="text-sm">{customer.officeAddress}</p>
                      <p className="text-sm">{customer.postalCode}</p>
                      <p className="text-sm">Account Manager: {customer.accountManager || 'Unassigned'}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Customer List ({filteredCustomers.length})
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="ALL">All Types</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="TERMINATED">Terminated</option>
              </select>
              <select
                value={filters.billingFrequency}
                onChange={(e) => setFilters(prev => ({ ...prev, billingFrequency: e.target.value }))}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="ALL">All Billing</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUALLY">Annually</option>
              </select>
              <select
                value={filters.accountManager}
                onChange={(e) => setFilters(prev => ({ ...prev, accountManager: e.target.value }))}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="ALL">All Managers</option>
                {accountManagers.map(manager => (
                  <option key={manager.id} value={manager.name}>{manager.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Manager</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.accountNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.type === 'B2B' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.officeAddress}</div>
                      <div className="text-sm text-gray-500">{customer.postalCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.accountManager ? (
                        <div className="text-sm text-gray-900">{customer.accountManager}</div>
                      ) : (
                        <select
                          onChange={(e) => handleAssignAccountManager(customer.customerId, e.target.value)}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Assign Manager</option>
                          {accountManagers.map(manager => (
                            <option key={manager.id} value={manager.id}>{manager.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        customer.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CustomerActions
                        customerId={customer.customerId}
                        onDelete={() => handleDelete(customer.customerId)}
                      />
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;