import React, { useState } from 'react';
import { Menu, X, PlayCircle, LogIn, LogOut, ShieldCheck, User } from 'lucide-react';
import { fetchApi, setCurrentUser } from '../utils/api';

const Navbar = ({ activeView, setActiveView, token, setToken, user, setUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse' },
    ...(token ? [{ id: 'watchlist', label: 'My Watchlist' }] : []),
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', isAdmin: true }] : []),
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await fetchApi('/logout', { method: 'POST' });
    } catch(e) {
      console.warn('Logout notification:', e);
    }
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToken(null);
    if (setUser) setUser(null);
    setActiveView('home');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex justify-between items-center flex-wrap">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
        <PlayCircle className="w-8 h-8 text-indigo-500" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
          AniSphere 🍿✨
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`relative transition-colors duration-200 text-sm font-medium flex items-center gap-1.5 ${
              activeView === item.id
                ? 'bg-indigo-600 text-white rounded-lg px-3 py-1.5 shadow-sm'
                : item.isAdmin
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5'
                  : 'text-slate-300 hover:text-indigo-300 px-3 py-1.5'
            }`}
          >
            {item.isAdmin && <ShieldCheck className="w-4 h-4 text-amber-400" />}
            {item.label}
            {item.id === 'watchlist' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-slate-950"></span>
              </span>
            )}
          </button>
        ))}

        {token ? (
          <div className="flex items-center pl-3 border-l border-slate-800 gap-3">
            {user && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                {user.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span className="font-medium text-slate-200">{user.name}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {user.role}
                </span>
              </div>
            )}
            <button 
              onClick={handleLogoutClick}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 px-2 py-1.5 text-sm font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleNavClick('auth')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 ${
              activeView === 'auth' 
                ? 'bg-indigo-600 text-white rounded-lg' 
                : 'text-slate-300 hover:text-indigo-300'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-300 hover:text-white p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="w-full mt-3 md:hidden bg-slate-950 border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-800 mb-2 flex items-center justify-between">
                <span>Signed in as <b>{user.name}</b></span>
                <span className="px-2 py-0.5 rounded uppercase text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                  {user.role}
                </span>
              </div>
            )}

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.isAdmin && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                {item.label}
              </button>
            ))}

            {token ? (
              <button 
                onClick={handleLogoutClick}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => handleNavClick('auth')}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'auth' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-indigo-300'
                }`}
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Validation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Sign Out</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to log out of <span className="text-indigo-400 font-semibold">{user?.name || 'your account'}</span>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
