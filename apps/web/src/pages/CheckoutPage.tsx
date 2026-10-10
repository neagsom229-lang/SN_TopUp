import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function CheckoutPage() {
  const { code } = useParams();
  const { t } = useTranslation();

  const { data, error } = useQuery({
    queryKey: ['order', code],
    queryFn: async () => {
      const res = await fetch(`/api/v1/orders/${code}`);
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    },
    refetchInterval: (query) => {
      const status = query.state.data?.order?.status;
      const isTerminal = status === 'delivered' || status === 'failed' || status === 'expired';
      return isTerminal ? false : 2000;
    },
  });

  const order = data?.order;
  const payment = order?.payments?.[0];

  if (error) return <div className="text-center py-20 text-red-400">Order not found</div>;
  if (!order) return <div className="text-center py-20 text-gray-400">Loading checkout...</div>;

  const amountUSD = (order.amountCents / 100).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-cardBg p-8 rounded-3xl border border-gray-800 text-center shadow-2xl">
        <h1 className="text-2xl font-black mb-2">{t('checkout.title')}</h1>
        <p className="text-gray-400 text-sm mb-6">
          {t('checkout.orderCode')}{' '}
          <span className="font-mono text-primary font-bold">{order.code}</span>
        </p>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6 inline-block w-full max-w-sm">
          <div className="text-3xl font-extrabold text-primary mb-2">$ {amountUSD}</div>
          <div className="text-sm text-gray-400 mb-6">{order.product.name}</div>

          {/* QR Code Placeholder / Display */}
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black font-bold text-sm text-center p-2 rounded">
              [ BAKONG KHQR ]<br />
              {payment?.providerRef}
            </div>
          </div>
          <p className="text-xs text-gray-400">{t('checkout.scanQr')}</p>
        </div>

        {/* Status display */}
        <div className="mb-6">
          {order.status === 'pending' && (
            <div className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 py-3 px-4 rounded-xl font-semibold">
              <span className="animate-spin">⏳</span> {t('checkout.statusWaiting')}
            </div>
          )}
          {order.status === 'processing' && (
            <div className="flex items-center justify-center gap-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-xl font-semibold">
              <span className="animate-spin">⚡</span> {t('checkout.statusPaid')}
            </div>
          )}
          {order.status === 'delivered' && (
            <div className="flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-3 px-4 rounded-bold text-lg">
              🎉 {t('checkout.statusDelivered')}
            </div>
          )}
        </div>

        {/* Dev helper button */}
        {payment?.checkoutUrl && order.status === 'pending' && (
          <a
            href={payment.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-accent/20"
          >
            {t('checkout.openMockCheckout')} ↗
          </a>
        )}
      </div>
    </div>
  );
}
