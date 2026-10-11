import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import Watchlist from './pages/Watchlist';
import Auth from './pages/Auth';
import AdminCatalog from './pages/AdminCatalog';
import { getCurrentUser, fetchApi } from './utils/api';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(getCurrentUser());

  // Optionally verify and sync user profile on startup if token exists
  useEffect(() => {
    if (token && !user) {
      fetchApi('/user')
        .then(res => {
          setUser(res);
          localStorage.setItem('user', JSON.stringify(res));
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
      setActiveView('auth');
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Home setActiveView={setActiveView} />;
      case 'browse':
        return <Browse setActiveView={setActiveView} />;
      case 'watchlist':
        return token ? <Watchlist /> : <Auth setToken={setToken} setUser={setUser} setActiveView={setActiveView} />;
      case 'admin':
        return <AdminCatalog user={user} />;
      case 'auth':
        return <Auth setToken={setToken} setUser={setUser} setActiveView={setActiveView} />;
      case 'about':
        return <About />;
      default:
        return <Home setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        token={token} 
        setToken={setToken}
        user={user}
        setUser={setUser}
      />
      
      <main className="flex-grow flex flex-col">
        {renderView()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
