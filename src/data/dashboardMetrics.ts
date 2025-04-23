export const dashboardMetrics = {
  apiCalls: {
    total: 847392,
    trend: '+8.2%',
    byType: {
      deviceLocation: 324567,
      deviceStatus: 289456,
      numberVerify: 233369
    }
  },
  responseTime: {
    average: 76,
    trend: '-12ms',
    byEndpoint: [
      { name: '/verify', latency: 75, success: 98.5, calls: 12500 },
      { name: '/retrieve', latency: 82, success: 99.2, calls: 8700 },
      { name: '/batch', latency: 95, success: 97.8, calls: 4300 }
    ]
  },
  errors: {
    rate: 0.08,
    trend: '-0.02%',
    distribution: [
      { name: 'Invalid Arguments', value: 35, color: '#EF4444' },
      { name: 'Authentication', value: 25, color: '#F59E0B' },
      { name: 'Rate Limit', value: 20, color: '#3B82F6' },
      { name: 'Network', value: 15, color: '#8B5CF6' },
      { name: 'Other', value: 5, color: '#6B7280' }
    ]
  },
  success: {
    rate: 99.92,
    trend: '+0.02%'
  }
};