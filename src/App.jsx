import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Cart from './pages/Cart.jsx';
import Layout from './components/Layout.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <Layout/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  ); 
}

export default App;
