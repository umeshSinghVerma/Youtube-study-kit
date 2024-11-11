import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Intract from './components/Intract';
import { SearchProvider } from './context/SearchContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/guide" element={<div>Hi, I am on the guide page</div>} />
          <Route path="/intract" element={<Intract />} />
        </Routes>
      </HashRouter>
    </SearchProvider>
  </React.StrictMode>
);


