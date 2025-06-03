import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "mdb-ui-kit/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function App() {

  const { user } = useAuth();
  //Routes only logged in user can access
  const PrivateRoute = ({ children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
  };

  //Routes only logged out user can access
  const PublicRoute = ({ children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
  };

  return (
    <CartProvider userId={user ? user.id : 0}>
      <div className="app-container">
        <Layout />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<PublicRoute> <Login/> </PublicRoute>} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/register" element={<PublicRoute> <Register/> </PublicRoute>} />
            <Route path="/profile" element={<PrivateRoute> <Profile/> </PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {/* <Footer/> */}
      </div>
    </CartProvider>
  );
}

export default App;
