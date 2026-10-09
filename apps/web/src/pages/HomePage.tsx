import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.js';

interface Game {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
}

export function HomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'mobile' | 'pc'>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const res = await fetch('/api/v1/games');
      if (!res.ok) throw new Error('Failed to fetch games');
      return res.json();
    },
  });

  const games: Game[] = data?.games || [];

  const filteredGames = games.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    if (category === 'pc') {
      return matchesSearch && ['valorant', 'roblox', 'steam-wallet', 'genshin-impact', 'honkai-star-rail'].includes(g.slug);
    }
    if (category === 'mobile') {
      return matchesSearch && !['valorant', 'roblox', 'steam-wallet'].includes(g.slug);
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden text-center py-16 mb-12 bg-gradient-to-br from-cardBg via-gray-900 to-darkBg rounded-3xl border border-gray-800 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
          {t('home.title')}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">{t('home.subtitle')}</p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="w-full bg-gray-900/90 border border-gray-700 rounded-2xl px-6 py-4 pl-12 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition shadow-xl"
          />
          <span className="absolute left-4 top-4 text-xl">🔍</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory('all')}
          className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
            category === 'all' ? 'bg-primary text-gray-950 shadow-lg shadow-primary/20' : 'bg-cardBg text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          🎮 All Games ({games.length})
        </button>
        <button
          onClick={() => setCategory('mobile')}
          className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
            category === 'mobile' ? 'bg-primary text-gray-950 shadow-lg shadow-primary/20' : 'bg-cardBg text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          📱 Mobile Legends & Mobile
        </button>
        <button
          onClick={() => setCategory('pc')}
          className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
            category === 'pc' ? 'bg-primary text-gray-950 shadow-lg shadow-primary/20' : 'bg-cardBg text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          💻 PC & Gift Cards
        </button>
      </div>

      {isLoading && <div className="text-center py-20 text-gray-400 text-lg">Loading games catalog...</div>}
      {error && <div className="text-center py-20 text-red-400 text-lg">Failed to load games. Please check API server.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map((game: Game) => (
          <Link
            key={game.id}
            to={`/games/${game.slug}`}
            className="group bg-cardBg rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/60 transition duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/10 flex flex-col transform hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cardBg via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3">
                <Badge variant="success">Instant ⚡</Badge>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition line-clamp-1">{game.name}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Top-Up Available</span>
                <span className="text-primary group-hover:translate-x-1 transition">Select →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
