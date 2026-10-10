import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'km' : 'en');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-cardBg/80 border-gray-800 py-3 shadow-xl'
            : 'bg-cardBg/90 border-gray-800/60 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl md:text-2xl font-black text-primary tracking-wider flex items-center gap-2"
          >
            ⚡ SN TOP-UP{' '}
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono hidden sm:inline-block">
              CAMBODIA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-primary font-medium text-sm md:text-base">
              {t('nav.home')}
            </Link>
            <button
              onClick={toggleLang}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border border-gray-700 transition active:scale-95"
            >
              {i18n.language === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
            </button>
            <button
              onClick={toggleTheme}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-xs border border-gray-700 transition active:scale-95"
              title="Toggle Theme"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </m.nav>
    </LazyMotion>
  );
}
