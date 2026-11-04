import { usePlayer } from '../context/PlayerContext';

const AVATARS = [
  // POKEMON
  { id: 'pikachu', name: 'PIKACHU', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', price: 100 },
  { id: 'charizard', name: 'CHARIZARD', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', price: 200 },
  
  // ANIME
  { id: 'luffy', name: 'LUFFY', icon: 'https://cdn.myanimelist.net/images/characters/9/310307.jpg', price: 300 },
  { id: 'goku', name: 'GOKU', icon: '/avatars/goku.jpg', price: 300 },
  
  // GAME OF THRONES 
  { id: 'jon', name: 'JON SNOW', icon: 'https://static.hbo.com/content/dam/hbodata/series/game-of-thrones/character/s5/john-snow-1920.jpg', price: 400 },
  { id: 'dany', name: 'DAENERYS', icon: '/avatars/dany.jpg', price: 400 },
  
  // LORD OF THE RINGS
  { id: 'gandalf', name: 'GANDALF', icon: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg', price: 500 },
  { id: 'aragorn', name: 'ARAGORN', icon: 'https://static.wikia.nocookie.net/lotr/images/b/b6/Aragorn_profile.jpg', price: 500 }
];

const THEMES_LIST = [
  { id: 'default', name: 'Dark Slate', icon: '🌑', cost: 0, color: 'bg-slate-900' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆', cost: 300, color: 'bg-fuchsia-900' },
  { id: 'matrix', name: 'The Matrix', icon: '💻', cost: 300, color: 'bg-green-900' }
];

export default function Shop() {
  const { currentUser, buyAvatar, equipAvatar, buyTheme, equipTheme } = usePlayer();

  const handleAvatarAction = (avatar) => {
    const isUnlocked = currentUser?.unlockedAvatars?.includes(avatar.icon) || currentUser?.unlockedAvatars?.includes(avatar.id);
    if (isUnlocked) {
      equipAvatar(avatar.icon);
    } else {
      buyAvatar(avatar.icon, avatar.price);
    }
  };

  const handleThemeAction = (theme) => {
    const unlockedT = currentUser?.unlockedThemes || ['default'];
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
          const isUnlocked = currentUser?.unlockedAvatars?.includes(avatar.icon) || currentUser?.unlockedAvatars?.includes(avatar.id);
          const isEquipped = currentUser?.avatar === avatar.icon || currentUser?.avatar === avatar.id;
          const canAfford = currentUser?.tickets >= avatar.price;

          return (
            <div 
              key={index} 
              className={`flex flex-col items-center p-6 rounded-3xl border transition-all duration-300 ${
                isEquipped ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105' :
                isUnlocked ? 'bg-white/5 border-white/20 hover:border-purple-400/50' : 
                'bg-slate-900/80 border-slate-700 opacity-80'
              }`}
            >
              {/* EIKONA TOU AVATAR */}
              <div className="h-20 w-20 mb-4 overflow-hidden rounded-full border-2 border-purple-500/50">
                <img 
                  src={avatar.icon} 
                  alt={avatar.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-white font-bold tracking-wider mb-4 uppercase text-sm text-center">{avatar.name}</h3>
              
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
                {isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🎟️ ${avatar.price}`}
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