import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import './styles/crt.css';

import Header from './components/Header';
import Today from './pages/Today';
import Archive from './pages/Archive';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application with minimal router using window.location.
   * Applies a CRT/retro theme and renders Today/Archive pages.
   */
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // PUBLIC_INTERFACE
  const setRouteTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setRoute(path);
    }
  };

  useEffect(() => {
    // Default redirect unknown paths to root
    if (route !== '/' && !route.startsWith('/archive')) {
      setRouteTo('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Page = useMemo(() => {
    if (route === '/') return Today;
    if (route.startsWith('/archive')) return Archive;
    return Today;
  }, [route]);

  return (
    <div className="App" role="application" aria-label="RetroSpace APOD Viewer">
      <Header />
      <Page />
    </div>
  );
}

export default App;
