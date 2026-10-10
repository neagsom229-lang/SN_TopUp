import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'km' : 'en');
  };

  return (
    <nav className="bg-cardBg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black text-primary tracking-wider flex items-center gap-2"
        >
          ⚡ SN TOP-UP{' '}
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">
            CAMBODIA
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary font-medium">
            {t('nav.home')}
          </Link>
          <button
            onClick={toggleLang}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-700 transition"
          >
            {i18n.language === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
          </button>
        </div>
      </div>
    </nav>
  );
}
