import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { getCustomerSessions } from '../data/pollingSessions';
import { msisdns } from '../data/msisdns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function PollingVisualizationPage() {
  const { customerId, sessionId } = useParams<{ customerId: string; sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // milliseconds

  useEffect(() => {
    if (customerId && sessionId) {
      const sessions = getCustomerSessions(customerId);
      const targetSession = sessions.find(s => s.id === sessionId);
      if (targetSession) {
        setSession(targetSession);
      }
    }
  }, [customerId, sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && session) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= session.data.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, session, playbackSpeed]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const currentData = session.data[currentIndex];
  const msisdnMap = new Map(msisdns.map(m => [m.id, m]));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (currentIndex >= session.data.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/customer/${customerId}/dashboard`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value={2000}>0.5x Speed</option>
              <option value={1000}>1x Speed</option>
              <option value={500}>2x Speed</option>
              <option value={250}>4x Speed</option>
            </select>
            <button
              onClick={togglePlayback}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Polling Session: {new Date(session.timestamp).toLocaleString()}
            </h2>
            <p className="text-sm text-gray-500">
              {session.deviceCount} devices • {session.pollingRate / 1000}s polling rate
            </p>
          </div>

          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={session.data.length - 1}
              value={currentIndex}
              onChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{new Date(session.data[0].timestamp).toLocaleTimeString()}</span>
              <span>{new Date(currentData.timestamp).toLocaleTimeString()}</span>
              <span>{new Date(session.data[session.data.length - 1].timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[1.3521, 103.8198]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {currentData.deviceData.map((device: any) => {
                const msisdn = msisdnMap.get(device.msisdnId);
                if (!msisdn) return null;

                return (
                  <Marker
                    key={device.msisdnId}
                    position={[device.latitude, device.longitude]}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-semibold">{msisdn.number}</p>
                        <p className="text-sm text-gray-600">Type: {msisdn.type}</p>
                        <p className="text-sm text-gray-600">
                          Response Time: {device.responseTime}ms
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollingVisualizationPage;