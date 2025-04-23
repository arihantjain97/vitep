import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Upload, 
  Search, 
  FileDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { MSISDN } from '../types';
import { msisdns } from '../data/msisdns';

function NetworkInfoPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [customerMsisdns, setCustomerMsisdns] = useState<MSISDN[]>(
    () => msisdns.filter(msisdn => msisdn.customerId === customerId)
  );

  const itemsPerPage = 20;
  const filteredMSISDNs = customerMsisdns.filter(msisdn => 
    msisdn.number.includes(searchTerm) ||
    msisdn.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msisdn.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMSISDNs.length / itemsPerPage);
  const paginatedMSISDNs = filteredMSISDNs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        const newMSISDNs: MSISDN[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [number, type, status] = line.split(',');
            if (number) {
              newMSISDNs.push({
                id: `msisdn-${Date.now()}-${i}`,
                number: number.trim(),
                type: (type?.trim() as 'VOICE' | 'DATA' | 'BOTH') || 'BOTH',
                status: (status?.trim() as 'ALLOWED' | 'NOT_ALLOWED') || 'ALLOWED',
                activationDate: new Date().toISOString(),
                customerId: customerId || ''
              });
            }
          }
        }

        setCustomerMsisdns(prev => [...prev, ...newMSISDNs]);
        setNotification({
          type: 'success',
          message: `${newMSISDNs.length} MSISDNs imported successfully`
        });

        if (e.target) {
          e.target.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = `MSISDN,Type,Status
+6591234567,BOTH,ALLOWED
+6591234568,VOICE,NOT_ALLOWED
+6591234569,DATA,ALLOWED`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-msisdns.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleStatus = (id: string) => {
    setCustomerMsisdns(prev => prev.map(msisdn => {
      if (msisdn.id === id) {
        return {
          ...msisdn,
          status: msisdn.status === 'ALLOWED' ? 'NOT_ALLOWED' : 'ALLOWED'
        };
      }
      return msisdn;
    }));
    setNotification({
      type: 'success',
      message: 'MSISDN status updated successfully'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-center`}>
          {notification.type === 'success' ? 
            <CheckCircle className="h-5 w-5 mr-2" /> : 
            <AlertCircle className="h-5 w-5 mr-2" />
          }
          {notification.message}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Upload MSISDN Information</h2>
          </div>
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Sample CSV
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
      </div>

      {/* MSISDN List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              MSISDN List
            </h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search MSISDNs..."
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MSISDN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activation Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMSISDNs.map((msisdn) => (
                <tr key={msisdn.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {msisdn.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      msisdn.type === 'BOTH' ? 'bg-purple-100 text-purple-800' :
                      msisdn.type === 'VOICE' ? 'bg-green-100 text-green-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {msisdn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      msisdn.status === 'ALLOWED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {msisdn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(msisdn.activationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleStatus(msisdn.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        msisdn.status === 'ALLOWED'
                          ? 'text-red-700 bg-red-50 hover:bg-red-100'
                          : 'text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {msisdn.status === 'ALLOWED' ? (
                        <XCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      {msisdn.status === 'ALLOWED' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredMSISDNs.length)}
                </span>{' '}
                of <span className="font-medium">{filteredMSISDNs.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkInfoPage;