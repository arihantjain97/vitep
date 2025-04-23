import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { roles } from '../data/roles';

function RoleLoginPage() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get the appropriate config based on role
  const getConfig = () => {
    if (!role) return roles.admin;
    
    if (role === 'admin' || role === 'developer') {
      return roles[role];
    }

    // For customer role, find matching customer config
    if (role === 'customer') {
      // Find the customer config that matches the entered email
      const customerConfig = Object.values(roles).find(r => 
        r.email === email && r.redirect.includes('/customer/')
      );
      return customerConfig || {
        email: '',
        password: '',
        title: 'Enterprise Customer Portal',
        description: 'Manage your API integrations and usage',
        color: 'blue',
        redirect: '/dashboard'
      };
    }

    return roles.admin;
  };

  const config = getConfig();

  const getButtonColorClass = () => {
    switch (config.color) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500';
      default:
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    }
  };

  const getFocusColorClass = () => {
    switch (config.color) {
      case 'green':
        return 'focus:ring-green-500 focus:border-green-500';
      case 'blue':
        return 'focus:ring-blue-500 focus:border-blue-500';
      case 'orange':
        return 'focus:ring-orange-500 focus:border-orange-500';
      default:
        return 'focus:ring-green-500 focus:border-green-500';
    }
  };

  const getLinkColorClass = () => {
    switch (config.color) {
      case 'green':
        return 'text-green-600 hover:text-green-500';
      case 'blue':
        return 'text-blue-600 hover:text-blue-500';
      case 'orange':
        return 'text-orange-600 hover:text-orange-500';
      default:
        return 'text-green-600 hover:text-green-500';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'customer') {
      // Find matching customer credentials
      const customerConfig = Object.values(roles).find(r => 
        r.email === email && r.password === password && r.redirect.includes('/customer/')
      );

      if (customerConfig) {
        toast.success('Login successful!');
        navigate(customerConfig.redirect);
        return;
      }
    } else if (email === config.email && password === config.password) {
      toast.success('Login successful!');
      navigate(config.redirect);
      return;
    }

    toast.error('Invalid credentials');
  };

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
          {config.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {config.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none ${getFocusColorClass()} sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none ${getFocusColorClass()} sm:text-sm`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded border-gray-300 ${getFocusColorClass()}`}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className={getLinkColorClass()}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${getButtonColorClass()} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link 
              to="/role-select"
              className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to role selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleLoginPage;