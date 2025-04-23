import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Users, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00D84B] to-[#006F32] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 hover:text-green-600 transition-colors">
              <Users className="h-6 w-6 text-white" />
              <h1 className="text-xl font-semibold text-white">Sirius Customer Management Portal</h1>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}

export default Layout;