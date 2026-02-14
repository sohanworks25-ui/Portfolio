
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, data } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate against stored credentials or default
    const storedCreds = data.adminCredentials || { username: 'admin', password: 'admin123' };
    
    if (username === storedCreds.username && password === storedCreds.password) {
      login(username);
      navigate('/admin');
    } else {
      setError('Invalid username or password. (Check your credentials in Profile settings)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/30">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1 text-gray-700 dark:text-gray-300">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1 text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">Back to Frontend</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
