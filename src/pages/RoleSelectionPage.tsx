import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Code, ArrowLeft } from 'lucide-react';

function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1690165514349-501b6e2d7e44?q=80&w=100" 
            alt="Sirius Logo" 
            className="h-12 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Select your role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to access the platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="space-y-4">
          <Link 
            to="/login/admin"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">StarHub Admin</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Internal platform management and customer oversight
                </p>
              </div>
            </div>
          </Link>

          <Link 
            to="/login/customer"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Enterprise Customer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your organization's API integrations and usage
                </p>
              </div>
            </div>
          </Link>

          <Link 
            to="/login/developer"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Code className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Developer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Access API documentation and development tools
                </p>
              </div>
            </div>
          </Link>

          <div className="mt-6 text-center">
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;