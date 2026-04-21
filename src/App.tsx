import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Top100 from "./pages/Top100";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // @ts-ignore
    if (typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('config', 'G-29V2XGBPP7', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  
  // Transformando o progresso do scroll em cores suaves que combinam com a marca
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#FFFFFF", "#FDF7FD", "#F5E6F0"] // Branco -> Rosa Pálido -> Rosa Lavanda
  );

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <AnalyticsTracker />
          <div className="relative min-h-screen font-sans selection:bg-rose-100 selection:text-rose-600">
            {/* Fundo fixo com degradê responsivo ao scroll */}
            <motion.div 
              style={{ backgroundColor }}
              className="fixed inset-0 -z-10 transition-colors duration-700"
            />
            
            <Navbar />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/top100" element={<Top100 />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/store" element={<Store />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}
