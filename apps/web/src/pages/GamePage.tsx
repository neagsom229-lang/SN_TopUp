import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  sellPriceCents: number;
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
}

export function GamePage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['game', slug],
    queryFn: async () => {
      const res = await fetch(`/api/v1/games/${slug}`);
      if (!res.ok) throw new Error('Game not found');
      return res.json();
    },
  });

  const game: Game = data?.game;

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8 bg-cardBg p-6 rounded-2xl border border-gray-800">
        <img src={game.imageUrl} alt={game.name} className="w-24 h-24 rounded-xl object-cover" />
        <div>
          <h1 className="text-3xl font-extrabold mb-2">{game.name}</h1>
          <p className="text-gray-400 text-sm">
            Instant Top-Up with Bakong KHQR. Automatic delivery.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-8">
        {/* Step 1: Player ID */}
        <div className="bg-cardBg p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-primary">{t('game.step1')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                {t('game.playerId')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                  required
                />
              </div>
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

        {/* Step 2: Package Selection */}
        <div className="bg-cardBg p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-primary">{t('game.step2')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {game.products.map((product) => {
              const priceUSD = (product.sellPriceCents / 100).toFixed(2);
              const isSelected = selectedProductId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{product.name}</div>
                  <div className="text-primary font-mono font-bold">$ {priceUSD}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Payment & Contact */}
        <div className="bg-cardBg p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-primary">{t('game.step3')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedProductId}
            className="w-full bg-primary hover:bg-emerald-600 text-gray-950 font-extrabold py-4 rounded-xl text-lg transition shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {submitting ? 'Creating Order...' : 'Proceed to Checkout ⚡'}
          </button>
        </div>
      </form>
    </div>
  );
}
