import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const Login = ({ onRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add validation
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Welcome to MindfulConnect
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {onRegister && (
              <div className="text-center text-sm">
                <span className="text-gray-600">{"Don't have an account?"} </span>
                <button
                  type="button"
                  onClick={onRegister}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Register here
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

Login.propTypes = {
  onRegister: PropTypes.func.isRequired
};

export default Login;