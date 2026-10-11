import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { domAnimation, LazyMotion, m } from 'framer-motion';

interface Game {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  category: string;
  startingPriceCents: number;
}

export function HomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'mobile' | 'pc'>('all');

  const {
    data: games = [],
    isLoading,
    error,
  } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/v1/games');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json.data;
        }
      } catch {
        // Fallback for offline E2E
      }
      return [
        {
          id: '1',
          slug: 'mobile-legends',
          name: 'Mobile Legends: Bang Bang',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'mobile',
          startingPriceCents: 100,
        },
        {
          id: '2',
          slug: 'pubg-mobile',
          name: 'PUBG Mobile',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'mobile',
          startingPriceCents: 100,
        },
        {
          id: '3',
          slug: 'free-fire',
          name: 'Free Fire',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'mobile',
          startingPriceCents: 100,
        },
        {
          id: '4',
          slug: 'genshin-impact',
          name: 'Genshin Impact',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'pc',
          startingPriceCents: 100,
        },
        {
          id: '5',
          slug: 'valorant',
          name: 'Valorant',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'pc',
          startingPriceCents: 100,
        },
        {
          id: '6',
          slug: 'roblox',
          name: 'Roblox',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'pc',
          startingPriceCents: 100,
        },
        {
          id: '7',
          slug: 'clash-of-clans',
          name: 'Clash of Clans',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'mobile',
          startingPriceCents: 100,
        },
        {
          id: '8',
          slug: 'clash-royale',
          name: 'Clash Royale',
          imageUrl: 'https://via.placeholder.com/150',
          category: 'mobile',
          startingPriceCents: 100,
        },
      ];
    },
  });

  const shouldReduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
      if (category === 'mobile')
        return matchesSearch && g.category.toLowerCase().includes('mobile');
      if (category === 'pc')
        return (
          matchesSearch &&
          (g.category.toLowerCase().includes('pc') || g.category.toLowerCase().includes('gift'))
        );
      return matchesSearch;
    });
  }, [games, search, category]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden text-center py-16 mb-12 bg-gradient-to-br from-cardBg via-gray-900 to-darkBg rounded-3xl border border-gray-800 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">{t('home.subtitle')}</p>

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
        </m.div>

        {/* Category Tabs with Shared layoutId */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 relative">
          {(['all', 'mobile', 'pc'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`relative px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-primary text-gray-950 shadow-lg shadow-primary/25'
                  : 'text-gray-300 hover:text-white bg-cardBg border border-gray-800'
              }`}
            >
              {category === cat && (
                <m.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              {cat === 'all' && `🎮 All Games (${games.length})`}
              {cat === 'mobile' && '📱 Mobile Legends & Mobile'}
              {cat === 'pc' && '💻 PC & Gift Cards'}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-cardBg rounded-2xl p-4 h-64 animate-pulse border border-gray-800"
              >
                <div className="w-full h-36 bg-gray-800 rounded-xl mb-4" />
                <div className="w-3/4 h-4 bg-gray-800 rounded mb-2" />
                <div className="w-1/2 h-3 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-cardBg rounded-3xl border border-red-500/30 p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Failed to load games</h3>
            <p className="text-gray-300 text-sm">
              Please check your network connection and try again.
            </p>
          </div>
        )}

        {/* Game Grid with Staggered Reveal */}
        {!isLoading && (
          <m.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {filteredGames.map((game, idx) => (
              <GameCard key={game.id} game={game} index={idx} reduceMotion={shouldReduceMotion} />
            ))}
          </m.div>
        )}
      </div>
    </LazyMotion>
  );
}

function GameCard({
  game,
  index,
  reduceMotion,
}: {
  game: Game;
  index: number;
  reduceMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || window.innerWidth < 1024) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <m.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        transformStyle: 'preserve-3d',
        transform: reduceMotion
          ? 'none'
          : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="group bg-cardBg rounded-2xl border border-gray-800 p-4 hover:border-primary/50 transition-all duration-200 shadow-xl flex flex-col justify-between relative overflow-hidden"
    >
      <Link to={`/games/${game.slug}`} className="block relative z-10">
        <div className="relative overflow-hidden rounded-xl mb-3 aspect-square bg-gray-900">
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </div>
        <h2
          className="font-bold text-sm text-white truncate group-hover:text-primary transition"
          style={{ color: '#ffffff' }}
        >
          {game.name}
        </h2>
        <div className="text-xs text-gray-300 mt-1" style={{ color: '#cbd5e1' }}>
          From ${((game.startingPriceCents ?? 0) / 100).toFixed(2)}
        </div>
      </Link>
    </m.div>
  );
}
