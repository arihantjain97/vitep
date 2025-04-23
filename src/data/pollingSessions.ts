import { PollingSession } from '../types';
import { msisdns } from './msisdns';

// Initialize empty polling sessions storage
const pollingSessions: Record<string, PollingSession[]> = {};

// Load any existing sessions from localStorage
try {
  const savedSessions = localStorage.getItem('pollingSessions');
  if (savedSessions) {
    Object.assign(pollingSessions, JSON.parse(savedSessions));
  }
} catch (error) {
  console.error('Error loading polling sessions:', error);
}

// Helper to save sessions to localStorage
const saveSessions = () => {
  try {
    localStorage.setItem('pollingSessions', JSON.stringify(pollingSessions));
  } catch (error) {
    console.error('Error saving polling sessions:', error);
  }
};

export const getCustomerSessions = (customerId: string): PollingSession[] => {
  return pollingSessions[customerId] || [];
};

export const savePollingSession = (
  customerId: string,
  session: Omit<PollingSession, 'id'>
): void => {
  const id = `session-${Date.now()}`;
  const newSession: PollingSession = { ...session, id };
  
  if (!pollingSessions[customerId]) {
    pollingSessions[customerId] = [];
  }
  
  pollingSessions[customerId].unshift(newSession);
  saveSessions();
};

export const deletePollingSession = (customerId: string, sessionId: string): void => {
  if (pollingSessions[customerId]) {
    pollingSessions[customerId] = pollingSessions[customerId].filter(
      session => session.id !== sessionId
    );
    saveSessions();
  }
};

export const downloadSessionData = (session: PollingSession): void => {
  // Create a lookup map for MSISDN numbers
  const msisdnMap = new Map(msisdns.map(m => [m.id, m.number]));

  const csvContent = [
    ['Timestamp', 'MSISDN', 'Latitude', 'Longitude', 'Response Time (ms)'],
    ...session.data.flatMap(point => 
      point.deviceData.map(device => [
        new Date(point.timestamp).toISOString(),
        msisdnMap.get(device.msisdnId) || device.msisdnId, // Use actual phone number or fallback to ID
        device.latitude.toFixed(6),
        device.longitude.toFixed(6),
        device.responseTime.toString()
      ])
    )
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `polling-session-${session.id}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};