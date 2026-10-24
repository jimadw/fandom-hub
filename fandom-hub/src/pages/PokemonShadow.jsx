import { useState, useEffect } from 'react';
// 1. Κάνουμε import τον λογαριασμό μας
import { usePlayer } from '../context/PlayerContext';

export default function PokemonShadow() {
  // 2. Φέρνουμε τη λειτουργία που προσθέτει tickets!
  const { addTickets } = usePlayer();

  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(false);
  
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setAllPokemonNames(data.results.map(p => p.name));
      } catch (error) {
        console.error("Error loading Pokemon names:", error);
      }
    };
    fetchAllNames();
    fetchRandomPokemon();
  }, []);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    setIsRevealed(false);
    setGuess('');
    setErrorMsg(false);
    setShowSuggestions(false);
    setWrongGuesses([]); 
    
    const randomX = Math.floor(Math.random() * 61) + 20;
    const randomY = Math.floor(Math.random() * 61) + 20;
    setZoomOrigin(`${randomX}% ${randomY}%`);
    
    const randomId = Math.floor(Math.random() * 151) + 1;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      
      setPokemon({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);
    
    if (value.length > 0 && !isRevealed) {
      const filtered = allPokemonNames.filter(name => 
        name.toLowerCase().startsWith(value.toLowerCase()) &&
        !wrongGuesses.includes(name.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setGuess(name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let activeGuess = guess;
    
    // Auto-select: Αν υπάρχει ανοιχτό dropdown και πατήσει Enter, παίρνει το πρώτο suggestion
    if (showSuggestions && suggestions.length > 0) {
      activeGuess = suggestions[0]; 
      setGuess(activeGuess);
    }

    if (!pokemon || isRevealed || !activeGuess.trim()) return;
    
    setShowSuggestions(false);
    const currentGuess = activeGuess.toLowerCase().trim();

    if (currentGuess === pokemon.name.toLowerCase()) {
      setIsRevealed(true);
      setErrorMsg(false);
      // 3. Δίνουμε τα Tickets στο Context του παίκτη!
      const points = Math.max(2, 10 - (wrongGuesses.length * 2));
      addTickets(points);
    } else {
      setErrorMsg(true);
      setWrongGuesses(prev => [...prev, currentGuess]);
      setGuess(''); 
      setTimeout(() => setErrorMsg(false), 2000);
    }
  };

  const dynamicScale = isRevealed ? 1 : Math.max(1, 2.5 - (wrongGuesses.length * 0.5));

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center">
      <div className="flex justify-between w-full mb-6 px-4">
        <h2 className="text-3xl font-bold text-yellow-400 arcade-font">ShadowDex</h2>
        {/* 4. Νέο UI για τα Tickets */}
        <div className="text-sm font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-yellow-400">
          WIN TICKETS 🎟️
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full flex flex-col items-center shadow-lg backdrop-blur-sm relative">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="w-64 h-64 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-full absolute top-10 blur-xl"></div>
            
            <div className="w-64 h-64 relative z-10 flex items-center justify-center overflow-hidden rounded-xl">
              <img 
                src={pokemon?.image} 
                alt="Pokemon" 
                style={{ 
                  transform: `scale(${dynamicScale})`,
                  transformOrigin: isRevealed ? 'center' : zoomOrigin 
                }}
                className={`w-full h-full object-contain transition-all duration-700 ease-out select-none pointer-events-none drop-shadow-2xl ${
                  isRevealed ? 'brightness-100' : 'brightness-0'
                }`}
              />
            </div>

            {!isRevealed && (
              <div className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
                Guesses: <span className="text-red-400">{wrongGuesses.length}</span> (Image zooms out on wrong guess)
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 w-full flex flex-col gap-3 z-10 items-center">
              <div className="w-full flex gap-3 relative">
                
                <div className="flex-grow relative">
                  <input 
                    type="text" 
                    value={guess}
                    onChange={handleInputChange}
                    onFocus={() => { if(guess.length > 0) setShowSuggestions(true) }}
                    disabled={isRevealed}
                    placeholder="Type the name..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                      {suggestions.map((name, index) => (
                        <li 
                          key={index}
                          onClick={() => handleSuggestionClick(name)}
                          className="px-4 py-2 hover:bg-slate-700 cursor-pointer capitalize text-slate-200 transition-colors"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {!isRevealed ? (
                  <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors min-w-[100px]">
                    Guess
                  </button>
                ) : (
                  <button type="button" onClick={fetchRandomPokemon} className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-colors min-w-[100px]">
                    Next
                  </button>
                )}
              </div>
              
              {errorMsg && (
                <div className="text-red-400 font-bold text-sm animate-pulse mt-2">
                  Wrong name! Zooming out...
                </div>
              )}
            </form>
            
            {isRevealed && (
              <div className="mt-4 text-xl font-bold text-green-400 z-10 arcade-font capitalize">
                It's {pokemon?.name}!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}