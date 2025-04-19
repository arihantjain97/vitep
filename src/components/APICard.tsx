import React from 'react';
import { API } from '../types';
import { ChevronRight, Zap, MapPin, Shield } from 'lucide-react';

const categoryIcons = {
  device: Zap,
  location: MapPin,
  verification: Shield,
};

interface APICardProps {
  api: API;
  onClick: () => void;
}

export function APICard({ api, onClick }: APICardProps) {
  const Icon = categoryIcons[api.category];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <p className="mt-3 text-gray-600">{api.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">From</span>
          <span className="text-sm font-bold text-blue-600">${api.pricing.basic}/call</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          api.status === 'available' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {api.status === 'available' ? 'Available' : 'Coming Soon'}
        </span>
      </div>
    </div>
  );
}