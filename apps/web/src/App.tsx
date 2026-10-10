import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n.js';
import { Navbar } from './components/Navbar.js';
import { HomePage } from './pages/HomePage.js';
import { GamePage } from './pages/GamePage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-darkBg text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games/:slug" element={<GamePage />} />
              <Route path="/checkout/:code" element={<CheckoutPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
