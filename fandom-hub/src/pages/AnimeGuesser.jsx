import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
// Kane import to JSON arxeio sou edw. Allakse to path an to exeis allou!
import { animeDatabase } from "../data/animeDB";

export default function AnimeGuesser() {
  const { addTickets } = usePlayer();
  
  const [currentAnime, setCurrentAnime] = useState(null);
  const [options, setOptions] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Fortwnei apeutheias ta data apo to imported JSON
    setupRound(animeDatabase);
  }, []);

  const setupRound = (list) => {
    if (!list || list.length === 0) return;
    
    const randomTarget = list[Math.floor(Math.random() * list.length)];
    const shuffledOptions = [...list]
      .sort(() => 0.5 - Math.random())
      .filter(a => a.id !== randomTarget.id)
      .slice(0, 3);
      
    shuffledOptions.push(randomTarget);
    setOptions(shuffledOptions.sort(() => 0.5 - Math.random()));
    setCurrentAnime(randomTarget);
    setWrongAnswers([]);
    setIsCorrect(false);
  };

  const handleOptionClick = (anime) => {
    if (isCorrect || wrongAnswers.includes(anime.id)) return;

    if (anime.id === currentAnime.id) {
      setIsCorrect(true);
      const points = Math.max(5, 20 - (wrongAnswers.length * 5));
      addTickets(points);
    } else {
      setWrongAnswers(prev => [...prev, anime.id]);
    }
  };

  const handleNext = () => {
    setupRound(animeDatabase);
  };

  const getButtonClass = (anime) => {
    if (isCorrect && anime.id === currentAnime.id) return "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105"; 
    if (wrongAnswers.includes(anime.id)) return "bg-red-900/30 border-red-800/50 text-slate-500 opacity-50 cursor-not-allowed line-through"; 
    if (isCorrect) return "bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-50 cursor-not-allowed"; 
    return "bg-slate-800 border-slate-600 hover:border-cyan-400 hover:bg-slate-700 text-slate-200 shadow-lg hover:-translate-y-1 cursor-pointer"; 
  };

  
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center">
      <div className="flex justify-between w-full mb-6 px-4">
        <h2 className="text-3xl font-bold text-cyan-400 arcade-font">Otaku Eye</h2>
        <div className="text-sm font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-yellow-400">
          WIN TICKETS 🎟️
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full flex flex-col items-center shadow-lg backdrop-blur-sm min-h-[400px] justify-center relative">
        {currentAnime && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <p className="text-slate-300 text-lg md:text-xl italic text-center mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 leading-relaxed">
              "{currentAnime.synopsis}"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              {options.map((anime) => (
                <button
                  key={anime.id}
                  onClick={() => handleOptionClick(anime)}
                  disabled={isCorrect || wrongAnswers.includes(anime.id)}
                  className={`px-6 py-4 rounded-xl border-2 font-medium text-lg transition-all duration-300 ${getButtonClass(anime)}`}
                >
                  {anime.title_english || anime.title}
                </button>
              ))}
            </div>

            {isCorrect && (
              <div className="flex flex-col items-center mt-2 animate-fade-in">               
                <button 
                  onClick={handleNext}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] "
                >
                  Next Anime
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}