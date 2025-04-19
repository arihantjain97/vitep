import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import DeviceLocationPage from './pages/DeviceLocationPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NetworkInfoPage from './pages/NetworkInfoPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import UnifiedDashboardPage from './pages/UnifiedDashboardPage';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api/device-location" element={<DeviceLocationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unified-dashboard" element={<UnifiedDashboardPage />} />
          <Route path="/customer/:customerId/network-info" element={<NetworkInfoPage />} />
          <Route path="/customer/:customerId/dashboard" element={<CustomerDashboardPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;