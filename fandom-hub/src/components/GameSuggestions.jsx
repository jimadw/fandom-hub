import { Link, useLocation } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

export default function GameSuggestions() {
  const { currentUser } = usePlayer();
  const location = useLocation();

  // Βάλε εδώ μέσα όλα τα paths που ΔΕΝ θέλεις να φαίνονται τα suggestions.
  // Π.χ. αν το main menu σου είναι '/home' ή '/menu', πρόσθεσέ το στη λίστα!
  const hiddenPaths = ['/', '/shop', '/login', '/home'];
  
  if (hiddenPaths.includes(location.pathname)) {
    return null; // Κρύβει το component εντελώς σε αυτές τις σελίδες
  }

  const allGames = [
    { path: '/anime', name: 'Otaku Eye', desc: 'Click to switch game', icon: '👁️', color: 'text-cyan-400' },
    { path: '/pokemon', name: 'ShadowDex', desc: 'Click to switch game', icon: '⚡', color: 'text-yellow-500' },
    { path: '/trivia', name: 'BrainGlitch', desc: 'Click to switch game', icon: '🧠', color: 'text-purple-400' },
    { path: '/vip-blur', name: 'VIP Blur Reveal', desc: 'Click to switch game', icon: '🔥', color: 'text-red-500', isVip: true }
  ];

  const suggestedGames = allGames.filter(game => {
    // 2. Krivei aytomata to paixnidi sto opoio vriskesai auth th stigmh
    if (game.path === location.pathname) return false;
    
    // Krivei to VIP an den einai ksekleidwto (to exeis sxolio twra)
    //if (game.isVip && !currentUser?.vipUnlocked) return false; 
    
    return true;
  });

  if (suggestedGames.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8 animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px bg-slate-800 flex-grow"></div>
        <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">PLAY NEXT</span>
        <div className="h-px bg-slate-800 flex-grow"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestedGames.map((game) => (
          <Link 
            key={game.path}
            to={game.path}
            className="bg-[#1a1721] border border-white/5 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 hover:bg-[#231e2b] cursor-pointer"
          >
            <div className="w-12 h-12 bg-[#25212e] rounded-xl flex items-center justify-center text-2xl shadow-inner">
              {game.icon}
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${game.color}`}>{game.name}</span>
              <span className="text-slate-400 text-xs">{game.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}