import { usePlayer } from '../context/PlayerContext';

const AVATARS = [
  { icon: '👾', name: 'Invader', cost: 0 },
  { icon: '👻', name: 'Phantom', cost: 50 },
  { icon: '🤖', name: 'Mecha', cost: 100 },
  { icon: '🦊', name: 'Fox', cost: 150 },
  { icon: '⚡', name: 'Spark', cost: 200 },
  { icon: '🔥', name: 'Flame', cost: 300 },
  { icon: '💀', name: 'Skull', cost: 400 },
  { icon: '👑', name: 'King', cost: 1000 },
];

const THEMES_LIST = [
  { id: 'default', name: 'Dark Slate', icon: '🌑', cost: 0, color: 'bg-slate-900' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆', cost: 300, color: 'bg-fuchsia-900' },
  { id: 'matrix', name: 'The Matrix', icon: '💻', cost: 300, color: 'bg-green-900' }
];

export default function Shop() {
  const { currentUser, buyAvatar, equipAvatar, buyTheme, equipTheme } = usePlayer();

  const handleAvatarAction = (avatar) => {
    const isUnlocked = currentUser.unlockedAvatars.includes(avatar.icon);
    if (isUnlocked) {
      equipAvatar(avatar.icon);
    } else {
      buyAvatar(avatar.icon, avatar.cost);
    }
  };

  const handleThemeAction = (theme) => {
    const unlockedT = currentUser.unlockedThemes || ['default'];
    const isUnlocked = unlockedT.includes(theme.id);
    if (isUnlocked) {
      equipTheme(theme.id);
    } else {
      buyTheme(theme.id, theme.cost);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-purple-400 arcade-font mb-2">REWARD SHOP</h2>
        <p className="text-slate-400">Spend your tickets to unlock new items!</p>
        <div className="mt-4 inline-block bg-yellow-900/30 border border-yellow-500/50 px-6 py-2 rounded-full">
          <span className="text-yellow-400 font-bold text-lg tracking-widest">
            YOUR BALANCE: 🎟️ {currentUser?.tickets || 0}
          </span>
        </div>
      </div>

      {/* --- SECTION 1: AVATARS --- */}
      <h3 className="text-2xl font-bold text-white mb-6 w-full text-left border-b border-white/10 pb-2">Player Avatars</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-16">
        {AVATARS.map((avatar, index) => {
          const isUnlocked = currentUser?.unlockedAvatars.includes(avatar.icon);
          const isEquipped = currentUser?.avatar === avatar.icon;
          const canAfford = currentUser?.tickets >= avatar.cost;

          return (
            <div 
              key={index} 
              className={`flex flex-col items-center p-6 rounded-3xl border transition-all duration-300 ${
                isEquipped ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105' :
                isUnlocked ? 'bg-white/5 border-white/20 hover:border-purple-400/50' : 
                'bg-slate-900/80 border-slate-700 opacity-80'
              }`}
            >
              <div className="text-6xl mb-4 drop-shadow-lg">{avatar.icon}</div>
              <h3 className="text-white font-bold tracking-wider mb-4 uppercase text-sm">{avatar.name}</h3>
              
              <button
                onClick={() => handleAvatarAction(avatar)}
                disabled={!isUnlocked && !canAfford}
                className={`w-full py-2 rounded-xl font-bold text-sm transition-all ${
                  isEquipped ? 'bg-purple-500 text-white cursor-default' :
                  isUnlocked ? 'bg-green-600 hover:bg-green-500 text-white' :
                  canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900' :
                  'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🎟️ ${avatar.cost}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* --- SECTION 2: THEMES --- */}
      <h3 className="text-2xl font-bold text-white mb-6 w-full text-left border-b border-white/10 pb-2">UI Themes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {THEMES_LIST.map(theme => {
          const unlockedT = currentUser?.unlockedThemes || ['default'];
          const isUnlocked = unlockedT.includes(theme.id);
          const isEquipped = (currentUser?.currentTheme || 'default') === theme.id;
          const canAfford = currentUser?.tickets >= theme.cost;

          return (
            <div key={theme.id} className={`flex flex-col items-center p-6 rounded-3xl border transition-all ${
              isEquipped ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' : 
              'border-white/10 opacity-80'
            } ${theme.color}`}>
              <div className="text-5xl mb-4 drop-shadow-lg">{theme.icon}</div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest">{theme.name}</h3>
              
              <button
                onClick={() => handleThemeAction(theme)}
                disabled={!isUnlocked && !canAfford}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  isEquipped ? 'bg-white text-black shadow-lg' :
                  isUnlocked ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                  canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900' : 
                  'bg-black/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🎟️ ${theme.cost}`}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}