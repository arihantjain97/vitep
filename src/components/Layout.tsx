import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Users } from 'lucide-react';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">StarHub Customer Management Portal</h1>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}

export default Layout;