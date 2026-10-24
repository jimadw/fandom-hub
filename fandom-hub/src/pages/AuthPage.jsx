import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function AuthPage() {
  const { login, register } = usePlayer();
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Εκτελείται η εγγραφή ή η σύνδεση...
    const result = isLogin ? login(username, password) : register(username, password);
    
    // Αν αποτύχει, δείχνουμε το σφάλμα. 
    // Αν πετύχει, το PlayerContext αλλάζει τον currentUser και το App.jsx σε πάει μόνο του στο Μενού!
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wider text-white arcade-font mb-2">
          FANDOM<span className="text-purple-500">HUB</span>
        </h1>
        <p className="text-slate-400">Insert Coin to Continue</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center arcade-font">
          {isLogin ? 'PLAYER LOGIN' : 'NEW PLAYER'}
        </h2>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center font-bold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="e.g. PlayerOne"
            />
          </div>
          
          <div className="mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] mt-2"
          >
            {isLogin ? 'START GAME' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700 pt-4">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-purple-400 font-bold hover:text-purple-300 transition-colors mt-1"
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
}