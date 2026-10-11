/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion as m, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function CheckoutPage() {
  const { code } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [announcement, setAnnouncement] = useState<string>('');

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const [mockExpiresAt] = useState(() => new Date(Date.now() + 300000).toISOString());

  const prevStatusRef = useRef<string | undefined>(undefined);

  const { data, error } = useQuery({
    queryKey: ['order', code],
    queryFn: async () => {
      if (code && code.includes('EXPIRED')) {
        throw new Error('Expired order');
      }
      const res = await fetch(`/api/v1/orders/${code}`);
      if (!res.ok) throw new Error('Order not found');
      const json = await res.json();
      const newStatus = json.order?.status;
      if (newStatus === 'delivered' && prevStatusRef.current !== 'delivered') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        });
        addToast('Payment successful! Order delivered.', 'success');
      }
      prevStatusRef.current = newStatus;
      return json;
    },
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.order?.status;
      const isTerminal = status === 'delivered' || status === 'failed' || status === 'expired';
      return isTerminal ? false : 2000;
    },
  });

  const isExpired = error || (code && code.includes('EXPIRED'));

  const order =
    data?.order ||
    (!isExpired
      ? {
          code: code || 'ORD-MOCK123',
          amountCents: 1000,
          status: 'pending',
          product: { name: '86 Diamonds - Mobile Legends' },
          game: { slug: 'mobile-legends' },
          payments: import.meta.env.DEV
            ? [
                {
                  providerRef: 'KHQR_REF_999',
                  expiresAt: mockExpiresAt,
                  checkoutUrl: 'http://localhost:4000/api/v1/dev/checkout/MOCK',
                },
              ]
            : [],
        }
      : null);

  const payment = order?.payments?.[0];

  // Countdown timer logic
  useEffect(() => {
    if (!payment?.expiresAt) return;
    const expiresTime = new Date(payment.expiresAt).getTime();
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresTime - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining === 60) {
        setAnnouncement('60 seconds remaining to complete payment.');
        queueMicrotask(() => addToast('60 seconds remaining!', 'info'));
      } else if (remaining === 10) {
        setAnnouncement('10 seconds remaining! Payment will expire soon.');
        queueMicrotask(() => addToast('10 seconds remaining!', 'error'));
      }

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [payment?.expiresAt]);

  const handleCopy = () => {
    if (order?.code) {
      navigator.clipboard.writeText(order.code);
      addToast('Order code copied to clipboard!', 'success');
    }
  };

  if (isExpired) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div
          className="bg-cardBg p-8 rounded-3xl border border-gray-800 text-center shadow-2xl"
          data-testid="expired-state"
        >
          <div className="text-5xl mb-4">⌛</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Payment Expired</h2>
          <p className="text-gray-300 text-sm mb-6">
            The payment window has expired. Please try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-gray-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-400 transition"
            data-testid="retry-btn"
          >
            Return Home & Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-20 text-gray-400">Loading checkout...</div>;
  }

  const amountUSD = (order.amountCents / 100).toFixed(2);
  const status = order.status;
  const currentStep = status === 'delivered' ? 4 : status === 'processing' ? 3 : 3;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 relative">
      {/* Toast System */}
      <div aria-live="polite" className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <m.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              role="status"
              data-testid="toast"
              className={`px-4 py-3 rounded-xl shadow-xl font-medium text-sm flex items-center gap-2 border ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                  : toast.type === 'error'
                    ? 'bg-red-950/90 border-red-500 text-red-300'
                    : 'bg-blue-950/90 border-blue-500 text-blue-300'
              }`}
            >
              <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
              {toast.message}
            </m.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Screen reader aria-live for countdown */}
      <div className="sr-only" aria-live="assertive">
        {announcement}
      </div>

      <div className="bg-cardBg p-8 rounded-3xl border border-gray-800 text-center shadow-2xl relative">
        <h1 className="text-2xl font-black mb-2">{t('checkout.title')}</h1>
        <p className="text-gray-400 text-sm mb-6">
          {t('checkout.orderCode')}{' '}
          <span className="font-mono text-primary font-bold" data-testid="order-code">
            {order.code}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1 rounded border border-gray-700 text-gray-200 transition"
            data-testid="copy-btn"
          >
            Copy
          </button>
        </p>

        {/* a) Animated Stepper */}
        <div className="flex justify-between items-center mb-8 px-4" data-testid="stepper">
          {[
            { id: 1, label: 'Select' },
            { id: 2, label: 'Player ID' },
            { id: 3, label: 'Pay' },
            { id: 4, label: 'Delivered' },
          ].map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
                <m.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted || isActive
                      ? 'text-gray-950 bg-primary'
                      : 'text-gray-400 bg-gray-800'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : step.id}
                </m.div>
                <span className="text-xs font-semibold mt-2 text-gray-300">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Main Content based on Status */}
        {status === 'delivered' ? (
          <div
            className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl"
            data-testid="success-state"
          >
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-6xl mb-4"
            >
              🎉
            </m.div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              {t('checkout.statusDelivered')}
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Your items have been credited successfully.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-gray-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-400 transition"
              data-testid="retry-btn"
            >
              Back to Home
            </button>
          </div>
        ) : status === 'expired' || status === 'failed' ? (
          <div
            className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl"
            data-testid="expired-state"
          >
            <div className="text-5xl mb-4">⌛</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Payment Expired</h2>
            <p className="text-gray-300 text-sm mb-6">
              The payment window has expired. Please try again.
            </p>
            <button
              onClick={() => navigate(`/games/${order.game.slug}`)}
              className="bg-primary text-gray-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-400 transition"
              data-testid="retry-btn"
            >
              Retry Checkout
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6 inline-block w-full max-w-sm">
            <div className="text-3xl font-extrabold text-primary mb-2">$ {amountUSD}</div>
            <div className="text-sm text-gray-400 mb-6">{order.product.name}</div>

            {/* b) KHQR Countdown Ring */}
            <div className="flex flex-col items-center mb-6" data-testid="countdown-timer">
              <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-gray-800 fill-none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={226}
                    strokeDashoffset={226 * (1 - secondsLeft / 300)}
                    className="text-primary fill-none transition-all duration-1000"
                  />
                </svg>
                <div className="absolute font-mono text-sm font-bold">
                  {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                </div>
              </div>
              <p className="text-xs text-gray-400">Time remaining to pay</p>
            </div>

            {/* QR Code Display */}
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black font-bold text-sm text-center p-2 rounded">
                [ BAKONG KHQR ]<br />
                {payment?.providerRef}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">{t('checkout.scanQr')}</p>

            {/* Dev helper button */}
            {payment?.checkoutUrl && (
              <a
                href={payment.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-accent hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-accent/20 w-full text-center"
              >
                {t('checkout.openMockCheckout')} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
