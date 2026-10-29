import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';

import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import MainMenu from './pages/MainMenu';
import TriviaGame from './pages/TriviaGame';
import AnimeGuesser from './pages/AnimeGuesser';
import PokemonShadow from './pages/PokemonShadow';
import VipBlurGame from './pages/VipBlurGame';
import WesterosMap from './pages/WesterosMap';
import Shop from './pages/Shop';

const AppRoutes = () => {
  const { currentUser } = usePlayer();

  // Αν ΔΕΝ είσαι συνδεδεμένος, σε κρατάει στο AuthPage
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthPage />
      </div>
    );
  }

  // Αν ΕΙΣΑΙ συνδεδεμένος, φορτώνει κανονικά το Hub
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/trivia" element={<TriviaGame />} />
        <Route path="/anime" element={<AnimeGuesser />} />
        <Route path="/pokemon" element={<PokemonShadow />} />
        <Route path="/vip-blur" element={<VipBlurGame />} />
        <Route path="/westeros-map" element={<WesterosMap />} />
        <Route path="/shop" element={<Shop />} />
        {/* Αν γράψεις λάθος URL, σε γυρνάει στο κεντρικό μενού */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PlayerProvider>
  );
}