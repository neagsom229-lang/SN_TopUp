import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import './i18n.js';
import { Navbar } from './components/Navbar.js';

const HomePage = lazy(() => import('./pages/HomePage.js').then((m) => ({ default: m.HomePage })));
const GamePage = lazy(() => import('./pages/GamePage.js').then((m) => ({ default: m.GamePage })));
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage.js').then((m) => ({ default: m.CheckoutPage })),
);

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-darkBg text-white flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense
                fallback={<div className="text-center py-20 text-gray-400">Loading page...</div>}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/games/:slug" element={<GamePage />} />
                  <Route path="/checkout/:code" element={<CheckoutPage />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}

export default App;
