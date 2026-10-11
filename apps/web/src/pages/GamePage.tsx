import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GameCover } from '../components/GameCover';

interface Product {
  id: string;
  name: string;
  sellPriceCents: number;
  packageType: string;
  badge?: string | null;
  bonusLabel?: string | null;
  unitAmount?: number | null;
  unitLabel?: string | null;
  unitPriceMicros?: number | null;
}

interface Game {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  inputFields: Array<{
    key: string;
    label: { en: string; km: string };
    required: boolean;
    placeholder?: string;
  }>;
  products: Product[];
  groupedProducts?: {
    currency: Product[];
    pass: Product[];
    bundle: Product[];
  };
}

export function GamePage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProductId = searchParams.get('product') || '';
  const setSelectedProductId = (id: string) => {
    if (id) setSearchParams({ product: id });
    else setSearchParams({});
  };

  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'currency' | 'pass' | 'bundle'>('currency');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'amount-asc' | 'amount-desc'>(
    'price-asc',
  );

  const { data, isLoading } = useQuery({
    queryKey: ['game', slug],
    queryFn: async () => {
      const res = await fetch(`/api/v1/games/${slug}`);
      if (!res.ok) throw new Error('Game not found');
      return res.json();
    },
  });

  const game: Game = data?.game;

  useEffect(() => {
    if (game) {
      document.title = `${game.name} Top-Up - SN Top-Up`;
    }
  }, [game]);

  const currentProducts = useMemo(() => {
    if (!game) return [];
    const grouped = game.groupedProducts || {
      currency: game.products.filter((p) => p.packageType === 'currency'),
      pass: game.products.filter((p) => p.packageType === 'pass'),
      bundle: game.products.filter((p) => p.packageType === 'bundle'),
    };
    const list = grouped[activeTab] || [];
    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.sellPriceCents - b.sellPriceCents;
      if (sortBy === 'price-desc') return b.sellPriceCents - a.sellPriceCents;
      if (sortBy === 'amount-asc') return (a.unitAmount || 0) - (b.unitAmount || 0);
      if (sortBy === 'amount-desc') return (b.unitAmount || 0) - (a.unitAmount || 0);
      return 0;
    });
  }, [game, activeTab, sortBy]);

  const selectedProduct = game?.products?.find((p) => p.id === selectedProductId);

  const handleVerify = async () => {
    if (!playerId) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/v1/players/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameSlug: slug, playerId, serverId }),
      });
      const json = await res.json();
      if (res.ok) {
        setVerifiedName(json.playerName);
      } else {
        alert(json.error?.message || 'Player verification failed');
      }
    } catch {
      alert('Network error during player check');
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !playerId || !contactPhone) {
      alert('Please fill in all required fields and select a package.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          playerId,
          serverId: serverId || undefined,
          contactPhone,
          promoCode: promoCode || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        navigate(`/checkout/${json.order.code}`);
      } else {
        alert(json.error?.message || 'Failed to create order');
      }
    } catch {
      alert('Network error creating order');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-20 text-gray-400">Loading game details...</div>;
  if (!game) return <div className="text-center py-20 text-red-400">Game not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-6 mb-8 bg-cardBg p-6 rounded-2xl border border-gray-800">
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
          <GameCover
            slug={game.slug}
            name={game.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold mb-2">{game.name}</h1>
          <p className="text-gray-400 text-sm">Secure and transparent top-up catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Player ID */}
          <div className="bg-cardBg p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-primary">{t('game.step1')}</h2>
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-xs flex items-start gap-3">
              <span className="text-lg">🛡️</span>
              <div>
                <div className="font-bold mb-1">Security Notice</div>
                <div>We only need your Player ID. Never share your password or login codes.</div>
                <div className="text-gray-400 mt-1">
                  យើងត្រូវការតែអត្តសញ្ញាណអ្នកលេង (Player ID) របស់អ្នកប៉ុណ្ណោះ។
                  កុំចែករំលែកពាក្យសម្ងាត់ ឬកូដសម្ងាត់របស់អ្នកឡើយ។
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('game.playerId')}
                </label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                  required
                />
              </div>
              {game.inputFields.length > 1 && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    {t('game.serverId')}
                  </label>
                  <input
                    type="text"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    placeholder="e.g. 2101"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                    required
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !playerId}
                className="bg-gray-800 hover:bg-gray-700 text-primary border border-primary/30 px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : t('game.checkPlayer')}
              </button>
              {verifiedName && (
                <span className="text-emerald-400 font-medium text-sm">
                  ✓ {t('game.verifiedName')} <b>{verifiedName}</b>
                </span>
              )}
            </div>
          </div>

          {/* Step 2: Package Selection with Tabs & Sorting */}
          <div className="bg-cardBg p-6 rounded-2xl border border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold text-primary">{t('game.step2')}</h2>
              {/* Package Type Tabs */}
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                {(['currency', 'pass', 'bundle'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'bg-primary text-gray-950 shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="flex justify-end mb-4">
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(
                    e.target.value as 'price-asc' | 'price-desc' | 'amount-asc' | 'amount-desc',
                  )
                }
                aria-label="Sort packages"
                className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="amount-desc">Amount: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentProducts.map((product) => {
                const priceUSD = (product.sellPriceCents / 100).toFixed(2);
                const isSelected = selectedProductId === product.id;
                const unitPriceFormatted =
                  product.unitPriceMicros && product.unitLabel
                    ? `${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      }).format(product.unitPriceMicros / 1_000_000)} / ${product.unitLabel}`
                    : null;

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`relative cursor-pointer p-4 rounded-xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {product.badge && (
                      <span className="absolute -top-2.5 right-3 bg-accent text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                        {product.badge.replace('_', ' ')}
                      </span>
                    )}
                    <div>
                      <div className="font-bold text-lg mb-1">{product.name}</div>
                      {product.bonusLabel && (
                        <div className="text-xs text-emerald-400 font-medium mb-2">
                          🎁 {product.bonusLabel}
                        </div>
                      )}
                    </div>
                    <div>
                      {unitPriceFormatted && (
                        <div className="text-xs text-gray-400 mb-2">{unitPriceFormatted}</div>
                      )}
                      <div className="text-primary font-mono font-bold text-xl">$ {priceUSD}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3 & Sticky Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-cardBg p-6 rounded-2xl border border-gray-800 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-primary">{t('game.step3')}</h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('game.contactPhone')}
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+855 12 345 678"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('game.promoCode')}
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SNWELCOME"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                />
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Selected Package:</span>
                  <span className="text-white font-semibold">
                    {selectedProduct ? selectedProduct.name : 'None selected'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total:</span>
                  <span className="text-primary">
                    $ {selectedProduct ? (selectedProduct.sellPriceCents / 100).toFixed(2) : '0.00'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedProductId || !playerId || !contactPhone}
                  className="w-full bg-primary hover:bg-emerald-600 text-gray-950 font-extrabold py-4 rounded-xl text-lg transition shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {submitting ? 'Creating Order...' : 'Proceed to Checkout ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cardBg border-t border-gray-800 p-4 flex items-center justify-between shadow-2xl z-50">
        <div>
          <div className="text-xs text-gray-400">Total Price</div>
          <div className="text-primary font-bold text-lg">
            $ {selectedProduct ? (selectedProduct.sellPriceCents / 100).toFixed(2) : '0.00'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={submitting || !selectedProductId || !playerId || !contactPhone}
          className="bg-primary text-gray-950 font-bold px-6 py-3 rounded-xl shadow disabled:opacity-50"
        >
          Checkout ⚡
        </button>
      </div>
    </div>
  );
}
