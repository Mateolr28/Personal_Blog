import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Plane, Compass, Sparkles, Terminal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre mí', path: '/about' },
    { name: 'Experiencia', path: '/experience' },
    { name: 'Proyectos', path: '/projects' },
    { name: 'Viajes', path: '/travel' },
    { name: 'Aviación', path: '/aviation' },
    { name: 'Contacto', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          id="brand-logo-link"
          className="flex items-center gap-3 font-bold text-white group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center text-white shadow-lg border border-blue-400/30 group-hover:scale-105 transition-transform">
            <Plane className="w-4 h-4 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight serif italic">MR.ARCHIVE</span>
            <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">
              Dev & Spotter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                isActive(link.path)
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            id="nav-contact-pill"
            className="hidden sm:inline-flex items-center text-[11px] uppercase tracking-widest px-4 py-1.5 border border-white/20 rounded-full text-white/80 hover:bg-white hover:text-black transition-all"
          >
            Contacto
          </Link>

          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 md:hidden border border-white/10 transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-[#080808]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-5 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-blue-950/60 border border-blue-500/30 text-blue-300 font-semibold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
