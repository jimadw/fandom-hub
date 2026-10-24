import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

export default function MainMenu() {
  const { currentUser, buyGame } = usePlayer();
  
  const unlockedGames = currentUser?.unlockedGames || [];
  const isVipUnlocked = unlockedGames.includes('blur-reveal');

  const handleUnlockVIP = () => {
    buyGame('blur-reveal', 500); 
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 arcade-font tracking-widest">
          CHOOSE YOUR <span className="text-purple-500">GAME</span>
        </h1>
        <p className="text-slate-400 text-lg">Select a module to start earning tickets!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        
        {/* Karta Trivia */}
        <Link to="/trivia" className="bg-slate-900/80 border border-purple-500/30 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all group flex flex-col items-center text-center">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">🧠</div>
          <h2 className="text-xl font-bold text-purple-400 arcade-font mb-2">BrainGlitch</h2>
          <p className="text-slate-400 text-sm">Test your Pop Culture knowledge.</p>
        </Link>

        {/* Karta Anime */}
        <Link to="/anime" className="bg-slate-900/80 border border-cyan-500/30 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all group flex flex-col items-center text-center">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">👁️</div>
          <h2 className="text-xl font-bold text-cyan-400 arcade-font mb-2">Otaku Eye</h2>
          <p className="text-slate-400 text-sm">Guess the Anime from its synopsis.</p>
        </Link>

        {/* Karta Pokemon */}
        <Link to="/pokemon" className="bg-slate-900/80 border border-yellow-500/30 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all group flex flex-col items-center text-center">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">⚡</div>
          <h2 className="text-xl font-bold text-yellow-400 arcade-font mb-2">ShadowDex</h2>
          <p className="text-slate-400 text-sm">Who's that Pokémon?</p>
        </Link>
        
        {/* NEA VIP KARTA */}
        {isVipUnlocked ? (
          <Link to="/vip-blur" className="bg-slate-900/80 border border-red-500/70 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all group flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">VIP</div>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">🔍</div>
            <h2 className="text-xl font-bold text-red-400 arcade-font mb-2">Blur Reveal</h2>
            <p className="text-slate-400 text-sm">Guess the hidden anime!</p>
          </Link>
        ) : (
          <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-3xl flex flex-col items-center text-center relative opacity-80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">LOCKED</div>
            <div className="text-6xl mb-4 grayscale opacity-40 drop-shadow-lg">🔒</div>
            <h2 className="text-xl font-bold text-slate-500 arcade-font mb-2">Blur Reveal</h2>
            <p className="text-slate-500 text-sm mb-4">VIP Exclusive Game</p>
            <button 
              onClick={handleUnlockVIP}
              disabled={currentUser?.tickets < 500}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all mt-auto ${
                currentUser?.tickets >= 500 
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              UNLOCK 🎟️ 500
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}