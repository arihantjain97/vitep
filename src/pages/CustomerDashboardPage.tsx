import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Users,
  MapPin,
  Shield,
  Zap,
  ChevronDown,
  BarChart2,
  PieChart,
  Network,
  ArrowLeft,
  Layout,
  Box,
  Play,
  Square,
  Timer,
  Smartphone,
  Download,
  Trash2
} from 'lucide-react';
import { dummyCustomers } from '../data/dummyCustomers';
import { msisdns } from '../data/msisdns';
import { dashboardMetrics } from '../data/dashboardMetrics';
import { getCustomerSessions, savePollingSession, deletePollingSession, downloadSessionData } from '../data/pollingSessions';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MSISDN } from '../types';

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

const generateTimeSeriesData = (days: number, apiType: string = 'all') => {
  const baseData = Array.from({ length: days }).map((_, i) => {
    const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000);
    return {
      date: date.toLocaleDateString(),
      deviceLocation: Math.floor(Math.random() * 500) + 200,
      deviceStatus: Math.floor(Math.random() * 400) + 150,
      numberVerify: Math.floor(Math.random() * 300) + 100,
      latency: Math.floor(Math.random() * 100) + 50,
      errors: Math.floor(Math.random() * 20),
      success: Math.floor(Math.random() * 100) + 900,
    };
  });

  if (apiType === 'all') return baseData;

  return baseData.map(data => ({
    date: data.date,
    calls: data[apiType],
    latency: data.latency,
    errors: data.errors,
    success: data.success
  }));
};

const generateEndpointData = () => [
  { name: '/verify', success: 98.5, latency: 75, calls: 12500 },
  { name: '/retrieve', success: 99.2, latency: 82, calls: 8700 },
  { name: '/batch', success: 97.8, latency: 95, calls: 4300 }
];

const POLLING_RATES = [
  { value: 1000, label: 'Every Second' },
  { value: 5000, label: 'Every 5 Seconds' },
  { value: 15000, label: 'Every 15 Seconds' },
  { value: 60000, label: 'Every Minute' },
  { value: 300000, label: 'Every 5 Minutes' },
  { value: 3600000, label: 'Every Hour' }
];

const API_OPTIONS = [
  { value: 'location-retrieval', label: 'Device Location (Location-Retrieval)', disabled: false },
  { value: 'device-status', label: 'Device Status (Device-Reachability-Status)', disabled: true },
  { value: 'number-verify', label: 'Number Verify', disabled: true }
];

interface PollingDataPoint {
  timestamp: number;
  avgResponseTime: number;
  deviceData: {
    msisdnId: string;
    latitude: number;
    longitude: number;
    responseTime: number;
  }[];
}

function ApplicationDashboard({ customer, msisdns }) {
  const [selectedAPI, setSelectedAPI] = useState('location-retrieval');
  const [pollingRate, setPollingRate] = useState(5000);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingData, setPollingData] = useState<PollingDataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PollingDataPoint | null>(null);
  const [pollingStats, setPollingStats] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    successRate: 100,
    lastUpdate: null as Date | null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState(() => getCustomerSessions(customer.customerId));
  const [msisdnPage, setMsisdnPage] = useState(1);
  const itemsPerPage = 5;
  const msisdnsPerPage = 5;
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const eligibleMSISDNs = msisdns.filter(
    msisdn => (msisdn.type === 'BOTH' || msisdn.type === 'DATA') && msisdn.status === 'ALLOWED'
  );

  const paginatedMSISDNs = eligibleMSISDNs.slice(
    (msisdnPage - 1) * msisdnsPerPage,
    msisdnPage * msisdnsPerPage
  );

  useEffect(() => {
    setSessions(getCustomerSessions(customer.customerId));
  }, [customer.customerId]);

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const startPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    setIsPolling(true);
    setPollingData([]);
    setSelectedPoint(null);
    setPollingStats({
      totalRequests: 0,
      avgResponseTime: 0,
      successRate: 100,
      lastUpdate: new Date()
    });

    pollingInterval.current = setInterval(() => {
      const timestamp = Date.now();
      const deviceData = eligibleMSISDNs.map(msisdn => ({
        msisdnId: msisdn.id,
        latitude: msisdn.location.lat + (Math.random() - 0.5) * 0.01,
        longitude: msisdn.location.lng + (Math.random() - 0.5) * 0.01,
        responseTime: Math.floor(Math.random() * 200) + 50
      }));

      const avgResponseTime = deviceData.reduce((acc, curr) => acc + curr.responseTime, 0) / deviceData.length;

      const newPoint = {
        timestamp,
        avgResponseTime,
        deviceData
      };

      setPollingData(prev => {
        const updatedData = [...prev, newPoint].slice(-20);
        return updatedData;
      });

      setSelectedPoint(newPoint);

      setPollingStats(prev => ({
        totalRequests: prev.totalRequests + eligibleMSISDNs.length,
        avgResponseTime: Math.round(avgResponseTime),
        successRate: 100,
        lastUpdate: new Date()
      }));
    }, pollingRate);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setIsPolling(false);

    if (pollingData.length > 0) {
      savePollingSession(customer.customerId, {
        timestamp: Date.now(),
        apiType: selectedAPI,
        pollingRate,
        deviceCount: eligibleMSISDNs.length,
        data: pollingData
      });
      setSessions(getCustomerSessions(customer.customerId));
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deletePollingSession(customer.customerId, sessionId);
    setSessions(getCustomerSessions(customer.customerId));
  };

  const handleDownloadSession = (session: PollingSession) => {
    downloadSessionData(session);
  };

  const handlePointClick = (point: PollingDataPoint) => {
    setSelectedPoint(point);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select API</label>
          <select
            value={selectedAPI}
            onChange={(e) => setSelectedAPI(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            {API_OPTIONS.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Polling Rate</label>
          <select
            value={pollingRate}
            onChange={(e) => setPollingRate(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            {POLLING_RATES.map(rate => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <input
            type="text"
            value={customer.name}
            disabled
            className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            onClick={isPolling ? stopPolling : startPolling}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              isPolling 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isPolling ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Polling
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Polling ({eligibleMSISDNs.length} devices)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Location Retrieval Polling</h3>
            <Timer className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={pollingData}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const clickedPoint = e.activePayload[0].payload;
                    setSelectedPoint(clickedPoint);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                  formatter={(value) => [`${value}ms`, 'Avg Response Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgResponseTime"
                  name="Avg Response Time" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Polling Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{pollingStats.totalRequests}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{pollingStats.avgResponseTime}ms</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-green-600">{pollingStats.successRate}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="text-sm font-medium text-gray-900">
                {pollingStats.lastUpdate ? pollingStats.lastUpdate.toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Most Recent Polling Session (Historical Data) for Device Location</h3>
          </div>
          {selectedPoint && (
            <div className="text-sm text-gray-500">
              Showing data from: {new Date(selectedPoint.timestamp).toLocaleString()}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MSISDN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Long
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMSISDNs.map((msisdn) => {
                const deviceData = selectedPoint?.deviceData.find(d => d.msisdnId === msisdn.id);
                return (
                  <tr key={msisdn.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {msisdn.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        msisdn.type === 'BOTH' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {msisdn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {msisdn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedPoint ? new Date(selectedPoint.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deviceData?.latitude.toFixed(4) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deviceData?.longitude.toFixed(4) || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {Math.ceil(eligibleMSISDNs.length / msisdnsPerPage) > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(eligibleMSISDNs.length / msisdnsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setMsisdnPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  msisdnPage === i + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Past Polling Sessions</h3>
        </div>
        {sessions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Your polling sessions will appear here</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Polling Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Devices Polled
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((session) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(session.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.apiType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.pollingRate / 1000}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.deviceCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              to={`/customer/${customer.customerId}/polling-visualization/${session.id}`}
                              className="text-green-600 hover:text-green-800 px-3 py-1 bg-green-100 rounded-md"
                            >
                              Visualize Data
                            </Link>
                            <button
                              onClick={() => handleDownloadSession(session)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Download CSV"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete session"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {Math.ceil(sessions.length / itemsPerPage) > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(sessions.length / itemsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CustomerDashboardPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer] = useState(() => dummyCustomers.find(c => c.customerId === customerId));
  const [customerMsisdns] = useState(() => 
    msisdns.filter(msisdn => msisdn.customerId === customerId)
  );
  
  const [metrics] = useState({
    totalAPICalls: dashboardMetrics.apiCalls.total,
    avgResponseTime: dashboardMetrics.responseTime.average,
    errorRate: dashboardMetrics.errors.rate,
    successRate: dashboardMetrics.success.rate
  });

  const [selectedAPI, setSelectedAPI] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [timeSeriesData, setTimeSeriesData] = useState(() => generateTimeSeriesData(30));
  const [endpointData] = useState(() => generateEndpointData());

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    setTimeSeriesData(generateTimeSeriesData(days, selectedAPI));
  }, [selectedAPI, timeRange]);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const APISelector = ({ className = '' }) => (
    <div className={`relative inline-block text-left ${className}`}>
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
  );

  const TimeRangeSelector = ({ className = '' }) => (
    <div className={`relative inline-block text-left ${className}`}>
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to="/unified-dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Unified Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-500">Account: {customer.accountNumber}</p>
          </div>
          <div className="flex items-center space-x-4">
            <TimeRangeSelector />
            <APISelector />
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              customer.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {customer.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total API Calls</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalAPICalls}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.avgResponseTime}ms</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">↓ 5ms improvement</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.errorRate}%</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <p className="mt-2 text-sm text-green-600">↓ 0.03% from last week</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.successRate}%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">↑ 0.03% from last week</p>
        </div>
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
                {selectedAPI === 'all' ? (
                  <>
                    <Line type="monotone" dataKey="deviceLocation" name="Device Location" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="deviceStatus" name="Device Status" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="numberVerify" name="Number Verify" stroke="#6366F1" strokeWidth={2} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
                )}
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
              <BarChart data={endpointData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="latency" fill="#3B82F6" />
              </BarChart>
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
              <RechartsPieChart>
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
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Endpoint Performance</h2>
            <Network className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endpointData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" name="Success Rate %" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Top Endpoints</h2>
          </div>
          <div className="space-y-4">
            {endpointData.map((endpoint, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{endpoint.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {endpoint.calls.toLocaleString()} calls
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Location Distribution</h2>
          </div>
          <div className="space-y-4">
            {[
              { region: 'Central', value: 35 },
              { region: 'North', value: 25 },
              { region: 'South', value: 20 },
              { region: 'East', value: 15 },
              { region: 'West', value: 5 }
            ].map((location, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location.region}</span>
                <span className="text-sm font-medium text-gray-900">{location.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">API Health</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.99%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Certificate</span>
              <span className="text-sm font-medium text-green-600">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Incident</span>
              <span className="text-sm font-medium text-gray-900">15 days ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rate Limit Status</span>
              <span className="text-sm font-medium text-green-600">Normal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Layout className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-medium text-gray-900">Application Dashboard</h2>
        </div>
        <ApplicationDashboard customer={customer} msisdns={customerMsisdns} />
      </div>
    </div>
  );
}

export default CustomerDashboardPage;