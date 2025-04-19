import React, { useState } from 'react';
import { API, OrderDetails } from '../types';
import { X } from 'lucide-react';

interface APIDetailsProps {
  api: API;
  onClose: () => void;
  onOrder: (details: OrderDetails) => void;
}

export function APIDetails({ api, onClose, onOrder }: APIDetailsProps) {
  const [plan, setPlan] = useState<'basic' | 'premium'>('basic');
  const [quantity, setQuantity] = useState(1000);

  const handleOrder = () => {
    onOrder({
      apiId: api.id,
      plan,
      quantity
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{api.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: api.documentation }} />
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Pricing Plans</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  plan === 'basic' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setPlan('basic')}
              >
                <h4 className="font-semibold">Basic Plan</h4>
                <p className="text-2xl font-bold text-blue-600">${api.pricing.basic}/call</p>
                <p className="text-gray-600 mt-2">Standard API access with basic features</p>
              </div>
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  plan === 'premium' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setPlan('premium')}
              >
                <h4 className="font-semibold">Premium Plan</h4>
                <p className="text-2xl font-bold text-blue-600">${api.pricing.premium}/call</p>
                <p className="text-gray-600 mt-2">Advanced features with priority support</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Number of API calls
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleOrder}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}