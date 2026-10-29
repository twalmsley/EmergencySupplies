import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from './components/ConfirmDialog';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AdviceIndexPage, AdviceTopicPage } from './pages/AdvicePage';
import { GrabBagPage } from './pages/GrabBagPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ShoppingPage } from './pages/ShoppingPage';
import { SuppliesPage } from './pages/SuppliesPage';

export default function App() {
  return (
    <AppProvider>
      <ConfirmProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<SuppliesPage />} />
              <Route path="shopping" element={<ShoppingPage />} />
              <Route path="grab-bag" element={<GrabBagPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="advice" element={<AdviceIndexPage />} />
              <Route path="advice/:slug" element={<AdviceTopicPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfirmProvider>
    </AppProvider>
  );
}
