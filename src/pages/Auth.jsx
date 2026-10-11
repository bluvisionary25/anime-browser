import React, { useState } from 'react';
import { fetchApi, setCurrentUser } from '../utils/api';
import { User, Mail, Lock, ShieldCheck, UserCheck } from 'lucide-react';

const Auth = ({ setToken, setUser, setActiveView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const data = await fetchApi(endpoint, {
        method: 'POST',
        body: payload
      });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      if (setUser) setUser(data.user);
      setActiveView('browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email, password) => {
    setIsLogin(true);
    setFormData({ name: '', email, password });
    setError(null);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {isLogin ? 'Sign in to access your Watchlist and account features.' : 'Join to track and personalize your anime experience.'}
        </p>
        
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Demo Credentials (For Presentation)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@example.com', 'password')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Account
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('test@example.com', 'password')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              User Account
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-1"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
