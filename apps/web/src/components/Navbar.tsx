import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'km' : 'en';
    i18n.changeLanguage(newLang);
  };

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
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
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono hidden sm:inline-block">
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
        </div>
      </div>
    </header>
  );
};
