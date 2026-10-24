import { Link } from 'react-router-dom';
import GameSuggestions from './GameSuggestions';
import { usePlayer } from '../context/PlayerContext';

// Τα χρώματα των Themes
const THEMES = {
  // Aplo skouro background me ena fwtino mple/gri radial glow panw deksia
  default: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black",
  
  // Skouro mwv me ena grid (plegma) poy dinei thn aisthisi tou Cyberpunk / Synthwave
  cyberpunk: "bg-[#090014] bg-[linear-gradient(to_right,#3b0764_1px,transparent_1px),linear-gradient(to_bottom,#3b0764_1px,transparent_1px)] bg-[size:4rem_4rem]",
  
  // Apolyto mauro me prasines orizonties grammes (scanlines) opws oi palies CRT othones sto Matrix
  matrix: "bg-black bg-[linear-gradient(transparent_50%,rgba(34,197,94,0.1)_50%)] bg-[size:100%_4px]"
};

export default function Layout({ children }) {
  const { currentUser, logout } = usePlayer();
  
  // Βρίσκει ποιο θέμα φοράει ο παίκτης, αλλιώς βάζει το default (μαύρο/μπλε)
  const activeTheme = THEMES[currentUser?.currentTheme] || THEMES.default;

  return (
    // Το κεντρικό div που αλλάζει χρώμα ανάλογα με το theme!
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${activeTheme}`}>
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wider text-white hover:text-purple-400 transition-colors arcade-font">
            FANDOM<span className="text-purple-500">HUB</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-white font-bold">{currentUser?.username}</span>
              <span className="text-yellow-400 text-xs font-bold tracking-widest bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/30 mt-1">
                🎟️ {currentUser?.tickets || 0} TICKETS
              </span>
            </div>
            
            <Link 
              to="/shop" 
              title="Go to Reward Shop" 
              className="w-10 h-10 bg-slate-800 rounded-xl border-2 border-purple-500 flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:scale-110 transition-transform cursor-pointer"
            >
              {currentUser?.avatar}
            </Link>

            <button 
              onClick={logout}
              className="ml-2 bg-red-900/50 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-red-500/50"
              title="Logout"
            >
              ⏏️
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center p-4 w-full">
        {children}
        <GameSuggestions />
      </main>
    </div>
  );
}