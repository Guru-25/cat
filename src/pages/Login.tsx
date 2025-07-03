import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TruckIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication with role-based access
    if (credentials.username && credentials.password) {
      let userRole = 'operator'; // default role
      let userName = credentials.username;
      
      // Admin credentials
      if (credentials.username.toLowerCase() === 'admin' || 
          credentials.username.toLowerCase() === 'supervisor') {
        userRole = 'admin';
        userName = credentials.username.toLowerCase() === 'admin' ? 'System Admin' : 'Site Supervisor';
      }
      
      // Store authentication info with role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
      
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <TruckIcon className="h-12 w-12 text-yellow-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CAT Smart Assistant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your operator dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              Sign in
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p><strong>Admin:</strong> username: "admin" or "supervisor"</p>
            <p><strong>Operator:</strong> any other username</p>
            <p>Password: anything</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 