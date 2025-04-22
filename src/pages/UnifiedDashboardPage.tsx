import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Shield,
  Network,
  Search,
  Users
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { dummyCustomers } from '../data/dummyCustomers';

const TIME_RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
];

const API_TYPES = [
  { id: 'all', name: 'All APIs' },
  { id: 'device-location', name: 'Device Location' },
  { id: 'device-status', name: 'Device Status' },
  { id: 'number-verify', name: 'Number Verification' }
];

const ERROR_TYPES = [
  { name: 'Invalid Arguments', value: 35, color: '#EF4444' },
  { name: 'Authentication', value: 25, color: '#F59E0B' },
  { name: 'Rate Limit', value: 20, color: '#3B82F6' },
  { name: 'Network', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 5, color: '#6B7280' }
];

const generateTimeSeriesData = (days: number, customerId?: string) => {
  const multiplier = customerId ? 
    dummyCustomers.findIndex(c => c.customerId === customerId) + 1 : 
    dummyCustomers.length;

  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const baseValue = customerId ? 2000 : 5000;
    return {
      date: date.toLocaleDateString(),
      deviceLocation: Math.floor(Math.random() * baseValue * multiplier) + baseValue,
      deviceStatus: Math.floor(Math.random() * (baseValue - 1000) * multiplier) + baseValue - 500,
      numberVerify: Math.floor(Math.random() * (baseValue - 2000) * multiplier) + baseValue - 1000,
      errors: Math.floor(Math.random() * (customerId ? 20 : 100)),
      latency: Math.floor(Math.random() * 50) + 50
    };
  });
};

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  trendColor?: 'green' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, trendColor = 'green' }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`bg-${trendColor === 'green' ? 'green' : 'red'}-100 rounded-full p-3`}>
        {icon}
      </div>
    </div>
    {trend && (
      <p className={`mt-2 text-sm text-${trendColor}-600`}>{trend}</p>
    )}
  </div>
);

function UnifiedDashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedAPI, setSelectedAPI] = useState('all');

  const handleCustomerChange = (customerId: string) => {
    if (customerId !== 'all') {
      navigate(`/customer/${customerId}/dashboard`);
    }
  };

  const timeSeriesData = useMemo(() => {
    const days = timeRange === '24h' ? 1 : 
                timeRange === '7d' ? 7 : 
                timeRange === '30d' ? 30 : 90;
    return generateTimeSeriesData(days);
  }, [timeRange]);

  const totalAPICalls = useMemo(() => {
    return timeSeriesData.reduce((acc, curr) => 
      acc + curr.deviceLocation + curr.deviceStatus + curr.numberVerify, 0
    );
  }, [timeSeriesData]);

  const customerUsageData = useMemo(() => {
    return dummyCustomers.map(customer => ({
      name: customer.name,
      calls: Math.floor(Math.random() * 50000) + 10000
    }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unified API Dashboard</h1>
            <p className="text-gray-500">Aggregated metrics across all customers</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value="all"
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="all">All Customers</option>
                {dummyCustomers.map(customer => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedAPI}
                onChange={(e) => setSelectedAPI(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {API_TYPES.map(api => (
                  <option key={api.id} value={api.id}>{api.name}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {TIME_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total API Calls"
          value={totalAPICalls.toLocaleString()}
          trend="↑ 15% from last period"
          icon={<Activity className="h-6 w-6 text-green-600" />}
        />
        
        <MetricCard
          title="Average Response Time"
          value="68ms"
          trend="↓ 8ms improvement"
          icon={<Clock className="h-6 w-6 text-green-600" />}
        />

        <MetricCard
          title="Error Rate"
          value="0.08%"
          trend="↓ 0.02% decrease"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
          trendColor="green"
        />

        <MetricCard
          title="Overall Success Rate"
          value="99.92%"
          trend="↑ 0.02% increase"
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">API Calls Trend</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="deviceLocation" 
                  name="Device Location" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="deviceStatus" 
                  name="Device Status" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="numberVerify" 
                  name="Number Verify" 
                  stroke="#6366F1" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Response Time Distribution</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  name="Response Time (ms)" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Error Distribution</h2>
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ERROR_TYPES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ERROR_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Customer Usage Distribution</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">API Performance</h2>
          </div>
          <div className="space-y-4">
            {API_TYPES.slice(1).map((api, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{api.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor(Math.random() * 20 + 80)}ms
                  </span>
                  <span className="text-xs text-green-600">99.9%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Top Customers</h2>
          </div>
          <div className="space-y-4">
            {dummyCustomers.slice(0, 5).map((customer, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{customer.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(Math.random() * 50000 + 10000).toLocaleString()} calls
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">System Health</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-medium text-green-600">99.999%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Gateway Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Health</span>
              <span className="text-sm font-medium text-green-600">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cache Hit Rate</span>
              <span className="text-sm font-medium text-green-600">94.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnifiedDashboardPage;