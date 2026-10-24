import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { animeDatabase } from '../data/animeDB.js';

export default function VipBlurGame() {
  const { addTickets } = usePlayer();
  
  const [currentAnime, setCurrentAnime] = useState(null);
  const [blurLevel, setBlurLevel] = useState(25);
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [wrongGuesses, setWrongGuesses] = useState([]);
  // Neo state gia to loading ths eikonas
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const wrapperRef = useRef(null);

  useEffect(() => {
    startNewGame();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  const startNewGame = () => {
    const randomAnime = animeDatabase[Math.floor(Math.random() * animeDatabase.length)];
    setCurrentAnime(randomAnime);
    setBlurLevel(25);
    setGuess('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsGameOver(false);
    setWrongGuesses([]); 
    setIsImageLoaded(false); // Mhdenizoume to loading kathe fora pou allazei o gyros
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);
    
    if (value.length > 0) {
      const filtered = animeDatabase.filter(anime => {
        const titleEng = anime.title_english?.toLowerCase() || "";
        const titleJap = anime.title?.toLowerCase() || "";
        const searchVal = value.toLowerCase();
        
        const matchesSearch = titleEng.includes(searchVal) || titleJap.includes(searchVal);
        const notGuessedYet = !wrongGuesses.includes(titleEng) && !wrongGuesses.includes(titleJap);
        
        return matchesSearch && notGuessedYet;
      });
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (animeTitle) => {
    setGuess(animeTitle);
    setShowSuggestions(false);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    
    let activeGuess = guess;
    if (showSuggestions && suggestions.length > 0) {
      activeGuess = suggestions[0].title_english || suggestions[0].title;
      setGuess(activeGuess);
    }

    if (isGameOver || !activeGuess.trim()) return;

    const guessLower = activeGuess.toLowerCase().trim();
    const titleEng = currentAnime.title_english?.toLowerCase() || "";
    const titleJap = currentAnime.title?.toLowerCase() || "";

    setShowSuggestions(false);

    if (guessLower === titleEng || guessLower === titleJap) {
      const reward = blurLevel * 10; 
      if (reward > 0) addTickets(reward);
      setBlurLevel(0);
      setIsGameOver(true);
    } else {
      setWrongGuesses(prev => [...prev, guessLower]);
      setBlurLevel(prev => Math.max(0, prev - 5));
      setGuess('');
    }
  };

  if (!currentAnime) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center animate-fade-in">
      <div className="flex justify-between w-full mb-6 px-4">
        <h2 className="text-3xl font-bold text-red-500 arcade-font">VIP BLUR REVEAL</h2>
      </div>

      <div className="bg-slate-900/80 border-2 border-red-500/50 p-8 rounded-3xl w-full flex flex-col items-center shadow-[0_0_30px_rgba(239,68,68,0.2)] backdrop-blur-md">
        
        <div className={`relative w-64 h-96 mb-8 overflow-hidden rounded-xl border-4 shadow-2xl transition-colors duration-500 ${isGameOver ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'border-slate-800'}`}>
          
          {/* Loading Spinner an den exei fortwsei h eikona */}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <img 
            key={currentAnime.id} 
            src={currentAnime.image_url} 
            alt="Guess the Anime" 
            onLoad={() => setIsImageLoaded(true)} // Eidopoiei oti katevhke h eikona
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ filter: `blur(${blurLevel}px)` }} 
          />
          
          {(!isGameOver && isImageLoaded) && (
            <div className="absolute top-2 right-2 bg-black/70 text-red-400 font-bold px-3 py-1 rounded-lg text-sm border border-red-500/50">
              BLUR: {blurLevel}px
            </div>
          )}
        </div>

        {!isGameOver ? (
          <form onSubmit={handleGuess} className="w-full flex gap-3 relative" ref={wrapperRef}>
            <div className="relative flex-grow">
              <input 
                type="text"
                value={guess}
                onChange={handleInputChange}
                onFocus={() => guess.length > 0 && setShowSuggestions(true)}
                disabled={!isImageLoaded} // Kleidwnei to input mexri na fortwsei h eikona
                placeholder={isImageLoaded ? "Search Anime Title..." : "Loading image..."}
                className="w-full bg-black/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-slate-800 border border-slate-600 mt-1 rounded-xl max-h-48 overflow-y-auto shadow-2xl custom-scrollbar">
                  {suggestions.map((anime) => (
                    <li 
                      key={anime.id}
                      onClick={() => handleSuggestionClick(anime.title_english || anime.title)}
                      className="px-4 py-3 hover:bg-slate-700 cursor-pointer text-slate-200 border-b border-slate-700/50 last:border-0 transition-colors"
                    >
                      {anime.title_english || anime.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={!isImageLoaded}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] h-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              GUESS
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">{currentAnime.title_english || currentAnime.title}</h3>
            <button 
              onClick={startNewGame}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold w-full py-4 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)] "
            >
              Next Anime
            </button>
          </div>
        )}
      </div>
    </div>
  );
}