import React, { useState } from 'react';
import { APICard } from '../components/APICard';
import { APIDetails } from '../components/APIDetails';
import { apis } from '../data/apis';
import { API, OrderDetails } from '../types';
import { Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [selectedAPI, setSelectedAPI] = useState<API | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredAPIs = apis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAPIClick = (api: API) => {
    if (api.id === 'device-location') {
      navigate('/api/device-location');
    } else {
      setSelectedAPI(api);
    }
  };

  const handleOrder = (details: OrderDetails) => {
    console.log('Order placed:', details);
    alert('Order placed successfully! A StarHub representative will contact you shortly.');
    setSelectedAPI(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#00A6ED] to-[#005BAC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1690165514349-501b6e2d7e44?q=80&w=100" 
                alt="StarHub Logo" 
                className="h-10 w-auto"
              />
              <h1 className="ml-3 text-2xl font-bold text-white">StarHub API Marketplace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                Singapore's Premier API Platform
              </div>
              <Link 
                to="/login"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-4 w-4 mr-2" />
                Management Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Enterprise APIs for Singapore Businesses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Access StarHub's powerful suite of enterprise APIs. Built for Singapore's leading businesses, 
            with local support and compliance with Singapore regulations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search APIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6ED] focus:border-transparent"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-[#00A6ED] mb-2">🇸🇬</div>
            <h3 className="text-lg font-semibold mb-2">Singapore-Based Infrastructure</h3>
            <p className="text-gray-600">Local data centers ensuring low latency and data sovereignty compliance</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-[#00A6ED] mb-2">🔒</div>
            <h3 className="text-lg font-semibold mb-2">PDPA Compliant</h3>
            <p className="text-gray-600">Fully compliant with Singapore's Personal Data Protection Act</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-[#00A6ED] mb-2">🤝</div>
            <h3 className="text-lg font-semibold mb-2">Local Support</h3>
            <p className="text-gray-600">24/7 support from our Singapore-based technical team</p>
          </div>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAPIs.map(api => (
            <APICard
              key={api.id}
              api={api}
              onClick={() => handleAPIClick(api)}
            />
          ))}
        </div>

        {/* API Details Modal */}
        {selectedAPI && (
          <APIDetails
            api={selectedAPI}
            onClose={() => setSelectedAPI(null)}
            onOrder={handleOrder}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StarHub Enterprise</h3>
              <p className="text-gray-400">
                67 Ubi Avenue 1<br />
                #05-01 StarHub Green<br />
                Singapore 408942
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Enterprise Sales: 1800 888 8888<br />
                Technical Support: 1800 888 9999<br />
                Email: enterprise@starhub.com
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="text-gray-400">
                <li className="mb-2">API Documentation</li>
                <li className="mb-2">Developer Guide</li>
                <li className="mb-2">Service Level Agreement</li>
                <li>PDPA Compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;