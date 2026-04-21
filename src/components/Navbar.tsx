import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Youtube, Facebook, Search, Tv, ShoppingBag, ShoppingCart, Menu, X, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import logo from "../assets/logo.jpg";
import { TOP_DORAMAS } from "../constants/doramas";

import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };

    if (isSearchOpen || isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, isMenuOpen]);

  // Animando a visibilidade e o tamanho da logo com base no scroll
  const logoOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0]);
  const logoWidth = useTransform(scrollY, [0, 100], ["5rem", "0rem"]);
  const logoMargin = useTransform(scrollY, [0, 100], ["0.75rem", "0rem"]);

  // Efeito de esconder o header no mobile ao rolar
  const navY = useTransform(scrollY, [0, 100], [0, isMobile ? -120 : 0]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Top 100", path: "/top100" },
    { name: "Quem Somos", path: "/about" },
    { name: "Loja", path: "/store", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Contato", path: "/contact" },
  ];

  const navPadding = useTransform(scrollY, [0, 100], ["1rem", "0.25rem"]); // py-4 para py-1
  const titleScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const navOpacity = useTransform(scrollY, [0, 100], [0.4, 0.2]); // Fica mais transparente ao rolar

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { doramas: [], pages: [] };
    
    const term = searchTerm.toLowerCase();
    
    const doramas = TOP_DORAMAS.filter(d => 
      d.title.toLowerCase().includes(term) || 
      d.original.toLowerCase().includes(term)
    ).slice(0, 5);

    const pages = navLinks.filter(l => 
      l.name.toLowerCase().includes(term)
    );

    return { doramas, pages };
  }, [searchTerm]);

  const handleSearchSelect = (path: string) => {
    setSearchTerm("");
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <>
      <motion.nav 
        style={{ 
          paddingTop: navPadding, 
          paddingBottom: navPadding,
          y: navY,
          backgroundColor: useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.15)"])
        }}
        className="sticky top-0 z-50 backdrop-blur-md border-b border-primary/5 px-6 transition-all duration-300"
      >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center group">
          <motion.div 
            style={{ 
              opacity: logoOpacity, 
              scale: logoScale, 
              width: logoWidth,
              marginRight: logoMargin
            }}
            className="relative h-16 rounded-2xl overflow-hidden transition-all bg-transparent shrink-0"
          >
            <img 
              src={logo} 
              alt="Oppa Dorama Club Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.div 
            style={{ scale: titleScale }}
            className="flex flex-col items-center gap-0 origin-left"
          >
            <span className="text-xl md:text-2xl font-display font-black text-accent leading-none tracking-tight">Oppa</span>
            <span className="text-[8px] md:text-[9px] font-sans font-black text-primary uppercase tracking-[0.35em] pl-[0.35em]">Dorama Club</span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <motion.div 
          style={{ scale: titleScale }}
          className="hidden lg:flex items-center gap-4 xl:gap-8 font-bold text-accent origin-right"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="hover:text-primary-dark transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </motion.div>

        <motion.div 
          style={{ scale: titleScale }}
          className="flex items-center gap-2 lg:gap-3 origin-right"
        >
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors mr-1"
          >
            <Search className="w-5 h-5 text-accent" />
          </button>

          <Link 
            to="/cart"
            className="p-2 hover:bg-primary/10 rounded-full transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 text-accent" />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 bg-accent/5 p-1 rounded-full border border-accent/5">
            <a 
              href="https://www.facebook.com/oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-accent/40 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>

            <a 
              href="https://www.youtube.com/@oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-accent/40 rounded-full hover:bg-[#FF0000] hover:text-white transition-all duration-300"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>

            <a 
              href="https://www.instagram.com/oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-accent/40 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>

            <a 
              href="https://www.tiktok.com/@oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-accent/40 rounded-full hover:bg-black hover:text-white transition-all duration-300"
              title="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 hover:bg-primary/10 rounded-xl transition-colors text-accent"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border border-primary/10 mt-4 rounded-[2.5rem] shadow-2xl shadow-primary/10"
          >
              <div className="flex flex-col gap-4 px-8 py-10">
                {/* Mobile Search Bar */}
                <div className="relative mb-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/30" />
                  <input 
                    type="text"
                    placeholder="Buscar doramas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full bg-accent/5 border border-primary/10 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-black text-accent hover:text-primary-dark transition-colors flex items-center gap-2"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/cart" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-black text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Meu Carrinho ({totalItems})
              </Link>
              <div className="mt-8 pt-8 border-t border-primary/5 flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-accent/20 uppercase tracking-[0.2em]">Conecte-se conosco</span>
                <div className="flex items-center gap-2 p-1.5 bg-accent/5 rounded-full border border-accent/5">
                  <a 
                    href="https://www.facebook.com/oppadoramaclub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 text-accent/40 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a 
                    href="https://www.youtube.com/@oppadoramaclub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 text-accent/40 rounded-full hover:bg-[#FF0000] hover:text-white transition-all duration-300"
                    title="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>

                  <a 
                    href="https://www.instagram.com/oppadoramaclub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 text-accent/40 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  <a 
                    href="https://www.tiktok.com/@oppadoramaclub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 text-accent/40 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                    title="TikTok"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>

    {/* Search Dropdown - Subtle centered card */}
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop for closing */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            className="fixed top-20 md:top-24 left-1/2 z-[100] w-[92%] max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <div className="relative flex items-center gap-3 md:gap-4 mb-6">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Buscar doramas ou páginas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent py-2 text-lg md:text-xl font-display font-bold text-accent placeholder:text-accent/20 focus:outline-none"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-accent/5 rounded-full text-accent/40 transition-all"
                  aria-label="Fechar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Doramas Results */}
                <div className="flex flex-col">
                  <h3 className="text-primary/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    Doramas
                  </h3>
                  <div className="flex flex-col gap-2">
                    {searchResults.doramas.length > 0 ? (
                      searchResults.doramas.map(dorama => (
                        <button
                          key={dorama.rank}
                          onClick={() => handleSearchSelect(`/top100?id=${dorama.rank}`)}
                          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <img src={dorama.image} alt={`Poster de ${dorama.title}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-accent font-bold group-hover:text-primary transition-colors line-clamp-1 text-sm">{dorama.title}</h4>
                            <p className="text-accent/40 text-[9px] uppercase tracking-wider truncate">{dorama.original}</p>
                          </div>
                        </button>
                      ))
                    ) : searchTerm ? (
                      <p className="text-accent/20 text-xs italic py-4 text-center">Nenhum dorama encontrado...</p>
                    ) : (
                      <p className="text-accent/20 text-xs italic py-4 text-center">Digite para buscar...</p>
                    )}
                  </div>
                </div>

                {/* Pages Results */}
                <div className="flex flex-col border-t md:border-t-0 md:border-l border-accent/5 pt-6 md:pt-0 md:pl-8">
                  <h3 className="text-primary/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    Navegação
                  </h3>
                  <div className="flex flex-col gap-1">
                    {searchResults.pages.length > 0 ? (
                      searchResults.pages.map(page => (
                        <button
                          key={page.path}
                          onClick={() => handleSearchSelect(page.path)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            {page.icon || <Star className="w-4 h-4" />}
                          </div>
                          <span className="text-accent text-sm font-bold group-hover:text-primary transition-colors">{page.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                        {navLinks.map(page => (
                          <button
                            key={page.path}
                            onClick={() => handleSearchSelect(page.path)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all text-left text-accent/60 hover:text-primary group"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-all"></div>
                            <span className="text-xs font-semibold">{page.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer hint */}
            <div className="bg-accent/5 p-3 text-center border-t border-accent/5">
              <p className="text-[10px] text-accent/30 font-medium uppercase tracking-widest">
                Pressione ESC para fechar
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
  );
}
