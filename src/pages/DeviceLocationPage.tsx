import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { ArrowLeft, MapPin, Crosshair, Info, Code, Shield, Server } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Replace with your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3Rhcmh1YiIsImEiOiJjbHNxOXh4MW8wMGx5MmpxdDd1bXFqOXozIn0.5yS9_oHR1NK6y9V8lqWl9A';

type APIType = 'verification' | 'retrieval';
type CoverageType = 'nationwide' | 'custom';

interface Pricing {
  nationwide: {
    basic: number;
    premium: number;
  };
  custom: {
    basic: number;
    premium: number;
  };
}

const pricing: Record<APIType, Pricing> = {
  verification: {
    nationwide: {
      basic: 0.025,
      premium: 0.045
    },
    custom: {
      basic: 0.015,
      premium: 0.035
    }
  },
  retrieval: {
    nationwide: {
      basic: 0.035,
      premium: 0.055
    },
    custom: {
      basic: 0.025,
      premium: 0.045
    }
  }
};

function DeviceLocationPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [selectedAPI, setSelectedAPI] = useState<APIType>('verification');
  const [coverageType, setCoverageType] = useState<CoverageType>('nationwide');
  const [plan, setPlan] = useState<'basic' | 'premium'>('basic');
  const [quantity, setQuantity] = useState(1000);
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'schemas'>('overview');

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [103.8198, 1.3521], // Singapore coordinates
      zoom: 11,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    draw.current = new MapboxDraw({
      controls: {
        polygon: true,
        trash: true
      },
      displayControlsDefault: false
    });

    map.current.addControl(draw.current);

    map.current.on('load', () => {
      // Add Singapore boundary
      map.current?.addSource('singapore-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [103.6052, 1.1640],
              [103.6052, 1.4707],
              [104.0996, 1.4707],
              [104.0996, 1.1640],
              [103.6052, 1.1640]
            ]]
          }
        }
      });

      map.current?.addLayer({
        id: 'singapore-boundary-fill',
        type: 'fill',
        source: 'singapore-boundary',
        paint: {
          'fill-color': '#0066cc',
          'fill-opacity': 0.1
        }
      });

      map.current?.addLayer({
        id: 'singapore-boundary-line',
        type: 'line',
        source: 'singapore-boundary',
        paint: {
          'line-color': '#0066cc',
          'line-width': 2
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const updateMapInteraction = () => {
      if (coverageType === 'custom') {
        map.current?.setMinZoom(10);
        if (draw.current) {
          draw.current.deleteAll();
          draw.current.changeMode('draw_polygon');
        }
      } else {
        map.current?.setMinZoom(9);
        if (draw.current) {
          draw.current.deleteAll();
        }
      }
    };

    updateMapInteraction();
  }, [coverageType]);

  const handleOrder = () => {
    const customArea = coverageType === 'custom' ? draw.current?.getAll() : null;
    const orderDetails = {
      apiType: selectedAPI,
      coverageType,
      customArea,
      plan,
      quantity,
      pricing: pricing[selectedAPI][coverageType][plan]
    };
    
    console.log('Order details:', orderDetails);
    alert('Order placed successfully! A StarHub representative will contact you shortly.');
  };

  const renderApiDocumentation = () => {
    if (activeTab === 'overview') {
      return (
        <div className="prose max-w-none">
          <h3>Overview</h3>
          <p className="text-gray-600">
            {selectedAPI === 'verification' ? (
              <>
                The Location Verification API determines whether a mobile device is within the proximity 
                of a specified geographical area. The API request includes the target area, defined as 
                a circle with a specified center (latitude and longitude) and a radius or accuracy threshold.
              </>
            ) : (
              <>
                The Location Retrieval API provides the location of a mobile line as detected by the 
                mobile network operator. The request can specify the maximum acceptable age of the 
                location data, while the response delivers the detected location.
              </>
            )}
          </p>

          <h4>Key Features</h4>
          <ul>
            {selectedAPI === 'verification' ? (
              <>
                <li>Real-time location verification</li>
                <li>Configurable accuracy thresholds</li>
                <li>Support for circular and polygon geofences</li>
                <li>Match rate estimation for partial matches</li>
              </>
            ) : (
              <>
                <li>High-precision location data</li>
                <li>Configurable data freshness</li>
                <li>Support for circle and polygon responses</li>
                <li>Batch location retrieval capabilities</li>
              </>
            )}
          </ul>

          <h4>Authentication</h4>
          <p>
            Uses OAuth 2.0 with OpenID Connect. All requests require a Bearer token:
          </p>
          <pre className="bg-gray-800 text-white p-4 rounded-md">
            Authorization: Bearer &lt;your_token&gt;
          </pre>
        </div>
      );
    }

    if (activeTab === 'endpoints') {
      return (
        <div className="prose max-w-none">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-green-500 text-white text-sm font-mono rounded">POST</span>
              <code className="text-sm">
                {selectedAPI === 'verification' ? '/verify' : '/retrieve'}
              </code>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h4 className="mt-0">Request Body</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm">
{selectedAPI === 'verification' ? 
`{
  "device": {
    "phoneNumber": "+6591234567"
  },
  "area": {
    "areaType": "CIRCLE",
    "center": {
      "latitude": 1.3521,
      "longitude": 103.8198
    },
    "radius": 1000
  },
  "maxAge": 120
}` :
`{
  "device": {
    "phoneNumber": "+6591234567"
  },
  "maxAge": 120,
  "maxSurface": 1000000
}`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="mt-0">Response</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm">
{selectedAPI === 'verification' ? 
`{
  "verificationResult": "TRUE",
  "lastLocationTime": "2025-03-15T14:30:00+08:00",
  "matchRate": 95
}` :
`{
  "lastLocationTime": "2025-03-15T14:30:00+08:00",
  "area": {
    "areaType": "CIRCLE",
    "center": {
      "latitude": 1.3521,
      "longitude": 103.8198
    },
    "radius": 800
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="prose max-w-none">
        <h3>Data Models</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h4 className="mt-0 mb-2">Device</h4>
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm">
{`{
  "phoneNumber": string,     // E.164 format
  "ipv4Address": {
    "publicAddress": string,
    "publicPort": number
  },
  "ipv6Address": string
}`}
          </pre>
        </div>

        {selectedAPI === 'verification' && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <h4 className="mt-0 mb-2">Area</h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm">
{`{
  "areaType": "CIRCLE",
  "center": {
    "latitude": number,
    "longitude": number
  },
  "radius": number
}`}
            </pre>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="mt-0 mb-2">Error Response</h4>
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm">
{`{
  "status": number,
  "code": string,
  "message": string
}`}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#00A6ED] to-[#005BAC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link to="/" className="text-white hover:text-gray-200 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Marketplace
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - API Information */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Device Location API</h1>
            
            {/* API Type Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Select API Type</h2>
              <div className="space-y-2">
                <button
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedAPI === 'verification'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedAPI('verification')}
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium">Location Verification</h3>
                      <p className="text-sm text-gray-600">
                        Verify if a device is within a specified geographical area
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedAPI === 'retrieval'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedAPI('retrieval')}
                >
                  <div className="flex items-start">
                    <Crosshair className="h-5 w-5 text-blue-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium">Location Retrieval</h3>
                      <p className="text-sm text-gray-600">
                        Get precise device location data from the network
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Coverage Type */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Coverage Area</h2>
              <div className="space-y-2">
                <button
                  className={`w-full p-4 text-left rounded-lg border ${
                    coverageType === 'nationwide'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setCoverageType('nationwide')}
                >
                  <h3 className="font-medium">Nationwide Coverage</h3>
                  <p className="text-sm text-gray-600">
                    Access to location data across all of Singapore
                  </p>
                </button>

                <button
                  className={`w-full p-4 text-left rounded-lg border ${
                    coverageType === 'custom'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setCoverageType('custom')}
                >
                  <h3 className="font-medium">Custom Area</h3>
                  <p className="text-sm text-gray-600">
                    Define specific areas on the map
                  </p>
                </button>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Select Plan</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg border ${
                    plan === 'basic'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPlan('basic')}
                >
                  <h3 className="font-medium">Basic</h3>
                  <p className="text-xl font-bold text-blue-600">
                    ${pricing[selectedAPI][coverageType].basic}
                    <span className="text-sm font-normal text-gray-600">/call</span>
                  </p>
                </button>

                <button
                  className={`p-4 rounded-lg border ${
                    plan === 'premium'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPlan('premium')}
                >
                  <h3 className="font-medium">Premium</h3>
                  <p className="text-xl font-bold text-blue-600">
                    ${pricing[selectedAPI][coverageType].premium}
                    <span className="text-sm font-normal text-gray-600">/call</span>
                  </p>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of API calls
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Order Now
            </button>
          </div>

          {/* Right Column - Map and Documentation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Coverage Area</h2>
              {coverageType === 'custom' && (
                <p className="text-sm text-gray-600 mb-3">
                  Use the polygon tool to draw your custom coverage area
                </p>
              )}
              <div className="relative" style={{ height: '400px' }}>
                <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
              </div>
            </div>

            {/* API Documentation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex items-center px-6 py-4">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold">API Documentation</h2>
                </div>
                <div className="px-6 flex space-x-4">
                  <button
                    className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <Info className="h-4 w-4 inline-block mr-1" />
                    Overview
                  </button>
                  <button
                    className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                      activeTab === 'endpoints'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('endpoints')}
                  >
                    <Server className="h-4 w-4 inline-block mr-1" />
                    Endpoints
                  </button>
                  <button
                    className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                      activeTab === 'schemas'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('schemas')}
                  >
                    <Code className="h-4 w-4 inline-block mr-1" />
                    Schemas
                  </button>
                </div>
              </div>
              <div className="p-6">
                {renderApiDocumentation()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeviceLocationPage;