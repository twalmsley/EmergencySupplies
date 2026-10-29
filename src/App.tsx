import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AdviceIndexPage, AdviceTopicPage } from './pages/AdvicePage';
import { HelpPage } from './pages/HelpPage';
import { SuppliesPage } from './pages/SuppliesPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<SuppliesPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="advice" element={<AdviceIndexPage />} />
            <Route path="advice/:slug" element={<AdviceTopicPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
