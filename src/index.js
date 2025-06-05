import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import App from './App';
import './index.css';

function CartProviderWrapper() {
  const { user } = useAuth();
  return <CartProvider userId={user ? user.id : null}><App /></CartProvider>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProviderWrapper />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
